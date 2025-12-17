// src/hooks/usePodcastDetail.ts
import { useFeedback } from '@/hooks/useFeedback'
import { useLoading } from '@/hooks/useLoading'
import { usePodcast } from '@/src/hooks/usePodcast'
import { t } from '@/src/i18nConfig'
import { stopLoadingWithTimeout } from '@/src/utils/utils'
import { TIMEOUT_TOAST_OUT_MS } from '@/utils/constants'
import { IEpisode, IParsedPodcastDetail } from '@/utils/interfaces'
import { useEffect } from 'react'

export const usePodcastDetail = ({
  podcastId
}: {
  podcastId: string
}): {
  loading: boolean
  podcast: IParsedPodcastDetail | null
  episodes: IEpisode[]
  episodesCount: number
  isCached: boolean
  error: Error | null
} => {
  const {
    loading,
    startLoading,
    stopLoading,
    startNavLoading,
    stopNavLoading
  } = useLoading()
  const { newMessage } = useFeedback()
  const { podcast, episodes, episodesCount, isCached, error } = usePodcast({
    podcastId
  })

  useEffect(() => {
    startLoading()
    startNavLoading(TIMEOUT_TOAST_OUT_MS)

    if (error) {
      stopLoading()
      stopNavLoading()
      newMessage(t('error_podcast_detail'))
      return
    }

    if (podcast && episodesCount > 0 && isCached) {
      stopLoading()
      stopNavLoading()
      newMessage(`${t('loading_podcast_details')} ${podcast.trackName}`)
      return
    }

    if (episodesCount === 0) return
    stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
    stopNavLoading()
    newMessage(`${t('loading_podcast_details')} ${podcast?.trackName}`)
  }, [
    episodesCount,
    isCached,
    error,
    newMessage,
    podcast?.trackName,
    startLoading,
    stopLoading,
    startNavLoading,
    stopNavLoading,
    podcast
  ])

  return {
    loading,
    podcast,
    episodes,
    episodesCount,
    isCached,
    error
  }
}
