import { describe, expect, it, vi } from 'vitest'

vi.mock('./fetchWithTimeout', () => ({
  fetchWithTimeout: vi.fn()
}))

import { fetchPodcastById } from './fetchPodcastById'
import { fetchWithTimeout } from './fetchWithTimeout'

describe('services/fetchPodcastById', () => {
  it('returns the first result from the lookup payload', async () => {
    vi.mocked(fetchWithTimeout).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          results: [{ trackId: 123, feedUrl: 'https://example.com/feed.xml' }]
        }),
        { headers: { 'content-type': 'text/plain' } }
      )
    )

    const result = await fetchPodcastById('123')
    expect(result).toEqual({
      trackId: 123,
      feedUrl: 'https://example.com/feed.xml'
    })
  })
})
