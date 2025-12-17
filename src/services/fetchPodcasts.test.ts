import { describe, expect, it, vi } from 'vitest'

vi.mock('./fetchWithTimeout', () => ({
  fetchWithTimeout: vi.fn()
}))

import { fetchTopPodcasts } from './fetchPodcasts'
import { fetchWithTimeout } from './fetchWithTimeout'

describe('services/fetchPodcasts', () => {
  it('returns normalized podcasts from the feed payload', async () => {
    vi.mocked(fetchWithTimeout).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          feed: {
            entry: [
              {
                id: { attributes: { 'im:id': '1' } },
                'im:name': { label: 'Podcast 1' },
                'im:artist': { label: 'Author 1' },
                'im:image': [{ label: 's' }, { label: 'm' }, { label: 'l' }],
                summary: { label: 'Summary 1' }
              }
            ]
          }
        }),
        { headers: { 'content-type': 'text/plain' } }
      )
    )

    const result = await fetchTopPodcasts()
    expect(result).toEqual([
      {
        id: '1',
        title: 'Podcast 1',
        author: 'Author 1',
        image: 'l',
        summary: 'Summary 1'
      }
    ])
  })
})
