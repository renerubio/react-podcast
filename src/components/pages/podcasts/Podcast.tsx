import { useFeedback } from '@/hooks/useFeedback'
import { t } from '@/src/i18nConfig'
import { ITop100Podcasts } from '@/utils/interfaces'
import { buildNavMessage } from '@/utils/podcastHelpers'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Renders a podcast item as a clickable link with interactive hover effects.
 *
 * @param podcast - The podcast data to display, of type `ITop100Podcasts`.
 * @returns A React component displaying the podcast's image, title, and author.
 *
 * The component uses `useFeedback` to show a loading state when navigating,
 * and applies visual effects on mouse enter and leave.
 */
export const Podcast = ({ podcast }: { podcast: ITop100Podcasts }) => {
  const { newMessage } = useFeedback()

  return (
    <Link
      key={podcast.id}
      href={`/podcast/${podcast.id}`}
      title={`${t('go_to')} ${t('podcast_detail')} ${podcast.title} ${t('by')} ${podcast.author}`}
      onClick={() => {
        newMessage(buildNavMessage({ target: podcast.title }))
      }}
      className="podcast-item"
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
