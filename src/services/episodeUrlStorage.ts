import { createStore, del, get, set } from 'idb-keyval'

/**
 * Note: this uses a dedicated database name to avoid IndexedDB versioning
 * conflicts with other stores (e.g. TanStack Query persistence) that may have
 * created the DB earlier without this object store.
 */
const STORE = createStore('react-podcast-episode-urls', 'episode-urls')

/**
 * Persists episode audio URLs in IndexedDB.
 *
 * This keeps parity with the previous behavior (stored in `localStorage`) but avoids
 * blocking synchronous storage APIs and survives reloads/restarts like the Query cache.
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
