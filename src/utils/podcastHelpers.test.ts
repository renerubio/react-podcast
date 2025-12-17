import { describe, expect, it } from 'vitest'

import { filterPodcasts, findEpisodeById } from './podcastHelpers'

describe('utils/podcastHelpers', () => {
  it('filterPodcasts matches by title or author (case/diacritic-insensitive)', () => {
    const podcasts = [
      { id: '1', title: 'Árbol', author: 'René', image: '', summary: '' },
      { id: '2', title: 'Other', author: 'Someone', image: '', summary: '' }
    ]

    expect(filterPodcasts({ podcasts, query: 'arbol' })).toHaveLength(1)
    expect(filterPodcasts({ podcasts, query: 'RENE' })).toHaveLength(1)
  })

  it('findEpisodeById matches by stringified id', () => {
    const episodes = [{ id: 123 } as any, { id: '456' } as any]
    expect(findEpisodeById({ episodes, episodeId: '123' })?.id).toBe(123)
    expect(
      findEpisodeById({ episodes, episodeId: 456 as any } as any)?.id
    ).toBe('456')
  })
})
