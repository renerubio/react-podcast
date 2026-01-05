import { TIMEOUT_TOAST_OUT_MS } from '@/utils/constants'

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
