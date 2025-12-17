import { fetchParsedFeed } from '@/services/fetchParsedFeed'
import { fetchPodcastById } from '@/services/fetchPodcastById'
import { ONE_DAY_MS, PODCAST_ID } from '@/utils/constants'
import { IParsedPodcastDetail } from '@/utils/interfaces'
import { parsePodcastDetail } from '@/utils/normalize'
import { localStorageGetWithTTL, localStorageSetWithTTL } from '@/utils/utils'

const buildPodcastCacheKey = ({ podcastId }: { podcastId: string }) =>
  `${PODCAST_ID}_${podcastId}`

const readCachedPodcast = ({
  podcastId
}: {
  podcastId: string
}): IParsedPodcastDetail | null =>
  localStorageGetWithTTL(buildPodcastCacheKey({ podcastId }))

const writeCachedPodcast = (params: {
  podcastId: string
  podcast: IParsedPodcastDetail
  ttlMs?: number
}) => {
  const { podcastId, podcast, ttlMs = ONE_DAY_MS } = params
  localStorageSetWithTTL(buildPodcastCacheKey({ podcastId }), podcast, ttlMs)
}

export type PodcastWithCacheResult = {
  podcast: IParsedPodcastDetail | null
  isCached: boolean
}

/**
 * Retrieves podcast details with caching support.
 *
 * First checks if the podcast is available in localStorage cache. If found and valid,
 * returns the cached data. Otherwise, fetches the podcast from the API, parses the feed,
 * and stores the result in cache for future requests.
 *
 * @param podcastId - The unique identifier of the podcast to retrieve
 * @returns A promise that resolves to an object containing:
 *   - podcast: The parsed podcast details or null if fetching failed
 *   - isCached: Boolean indicating whether the data was retrieved from cache
 *
 * @example
 * ```typescript
 * const { podcast, isCached } = await getPodcastWithCache({ podcastId: '123456' });
 * if (podcast) {
 *   console.log(isCached ? 'Loaded from cache' : 'Fetched from API');
 * }
 * ```
 */
export async function getPodcastWithCache({
  podcastId
}: {
  podcastId: string
}): Promise<PodcastWithCacheResult> {
  const cached = readCachedPodcast({ podcastId })
  if (cached && Object.keys(cached).length > 0) {
    return { podcast: cached, isCached: true }
  }

  const responsePodcastById = await fetchPodcastById(podcastId)
  const xml = await fetchParsedFeed(responsePodcastById.feedUrl)

  if (!responsePodcastById || !xml) {
    return { podcast: null, isCached: false }
  }

  const parsed = parsePodcastDetail({
    podcast: responsePodcastById,
    xml: xml as XMLDocument
  })

  writeCachedPodcast({ podcastId, podcast: parsed, ttlMs: ONE_DAY_MS })
  return { podcast: parsed, isCached: false }
}
