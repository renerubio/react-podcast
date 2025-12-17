import { t } from '@/src/i18nConfig'
import { TIMEOUT_TOAST_OUT_MS } from '@/utils/constants'
import { filterPodcasts } from '@/utils/podcastHelpers'
import { stopLoadingWithTimeout } from '@/utils/utils'
import { useEffect, useMemo, useState } from 'react'
import { useFeedback } from './useFeedback'
import { useLoading } from './useLoading'
import { usePodcasts } from './usePodcasts'

/**
 * Custom hook that manages the state and logic for the Podcasts page.
 *
 * Handles:
 * - Loading state management for podcasts data
 * - Search query state for filtering podcasts
 * - Filtering podcasts based on title and author
 * - User feedback messages during data loading
 *
 * @returns {Object} An object containing:
 * - `loading` {boolean} - Indicates whether podcasts are currently being loaded
 * - `query` {string} - The current search query string
 * - `setQuery` {function} - Function to update the search query
 * - `filtered` {ITop100Podcasts[]} - Array of podcasts filtered by the search query
 *
 */
export const usePodcastsPage = () => {
  const {
    loading,
    startLoading,
    stopLoading,
    startNavLoading,
    stopNavLoading
  } = useLoading()
  const { newMessage } = useFeedback()
  const { podcasts, isCached, error } = usePodcasts()
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (podcasts && podcasts.length > 0) {
      stopLoading()
      stopNavLoading()
      return
    }

    if (error) {
      newMessage(t('error_loading_podcasts'))
      stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
      stopNavLoading()
      return
    }

    if (!isCached) {
      startLoading()
      startNavLoading(TIMEOUT_TOAST_OUT_MS)
      newMessage(t('loading_top_podcasts'))
    }
  }, [
    podcasts,
    newMessage,
    startLoading,
    stopLoading,
    startNavLoading,
    stopNavLoading,
    isCached,
    error
  ])

  const filtered = useMemo(
    () => filterPodcasts({ podcasts, query }),
    [podcasts, query]
  )

  return {
    loading,
    query,
    setQuery,
    filtered
  }
}
