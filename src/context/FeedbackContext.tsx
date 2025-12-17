'use client'

import { createContext, useState } from 'react'

export type TFeedbackContext = {
  message: string | ''
  setMessage: React.Dispatch<React.SetStateAction<string | ''>>
}
export const FeedbackCtx = createContext<TFeedbackContext | null>(null)

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | ''>('')
  return (
    <FeedbackCtx.Provider value={{ message, setMessage }}>
      {children}
    </FeedbackCtx.Provider>
  )
}
