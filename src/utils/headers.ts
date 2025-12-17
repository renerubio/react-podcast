'use server'
import { LANGUAGE_FALLBACK } from '@/utils/constants'
import { headers } from 'next/headers'

/**
 * Retrieves the preferred locale from the HTTP request headers.
 *
 * This function asynchronously fetches the HTTP headers, extracts the
 * 'accept-language' value, and parses it to determine the primary locale.
 * If the 'accept-language' header is missing or cannot be parsed, it defaults to 'en'.
 *
 * @returns {Promise<string>} A promise that resolves to the locale string (e.g., 'en', 'es').
 * @throws {Error} Throws an error if the headers cannot be retrieved or processed.
 */
export async function getRequestLocale(): Promise<string> {
  try {
    const httpHeaders = await headers()
    if (!httpHeaders) {
      throw new Error('HTTP headers could not be retrieved')
    }
    const acceptLanguage = httpHeaders.get('accept-language') || ''
    const locale = acceptLanguage.split(',')[0]?.split('-')[0]
    return locale || LANGUAGE_FALLBACK
  } catch (error) {
    throw new Error(
      `Failed to retrieve or process headers: ${(error as Error).message}`
    )
  }
}
