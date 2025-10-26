'use client'

import { useNavigationContext } from '@/context/NavigationContext'

export default function NavIndicator() {
  const { loading } = useNavigationContext()

  if (!loading) return null

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        padding: '8px 12px',
        background: '#111',
        color: '#fff',
        borderRadius: 8,
        fontSize: 12,
        opacity: 0.9
      }}
    >
      Cargando…
    </div>
  )
}
