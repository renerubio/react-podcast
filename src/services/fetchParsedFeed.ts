import { validateTextContentType } from '@/utils/utils'
import { fetchWithTimeout } from './fetchWithTimeout'

/**
 * Fetches and parses an XML feed from the specified URL via a proxy endpoint.
 *
 * @template T - Expected return type after parsing the XML.
 * @param url - URL of the feed to fetch and parse.
 * @returns Promise that resolves to the parsed XML, cast to type T.
 * @throws Error if the fetch or parsing fails.
 *
 * @example
 * ```typescript
 * const xml = await fetchParsedFeed<XMLDocument>(feedUrl)
 * ```
 */
export async function fetchParsedFeed<T>(url: string): Promise<T> {
  try {
    const res = await fetchWithTimeout(url, {
      cache: 'no-store'
    })

    validateTextContentType(res)

    const text = await res.text()
    const xml = new DOMParser().parseFromString(text, 'text/xml')
    return xml as unknown as T
  } catch (error) {
    throw new Error(`Error fetching/parsing feed from URL ${url}: ${error}`)
  }
}
