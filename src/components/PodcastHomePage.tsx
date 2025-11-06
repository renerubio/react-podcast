import Filter from '@/components/Filter'
import PodcastList from '@/components/PodcastList'
import { TopPodcast } from '@/services/podcasts'
import { normalize } from '@/utils/normalize'
import { use, useMemo, useState } from 'react'

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
const PodcastHomePage = ({
  dataPromise
}: {
  dataPromise: Promise<TopPodcast[]>
}) => {
  const podcasts = use(dataPromise)
  const [query, setQuery] = useState('')

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
      <Filter query={query} setQuery={setQuery} filtered={filtered} />
      <PodcastList podcastsFiltered={filtered} />
    </main>
  )
}

export default PodcastHomePage
