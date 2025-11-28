'use client'
import Filter from '@/components/Filter'
import PodcastList from '@/components/PodcastList'
import { SkeletonHomePage } from '@/components/Skeletons'
import { useLoading } from '@/context/NavigationContext'
import { fetchTopPodcasts } from '@/services/podcasts'
import { t } from '@/src/i18nConfig'
import { normalize } from '@/utils/normalize'
import { lsGetWithTTL, lsSetWithTTL, stopWithTimeout } from '@/utils/utils'
import { useEffect, useMemo, useState } from 'react'

/**
 * PodcastHomePage is the main landing page component for displaying top podcasts.
 *
 * This component:
 * - Loads and caches a list of top podcasts, using local storage with TTL for caching.
 * - Shows a loading indicator while fetching data.
 * - Provides a search/filter input to filter podcasts by title or author.
 * - Renders a skeleton loader while podcasts are loading, and displays the filtered podcast list once loaded.
 *
 * @component
 * @returns {JSX.Element} The rendered podcast home page.
 */
const PodcastHomePage = () => {
  const { start, stop } = useLoading()
  const [isLoading, setIsLoading] = useState(true)
  const [podcasts, setPodcasts] = useState<ITop100Podcasts[]>([])
  const KEY_PODCASTS = 'podcasts'
  useEffect(() => {
    start(t('loading_top_podcasts'))
    if (podcasts && podcasts?.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false)
      stopWithTimeout({ stop })
    }
  }, [podcasts, start, stop])
  useEffect(() => {
    const cached = lsGetWithTTL(KEY_PODCASTS)
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPodcasts(cached)
      return
    }
    const getPodcasts = fetchTopPodcasts()
    getPodcasts.then((data) => {
      setPodcasts(data)
      lsSetWithTTL(KEY_PODCASTS, data)
    })
  }, [])

  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!podcasts) return []
    if (!query) return podcasts
    const queryNormalized = normalize(query)
    return podcasts.filter((podcast: ITop100Podcasts) => {
      const title = normalize(podcast.title)
      const author = normalize(podcast.author)
      return title.includes(queryNormalized) || author.includes(queryNormalized)
    })
  }, [podcasts, query])

  return isLoading ? (
    <SkeletonHomePage />
  ) : (
    <>
      <Filter query={query} setQuery={setQuery} filtered={filtered} />
      <PodcastList podcastsFiltered={filtered} />
    </>
  )
}

export default PodcastHomePage
