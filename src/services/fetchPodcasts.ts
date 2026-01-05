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
 * @returns Promise that resolves to an array of normalized podcast objects.
 * @throws Error when the fetch request fails or the response is invalid.
 *
 * @remarks
 * Uses Next.js revalidation via `REVALIDATE_SECONDS`.
 *
 * @example
 * ```typescript
 * const podcasts = await fetchTopPodcasts()
 * ```
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
