'use client'
import { useLoading } from '@/context/NavigationContext'
import { t } from '@/src/i18nConfig'
import Link from 'next/link'

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).format(new Date(iso))

const formatDuration = (d: number | string) => {
  if (typeof d === 'string') return d
  const m = Math.floor(d / 60)
  const s = Math.floor(d % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Renders a table displaying a list of podcast episodes with their titles, release dates, and durations.
 *
 * @param episodes - An array of episode objects to display in the table.
 * @param podcastId - The unique identifier of the podcast, used to generate episode links.
 *
 * Each episode row displays:
 * - The episode title as a link if a URL is present, otherwise as plain text.
 * - The formatted release date of the episode.
 * - The formatted duration of the episode.
 *
 * The component uses the `useLoading` hook to indicate loading state when navigating to an episode.
 *
 * @returns A table element containing the list of episodes.
 */
export const EpisodesTable = ({
  episodes,
  podcastId
}: {
  episodes: IEpisode[]
  podcastId: string
}) => {
  const { start } = useLoading()

  return (
    <table className="podcast-detail-episodes-table" aria-label="Episodes">
      <thead className="podcast-detail-episodes-thead">
        <tr>
          <th>{t('title')}</th>
          <th className="podcast-detail-episodes-th-date">{t('date')}</th>
          <th className="podcast-detail-episodes-th-duration">
            {t('duration')}
          </th>
        </tr>
      </thead>

      <tbody>
        {episodes.map((ep) => (
          <tr key={ep.id} className="podcast-detail-episodes-tr">
            <td className="podcast-detail-episodes-td">
              {ep.url ? (
                <Link
                  className="podcast-detail-episodes-episode-link"
                  onClick={() => {
                    start(`Navigating to episode ${ep.title}`)
                    localStorage.setItem(String(ep.id), String(ep.url))
                  }}
                  href={`/podcast/${podcastId}/episode/${ep.id}`}
                  title={`${t('go_to')} ${t('episode_detail')} ${ep.title}`}
                >
                  {ep.title}
                </Link>
              ) : (
                ep.title
              )}
            </td>
            <td className="podcast-detail-episodes-td">
              {formatDate(ep.date)}
            </td>
            <td className="podcast-detail-episodes-td">
              {formatDuration(ep.duration)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
