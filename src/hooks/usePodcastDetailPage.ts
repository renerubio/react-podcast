// src/hooks/usePodcastDetail.ts
import { useFeedback } from '@/hooks/useFeedback'
import { useLoading } from '@/hooks/useLoading'
import { usePodcast } from '@/src/hooks/usePodcast'
import { t } from '@/src/i18nConfig'
import { stopLoadingWithTimeout } from '@/src/utils/utils'
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
} => {
  const { loading, startLoading, stopLoading } = useLoading()
  const { newMessage } = useFeedback()
  const { podcast, episodes, episodesCount, isCached } = usePodcast({
    podcastId
  })

  useEffect(() => {
    startLoading()

    if (podcast && episodesCount > 0 && isCached) {
      stopLoading()
      return
    }

    if (episodesCount === 0) return
    stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
    newMessage(`${t('loading_podcast_details')} ${podcast?.trackName}`)
  }, [
    episodesCount,
    isCached,
    newMessage,
    podcast,
    podcast?.trackName,
    startLoading,
    stopLoading
  ])

  return {
    loading,
    podcast,
    episodes,
    episodesCount,
    isCached
  }
}
