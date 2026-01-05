import { queryKeys } from '@/lib/reactQuery/queryKeys'
import { fetchTopPodcasts } from '@/services/fetchPodcasts'
import { t } from '@/src/i18nConfig'
import { filterPodcasts } from '@/utils/podcastHelpers'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useFeedback } from './useFeedback'

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
  const { newMessage } = useFeedback()
  const {
    data: podcasts,
    error,
    isPending,
    isFetching
  } = useQuery({
    queryKey: queryKeys.topPodcasts,
    queryFn: fetchTopPodcasts,
    refetchOnMount: true
  })
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (error) {
      newMessage(t('error_loading_podcasts'))
      return
    }

    if (!podcasts && isFetching) {
      newMessage(t('loading_top_podcasts'))
      return
    }

    if (podcasts && podcasts.length === 0) {
      newMessage(t('no_podcasts_found'))
    }
  }, [podcasts, newMessage, isFetching, error])

  const filtered = useMemo(
    () => filterPodcasts({ podcasts: podcasts ?? null, query }),
    [podcasts, query]
  )

  return {
    loading: !podcasts && (isPending || isFetching),
    query,
    setQuery,
    filtered
  }
}
