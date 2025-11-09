'use client'

import PodcastDetail from '@/components/PodcastDetail'
import { SkeletonPodcastDetail } from '@/components/Skeletons'
import { fetchPodcastById } from '@/services/podcasts'
import '@/styles/components.css'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'

/**
 * Renders the podcast detail page for a specific podcast.
 *
 * This component retrieves the `podcastId` from the route parameters,
 * fetches the podcast details asynchronously, and displays the details
 * inside a `Suspense` boundary with a skeleton fallback while loading.
 *
 * @component
 * @returns {JSX.Element} The podcast detail page.
 */
const PodcastDetailPage = () => {
  const { podcastId } = useParams<{ podcastId: string }>()
  const podcastDetailPromise = fetchPodcastById(podcastId)
  return (
    <Suspense fallback={<SkeletonPodcastDetail />}>
      <PodcastDetail promise={podcastDetailPromise} podcastId={podcastId} />
    </Suspense>
  )
}

export default PodcastDetailPage
