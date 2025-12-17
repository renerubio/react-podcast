import { describe, expect, it, vi } from 'vitest'

import {
  localStorageGetWithTTL,
  localStorageSetWithTTL,
  validateJsonContentType,
  validateTextContentType
} from './utils'

describe('utils/utils', () => {
  it('validateJsonContentType throws on non-json', () => {
    const res = new Response('{}', {
      headers: { 'content-type': 'text/plain' }
    })
    expect(() => validateJsonContentType(res)).toThrow(
      /Unexpected content type/
    )
  })

  it('validateTextContentType throws on non-text', () => {
    const res = new Response('{}', {
      headers: { 'content-type': 'application/json' }
    })
    expect(() => validateTextContentType(res)).toThrow(
      /Expected text content type/
    )
  })

  it('localStorageSetWithTTL stores and localStorageGetWithTTL reads until expired', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'))

    localStorage.clear()
    localStorageSetWithTTL('k', { a: 1 }, 1000)
    expect(localStorageGetWithTTL<{ a: number }>('k')).toEqual({ a: 1 })

    vi.setSystemTime(new Date('2025-01-01T00:00:01.001Z'))
    expect(localStorageGetWithTTL<{ a: number }>('k')).toBeNull()
    expect(localStorage.getItem('k')).toBeNull()

    vi.useRealTimers()
  })
})
