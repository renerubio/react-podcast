'use server'
import { parseLocaleFromAcceptLanguage } from '@/utils/headersPure'
import { headers } from 'next/headers'

/**
 * Retrieves the preferred locale from the HTTP request headers.
 *
 * @impure
 * @remarks
 * - Reads request headers from Next.js runtime.
 * - Depends on the current request environment and headers.
 *
 * @returns A promise that resolves to the locale string (e.g., `en`, `es`).
 * @throws Error when headers cannot be retrieved or processed.
 *
 * @example
 * ```typescript
 * const locale = await getRequestLocale()
 * ```
 */
export async function getRequestLocale(): Promise<string> {
  try {
    const httpHeaders = await headers()
    if (!httpHeaders) {
      throw new Error('HTTP headers could not be retrieved')
    }
    const acceptLanguage = httpHeaders.get('accept-language') || ''
    return parseLocaleFromAcceptLanguage(acceptLanguage)
  } catch (error) {
    throw new Error(
      `Failed to retrieve or process headers: ${(error as Error).message}`
    )
  }
}
