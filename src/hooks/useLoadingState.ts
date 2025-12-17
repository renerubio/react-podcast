import { useCallback, useState } from 'react'

export interface ILoadingState {
  loading: boolean
  startLoading: () => void
  stopLoading: () => void
}

/**
 * Custom hook for managing loading state.
 *
 * @internal This hook is intended to be used only by loadingContext.tsx
 *
 * @returns {ILoadingState} An object containing:
 * - `loading`: Boolean indicating the current loading state
 * - `startLoading`: Function to set loading state to true
 * - `stopLoading`: Function to set loading state to false
 *
 */
export function useLoadingState(): ILoadingState {
  const [loading, setLoading] = useState(true)

  const startLoading = useCallback(() => setLoading(true), [])
  const stopLoading = useCallback(() => setLoading(false), [])

  return { loading, startLoading, stopLoading }
}
