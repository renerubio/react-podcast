import BackButton from '@/components/BackButton'
import Card from '@/components/Card'
import { EpisodesTable, TEpisode } from '@/components/EpisodesTable'
import { useLoading } from '@/context/NavigationContext'
import { IPodcastDetail, scrappingFromFeedUrl } from '@/services/podcasts'
import { t } from '@/src/i18nConfig'
import { stopWithTimeout } from '@/utils/utils'
import Image from 'next/image'
import { use, useEffect, useState } from 'react'

/**
 * PodcastDetail component displays detailed information about a specific podcast,
 * including its artwork, title, author, description, and a list of episodes.
 *
 * @param promise - A Promise that resolves to the podcast detail data (`IPodcastDetail`).
 * @param podcastId - The unique identifier for the podcast.
 *
 * The component fetches and parses the podcast's RSS feed to extract the description and episodes,
 * and manages loading state accordingly. It renders the podcast's main information and an episodes table.
 */
const PodcastDetail = ({
  promise,
  podcastId
}: {
  promise: Promise<IPodcastDetail>
  podcastId: string
}) => {
  const podcastDetail: IPodcastDetail = use(promise)
  const { feedUrl } = podcastDetail
  const scrappingUrlPromise = scrappingFromFeedUrl(feedUrl)
  const [description, setDescription] = useState('')
  const [episodes, setEpisodes] = useState<TEpisode[] | null>(null)

  const { stop } = useLoading()
  useEffect(() => {
    stopWithTimeout({ stop })

    scrappingUrlPromise.then((xml) => {
      if (
        xml &&
        typeof xml === 'object' &&
        'querySelector' in xml &&
        typeof (xml as XMLDocument).querySelector === 'function'
      ) {
        setDescription(
          (xml as XMLDocument)
            .querySelector('channel > description')
            ?.textContent?.trim() ?? ''
        )
        setEpisodes(
          Array.from((xml as XMLDocument).querySelectorAll('item')).map(
            (item) => ({
              id: item.querySelector('guid')?.textContent ?? '',
              title: item.querySelector('title')?.textContent ?? '',
              url:
                item.querySelector('enclosure')?.getAttribute('url') ??
                undefined,
              date: item.querySelector('pubDate')?.textContent ?? '',
              duration:
                item.getElementsByTagName('itunes:duration')[0]?.textContent ??
                ''
            })
          )
        )
      } else {
        console.error('## scrappingUrl result: xml is not a XMDocument', xml)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!podcastDetail) {
    return (
      <main>
        <h1>{t('podcast_not_found')}</h1>
        <BackButton />
      </main>
    )
  }

  return (
    <main className="podcast-detail-container">
      <Card className="podcast-detail-resume">
        <Image
          src={podcastDetail.artworkUrl600}
          alt={podcastDetail.collectionName}
          width={160}
          height={160}
          className="podcast-detail-image"
        />
        <hr />
        <h1 className="podcast-detail-title">{podcastDetail.trackName}</h1>
        <p className="podcast-detail-subtitle">{`${t('by')} ${podcastDetail.collectionName}`}</p>
        <hr />
        <p className="podcast-detail-title-description">{t('description')}</p>
        <p
          className="podcast-detail-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </Card>
      <div className="podcast-detail-episodes">
        <Card className="podcast-detail-episode-title" variant="header">
          <h3>{`${t('episodes')}: ${podcastDetail.trackCount}`}</h3>
        </Card>
        <Card variant="nav">
          <EpisodesTable episodes={episodes || []} podcastId={podcastId} />
        </Card>
      </div>
    </main>
  )
}

export default PodcastDetail
