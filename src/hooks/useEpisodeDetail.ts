import { t } from '@/src/i18nConfig'
import { findEpisodeById } from '@/utils/podcastHelpers'
import { stopLoadingWithTimeout } from '@/utils/utils'
import { useEffect, useMemo } from 'react'
import { useFeedback } from './useFeedback'
import { useLoading } from './useLoading'
import { usePodcast } from './usePodcast'

export const useEpisodeDetail = ({
  podcastId,
  episodeId
}: {
  podcastId: string
  episodeId: string
}) => {
  const { loading, startLoading, stopLoading } = useLoading()
  const { newMessage } = useFeedback()
  const { podcast, episodes } = usePodcast({ podcastId })

  const episodeDetail = useMemo(
    () => findEpisodeById({ episodes, episodeId }),
    [episodes, episodeId]
  )

  useEffect(() => {
    startLoading()
    if (!episodeDetail) {
      newMessage(`${t('episode: ')} ${episodeId} ${t('not_found')} `)
      stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
      return
    }
    stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
    newMessage(`${t('loading_episode_details')} ${episodeDetail.title}`)
  }, [episodeDetail, episodeId, newMessage, startLoading, stopLoading])

  return { loading, podcast, episodeDetail }
}
