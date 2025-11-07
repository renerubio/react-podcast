'use client'
import Filter from '@/components/Filter'
import PodcastList from '@/components/PodcastList'
import { TopPodcast } from '@/services/podcasts'
import { normalize } from '@/utils/normalize'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useLoading } from '../context/NavigationContext'
import { stopWithTimeout } from '../utils/utils'
import { SkeletonHomePage } from './Skeletons'

/**
 * PodcastHomePage component displays a list of top podcasts with filtering capabilities.
 *
 * @param dataPromise - A promise that resolves to an array of TopPodcast objects.
 *
 * The component:
 * - Waits for the `dataPromise` to resolve and retrieves the list of podcasts.
 * - Maintains a search query state to filter podcasts by title or author.
 * - Uses a memoized filter to efficiently update the displayed list based on the query.
 * - Renders a `Filter` component for user input and a `PodcastList` for displaying results.
 *
 * @returns The main content area with filter controls and a filtered podcast list, or null if no podcasts are available.
 */
const PodcastHomePage = ({ data }: { data: any }) => {
  const podcasts = data
  const [query, setQuery] = useState('')
  /* const [dataPromise, setDataPromise] = useState<Promise<TopPodcast[]>>(
    Promise.resolve([])
  ) */
  const { start, stop } = useLoading()

  useEffect(() => {
    start('Loading top podcasts...')
    /*     setDataPromise(fetchTopPodcasts())
     */ stopWithTimeout({ stop })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    if (!query) return podcasts
    const queryNormalized = normalize(query)
    return podcasts.filter((podcast: TopPodcast) => {
      const title = normalize(podcast.title)
      const author = normalize(podcast.author)
      return title.includes(queryNormalized) || author.includes(queryNormalized)
    })
  }, [podcasts, query])

  if (!podcasts || podcasts.length === 0) return null

  return (
    <main>
      <Suspense fallback={<SkeletonHomePage />}>
        <Filter query={query} setQuery={setQuery} filtered={filtered} />
        <PodcastList podcastsFiltered={filtered} />
      </Suspense>
    </main>
  )
}

export default PodcastHomePage
