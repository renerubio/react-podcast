import type { AsyncStorage } from '@tanstack/query-persist-client-core'
import { createStore, del, entries, get, set } from 'idb-keyval'

/**
 * Async storage adapter backed by IndexedDB for TanStack Query persistence.
 *
 * Using IndexedDB avoids blocking the main thread (unlike `localStorage`) and
 * survives full page reloads / browser restarts, matching the existing 24h cache strategy.
 *
 * @remarks
 * Returns null when `indexedDB` is unavailable (e.g., tests or private mode).
 */
const STORE = createStore('react-podcast', 'tanstack-query')

export const indexedDbStorage: AsyncStorage<string> | null =
  typeof indexedDB === 'undefined'
    ? null
    : {
        getItem: async (key: string) => {
          const value = await get<string>(key, STORE)
          return value ?? null
        },
        setItem: async (key: string, value: string) => {
          await set(key, value, STORE)
        },
        removeItem: async (key: string) => {
          await del(key, STORE)
        },
        entries: async () => {
          const all = await entries<string, string>(STORE)
          return all.map(([key, value]) => [String(key), value])
        }
      }
