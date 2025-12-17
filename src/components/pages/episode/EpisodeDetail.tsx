'use client'
import AudioPlayer from '@/components/ui/AudioPlayer'
import Card from '@/components/ui/Card'
import Sidebar from '@/components/ui/Sidebar'
import {
  SkeletonAudioPlayer,
  SkeletonDetailSidebar
} from '@/components/ui/Skeletons'
import { useEpisodeDetail } from '@/src/hooks/useEpisodeDetail'
import { useParams } from 'next/navigation'

/**
 * Renders a single episode using data from the cached podcast detail in localStorage.
 * Announces loading via feedback messaging, shows skeletons until both the podcast
 * and episode are resolved, and stops the loader after state is populated.
 */
const EpisodeDetail = () => {
  const { podcastId, episodeId } = useParams<{
    podcastId: string
    episodeId: string
  }>()
  const { loading, podcast, episodeDetail } = useEpisodeDetail({
    podcastId,
    episodeId
  })

  if (!podcast || !episodeDetail) {
    return (
      <>
        <SkeletonDetailSidebar />
        <SkeletonAudioPlayer />
      </>
    )
  }

  return (
    <>
      {<Sidebar podcastDetail={podcast!} />}
      <div className="podcast-detail-episode">
        <Card variant="section" className="podcast-detail-episode-card">
          <h1 className="podcast-detail-episode-title">
            {episodeDetail?.title}
          </h1>
          <p
            className="podcast-detail-episode-description"
            dangerouslySetInnerHTML={{
              __html: episodeDetail?.description as string
            }}
          />
          <hr />
          <AudioPlayer src={episodeDetail?.url as string} />
        </Card>
      </div>
    </>
  )
}

export default EpisodeDetail
