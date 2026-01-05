'use client'
import { t } from '@/src/i18nConfig'
import { IEpisode } from '@/utils/interfaces'
import { formatDate, formatDuration } from '@/utils/normalize'
import Link from 'next/link'

interface IEpisodeRowProps {
  episode: IEpisode
  podcastId: string
  onEpisodeClick: (episode: IEpisode) => void
}

/**
 * Renders a single table row for an episode with title, date, and duration.
 *
 * If the episode has a URL, the title is rendered as a clickable link to the
 * episode detail page.
 *
 * @param props - Component props.
 * @param props.episode - Episode data to display.
 * @param props.podcastId - Podcast identifier.
 * @param props.onEpisodeClick - Callback triggered when the episode link is clicked.
 * @returns Table row element containing the episode information.
 *
 * @example
 * ```tsx
 * <EpisodeRow episode={episode} podcastId={podcastId} onEpisodeClick={onClick} />
 * ```
 */
const EpisodeRow = ({
  episode,
  podcastId,
  onEpisodeClick
}: IEpisodeRowProps) => (
  <tr className="podcast-detail-episodes-tr">
    <td className="podcast-detail-episodes-td">
      {episode.url ? (
        <Link
          className="podcast-detail-episodes-link"
          onClick={() => onEpisodeClick(episode)}
          href={`/podcast/${podcastId}/episode/${episode.id}`}
          title={`${t('go_to')} ${t('episode_detail')} ${episode.title}`}
          aria-label={`${t('aria_label_go_to')} ${episode.title}`}
        >
          {episode.title}
        </Link>
      ) : (
        <span>{episode.title}</span>
      )}
    </td>
    <td
      className="podcast-detail-episodes-td"
      aria-label={`${t('aria_label_episode_date')} ${formatDate(episode.date)}`}
    >
      <time dateTime={episode.date}>{formatDate(episode.date)}</time>
    </td>
    <td
      className="podcast-detail-episodes-td"
      aria-label={`${t('aria_label_episode_duration')} ${formatDuration(episode.duration)}`}
    >
      {formatDuration(episode.duration)}
    </td>
  </tr>
)

export default EpisodeRow
