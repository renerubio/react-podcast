import { fetchParsedFeed } from '@/services/fetchParsedFeed'
import { fetchPodcastById } from '@/services/fetchPodcastById'
import { IParsedPodcastDetail } from '@/utils/interfaces'
import { parsePodcastDetail } from '@/utils/normalize'

/**
 * Fetches and normalizes a podcast detail by `podcastId`.
 *
 * This function is designed to be used as a TanStack Query `queryFn`:
 * - No local persistence here (TanStack persistence handles it).
 * - Returns a UI-friendly, normalized object (metadata + episodes).
 *
 * @param podcastId - iTunes podcast identifier.
 * @returns Promise that resolves to a normalized podcast detail object.
 *
 * @example
 * ```typescript
 * const detail = await fetchPodcastDetail('123')
 * ```
 */
export async function fetchPodcastDetail(
  podcastId: string
): Promise<IParsedPodcastDetail> {
  const responsePodcastById = await fetchPodcastById(podcastId)
  const xml = await fetchParsedFeed<XMLDocument>(responsePodcastById.feedUrl)

  return parsePodcastDetail({
    podcast: responsePodcastById,
    xml
  })
}
