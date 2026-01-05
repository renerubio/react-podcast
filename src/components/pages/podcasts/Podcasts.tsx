'use client'
import Filter from '@/components/pages/podcasts/Filter'
import PodcastList from '@/components/pages/podcasts/PodcastList'
import { SkeletonHomePage } from '@/components/ui/Skeletons'
import { usePodcastsPage } from '@/hooks/usePodcastsPage'

/**
 * Main component for the Podcasts page.
 *
 * Displays a list of top 100 podcasts with search/filter functionality.
 * Shows a skeleton loader while data is being fetched.
 *
 * @returns Podcasts page or a skeleton loader during the loading state.
 *
 * @example
 * ```tsx
 * <PodcastHomePage />
 * ```
 */
const PodcastHomePage = () => {
  const { loading, query, setQuery, filtered } = usePodcastsPage()

  if (loading) return <SkeletonHomePage />

  return (
    <>
      <Filter query={query} setQuery={setQuery} filtered={filtered} />
      <PodcastList podcastsFiltered={filtered} />
    </>
  )
}

export default PodcastHomePage
