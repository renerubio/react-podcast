import { queryKeys } from '@/lib/reactQuery/queryKeys'
import { fetchTopPodcasts } from '@/services/fetchPodcasts'
import type { ITop100Podcasts } from '@/utils/interfaces'
import { useQuery } from '@tanstack/react-query'

/**
 * Data-only hook for fetching the top podcasts list.
 *
 * Keeps data access separated from UI concerns (SRP) and is easy to mock in tests.
 *
 * @returns TanStack Query result for the top podcasts list.
 *
 * @example
 * ```typescript
 * const { data, isFetching, error } = useTopPodcastsQuery()
 * ```
 */
export function useTopPodcastsQuery() {
  return useQuery<ITop100Podcasts[], Error>({
    queryKey: queryKeys.topPodcasts,
    queryFn: fetchTopPodcasts,
    refetchOnMount: true
  })
}
