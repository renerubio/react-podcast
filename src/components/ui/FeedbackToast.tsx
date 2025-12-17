'use client'

import { useEffect } from 'react'

import { useFeedback } from '@/hooks/useFeedback'
import { TIMEOUT_TOAST_OUT_MS } from '@/utils/constants'

export function FeedbackToast() {
  const { message, newMessage } = useFeedback()

  useEffect(() => {
    if (!message) return undefined
    const id = setTimeout(() => {
      newMessage('')
    }, TIMEOUT_TOAST_OUT_MS)
    return () => clearTimeout(id)
  }, [message, newMessage])

  if (!message) return null

  return (
    <div
      className="feedback-toast"
      role="status"
      aria-live="polite"
      style={{ ['--toast-duration' as string]: `${TIMEOUT_TOAST_OUT_MS}ms` }}
    >
      {message}
    </div>
  )
}
