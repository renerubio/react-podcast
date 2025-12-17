import { t } from '@/src/i18nConfig'
import { IEpisode, ITop100Podcasts } from '@/utils/interfaces'
import { normalizeText } from '@/utils/normalize'

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

export function rememberEpisodeUrl({
  episodeId,
  url
}: {
  episodeId: string | number
  url?: string
}): void {
  if (typeof window === 'undefined') return
  if (!url) return
  localStorage.setItem(String(episodeId), String(url))
}

export function buildNavMessage({ target }: { target: string }) {
  return `${t('go_to')} ${target}`
}
