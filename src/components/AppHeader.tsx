'use client'

import { t } from '@/src/i18nConfig'
import Link from 'next/link'

export default function AppHeader() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: '#fff',
        borderBottom: '1px solid #eee'
      }}
    >
      <Link href="/" style={{ fontWeight: 700, textDecoration: 'none' }}>
        {t('podcaster')}
      </Link>
      {/* Aquí podrías añadir search global o acciones */}
      <div />
    </header>
  )
}
