'use client'

import { KEY_PODCASTS, PODCAST_ID } from '@/utils/constants'
import type { IParsedPodcastDetail, ITop100Podcasts } from '@/utils/interfaces'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { persistQueryClientSave } from '@tanstack/query-persist-client-core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useState } from 'react'
import { indexedDbStorage } from './indexedDbStorage'
import { queryKeys } from './queryKeys'

const ONE_DAY_MS = 24 * 60 * 60 * 1000 // 24 hours
const GC_TIME_MS = 30 * 60 * 1000 // 30 minutes
const LEGACY_CACHE_MIGRATION_FLAG = 'react-podcast:legacy-cache-migrated:v1'

/**
 * TanStack Query provider with IndexedDB persistence.
 *
 * - Persists the query cache in IndexedDB to keep the existing 24h cache strategy across reloads.
 * - Uses `staleTime` = 24h to avoid refetching while cached data is fresh.
 * - Uses a shorter in-memory `gcTime` to avoid retaining large caches in RAM indefinitely.
 * - Keeps `refetchOnWindowFocus` disabled to minimize background network activity; data refetches on mount only when stale.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: ONE_DAY_MS,
            gcTime: GC_TIME_MS,
            refetchOnWindowFocus: false
          }
        }
      })
  )

  const [persister] = useState(() => {
    if (!indexedDbStorage) return null
    return createAsyncStoragePersister({
      storage: indexedDbStorage,
      key: 'REACT_QUERY_OFFLINE_CACHE'
    })
  })

  /**
   * One-time migration from the legacy localStorage TTL cache into TanStack Query.
   *
   * This preserves "instant load" for users who already have cached data from older versions.
   * After a successful seed, the legacy entries are removed and a migration flag is stored.
   */
  const migrateLegacyCache = async () => {
    if (typeof window === 'undefined') return
    if (typeof localStorage === 'undefined') return

    try {
      if (localStorage.getItem(LEGACY_CACHE_MIGRATION_FLAG) === '1') return
    } catch {
      return
    }

    const now = Date.now()

    const readLegacyTtlRecord = <T,>(
      raw: string
    ): {
      value: T
      ts: number
      ttl: number
    } | null => {
      try {
        const parsed = JSON.parse(raw) as {
          value: T
          ts: number
          ttl: number
        }

        if (
          !parsed ||
          typeof parsed.ts !== 'number' ||
          typeof parsed.ttl !== 'number'
        ) {
          return null
        }

        if (now - parsed.ts > parsed.ttl) return null
        return parsed
      } catch {
        return null
      }
    }

    try {
      const rawTop = localStorage.getItem(KEY_PODCASTS)
      if (rawTop) {
        const record = readLegacyTtlRecord<ITop100Podcasts[]>(rawTop)
        if (record?.value?.length) {
          queryClient.setQueryData(queryKeys.topPodcasts, record.value, {
            updatedAt: record.ts
          })
          localStorage.removeItem(KEY_PODCASTS)
        }
      }

      const prefix = `${PODCAST_ID}_`
      const keys = Array.from({ length: localStorage.length }, (_, i) =>
        localStorage.key(i)
      )

      for (const key of keys) {
        if (!key || !key.startsWith(prefix)) continue

        const podcastId = key.slice(prefix.length)
        if (!podcastId) continue

        const raw = localStorage.getItem(key)
        if (!raw) continue

        const record = readLegacyTtlRecord<IParsedPodcastDetail>(raw)
        if (!record?.value) continue

        queryClient.setQueryData(
          queryKeys.podcastDetail(podcastId),
          record.value,
          {
            updatedAt: record.ts
          }
        )
        localStorage.removeItem(key)
      }

      localStorage.setItem(LEGACY_CACHE_MIGRATION_FLAG, '1')
    } catch {
      return
    }
  }

  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    )
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: ONE_DAY_MS,
        buster: 'v1'
      }}
      onSuccess={async () => {
        await migrateLegacyCache()
        await persistQueryClientSave({
          queryClient,
          persister,
          buster: 'v1'
        })
      }}
    >
      {children}
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </PersistQueryClientProvider>
  )
}
