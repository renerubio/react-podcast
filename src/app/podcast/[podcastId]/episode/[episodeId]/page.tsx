'use client'
import {
  SkeletonAudioPlayer,
  SkeletonDetailSidebar
} from '@/components/Skeletons'
import { Suspense } from 'react'
import EpisodeDetail from './EpisodeDetail'

const EpisodeDetailSSR = () => (
  <main className="podcast-detail-container">
    <Suspense
      fallback={
        <>
          <SkeletonAudioPlayer />
          <SkeletonDetailSidebar />
        </>
      }
    >
      <EpisodeDetail />
    </Suspense>
  </main>
)

export default EpisodeDetailSSR
