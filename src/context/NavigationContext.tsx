'use client'

import { createContext, useContext, useState } from 'react'

const Ctx = createContext<NavigationCtx | null>(null)

export function NavigationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | undefined>()

  const start = (msg?: string) => {
    setMessage(msg)
    setLoading(true)
  }
  const stop = () => {
    setLoading(false)
    setMessage(undefined)
  }

  return (
    <Ctx.Provider value={{ loading, start, stop, message }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLoading() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLoading must be used within NavigationProvider')
  return ctx
}
