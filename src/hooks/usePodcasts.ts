import { getTopPodcastsWithCache } from '@/services/cache/topPodcasts'
import { KEY_PODCASTS } from '@/utils/constants'
import { ITop100Podcasts } from '@/utils/interfaces'
import { localStorageGetWithTTL } from '@/utils/utils'
import { useEffect, useState } from 'react'

/**
 * Custom React hook for managing podcast data with caching functionality.
 *
 * @remarks
 * This hook fetches the top 100 podcasts from the API and caches them in localStorage
 * with a TTL (Time To Live). On subsequent calls, it first checks if cached data exists
 * and is still valid before making a new API request.
 *
 * The hook automatically loads podcasts on component mount and handles loading states,
 * cached data detection, and error scenarios.
 *
 * @returns An object containing:
 * - `podcasts`: Array of top 100 podcasts or null if not loaded/failed
 * - `isCached`: Boolean indicating whether the data was loaded from cache
 * - `error`: Error object if the fetch operation failed, null otherwise
 *
 */
export function usePodcasts() {
  const [cachedTopPodcasts] = useState<ITop100Podcasts[] | null>(() =>
    localStorageGetWithTTL<ITop100Podcasts[]>(KEY_PODCASTS)
  )
  const [podcasts, setPodcasts] = useState<ITop100Podcasts[] | null>(
    cachedTopPodcasts
  )
  const [isCached, setIsCached] = useState<boolean>(Boolean(cachedTopPodcasts))
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadPodcasts = async () => {
      setError(null)

      try {
        const { podcasts: data, isCached: cached } =
          await getTopPodcastsWithCache()

        setPodcasts(data)
        setIsCached(cached)
      } catch (e) {
        setError(e as Error)
        setPodcasts(null)
        setIsCached(false)
      }
    }

    loadPodcasts()
  }, [])
  return { podcasts, isCached, error }
}
