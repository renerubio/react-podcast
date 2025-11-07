export type TopPodcast = {
  id: string
  title: string
  author: string
  image: string
  summary?: string
}

type AppleEntry = {
  id?: { attributes?: { ['im:id']?: string } }
  ['im:name']?: { label?: string }
  ['im:artist']?: { label?: string }
  ['im:image']?: Array<{ label?: string }>
  summary?: { label?: string }
}

const APPLE_TOP_100 =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'
// TEST Incremental Static Regeneration (ISR) with a small revalidation time
// export const REVALIDATE_SECONDS = 5
export const REVALIDATE_SECONDS = 60 * 60 * 24 // 24h

export async function fetchTopPodcasts(): Promise<TopPodcast[]> {
  // TEST Incremental Static Regeneration (ISR):
  //  console.log('[fetchTopPodcasts] running (network or regeneration)')

  const res = await fetch(APPLE_TOP_100, {
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
