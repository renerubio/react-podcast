import {
  SkeletonDetailSidebar,
  SkeletonDetailTable
} from '@/components/Skeletons'
import { Suspense } from 'react'
import PodcastDetail from './PodcastDetail'

const PodcastDetailSSR = () => (
  <main className="podcast-detail-container">
    <Suspense
      fallback={
        <>
          <SkeletonDetailSidebar />
          <SkeletonDetailTable />
        </>
      }
    >
      <PodcastDetail />
    </Suspense>
  </main>
)

export default PodcastDetailSSR
