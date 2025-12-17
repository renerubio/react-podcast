'use client'

import { t } from '@/src/i18nConfig'
export default function SearchInput({
  value,
  onChange,
  disable = false
}: {
  value: string
  onChange: (v: string) => void
  disable?: boolean
}) {
  return (
    <div className="filter-podcast-search-input-container">
      <input
        id="search"
        type="text"
        placeholder={t('filter_podcasts_placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t('filter_podcasts_placeholder')}
        className="filter-podcast-search-input"
        disabled={disable}
      />
    </div>
  )
}
