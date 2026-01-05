import { setEpisodeUrl } from '@/services/episodeUrlStorage'
import { t } from '@/src/i18nConfig'
import { IEpisode, ITop100Podcasts } from '@/utils/interfaces'
import { normalizeText } from '@/utils/normalize'

/**
 * Filters podcasts by title or author using normalized matching.
 *
 * @pure
 * @param params - Filter input.
 * @param params.podcasts - List of podcasts to search.
 * @param params.query - Search query string.
 * @returns Filtered list of podcasts.
 *
 * @example
 * ```typescript
 * filterPodcasts({ podcasts, query: 'science' })
 * ```
 */
export function filterPodcasts({
  podcasts,
  query
}: {
  podcasts: ITop100Podcasts[] | null
  query: string
}): ITop100Podcasts[] {
  if (!podcasts) return []
  if (!query) return podcasts
  const queryNormalized = normalizeText(query)
  return podcasts.filter(({ title, author }) => {
    const titleNormalized = normalizeText(title)
    const authorNormalized = normalizeText(author)
    return (
      titleNormalized.includes(queryNormalized) ||
      authorNormalized.includes(queryNormalized)
    )
  })
}

/**
 * Finds a single episode by its id.
 *
 * @pure
 * @param params - Lookup input.
 * @param params.episodes - Collection of episodes to search.
 * @param params.episodeId - Episode id to match.
 * @returns The matching episode, or null when not found.
 */
export function findEpisodeById({
  episodes,
  episodeId
}: {
  episodes: IEpisode[] | undefined
  episodeId: string
}): IEpisode | null {
  if (!episodes || !episodeId) return null
  return episodes.find((ep) => String(ep.id) === String(episodeId)) ?? null
}

/**
 * Resolves an episode URL to remember, if the inputs are valid.
 *
 * @pure
 * @param params - Input arguments.
 * @param params.episodeId - Episode identifier.
 * @param params.url - Candidate audio URL.
 * @returns The normalized URL string or null when invalid.
 */
export function resolveEpisodeUrlToRemember({
  episodeId,
  url
}: {
  episodeId: string | number
  url?: string
}): string | null {
  if (episodeId === '' || episodeId === null || episodeId === undefined)
    return null
  if (!url) return null
  return String(url)
}

/**
 * Persists the episode URL for later playback.
 *
 * @impure
 * @remarks
 * - Touches `window` and writes to storage via `setEpisodeUrl`.
 *
 * @param params - Input arguments.
 * @param params.episodeId - Episode identifier.
 * @param params.url - Candidate audio URL.
 * @returns void
 */
export function rememberEpisodeUrl({
  episodeId,
  url
}: {
  episodeId: string | number
  url?: string
}): void {
  if (typeof window === 'undefined') return
  const resolvedUrl = resolveEpisodeUrlToRemember({ episodeId, url })
  if (!resolvedUrl) return
  void setEpisodeUrl({ episodeId, url: resolvedUrl })
}

/**
 * Builds a navigation message from a label and target.
 *
 * @pure
 * @param params - Input for message composition.
 * @param params.target - Target label (e.g., page name).
 * @param params.goToLabel - Localized "go to" label.
 * @returns Composed navigation message.
 */
export function buildNavMessagePure({
  target,
  goToLabel
}: {
  target: string
  goToLabel: string
}): string {
  return `${goToLabel} ${target}`
}

/**
 * Builds a localized navigation message.
 *
 * @impure
 * @remarks
 * - Depends on i18n state via `t('go_to')`.
 *
 * @param params - Input for message composition.
 * @param params.target - Target label (e.g., page name).
 * @returns Composed navigation message.
 */
export function buildNavMessage({ target }: { target: string }) {
  return buildNavMessagePure({ target, goToLabel: t('go_to') })
}
