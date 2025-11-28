import { SkeletonHomePage } from '@/components/Skeletons'
import { Suspense } from 'react'
import PodcastHomePage from './PodcastHomePage'

const PodcastHomePageSSR = () => (
  <main>
    <Suspense fallback={<SkeletonHomePage />}>
      <PodcastHomePage />
    </Suspense>
  </main>
)

export default PodcastHomePageSSR
