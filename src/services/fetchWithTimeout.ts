const DEFAULT_TIMEOUT = 1000

/**
 * Fetches a resource from the specified URL with a configurable timeout.
 *
 * @param url - The URL to fetch from. Will be proxied through `/api/proxy`.
 * @param options - Optional fetch request initialization options (headers, method, body, etc.).
 * @param timeout - The timeout in milliseconds before the request is aborted. Defaults to 1000ms.
 *
 * @returns A Promise that resolves to the Response object from the fetch request.
 *
 * @throws {DOMException} Throws an AbortError if the request times out.
 *
 * @example
 * ```typescript
 * const response = await fetchWithTimeout('https://example.com/api/data', {}, 5000);
 * const data = await response.json();
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
