import { IPodcastDetail } from '@/utils/interfaces'
import { validateTextContentType } from '@/utils/utils'
import { fetchWithTimeout } from './fetchWithTimeout'

const APPLE_PODCAST_LOOKUP_URL =
  'https://itunes.apple.com/lookup?id={podcastId}&media=podcast'

/**
 * Fetches detailed information about a podcast by its ID from the Apple Podcast API.
 *
 * @param id - Unique identifier of the podcast to fetch.
 * @returns Promise that resolves to the podcast detail object.
 * @throws Error when the fetch request fails or returns invalid content.
 *
 * @example
 * ```typescript
 * const detail = await fetchPodcastById('123')
 * ```
 */
export async function fetchPodcastById(id: string): Promise<IPodcastDetail> {
  try {
    const url = APPLE_PODCAST_LOOKUP_URL.replace('{podcastId}', id)
    const res = await fetchWithTimeout(url, {
      cache: 'no-store'
    })

    validateTextContentType(res)

    const json = await res.json()
    const podcast = json?.results?.[0] ?? null
    return podcast
  } catch (error) {
    throw new Error(`Error fetching podcast by ID ${id}: ${error}`)
  }
}
