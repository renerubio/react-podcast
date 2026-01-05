import { useFeedback } from '@/hooks/useFeedback'
import { t } from '@/src/i18nConfig'
import type { IEpisode, IParsedPodcastDetail } from '@/utils/interfaces'
import { useEffect } from 'react'

type UseFeedbackHook = () => {
  newMessage: (msg: string) => void
}

type Translate = (key: string) => string

type UseEpisodeFeedbackParams = {
  episodeDetail: IEpisode | null
  episodeId: string
  isFetching: boolean
  isPending: boolean
  podcast: IParsedPodcastDetail | null
  error?: unknown
}

/**
 * Factory function that creates a custom `useEpisodeFeedback` hook with injected dependencies.
 *
 * This pattern allows easier testing by enabling dependency injection of the feedback
 * hook and translation function, keeping UI feedback logic decoupled from globals.
 *
 * @param options - Configuration object for the hook factory.
 * @param options.useFeedbackHook - Hook that provides the `newMessage` function for feedback.
 * @param options.translate - Function that translates i18n keys to localized strings.
 * @returns A custom React hook that manages episode feedback messages based on loading states and errors.
 *
 * @example
 * ```typescript
 * const useCustomEpisodeFeedback = createUseEpisodeFeedback({
 *   useFeedbackHook: mockUseFeedback,
 *   translate: mockTranslate
 * })
 *
 * useCustomEpisodeFeedback({
 *   episodeDetail,
 *   episodeId: '123',
 *   isFetching: false,
 *   isPending: false,
 *   podcast,
 *   error: null
 * })
 * ```
 */
export function createUseEpisodeFeedback({
  useFeedbackHook,
  translate
}: {
  useFeedbackHook: UseFeedbackHook
  translate: Translate
}) {
  return function useEpisodeFeedback({
    episodeDetail,
    episodeId,
    isFetching,
    isPending,
    podcast,
    error
  }: UseEpisodeFeedbackParams) {
    const { newMessage } = useFeedbackHook()

    useEffect(() => {
      if (error) {
        newMessage(translate('error_episode_detail'))
        return
      }

      if (!episodeDetail) {
        if (!isFetching && !isPending && podcast) {
          newMessage(
            `${translate('episode: ')} ${episodeId} ${translate('not_found')} `
          )
        }
        return
      }
      newMessage(
        `${translate('loading_episode_details')} ${episodeDetail.title}`
      )
    }, [
      episodeDetail,
      episodeId,
      newMessage,
      isFetching,
      isPending,
      podcast,
      error
    ])
  }
}

/**
 * Feedback hook for the episode detail page.
 *
 * Uses the default feedback context and i18n implementation.
 *
 * @param params - Input state for feedback decisions.
 * @param params.episodeDetail - Resolved episode detail, if available.
 * @param params.episodeId - Episode identifier.
 * @param params.isFetching - True when the query is fetching.
 * @param params.isPending - True when the query is in pending state.
 * @param params.podcast - Resolved podcast detail, if available.
 * @param params.error - Error state from the query, if any.
 * @returns void
 *
 * @example
 * ```typescript
 * useEpisodeFeedback({
 *   episodeDetail,
 *   episodeId,
 *   isFetching,
 *   isPending,
 *   podcast,
 *   error
 * })
 * ```
 */
export const useEpisodeFeedback = createUseEpisodeFeedback({
  useFeedbackHook: useFeedback,
  translate: t
})
