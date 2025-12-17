import { t } from '@/src/i18nConfig'
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
  const { loading, startLoading, stopLoading } = useLoading()
  const { newMessage } = useFeedback()
  const { podcasts, error } = usePodcasts()
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (error) {
      newMessage(t('error_loading_podcasts'))
      stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
      return
    }

    if (!podcasts) {
      newMessage(t('no_podcasts_found'))
      stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
      return
    }

    startLoading()
    newMessage(t('loading_top_podcasts'))
    if (podcasts) {
      stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
    }
  }, [podcasts, newMessage, startLoading, stopLoading, error])

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
