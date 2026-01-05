import { useFeedback } from '@/hooks/useFeedback'
import { t } from '@/src/i18nConfig'
import type { ITop100Podcasts } from '@/utils/interfaces'
import { useEffect } from 'react'

type UseFeedbackHook = () => {
  newMessage: (msg: string) => void
}

type Translate = (key: string) => string

type UsePodcastsFeedbackParams = {
  podcasts?: ITop100Podcasts[]
  error?: unknown
  isFetching: boolean
}

/**
 * Factory function that creates a custom `usePodcastsFeedback` hook with injected dependencies.
 *
 * This pattern allows easier testing by enabling dependency injection of the feedback
 * hook and translation function, keeping UI feedback logic decoupled from globals.
 *
 * @param options - Configuration object for the hook factory.
 * @param options.useFeedbackHook - Hook that provides the `newMessage` function for feedback.
 * @param options.translate - Function that translates i18n keys to localized strings.
 * @returns A custom React hook that manages feedback messages during the podcasts query lifecycle.
 *
 * @example
 * ```typescript
 * const useCustomPodcastsFeedback = createUsePodcastsFeedback({
 *   useFeedbackHook: mockUseFeedback,
 *   translate: mockTranslate
 * })
 *
 * useCustomPodcastsFeedback({
 *   podcasts,
 *   error: null,
 *   isFetching: false
 * })
 * ```
 */
export function createUsePodcastsFeedback({
  useFeedbackHook,
  translate
}: {
  useFeedbackHook: UseFeedbackHook
  translate: Translate
}) {
  return function usePodcastsFeedback({
    podcasts,
    error,
    isFetching
  }: UsePodcastsFeedbackParams) {
    const { newMessage } = useFeedbackHook()

    useEffect(() => {
      if (error) {
        newMessage(translate('error_loading_podcasts'))
        return
      }

      if (!podcasts && isFetching) {
        newMessage(translate('loading_top_podcasts'))
        return
      }

      if (podcasts && podcasts.length === 0) {
        newMessage(translate('no_podcasts_found'))
      }
    }, [podcasts, newMessage, isFetching, error])
  }
}

/**
 * Feedback hook for the top podcasts page.
 *
 * Uses the default feedback context and i18n implementation.
 *
 * @param params - Input state for feedback decisions.
 * @param params.podcasts - Resolved podcasts list, if available.
 * @param params.error - Error state from the query, if any.
 * @param params.isFetching - True when the query is fetching.
 * @returns void
 *
 * @example
 * ```typescript
 * usePodcastsFeedback({ podcasts, error, isFetching })
 * ```
 */
export const usePodcastsFeedback = createUsePodcastsFeedback({
  useFeedbackHook: useFeedback,
  translate: t
})
