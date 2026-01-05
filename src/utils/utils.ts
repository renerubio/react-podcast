import { TIMEOUT_TOAST_OUT_MS } from '@/utils/constants'

/**
 * Resolves a timeout value for stopping a loading indicator.
 *
 * @pure
 * @param params - Configuration for timeout resolution.
 * @param params.timeout - Optional explicit delay in milliseconds.
 * @param params.fallback - Default delay used when `timeout` is undefined.
 * @returns The resolved timeout in milliseconds.
 *
 * @example
 * ```typescript
 * resolveStopLoadingTimeout({ timeout: undefined, fallback: 1500 })
 * // => 1500
 * ```
 */
export function resolveStopLoadingTimeout({
  timeout,
  fallback = TIMEOUT_TOAST_OUT_MS
}: {
  timeout?: number
  fallback?: number
}): number {
  return typeof timeout === 'number' ? timeout : fallback
}

/**
 * Executes the provided `stop` function after a specified timeout.
 *
 * @impure
 * @remarks
 * - Schedules work with `setTimeout`.
 *
 * @param params - Configuration for the timeout behavior.
 * @param params.stopLoadingHandler - Function to execute after the timeout.
 * @param params.timeout - Optional delay in milliseconds before executing `stop`.
 * @returns void
 *
 * @example
 * ```typescript
 * stopLoadingWithTimeout({ stopLoadingHandler: () => setLoading(false) })
 * ```
 */
export function stopLoadingWithTimeout({
  stopLoadingHandler,
  timeout = TIMEOUT_TOAST_OUT_MS
}: {
  stopLoadingHandler: () => void
  timeout?: number
}) {
  const delay = resolveStopLoadingTimeout({
    timeout,
    fallback: TIMEOUT_TOAST_OUT_MS
  })
  setTimeout(() => {
    stopLoadingHandler()
  }, delay)
}

/**
 * Validates that a Response object has a JSON content type.
 *
 * @pure
 * @param res - Response object to validate.
 * @throws Error if the content type is not `application/json`.
 * @returns void
 */
export function validateJsonContentType(res: Response): void {
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(`Unexpected content type: ${contentType}`)
  }
}

/**
 * Validates that a Response object has a text content type.
 *
 * @pure
 * @param res - Response object to validate.
 * @throws Error if the content type does not include `text`.
 * @returns void
 */
export function validateTextContentType(res: Response): void {
  const contentType = res.headers.get('content-type')
  if (!contentType?.includes('text')) {
    throw new Error(`Expected text content type, got: ${contentType}`)
  }
}
