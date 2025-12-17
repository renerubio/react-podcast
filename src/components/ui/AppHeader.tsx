'use client'

import { useFeedback } from '@/hooks/useFeedback'
import { t } from '@/src/i18nConfig'
import Link from 'next/link'

export default function AppHeader() {
  const { message, newMessage } = useFeedback()

  const handleLinkClick = () => {
    newMessage(t('loading_top_podcasts'))
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
      <span
        className="header-feedback-placeholder"
        title={message ?? t('loading')}
      >
        {/* Placeholder to keep layout stable; actual toast is global */}
      </span>
    </header>
  )
}
