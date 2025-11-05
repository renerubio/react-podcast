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
  const podcasts: AppleEntry[] = json?.feed?.entry ?? []

  return podcasts.map((podcast) => ({
    id: podcast?.id?.attributes?.['im:id'] ?? '',
    title: podcast?.['im:name']?.label ?? '',
    author: podcast?.['im:artist']?.label ?? '',
    image:
      podcast?.['im:image']?.[2]?.label ||
      podcast?.['im:image']?.[0]?.label ||
      '',
    summary: podcast?.summary?.label
  }))
}
