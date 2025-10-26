'use client'

import { t } from '@/src/i18nConfig'

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function SearchInput({ value, onChange }: Props) {
  return (
    <div
      style={{
        margin: '16px 0',
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }}
    >
      <input
        id="search"
        type="text"
        placeholder={t('filter_podcasts_placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t('filter_podcasts_placeholder')}
        style={{
          flex: 1,
          height: 36,
          padding: '0 12px',
          border: '1px solid #e5e7eb',
          borderRadius: 5,
          outline: 'none',
          width: '30%'
        }}
      />
    </div>
  )
}
