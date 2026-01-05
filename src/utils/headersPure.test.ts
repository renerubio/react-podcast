import { describe, expect, it } from 'vitest'

import { parseLocaleFromAcceptLanguage } from './headersPure'

describe('utils/headersPure', () => {
  it('parseLocaleFromAcceptLanguage returns primary locale', () => {
    expect(parseLocaleFromAcceptLanguage('es-MX,es;q=0.9,en;q=0.8')).toBe('es')
  })

  it('parseLocaleFromAcceptLanguage returns fallback when empty', () => {
    expect(parseLocaleFromAcceptLanguage('', 'en')).toBe('en')
  })
})
