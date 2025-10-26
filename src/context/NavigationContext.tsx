'use client'

import { createContext, useContext, useState } from 'react'

type NavigationContextValue = {
  loading: boolean
  setLoading: (v: boolean) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)
  return (
    <NavigationContext.Provider value={{ loading, setLoading }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigationContext() {
  const context = useContext(NavigationContext)
  if (!context)
    throw new Error(
      'useNavigationContext must be used within NavigationProvider'
    )
  return context
}
