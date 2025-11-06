'use client'

import { useLoading } from '@/context/NavigationContext'
import { t } from '@/src/i18nConfig'
import { stopWithTimeout } from '@/utils/utils'
import Link from 'next/link'

export default function AppHeader() {
  const { loading, start, stop, message } = useLoading()

  const handleLinkClick = () => {
    start('Navigating to home page')
    stopWithTimeout({ stop })
  }

  return (
    <header>
      <Link href="/" onClick={handleLinkClick} className="header-link">
        {t('podcaster')}
      </Link>
      {loading && (
        <div className="header-loading-indicator" title={message ?? 'Loading…'}>
          {message ?? 'Loading…'}
        </div>
      )}
    </header>
  )
}
