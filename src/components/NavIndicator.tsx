'use client'

import { useNavigationContext } from '@/context/NavigationContext'
import { usePathname } from 'next/navigation'

function getRouteLabel(pathname: string): string {
  if (pathname === '/' || pathname === '') return 'home'
  if (/^\/podcast\/[^/]+\/episode\/[^/]+/.test(pathname)) return 'episode'
  if (/^\/podcast\/[^/]+/.test(pathname)) return 'podcast'
  return 'page'
}

export default function NavIndicator() {
  const { loading } = useNavigationContext()
  const pathname = usePathname()
  if (!loading) return null

  const label = getRouteLabel(pathname)
  const text = `Loading ${label} page…`

  return (
    <div
      aria-live="polite"
      title={text}
      style={{
        position: 'fixed',
        top: 8,
        right: 12,
        width: '200px',
        height: '32px',
        padding: '8px 12px',
        background: '#111',
        color: '#fff',
        borderRadius: 8,
        fontSize: 12,
        zIndex: 1000
      }}
    >
      {text}
    </div>
  )
}
