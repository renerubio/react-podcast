import { describe, expect, it } from 'vitest'

import {
  resolveStopLoadingTimeout,
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

  it('resolveStopLoadingTimeout returns fallback when timeout is undefined', () => {
    expect(
      resolveStopLoadingTimeout({ timeout: undefined, fallback: 1500 })
    ).toBe(1500)
  })

  it('resolveStopLoadingTimeout returns timeout when provided', () => {
    expect(resolveStopLoadingTimeout({ timeout: 2500, fallback: 1500 })).toBe(
      2500
    )
  })
})
