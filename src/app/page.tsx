'use client'
import PodcastHomePage from '@/components/PodcastHomePage'
import { SkeletonHomePage } from '@/components/Skeletons'
import { useLoading } from '@/context/NavigationContext'
import { fetchTopPodcasts, type TopPodcast } from '@/services/podcasts'
import '@/styles/components.css'
import { stopWithTimeout } from '@/utils/utils'
import { Suspense, useEffect, useState } from 'react'

/**
 * HomePage component displays the main landing page for the podcast application.
 *
 * It initializes and manages the loading state for fetching the top podcasts,
 * and renders the PodcastHomePage component within a React Suspense boundary.
 * While the podcast data is loading, a SkeletonHomePage is shown as a fallback.
 *
 * @component
 * @returns {JSX.Element} The rendered home page with podcast data or a loading skeleton.
 */
const HomePage = () => {
  const [dataPromise, setDataPromise] = useState<Promise<TopPodcast[]>>(
    Promise.resolve([])
  )
  const { start, stop } = useLoading()

  useEffect(() => {
    start('Loading top podcasts...')
    setDataPromise(fetchTopPodcasts())
    stopWithTimeout({ stop })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Suspense fallback={<SkeletonHomePage />}>
        <PodcastHomePage dataPromise={dataPromise} />
      </Suspense>
    </>
  )
}

export default HomePage
