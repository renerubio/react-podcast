export type TopPodcast = {
  id: string
  title: string
  author: string
  image: string
  summary?: string
}

export interface IPodcastDetail {
  wrapperType: string
  kind: string
  artistId: number
  artistName: string
  artistViewUrl: string
  artworkUrl30: string
  artworkUrl60: string
  artworkUrl100: string
  artworkUrl600: string
  collectionCensoredName: string
  collectionExplicitness: string
  collectionHdPrice: number
  collectionId: number
  collectionName: string
  collectionPrice: number
  collectionViewUrl: string
  contentAdvisoryRating: string
  country: string
  currency: string
  feedUrl: string
  genreIds: string[]
  genres: string[]
  primaryGenreName: string
  releaseDate: string
  trackCensoredName: string
  trackCount: number
  trackExplicitness: string
  trackId: number
  trackName: string
  trackPrice: number
  trackTimeMillis: number
  trackViewUrl: string
}

type AppleEntry = {
  id?: { attributes?: { ['im:id']?: string } }
  ['im:name']?: { label?: string }
  ['im:artist']?: { label?: string }
  ['im:image']?: Array<{ label?: string }>
  summary?: { label?: string }
}

const APPLE_TOP_100_URL =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'
const APPLE_PODCAST_LOOKUP_URL =
  'https://itunes.apple.com/lookup?id={podcastId}&media=podcast'
// TEST Incremental Static Regeneration (ISR) with a small revalidation time
// export const REVALIDATE_SECONDS = 5
export const REVALIDATE_SECONDS = 60 * 60 * 24 // 24h

/**
 * Fetches the top 100 podcasts from the Apple Podcasts API and returns them as an array of `TopPodcast` objects.
 *
 * The function performs a network request to the Apple Top 100 Podcasts endpoint, processes the response,
 * and maps the resulting data into a simplified format suitable for application use.
 *
 * @returns {Promise<TopPodcast[]>} A promise that resolves to an array of `TopPodcast` objects.
 * @throws {Error} If the network request fails or returns a non-OK status.
 */
export async function fetchTopPodcasts(): Promise<TopPodcast[]> {
  // TEST Incremental Static Regeneration (ISR):
  //  console.info('[fetchTopPodcasts] running (network or regeneration)')

  const res = await fetch(APPLE_TOP_100_URL, {
    next: { revalidate: REVALIDATE_SECONDS }
  })
  if (!res.ok) throw new Error(`Failed to fetch Top 100: ${res.status}`)

  const json = await res.json()
  const podcasts: AppleEntry[] = json?.feed?.entry ?? []

  return podcasts.map((podcast, idx) => ({
    id: podcast?.id?.attributes?.['im:id'] ?? String(idx),
    title: podcast?.['im:name']?.label ?? '',
    author: podcast?.['im:artist']?.label ?? '',
    image:
      podcast?.['im:image']?.[2]?.label ||
      podcast?.['im:image']?.[0]?.label ||
      '', // pon un placeholder si quieres
    summary: podcast?.summary?.label ?? ''
  }))
}

/**
 * Fetches detailed information for a podcast by its ID from the Apple Podcast Lookup API.
 *
 * @param id - The unique identifier of the podcast to fetch.
 * @returns A promise that resolves to an `IPodcastDetail` object containing the podcast details.
 * @throws Will throw an error if the network request fails or the response is not OK.
 */
export async function fetchPodcastById(id: string): Promise<IPodcastDetail> {
  const url = APPLE_PODCAST_LOOKUP_URL.replace('{podcastId}', id)
  const fetchOptions =
    process.env.NODE_ENV === 'development'
      ? { cache: 'no-store' as const }
      : { next: { revalidate: REVALIDATE_SECONDS } }

  const res = await fetch(url, fetchOptions)
  if (!res.ok) throw new Error(`Failed to fetch podcast ${id}: ${res.status}`)
  const json = await res.json()
  const podcast = json?.results?.[0] ?? null
  return podcast
}

/**
 * Fetches and parses an XML feed from the specified URL via a proxy endpoint.
 *
 * @template T - The expected return type after parsing the XML.
 * @param {string} url - The URL of the feed to fetch and parse.
 * @returns {Promise<T>} A promise that resolves to the parsed XML, cast to type T.
 * @throws {Error} If the fetch request fails or returns a non-OK response.
 */
export async function scrappingFromFeedUrl<T>(url: string): Promise<T> {
  const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`, {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error(`Failed to fetch from url ${url}`)
  const text = await res.text()
  const xml = new DOMParser().parseFromString(text, 'text/xml')
  return xml as unknown as T
}
