import { IPodcastDetail } from '@/utils/interfaces'
import { validateTextContentType } from '@/utils/utils'
import { fetchWithTimeout } from './fetchWithTimeout'

const APPLE_PODCAST_LOOKUP_URL =
  'https://itunes.apple.com/lookup?id={podcastId}&media=podcast'

/**
 * Fetches detailed information about a podcast by its ID from the Apple Podcast API.
 *
 * @param id - The unique identifier of the podcast to fetch
 * @returns A promise that resolves to the podcast detail object
 * @throws {Error} When the fetch request fails, returns a non-OK status, or receives invalid content type
 * @throws {Error} When there's an error parsing the response or accessing podcast data
 *
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
