const DEFAULT_TIMEOUT = 1000

/**
 * Fetches a resource from the specified URL with a configurable timeout.
 *
 * @param url - URL to fetch from; proxied through `/api/proxy`.
 * @param options - Fetch request initialization options.
 * @param timeout - Timeout in milliseconds before the request is aborted.
 * @returns Promise that resolves to the Response object.
 * @throws DOMException when the request times out (AbortError).
 *
 * @example
 * ```typescript
 * const response = await fetchWithTimeout('https://example.com/api/data', {}, 5000)
 * const data = await response.json()
 * ```
 */
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = DEFAULT_TIMEOUT
): Promise<Response> => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`, {
      ...options,
      signal: controller.signal
    })

    return response
  } finally {
    clearTimeout(id)
  }
}
