import { TopPodcast } from '@/services/podcasts'
import { t } from '@/src/i18nConfig'
import Image from 'next/image'
import Link from 'next/link'

export const Podcast = ({
  podcast,
  startNavigation
}: {
  podcast: TopPodcast
  startNavigation: (message: string) => void
}) => (
  <Link
    key={podcast.id}
    href={`/podcast/${podcast.id}`}
    onClick={() => {
      startNavigation('Navigating to podcast page')
    }}
    className="podcast-item"
    onMouseEnter={(e) => {
      ;(e.currentTarget as HTMLElement).style.transform =
        'translateY(-6px) scale(1.03)'
      ;(e.currentTarget as HTMLElement).style.boxShadow =
        '0 6px 24px rgba(0,0,0,0.14)'
    }}
    onMouseLeave={(e) => {
      ;(e.currentTarget as HTMLElement).style.transform = ''
      ;(e.currentTarget as HTMLElement).style.boxShadow =
        '0 2px 8px rgba(0,0,0,0.08)'
    }}
  >
    <Image
      src={podcast.image}
      alt={`${t('logo_song')}, ${t('title_song')}: ${podcast.title}, ${t('author_song')}: ${podcast.author}`}
      width={100}
      height={100}
      className="podcast-item-image"
    />
    <h3 className="podcast-item-title">{podcast.title}</h3>
    <p className="podcast-item-author">
      {t('author')}: {podcast.author}
    </p>
  </Link>
)

export const PodcastsList = ({
  podcasts,
  startNavigation
}: {
  podcasts: TopPodcast[]
  startNavigation: (message: string) => void
}) => (
  <div className="podcasts-container">
    {podcasts.map((podcast) => (
      <Podcast
        key={podcast.id}
        podcast={podcast}
        startNavigation={startNavigation}
      />
    ))}
  </div>
)
