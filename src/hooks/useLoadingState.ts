import { useCallback, useState } from 'react'

export interface ILoadingState {
  loading: boolean
  navLoading: boolean
  startLoading: () => void
  stopLoading: () => void
  startNavLoading: (timeoutMs?: number) => void
  stopNavLoading: () => void
}

/**
 * Custom hook for managing loading state.
 *
 * @internal This hook is intended to be used only by `LoadingContext`.
 *
 * @returns Loading state and handlers for general and navigation loading.
 *
 * @example
 * ```typescript
 * const { loading, startLoading, stopLoading } = useLoadingState()
 * ```
 */
export function useLoadingState(): ILoadingState {
  const [loading, setLoading] = useState(true)
  const [navLoading, setNavLoading] = useState(false)

  const startLoading = useCallback(() => setLoading(true), [])
  const stopLoading = useCallback(() => setLoading(false), [])
  const startNavLoading = useCallback((timeoutMs?: number) => {
    setNavLoading(true)
    if (timeoutMs) {
      setTimeout(() => setNavLoading(false), timeoutMs)
    }
  }, [])
  const stopNavLoading = useCallback(() => setNavLoading(false), [])

  return {
    loading,
    navLoading,
    startLoading,
    stopLoading,
    startNavLoading,
    stopNavLoading
  }
}
