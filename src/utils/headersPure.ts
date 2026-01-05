import { LANGUAGE_FALLBACK } from '@/utils/constants'

/**
 * Parses the primary locale from an Accept-Language header value.
 *
 * @pure
 * @param acceptLanguage - Raw `accept-language` header value.
 * @param fallback - Locale to use when parsing fails or value is empty.
 * @returns The normalized locale string (e.g., `en`, `es`).
 *
 * @example
 * ```typescript
 * parseLocaleFromAcceptLanguage('es-MX,es;q=0.9,en;q=0.8')
 * // => 'es'
 * ```
 */
export function parseLocaleFromAcceptLanguage(
  acceptLanguage: string,
  fallback: string = LANGUAGE_FALLBACK
): string {
  const locale = acceptLanguage.split(',')[0]?.split('-')[0]
  return locale || fallback
}
