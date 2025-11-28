'use client'
import Card from '@/components/Card'
import { t } from '@/src/i18nConfig'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const Sidebar = ({ podcastDetail }: { podcastDetail: IPodcastDetail }) => {
  const { podcastId } = useParams<{
    podcastId: string
  }>()

  const { artworkUrl600, collectionName, trackName, description } =
    podcastDetail

  return (
    <Link
      href={`/podcast/${podcastId}`}
      className="podcast-detail-resume-link"
      title={`${t('go_to')} ${t('podcast_detail')} ${trackName}`}
    >
      <Card className="podcast-detail-resume">
        <Image
          src={artworkUrl600}
          alt={collectionName}
          width={160}
          height={160}
          className="podcast-detail-image"
        />
        <hr />
        <h1 className="podcast-detail-title">{trackName}</h1>
        <p className="podcast-detail-subtitle">{`${t('by')} ${collectionName}`}</p>
        <hr />
        <p className="podcast-detail-title-description">{t('description')}</p>
        <p
          className="podcast-detail-description"
          dangerouslySetInnerHTML={{ __html: description as string }}
        />
      </Card>
    </Link>
  )
}

export default Sidebar
