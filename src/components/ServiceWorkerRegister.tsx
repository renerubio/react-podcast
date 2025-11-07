'use client'

import { useEffect } from 'react'

/**
 * React component that registers a Service Worker for the application.
 *
 * - Registers the Service Worker at `/sw.js` with the scope of `/`.
 * - Listens for messages from the Service Worker, specifically for a `DATA_UPDATED` event,
 *   and dispatches a custom `sw:data-updated` event on the document.
 * - Handles Service Worker updates by sending a `SKIP_WAITING` message to activate new versions immediately.
 * - Uses `requestIdleCallback` (if available) or `setTimeout` to defer registration until the browser is idle,
 *   minimizing impact on Time to Interactive (TTI).
 * - Silent fail: registration errors do not block the UI or throw visible errors.
 *
 * @component
 * @returns {null} This component does not render any UI.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })

        // Listen for messages from the Service Worker (e.g., data updated)
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data?.type === 'DATA_UPDATED') {
            // Optional: reload data or refresh the page
            // location.reload()
            document.dispatchEvent(new CustomEvent('sw:data-updated'))
          }
        })

        // Update to the new version as soon as it's ready
        if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' })
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing
          if (!sw) return
          sw.addEventListener('statechange', () => {
            if (
              sw.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              sw.postMessage({ type: 'SKIP_WAITING' })
            }
          })
        })
      } catch {
        // Silent fail: do not block UI if registration fails
      }
    }

    // Register on idle to avoid blocking TTI (Time to Interactive)
    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(register)
    } else {
      setTimeout(register, 0)
    }
  }, [])

  return null
}
