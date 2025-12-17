import { ONE_DAY_MS, TIMEOUT_TOAST_OUT_MS } from '@/utils/constants'

/**
 * Executes the provided `stop` function after a specified timeout.
 *
 * @param params - The parameters for the function.
 * @param params.stopLoadingHandler - The function to be executed after the timeout.
 * @param params.timeout - Optional. The delay in milliseconds before executing `stop`. Defaults to `TIMEOUT_TOAST_OUT_MS`.
 */
export function stopLoadingWithTimeout({
  stopLoadingHandler,
  timeout = TIMEOUT_TOAST_OUT_MS
}: {
  stopLoadingHandler: () => void
  timeout?: number
}) {
  setTimeout(() => {
    stopLoadingHandler()
  }, timeout)
}

const buildTTLRecord = <T>(value: T, ttlMs = ONE_DAY_MS) => ({
  value,
  ts: Date.now(),
  ttl: ttlMs
})

const isTTLExpired = ({ ts, ttl }: { ts: number; ttl: number }) =>
  Date.now() - ts > ttl

export function localStorageSetWithTTL<T>(
  key: string,
  value: T,
  ttlMs = ONE_DAY_MS
): void {
  if (typeof window === 'undefined') return
  const payload = buildTTLRecord(value, ttlMs)
  localStorage.setItem(key, JSON.stringify(payload))
}

/**
 * Retrieves a value from localStorage by key, supporting an optional time-to-live (TTL) mechanism.
 * If the stored item has expired based on its timestamp (`ts`) and TTL, it is removed and `null` is returned.
 * If the item is not found or cannot be parsed, `null` is returned.
 *
 * The stored value in localStorage is expected to be a JSON string with the following properties:
 * - `value`: The actual value to be retrieved.
 * - `ts`: The timestamp (in milliseconds since epoch) when the value was stored.
 * - `ttl`: (Optional) The time-to-live in milliseconds. If not provided, defaults to `ONE_DAY_MS`.
 *
 * @param key - The localStorage key to retrieve.
 * @returns The stored value if it exists and has not expired, otherwise `null`.
 */
export function localStorageGetWithTTL<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(key)
  if (!raw) return null

  try {
    const {
      value,
      ts,
      ttl = ONE_DAY_MS
    } = JSON.parse(raw) as {
      value: T
      ts: number
      ttl: number
    }
    if (isTTLExpired({ ts, ttl })) {
      localStorage.removeItem(key)
      return null
    }
    return value
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

/**
 * Validates that a Response object has a JSON content type.
 * Throws an error if the content type is not 'application/json'.
 *
 * @param res - The Response object to validate.
 * @throws {Error} If the content type is not 'application/json'.
 */
export function validateJsonContentType(res: Response): void {
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(`Unexpected content type: ${contentType}`)
  }
}

/**
 * Validates that a Response object has a text content type.
 * Throws an error if the content type does not include 'text'.
 *
 * @param res - The Response object to validate.
 * @throws {Error} If the content type does not include 'text'.
 */
export function validateTextContentType(res: Response): void {
  const contentType = res.headers.get('content-type')
  if (!contentType?.includes('text')) {
    throw new Error(`Expected text content type, got: ${contentType}`)
  }
}
