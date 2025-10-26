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

export async function fetchTopPodcasts(): Promise<TopPodcast[]> {
  const res = await fetch('/api/top-podcasts', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch Top 100')
  const json = await res.json()
  const entries: AppleEntry[] = json?.feed?.entry ?? []

  return entries.map((e) => ({
    id: e?.id?.attributes?.['im:id'] ?? '',
    title: e?.['im:name']?.label ?? '',
    author: e?.['im:artist']?.label ?? '',
    image: e?.['im:image']?.[2]?.label || e?.['im:image']?.[0]?.label || '',
    summary: e?.summary?.label
  }))
}
