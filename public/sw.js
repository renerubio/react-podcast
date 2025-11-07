const VERSION = 'v1'
const STATIC_CACHE = `static-${VERSION}`
const DATA_CACHE = `data-${VERSION}`
const IMG_CACHE = `img-${VERSION}`

const APPLE_FEED_PREFIX = 'https://itunes.apple.com/us/rss/toppodcasts'
const DATA_TTL_MS = 24 * 60 * 60 * 1000 // 24h

// Meta-cache for timestamps (key = request.url + '::ts')
const META_CACHE = `meta-${VERSION}`
const tsKey = (url) => `${url}::ts`

/**
 * Helper function intended to extend the lifetime of an event until the given promise resolves.
 * In this implementation, it is a no-op for compatibility with browsers that do not support waitUntil
 * outside of event handlers. Used for background cache updates in fetch handlers.
 *
 * @param {Promise<any>} promise - The promise to wait for.
 */
function eventWaitUntil(promise) {
  if (self && self.registration) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    self.registration.waiting
    // no-op; we use extendable events implicitly in fetch handler
  }
  // In some browsers you can't call waitUntil here; not critical for our case
}

/**
 * Attempts to fetch the requested HTML resource from the network first.
 * If the network request fails, falls back to the cached version.
 * If the cached version is also unavailable, serves the offline fallback page or a generic offline response.
 *
 * @param {Request} request - The fetch event request object for an HTML page.
 * @returns {Promise<Response>} The network response, cached response, or offline fallback response.
 */
async function networkFirstForHTML(request) {
  try {
    const netRes = await fetch(request)
    const cache = await caches.open(STATIC_CACHE)
    cache.put(request, netRes.clone())
    return netRes
  } catch {
    const cache = await caches.open(STATIC_CACHE)
    const cached = await cache.match(request)
    if (cached) return cached
    const offline = await cache.match('/offline')
    return (
      offline || new Response('Offline', { status: 503, statusText: 'Offline' })
    )
  }
}

/**
 * Attempts to serve a request from the specified cache first.
 * If the request is not found in the cache, it fetches it from the network,
 * stores a clone of the response in the cache, and returns the response.
 *
 * @async
 * @param {Request|string} request - The request to fetch or cache.
 * @param {string} cacheName - The name of the cache to use.
 * @returns {Promise<Response>} The cached or fetched response.
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  const res = await fetch(request)
  cache.put(request, res.clone())
  return res
}

/**
 * Notifies all connected window clients that data has been updated by sending a 'DATA_UPDATED' message.
 * Utilizes the Service Worker's `clients.matchAll` method to retrieve all window clients,
 * including those not yet controlled by the service worker, and posts a message to each.
 *
 * @function
 * @returns {void}
 */
function notifyClientsDataUpdated() {
  self.clients
    .matchAll({ includeUncontrolled: true, type: 'window' })
    .then((clients) => {
      clients.forEach((client) => client.postMessage({ type: 'DATA_UPDATED' }))
    })
}

/**
 * Updates the data cache with a fresh response from the network and stores a timestamp.
 *
 * @async
 * @param {Request} request - The network request to fetch and cache.
 * @param {Cache} cache - The Cache object where the response will be stored.
 * @param {Cache} meta - The Cache object used to store metadata such as timestamps.
 * @returns {Promise<void>} Resolves when the cache and metadata are updated.
 */
async function updateDataCache(request, cache, meta) {
  try {
    const res = await fetch(request, { cache: 'reload' })
    cache.put(request, res.clone())
    await meta.put(tsKey(request.url), new Response(String(Date.now())))
    notifyClientsDataUpdated()
  } catch {
    // silent: continue with stale
  }
}

/**
 * Revalidates a cached request by fetching a fresh response from the network,
 * updating the cache, and recording the revalidation timestamp in metadata storage.
 * Notifies clients that data has been updated.
 *
 * @async
 * @param {Request} request - The request to revalidate.
 * @param {Cache} cache - The cache instance to update with the new response.
 * @param {IDBDatabase|Object} meta - Metadata storage for tracking revalidation timestamps.
 * @returns {Promise<void>} Resolves when revalidation is complete.
 */
async function softRevalidate(request, cache, meta) {
  try {
    const res = await fetch(request, { cache: 'no-cache' })
    cache.put(request, res.clone())
    await meta.put(tsKey(request.url), new Response(String(Date.now())))
    notifyClientsDataUpdated()
  } catch {
    // optional: ignore
  }
}

/**
 * Implements a Stale-While-Revalidate caching strategy with a time-to-live (TTL) for cached responses.
 *
 * - Returns cached response immediately if available (even if expired).
 * - If the cached response is expired, triggers a background revalidation.
 * - If not expired, may optionally trigger a soft revalidation in the background.
 * - If no cached response exists, attempts to fetch from the network, caches the result, and updates metadata.
 * - If network fails and no cache exists, returns a default empty response.
 *
 * @async
 * @param {Request} request - The request to handle.
 * @param {string} cacheName - The name of the cache to use for storing responses.
 * @param {number} ttlMs - The time-to-live for cached responses, in milliseconds.
 * @returns {Promise<Response>} The cached or fetched response.
 */
async function staleWhileRevalidateWithTTL(request, cacheName, ttlMs) {
  const cache = await caches.open(cacheName)
  const meta = await caches.open(META_CACHE)

  const cached = await cache.match(request)
  const tsResp = await meta.match(tsKey(request.url))
  const ts = tsResp ? parseInt(await tsResp.text(), 10) : 0
  const now = Date.now()
  const isExpired = now - ts > ttlMs

  // Immediate response (stale if exists)
  if (cached) {
    // Revalidate in background if expired
    if (isExpired) {
      eventWaitUntil(updateDataCache(request, cache, meta))
    } else {
      // Optional: soft revalidation every X minutes even if not expired
      eventWaitUntil(softRevalidate(request, cache, meta))
    }
    return cached
  }

  // No cache → try network
  try {
    const res = await fetch(request)
    cache.put(request, res.clone())
    await meta.put(tsKey(request.url), new Response(String(now)))
    notifyClientsDataUpdated()
    return res
  } catch {
    // No network or cache
    return new Response(JSON.stringify({ feed: { entry: [] } }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE)
      await cache.addAll([
        '/', // app shell (SSR will serve HTML; this helps as fallback)
        '/offline'
      ])
      self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter(
            (k) =>
              ![STATIC_CACHE, DATA_CACHE, IMG_CACHE, META_CACHE].includes(k)
          )
          .map((k) => caches.delete(k))
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Navigations (HTML): Network First with fallback to /offline
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstForHTML(request))
    return
  }

  // Next static assets (immutable by hash): Cache First
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Apple feed (JSON): SWR with TTL 24h
  if (url.href.startsWith(APPLE_FEED_PREFIX)) {
    event.respondWith(
      staleWhileRevalidateWithTTL(request, DATA_CACHE, DATA_TTL_MS)
    )
    return
  }

  // Apple images: Cache First with network fallback
  if (url.hostname.endsWith('mzstatic.com')) {
    event.respondWith(cacheFirst(request, IMG_CACHE))
    return
  }

  // Others: pass through (or you can add more rules)
})
