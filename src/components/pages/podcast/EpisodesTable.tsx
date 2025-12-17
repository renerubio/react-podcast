'use client'
import { useFeedback } from '@/hooks/useFeedback'
import { t } from '@/src/i18nConfig'
import { IEpisode } from '@/utils/interfaces'
import { rememberEpisodeUrl } from '@/utils/podcastHelpers'
import { useCallback } from 'react'
import EpisodeRow from './EpisodeRow'

interface IEpisodesTableProps {
  episodes: IEpisode[]
  podcastId: string
}

export const EpisodesTable = ({ episodes, podcastId }: IEpisodesTableProps) => {
  const { newMessage } = useFeedback()
  const handleEpisodeClick = useCallback(
    (episode: IEpisode) => {
      newMessage(`${t('navigating_to')} ${episode.title}`)
      rememberEpisodeUrl({ episodeId: episode.id, url: episode.url })
    },
    [newMessage]
  )

  if (episodes?.length === 0) {
    return <p>{t('no_episodes_available')}</p>
  }

  return (
    <table
      className="podcast-detail-episodes-table"
      aria-label={t('aria_label_episode_table_list')}
    >
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
        {episodes.map((episode) => (
          <EpisodeRow
            key={episode.id}
            episode={episode}
            podcastId={podcastId}
            onEpisodeClick={handleEpisodeClick}
          />
        ))}
      </tbody>
    </table>
  )
}
