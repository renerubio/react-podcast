import { getTopPodcastsWithCache } from '@/services/cache/topPodcasts'
import { ITop100Podcasts } from '@/utils/interfaces'
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
  const [podcasts, setPodcasts] = useState<ITop100Podcasts[] | null>(null)
  const [isCached, setIsCached] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadPodcasts = async () => {
      setPodcasts(null)
      setError(null)

      try {
        const { podcasts: data, isCached: cached } =
          await getTopPodcastsWithCache()

        setPodcasts(data)
        setIsCached(cached)
      } catch (e) {
        setError(e as Error)
        setPodcasts(null)
      }
    }

    loadPodcasts()
  }, [])
  return { podcasts, isCached, error }
}
