'use client'

import { useEffect, useRef } from 'react'

/**
 * ServiceWorkerRegister
 * ----------------------
 * Registers the Service Worker in production and disables/unregisters it in development.
 *
 * Why:
 * - DEV: avoid cache interference with Fast Refresh and SSR/CSR hydration (no SW in dev).
 * - PROD: register '/sw.js' with immediate activation (skipWaiting) and background update flow.
 *
 * Features:
 * - DEV: unregister all SW + clear all CacheStorage.
 * - PROD: register SW on idle, listen for 'DATA_UPDATED' (dispatch 'sw:data-updated'),
 *         request 'SKIP_WAITING' when a new SW is installed,
 *         reload (once) on 'controllerchange' or just dispatch an event (configurable),
 *         trigger 'registration.update()' when tab regains focus to check for updates.
 *
 * Cleanup:
 * - Removes all event listeners on unmount (prevents duplicates on HMR).
 */
export default function ServiceWorkerRegister() {
  const reloadedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    // ---- DEV: completely disable SW and caches ----
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations?.().then((regs) => {
        regs.forEach((r) => r.unregister())
      })
      if ('caches' in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
      }
      return
    }

    // ---- PROD: register and wire events ----
    let messageHandler: (ev: MessageEvent) => void
    let visHandler: () => void
    let controllerHandler: () => void

    const doRegister = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })

        // 1) Listen for messages from SW (e.g. { type: 'DATA_UPDATED' })
        messageHandler = (event: MessageEvent) => {
          if (event.data?.type === 'DATA_UPDATED') {
            document.dispatchEvent(new CustomEvent('sw:data-updated'))
          }
        }
        navigator.serviceWorker.addEventListener('message', messageHandler)

        // 2) If a new SW is installed, ask it to activate immediately
        const askSkipWaiting = (sw: ServiceWorker | null) => {
          try {
            sw?.postMessage?.({ type: 'SKIP_WAITING' })
          } catch {
            // ignore
          }
        }

        if (reg.waiting) askSkipWaiting(reg.waiting)

        reg.addEventListener('updatefound', () => {
          const sw = reg.installing
          if (!sw) return
          sw.addEventListener('statechange', () => {
            if (
              sw.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              askSkipWaiting(sw)
            }
          })
        })

        // 3) When the new controller takes over, optionally reload once
        controllerHandler = () => {
          if (reloadedRef.current) return
          reloadedRef.current = true
          // Option A) hard reload to pick new assets immediately:
          // window.location.reload()
          // Option B) only notify (keeps UX calmer):
          document.dispatchEvent(new CustomEvent('sw:controller-changed'))
        }
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          controllerHandler
        )

        // 4) Check for SW updates when tab becomes visible again
        visHandler = () => {
          if (document.visibilityState === 'visible') {
            // Hint the browser to look for a fresh SW file
            reg.update().catch(() => {})
          }
        }
        document.addEventListener('visibilitychange', visHandler)
      } catch {
        // Silent fail: do not block UI if registration fails
      }
    }

    // Register on idle to avoid hurting TTI
    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(doRegister)
    } else {
      setTimeout(doRegister, 0)
    }

    // ---- Cleanup listeners to avoid duplicates on HMR/unmount ----
    // eslint-disable-next-line consistent-return
    return () => {
      if (messageHandler) {
        navigator.serviceWorker.removeEventListener('message', messageHandler)
      }
      if (controllerHandler) {
        navigator.serviceWorker.removeEventListener(
          'controllerchange',
          controllerHandler
        )
      }
      if (visHandler) {
        document.removeEventListener('visibilitychange', visHandler)
      }
    }
  }, [])

  return null
}
