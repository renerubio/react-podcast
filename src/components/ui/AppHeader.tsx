'use client'

import { useFeedback } from '@/hooks/useFeedback'
import { useLoading } from '@/hooks/useLoading'
import { t } from '@/src/i18nConfig'
import { stopLoadingWithTimeout } from '@/utils/utils'
import Link from 'next/link'
import { Activity } from 'react'

export default function AppHeader() {
  const { loading, startLoading, stopLoading } = useLoading()
  const { message, newMessage } = useFeedback()

  const handleLinkClick = () => {
    startLoading()
    newMessage(t('loading_top_podcasts'))
    stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
  }

  return (
    <header>
      <Link
        href="/"
        onClick={handleLinkClick}
        className="header-link"
        title={t('home')}
      >
        {t('podcaster')}
      </Link>
      <Activity mode={loading ? 'visible' : 'hidden'}>
        <span
          className="header-loading-indicator"
          title={message ?? t('loading')}
        >
          {message ?? t('loading')}
        </span>
      </Activity>
    </header>
  )
}
