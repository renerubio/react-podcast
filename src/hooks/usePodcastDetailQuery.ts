import { queryKeys } from '@/lib/reactQuery/queryKeys'
import { fetchPodcastDetail } from '@/services/fetchPodcastDetail'
import type { IParsedPodcastDetail } from '@/utils/interfaces'
import { useQuery } from '@tanstack/react-query'

/**
 * Data-only hook for fetching a podcast detail by id.
 *
 * Keeps data access separated from UI concerns (SRP) and is easy to mock in tests.
 *
 * @param podcastId - Podcast identifier.
 * @returns TanStack Query result for the podcast detail.
 *
 * @example
 * ```typescript
 * const { data, isFetching } = usePodcastDetailQuery(podcastId)
 * ```
 */
export function usePodcastDetailQuery(podcastId: string) {
  return useQuery<IParsedPodcastDetail, Error>({
    queryKey: queryKeys.podcastDetail(podcastId),
    queryFn: () => fetchPodcastDetail(podcastId),
    enabled: Boolean(podcastId),
    refetchOnMount: true
  })
}
