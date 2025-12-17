import { fetchTopPodcasts } from '@/services/fetchPodcasts'
import { KEY_PODCASTS, ONE_DAY_MS } from '@/utils/constants'
import { ITop100Podcasts } from '@/utils/interfaces'
import { localStorageGetWithTTL, localStorageSetWithTTL } from '@/utils/utils'

type TopPodcastsResult = {
  podcasts: ITop100Podcasts[] | null
  isCached: boolean
}

const readCachedTopPodcasts = (): ITop100Podcasts[] | null =>
  localStorageGetWithTTL(KEY_PODCASTS)

const writeCachedTopPodcasts = (
  podcasts: ITop100Podcasts[],
  ttlMs = ONE_DAY_MS
) => localStorageSetWithTTL(KEY_PODCASTS, podcasts, ttlMs)

/**
 * Retrieves the top podcasts list with caching support.
 *
 * First attempts to read from cache. If valid cached data exists, returns it immediately.
 * Otherwise, fetches fresh data from the API, caches it with a TTL, and returns the result.
 *
 * @returns {Promise<TopPodcastsResult>} A promise that resolves to an object containing:
 *   - `podcasts`: Array of top podcasts or null if fetch failed
 *   - `isCached`: Boolean indicating whether the data was retrieved from cache
 *
 * @example
 * ```typescript
 * const { podcasts, isCached } = await getTopPodcastsWithCache();
 * if (podcasts) {
 *   console.log(`Retrieved ${podcasts.length} podcasts (cached: ${isCached})`);
 * }
 * ```
 */
export async function getTopPodcastsWithCache(): Promise<TopPodcastsResult> {
  const cached = readCachedTopPodcasts()
  if (cached && cached.length > 0) {
    return { podcasts: cached, isCached: true }
  }

  const podcasts = await fetchTopPodcasts()
  if (!podcasts || podcasts.length === 0) {
    return { podcasts: null, isCached: false }
  }

  writeCachedTopPodcasts(podcasts)
  return { podcasts, isCached: false }
}
