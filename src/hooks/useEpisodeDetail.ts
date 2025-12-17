import { t } from '@/src/i18nConfig'
import { TIMEOUT_TOAST_OUT_MS } from '@/utils/constants'
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
  const {
    loading,
    startLoading,
    stopLoading,
    startNavLoading,
    stopNavLoading
  } = useLoading()
  const { newMessage } = useFeedback()
  const { podcast, episodes, error } = usePodcast({ podcastId })

  const episodeDetail = useMemo(
    () => findEpisodeById({ episodes, episodeId }),
    [episodes, episodeId]
  )

  useEffect(() => {
    startLoading()
    startNavLoading(TIMEOUT_TOAST_OUT_MS)

    if (error) {
      stopLoading()
      stopNavLoading()
      newMessage(t('error_episode_detail'))
      return
    }

    if (!episodeDetail) {
      newMessage(`${t('episode: ')} ${episodeId} ${t('not_found')} `)
      stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
      stopNavLoading()
      return
    }
    stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
    stopNavLoading()
    newMessage(`${t('loading_episode_details')} ${episodeDetail.title}`)
  }, [
    episodeDetail,
    episodeId,
    newMessage,
    startLoading,
    stopLoading,
    startNavLoading,
    stopNavLoading
  ])

  return { loading, podcast, episodeDetail, error }
}
