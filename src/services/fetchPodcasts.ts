import { REVALIDATE_SECONDS } from '@/utils/constants'
import { ITop100Podcasts } from '@/utils/interfaces'
import { normalizePodcasts } from '@/utils/normalize'
import { TAppleEntry } from '@/utils/types'
import { validateTextContentType } from '@/utils/utils'
import { fetchWithTimeout } from './fetchWithTimeout'

const APPLE_TOP_100_URL =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'

/**
 * Fetches the top 100 podcasts from Apple's RSS feed.
 *
 * @returns A promise that resolves to an array of podcast objects containing
 * id, title, author, image URL, and summary information.
 *
 * @throws {Error} When the fetch request fails, returns a non-OK status,
 * receives unexpected content type, or encounters any other error during processing.
 *
 * @remarks
 * This function uses caching with a revalidation period defined by REVALIDATE_SECONDS.
 * The podcast data is transformed from Apple's RSS feed format to a simplified structure.
 */
export async function fetchTopPodcasts(): Promise<ITop100Podcasts[]> {
  try {
    const res = await fetchWithTimeout(APPLE_TOP_100_URL, {
      next: { revalidate: REVALIDATE_SECONDS }
    })

    validateTextContentType(res)

    const json = await res.json()
    const podcasts: TAppleEntry[] = json?.feed?.entry ?? []
    return normalizePodcasts(podcasts)
  } catch (error) {
    throw new Error(`Error fetching top podcasts: ${error}`)
  }
}
