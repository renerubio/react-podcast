import { usePodcastsFeedback } from '@/hooks/usePodcastsFeedback'
import { useTopPodcastsQuery } from '@/hooks/useTopPodcastsQuery'
import type { ITop100Podcasts } from '@/utils/interfaces'
import { filterPodcasts } from '@/utils/podcastHelpers'
import { useMemo, useState } from 'react'

type UseTopPodcastsQueryHook = () => {
  data?: ITop100Podcasts[]
  error?: unknown
  isPending: boolean
  isFetching: boolean
}

type UsePodcastsFeedbackHook = (params: {
  podcasts?: ITop100Podcasts[]
  error?: unknown
  isFetching: boolean
}) => void

type FilterPodcastsHook = (params: {
  podcasts: ITop100Podcasts[] | null
  query: string
}) => ITop100Podcasts[]

/**
 * Factory function that creates a `usePodcastsPage` hook with injected dependencies.
 *
 * Separates responsibilities (SRP) and allows dependency inversion (DIP) for testing.
 *
 * @param options - Configuration object for the hook factory.
 * @param options.useTopPodcastsQueryHook - Hook that provides the top podcasts query state.
 * @param options.usePodcastsFeedbackHook - Hook that handles feedback messaging.
 * @param options.filterPodcastsHook - Pure filter function for search queries.
 * @returns A custom React hook that composes data loading, filtering, and feedback.
 *
 * @example
 * ```typescript
 * const useCustomPodcastsPage = createUsePodcastsPage({
 *   useTopPodcastsQueryHook: mockUseQuery,
 *   usePodcastsFeedbackHook: mockUseFeedback,
 *   filterPodcastsHook: mockFilter
 * })
 *
 * const state = useCustomPodcastsPage()
 * ```
 */
export function createUsePodcastsPage({
  useTopPodcastsQueryHook,
  usePodcastsFeedbackHook,
  filterPodcastsHook
}: {
  useTopPodcastsQueryHook: UseTopPodcastsQueryHook
  usePodcastsFeedbackHook: UsePodcastsFeedbackHook
  filterPodcastsHook: FilterPodcastsHook
}) {
  /**
   * Composes data, feedback, and filtering for the podcasts page.
   *
   * @returns State and handlers for the podcasts page.
   */
  return function usePodcastsPage() {
    const {
      data: podcasts,
      error,
      isPending,
      isFetching
    } = useTopPodcastsQueryHook()
    const [query, setQuery] = useState('')

    usePodcastsFeedbackHook({ podcasts, error, isFetching })

    const filtered = useMemo(
      () => filterPodcastsHook({ podcasts: podcasts ?? null, query }),
      [podcasts, query]
    )

    return {
      loading: !podcasts && (isPending || isFetching),
      query,
      setQuery,
      filtered
    }
  }
}

/**
 * Custom hook that manages the state and logic for the Podcasts page.
 *
 * Handles:
 * - Loading state management for podcasts data.
 * - Search query state for filtering podcasts.
 * - Filtering podcasts based on title and author.
 * - User feedback messages during data loading.
 *
 * @returns State and handlers for the podcasts page.
 *
 * @example
 * ```typescript
 * const { loading, query, setQuery, filtered } = usePodcastsPage()
 * ```
 */
export const usePodcastsPage = createUsePodcastsPage({
  useTopPodcastsQueryHook: useTopPodcastsQuery,
  usePodcastsFeedbackHook: usePodcastsFeedback,
  filterPodcastsHook: filterPodcasts
})
