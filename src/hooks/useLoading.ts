import { LoadingCtx } from '@/context/LoadingContext'
import { useContext } from 'react'

export function useLoading() {
  const ctx = useContext(LoadingCtx)
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider')
  const { loading, stopLoading, startLoading } = ctx
  return { loading, stopLoading, startLoading }
}
