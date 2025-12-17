import { FeedbackCtx } from '@/context/FeedbackContext'
import { useContext } from 'react'

export function useFeedback() {
  const ctx = useContext(FeedbackCtx)
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider')
  const { message, setMessage } = ctx
  function newMessage(msg: string) {
    setMessage((prev) => (prev === msg ? `${msg} ` : msg))
  }
  return { message, newMessage }
}
