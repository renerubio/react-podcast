'use client'

import { useLoadingState } from '@/hooks/useLoadingState'
import { createContext } from 'react'

export type TLoadingContext = {
  loading: boolean
  startLoading: () => void
  stopLoading: () => void
  navLoading: boolean
  startNavLoading: (timeoutMs?: number) => void
  stopNavLoading: () => void
}

export const LoadingCtx = createContext<TLoadingContext | null>(null)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const {
    loading,
    navLoading,
    startLoading,
    stopLoading,
    startNavLoading,
    stopNavLoading
  } = useLoadingState()

  return (
    <LoadingCtx.Provider
      value={{
        loading,
        startLoading,
        stopLoading,
        navLoading,
        startNavLoading,
        stopNavLoading
      }}
    >
      {children}
    </LoadingCtx.Provider>
  )
}
