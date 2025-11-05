import { TIMEOUT_TOAST_OUT_MS } from '@/utils/constants'

export function stopWithTimeout({
  stop,
  timeout = TIMEOUT_TOAST_OUT_MS
}: {
  stop: () => void
  timeout?: number
}) {
  setTimeout(() => {
    stop()
  }, timeout)
}
