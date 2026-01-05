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
