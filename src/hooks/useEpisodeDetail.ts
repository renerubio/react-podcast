import { useEpisodeFeedback } from '@/hooks/useEpisodeFeedback'
import { usePodcastDetailQuery } from '@/hooks/usePodcastDetailQuery'
import type { IEpisode, IParsedPodcastDetail } from '@/utils/interfaces'
import { findEpisodeById } from '@/utils/podcastHelpers'
import { useMemo } from 'react'

type UsePodcastDetailQueryHook = (podcastId: string) => {
  data?: IParsedPodcastDetail
  error?: unknown
  isPending: boolean
  isFetching: boolean
}

type UseEpisodeFeedbackHook = (params: {
  episodeDetail: IEpisode | null
  episodeId: string
  isFetching: boolean
  isPending: boolean
  podcast: IParsedPodcastDetail | null
  error?: unknown
}) => void

type FindEpisodeByIdHook = (params: {
  episodes: IEpisode[] | undefined
  episodeId: string
}) => IEpisode | null

/**
 * Factory function that creates a `useEpisodeDetail` hook with injected dependencies.
 *
 * Separates responsibilities (SRP) and allows dependency inversion (DIP) for testing.
 *
 * @param options - Configuration object for the hook factory.
 * @param options.usePodcastDetailQueryHook - Hook that provides podcast detail query state.
 * @param options.useEpisodeFeedbackHook - Hook that handles feedback messaging.
 * @param options.findEpisodeByIdHook - Pure selector for resolving an episode by id.
 * @returns A custom React hook that composes data loading, selection, and feedback.
 *
 * @example
 * ```typescript
 * const useCustomEpisodeDetail = createUseEpisodeDetail({
 *   usePodcastDetailQueryHook: mockUseQuery,
 *   useEpisodeFeedbackHook: mockUseFeedback,
 *   findEpisodeByIdHook: mockFindEpisode
 * })
 *
 * const state = useCustomEpisodeDetail({ podcastId: '1', episodeId: '2' })
 * ```
 */
export function createUseEpisodeDetail({
  usePodcastDetailQueryHook,
  useEpisodeFeedbackHook,
  findEpisodeByIdHook
}: {
  usePodcastDetailQueryHook: UsePodcastDetailQueryHook
  useEpisodeFeedbackHook: UseEpisodeFeedbackHook
  findEpisodeByIdHook: FindEpisodeByIdHook
}) {
  /**
   * Composes data, feedback, and selection for the episode detail view.
   *
   * @param params - Input identifiers for podcast and episode.
   * @param params.podcastId - Podcast identifier.
   * @param params.episodeId - Episode identifier.
   * @returns State for loading, resolved podcast, episode detail, and errors.
   */
  return function useEpisodeDetail({
    podcastId,
    episodeId
  }: {
    podcastId: string
    episodeId: string
  }) {
    const {
      data: podcast,
      error,
      isPending,
      isFetching
    } = usePodcastDetailQueryHook(podcastId)

    const episodeDetail = useMemo(
      () => findEpisodeByIdHook({ episodes: podcast?.episodes, episodeId }),
      [podcast?.episodes, episodeId]
    )

    useEpisodeFeedbackHook({
      episodeDetail,
      episodeId,
      isFetching,
      isPending,
      podcast: podcast ?? null,
      error
    })

    return {
      loading: !podcast && (isPending || isFetching),
      podcast: podcast ?? null,
      episodeDetail,
      error
    }
  }
}

/**
 * Custom hook that loads podcast detail and derives the selected episode.
 *
 * @param params - Input identifiers for podcast and episode.
 * @param params.podcastId - Podcast identifier.
 * @param params.episodeId - Episode identifier.
 * @returns State for loading, resolved podcast, episode detail, and errors.
 *
 * @example
 * ```typescript
 * const { loading, podcast, episodeDetail, error } = useEpisodeDetail({
 *   podcastId,
 *   episodeId
 * })
 * ```
 */
export const useEpisodeDetail = createUseEpisodeDetail({
  usePodcastDetailQueryHook: usePodcastDetailQuery,
  useEpisodeFeedbackHook: useEpisodeFeedback,
  findEpisodeByIdHook: findEpisodeById
})
