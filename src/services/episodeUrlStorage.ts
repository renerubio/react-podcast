import { createStore, del, get, set } from 'idb-keyval'

/**
 * IndexedDB store for episode audio URLs.
 *
 * @remarks
 * Uses a dedicated database name to avoid IndexedDB versioning conflicts with
 * other stores (e.g., TanStack Query persistence) that may have created the DB earlier.
 */
const STORE = createStore('react-podcast-episode-urls', 'episode-urls')

/**
 * Persists episode audio URLs in IndexedDB.
 *
 * This keeps parity with the previous behavior (stored in `localStorage`) but avoids
 * blocking synchronous storage APIs and survives reloads/restarts like the Query cache.
 *
 * @param params - Input arguments.
 * @param params.episodeId - Episode identifier.
 * @param params.url - Audio URL to persist.
 * @returns Promise that resolves after writing or when skipped.
 */
export async function setEpisodeUrl(params: {
  episodeId: string | number
  url: string
}): Promise<void> {
  if (typeof indexedDB === 'undefined') return
  const { episodeId, url } = params
  try {
    await set(String(episodeId), url, STORE)
  } catch {
    return
  }
}

/**
 * Reads a stored episode audio URL from IndexedDB.
 *
 * @param params - Input arguments.
 * @param params.episodeId - Episode identifier.
 * @returns Promise that resolves to the stored URL or null.
 */
export async function getEpisodeUrl(params: {
  episodeId: string | number
}): Promise<string | null> {
  if (typeof indexedDB === 'undefined') return null
  const { episodeId } = params
  try {
    const value = await get<string>(String(episodeId), STORE)
    return value ?? null
  } catch {
    return null
  }
}

/**
 * Removes a stored episode audio URL from IndexedDB.
 *
 * @param params - Input arguments.
 * @param params.episodeId - Episode identifier.
 * @returns Promise that resolves after deletion or when skipped.
 */
export async function deleteEpisodeUrl(params: {
  episodeId: string | number
}): Promise<void> {
  if (typeof indexedDB === 'undefined') return
  const { episodeId } = params
  try {
    await del(String(episodeId), STORE)
  } catch {
    return
  }
}
