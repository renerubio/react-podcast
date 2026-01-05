import { queryKeys } from '@/lib/reactQuery/queryKeys'
import { fetchPodcastDetail } from '@/services/fetchPodcastDetail'
import { t } from '@/src/i18nConfig'
import { findEpisodeById } from '@/utils/podcastHelpers'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useFeedback } from './useFeedback'

export const useEpisodeDetail = ({
  podcastId,
  episodeId
}: {
  podcastId: string
  episodeId: string
}) => {
  const { newMessage } = useFeedback()
  const {
    data: podcast,
    error,
    isPending,
    isFetching
  } = useQuery({
    queryKey: queryKeys.podcastDetail(podcastId),
    queryFn: () => fetchPodcastDetail(podcastId),
    enabled: Boolean(podcastId),
    refetchOnMount: true
  })

  const episodeDetail = useMemo(
    () => findEpisodeById({ episodes: podcast?.episodes, episodeId }),
    [podcast?.episodes, episodeId]
  )

  useEffect(() => {
    if (error) {
      newMessage(t('error_episode_detail'))
      return
    }

    if (!episodeDetail) {
      if (!isFetching && !isPending && podcast) {
        newMessage(`${t('episode: ')} ${episodeId} ${t('not_found')} `)
      }
      return
    }
    newMessage(`${t('loading_episode_details')} ${episodeDetail.title}`)
  }, [
    episodeDetail,
    episodeId,
    newMessage,
    isFetching,
    isPending,
    podcast,
    error
  ])

  return {
    loading: !podcast && (isPending || isFetching),
    podcast: podcast ?? null,
    episodeDetail,
    error
  }
}
