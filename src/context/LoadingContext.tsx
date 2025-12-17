'use client'

import { useLoadingState } from '@/hooks/useLoadingState'
import { createContext } from 'react'

export type TLoadingContext = {
  loading: boolean
  startLoading: () => void
  stopLoading: () => void
}

export const LoadingCtx = createContext<TLoadingContext | null>(null)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const { loading, startLoading, stopLoading } = useLoadingState()

  return (
    <LoadingCtx.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingCtx.Provider>
  )
}
