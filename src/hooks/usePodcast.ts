import { getCachedPodcast, getPodcastWithCache } from '@/services/cache/podcast'
import { IEpisode, IParsedPodcastDetail } from '@/utils/interfaces'
import { useEffect, useState } from 'react'

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
 * Fetches and caches a podcast detail by id.
 * - Reads from localStorage cache with TTL before hitting the API.
 * - Scrapes the feed URL to enrich metadata with description and episodes.
 * - Persists the combined payload back to cache for a day.
 * @param podcastId - iTunes podcast identifier.
 * @returns Podcast detail, cache indicator, and any load error.
 */
export function usePodcast({
  podcastId
}: {
  podcastId: string
}): UsePodcastResult {
  const [cachedPodcast] = useState<IParsedPodcastDetail | null>(() =>
    getCachedPodcast({ podcastId })
  )
  const [podcast, setPodcast] = useState<IParsedPodcastDetail | null>(
    cachedPodcast
  )
  const [isCached, setIsCached] = useState<boolean>(Boolean(cachedPodcast))
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadPodcast = async () => {
      const cached = getCachedPodcast({ podcastId })
      if (cached) {
        setPodcast(cached)
        setIsCached(true)
        return
      }

      try {
        const { podcast: data, isCached: cached } = await getPodcastWithCache({
          podcastId
        })

        setPodcast(data)
        setIsCached(cached)
      } catch (e) {
        setError(e as Error)
        setPodcast(null)
      }
    }

    loadPodcast()
  }, [podcastId])

  return {
    podcast,
    isCached,
    episodes: podcast?.episodes as IEpisode[],
    episodesCount: podcast?.episodes?.length ?? 0,
    error
  }
}
