import { describe, expect, it } from 'vitest'

import { validateJsonContentType, validateTextContentType } from './utils'

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
})
