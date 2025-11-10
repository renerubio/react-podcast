import { useLoading } from '@/context/NavigationContext'
import { t } from '@/src/i18nConfig'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Renders a podcast item as a clickable link with interactive hover effects.
 *
 * @param podcast - The podcast data to display, of type `TopPodcast`.
 * @returns A React component displaying the podcast's image, title, and author.
 *
 * The component uses `useLoading` to show a loading state when navigating,
 * and applies visual effects on mouse enter and leave.
 */
export const Podcast = ({ podcast }: { podcast: TopPodcast }) => {
  const { start } = useLoading()

  return (
    <Link
      key={podcast.id}
      href={`/podcast/${podcast.id}`}
      title={`${t('go_to')} ${t('podcast_detail')} ${podcast.title} ${t('by')} ${podcast.author}`}
      onClick={() => {
        start('Navigating to podcast page')
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
}
