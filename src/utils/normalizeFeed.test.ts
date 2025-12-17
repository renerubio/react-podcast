import { describe, expect, it, vi } from 'vitest'

vi.mock('@/src/i18nConfig', () => ({
  t: (key: string) => key
}))

import { parseEpisodesFromFeed, parsePodcastDescription } from './normalize'

describe('utils/normalize (feed parsing)', () => {
  it('parsePodcastDescription reads channel description', () => {
    const xml = new DOMParser().parseFromString(
      `<rss><channel><description>  Hello  </description></channel></rss>`,
      'text/xml'
    )
    expect(parsePodcastDescription(xml)).toBe('Hello')
  })

  it('parseEpisodesFromFeed normalizes provider-specific GUIDs', () => {
    const xml = new DOMParser().parseFromString(
      `<rss><channel>
        <item>
          <guid>https://media.blubrry.com/show/12345/episode</guid>
          <title>Ep1</title>
          <pubDate>2025-01-01</pubDate>
          <description>D1</description>
        </item>
        <item>
          <guid>https://example.com/?p=500songs=abc</guid>
          <title>Ep2</title>
          <pubDate>2025-01-02</pubDate>
          <description>D2</description>
        </item>
        <item>
          <guid></guid>
          <title>Ep3</title>
        </item>
      </channel></rss>`,
      'text/xml'
    )

    const episodes = parseEpisodesFromFeed(xml)
    expect(episodes.map((e) => e.title)).toEqual(['Ep1', 'Ep2'])
    expect(episodes[0]?.id).toBe('12345')
    expect(episodes[1]?.id).toBe('abc')
  })
})
