'use client'

import Card from '@/components/Card'
import { EpisodesTable } from '@/components/EpisodesTable'
import Sidebar from '@/components/Sidebar'
import {
  SkeletonDetailSidebar,
  SkeletonDetailTable
} from '@/components/Skeletons'
import { useLoading } from '@/context/NavigationContext'
import { fetchPodcastById, scrappingFromFeedUrl } from '@/services/podcasts'
import { t } from '@/src/i18nConfig'
import { lsGetWithTTL, lsSetWithTTL, stopWithTimeout } from '@/utils/utils'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * PodcastDetail component displays detailed information about a specific podcast,
 * including its metadata and a list of episodes. It fetches podcast data by ID,
 * parses the podcast feed, and caches the result in local storage with TTL.
 *
 * Features:
 * - Retrieves the podcast ID from the route parameters.
 * - Attempts to load podcast data from local storage cache first.
 * - Fetches podcast details and episode list from a remote source if not cached.
 * - Parses XML feed to extract podcast description and episodes.
 * - Handles not-found cases and loading state.
 * - Renders podcast sidebar and episodes table.
 *
 * Dependencies:
 * - React hooks (useState, useEffect)
 * - Custom hooks and utilities: useParams, useLoading, lsGetWithTTL, lsSetWithTTL, stopWithTimeout, fetchPodcastById, scrappingFromFeedUrl
 * - UI components: Sidebar, Card, EpisodesTable
 * - Translation function: t
 *
 * @component
 */
const PodcastDetail = () => {
  const { podcastId } = useParams<{
    podcastId: string
  }>()
  const [podcast, setPodcast] = useState<any | null>(null)
  const [notFoundFlag, setNotFoundFlag] = useState(false)
  const { start, stop } = useLoading()

  const KEY_PODCAST = `podcastId_${podcastId}`

  useEffect(() => {
    start(t('loading_podcast_details') + podcastId + '...')
    stopWithTimeout({ stop })
    if (notFoundFlag) notFound()
  }, [stop, notFoundFlag, podcastId, start])

  useEffect(() => {
    const cached = lsGetWithTTL(KEY_PODCAST)
    if (cached && Object.keys(cached).length > 0 && cached.episodes) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPodcast(cached)
      return
    }

    fetchPodcastById(podcastId).then(async (data) => {
      if (data === null) setNotFoundFlag(true)
      const { artworkUrl600, collectionName, trackName, feedUrl } = data
      try {
        const xml = await scrappingFromFeedUrl(feedUrl)
        if (
          xml &&
          typeof xml === 'object' &&
          'querySelector' in xml &&
          typeof (xml as XMLDocument).querySelector === 'function'
        ) {
          setPodcast({
            artworkUrl600,
            collectionName,
            trackName,
            feedUrl,
            description:
              (xml as XMLDocument)
                .querySelector('channel > description')
                ?.textContent?.trim() ?? '',
            episodes: Array.from((xml as XMLDocument).querySelectorAll('item'))
              .filter((item) => {
                const idRaw: string =
                  item.querySelector('guid')?.textContent ?? ''

                const id = idRaw.includes('blubrry')
                  ? idRaw.split('/')[4]
                  : idRaw.includes('500songs')
                    ? idRaw.split('=')[2]
                    : idRaw
                return id !== undefined && id !== ''
              })
              .map((item) => {
                const idRaw: string =
                  item.querySelector('guid')?.textContent ?? ''

                const id = idRaw.includes('blubrry')
                  ? idRaw.split('/')[4]
                  : idRaw.includes('500songs')
                    ? idRaw.split('=')[2]
                    : idRaw

                const durationRaw =
                  item.getElementsByTagName('itunes:duration')[0]?.textContent
                const duration =
                  durationRaw && durationRaw !== '0:00'
                    ? durationRaw
                    : t('unknown')
                return {
                  id,
                  title: item.querySelector('title')?.textContent ?? '',
                  url:
                    item.querySelector('enclosure')?.getAttribute('url') ??
                    undefined,
                  date: item.querySelector('pubDate')?.textContent ?? '',
                  duration,
                  description:
                    item.querySelector('description')?.textContent ?? ''
                }
              })
          })
        } else {
          console.error('## scrappingUrl result: xml is not a XMDocument', xml)
        }
      } catch (err) {
        console.error('Error fetching/parsing feed:', err)
      }
    })
  }, [KEY_PODCAST, podcastId])

  useEffect(() => {
    if (podcast && Object.keys(podcast).length > 0 && podcast.episodes) {
      lsSetWithTTL(KEY_PODCAST, {
        ...podcast
      })
    }
  }, [KEY_PODCAST, podcast])

  return (
    podcast && (
      <main className="podcast-detail-container">
        {Object.keys(podcast).length > 0 ? (
          <Sidebar podcastDetail={podcast} />
        ) : (
          <SkeletonDetailSidebar />
        )}
        {podcast.episodes ? (
          <div className="podcast-detail-episodes">
            <Card className="podcast-detail-episodes-title" variant="header">
              <h3>{`${t('episodes')}: ${podcast?.episodes?.length ?? 0}`}</h3>
            </Card>
            <Card variant="nav">
              <EpisodesTable
                episodes={podcast?.episodes as IEpisode[]}
                podcastId={podcastId}
              />
            </Card>
          </div>
        ) : (
          <SkeletonDetailTable />
        )}
      </main>
    )
  )
}

export default PodcastDetail
