import { describe, expect, it } from 'vitest'

import { formatDuration, normalizePodcasts, normalizeText } from './normalize'

describe('utils/normalize', () => {
  it('normalizeText lowercases and strips diacritics', () => {
    expect(normalizeText('  ÁrBOL  ')).toBe('arbol')
  })

  it('formatDuration formats seconds to m:ss', () => {
    expect(formatDuration(65)).toBe('1:05')
  })

  it('normalizePodcasts maps minimal apple entries', () => {
    const entries = [
      {
        id: { attributes: { 'im:id': '123' } },
        'im:name': { label: 'Title' },
        'im:artist': { label: 'Author' },
        'im:image': [{ label: 's' }, { label: 'm' }, { label: 'l' }],
        summary: { label: 'Summary' }
      }
    ] as any

    expect(normalizePodcasts(entries)).toEqual([
      {
        id: '123',
        title: 'Title',
        author: 'Author',
        image: 'l',
        summary: 'Summary'
      }
    ])
  })
})
