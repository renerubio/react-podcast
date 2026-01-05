import { queryKeys } from '@/lib/reactQuery/queryKeys'
import { fetchPodcastDetail } from '@/services/fetchPodcastDetail'
import { IEpisode, IParsedPodcastDetail } from '@/utils/interfaces'
import { useQuery } from '@tanstack/react-query'

/**
 * Shape returned by `usePodcast`, combining the normalized podcast payload
 * with flags indicating cache usage and load failures.
 */
interface UsePodcastResult {
  podcast: IParsedPodcastDetail | null
  episodes: IEpisode[]
  episodesCount: number
  isCached: boolean
  error: Error | null
}

/**
 * Fetches a podcast detail by id using TanStack Query.
 *
 * Caching/persistence is handled by the global TanStack Query setup (IndexedDB),
 * so this hook stays focused on data access and shape for the UI.
 * @param podcastId - iTunes podcast identifier.
 * @returns Podcast detail, cache indicator, and any load error.
 */
export function usePodcast({
  podcastId
}: {
  podcastId: string
}): UsePodcastResult {
  const { data, error } = useQuery({
    queryKey: queryKeys.podcastDetail(podcastId),
    queryFn: () => fetchPodcastDetail(podcastId),
    enabled: Boolean(podcastId),
    refetchOnMount: true
  })

  return {
    podcast: data ?? null,
    isCached: Boolean(data),
    episodes: (data?.episodes ?? []) as IEpisode[],
    episodesCount: data?.episodes?.length ?? 0,
    error: (error as Error) ?? null
  }
}
