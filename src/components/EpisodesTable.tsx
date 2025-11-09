'use client'
import { useLoading } from '@/context/NavigationContext'
import Link from 'next/link'
import { t } from '../i18nConfig'

export type TEpisode = {
  id: string | number
  title: string
  url?: string
  /** ISO date string, e.g. "2016-03-01T00:00:00Z" */
  date: string
  /** seconds (number) o cadena ya formateada "14:00" */
  duration: number | string
}

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
  episodes: TEpisode[]
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
                  }}
                  href={`/podcast/${podcastId}/episode/${ep.id}`}
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
