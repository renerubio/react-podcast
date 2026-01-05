'use client'
import AudioPlayer from '@/components/ui/AudioPlayer'
import Card from '@/components/ui/Card'
import Sidebar from '@/components/ui/Sidebar'
import { SkeletonEpisodeDetail } from '@/components/ui/Skeletons'
import { useEpisodeDetail } from '@/src/hooks/useEpisodeDetail'
import { t } from '@/src/i18nConfig'
import { useParams } from 'next/navigation'

/**
 * Renders a single episode using the cached podcast detail from TanStack Query.
 * Shows skeletons until both the podcast and episode are resolved.
 */
const EpisodeDetail = () => {
  const { podcastId, episodeId } = useParams<{
    podcastId: string
    episodeId: string
  }>()
  const { loading, podcast, episodeDetail, error } = useEpisodeDetail({
    podcastId,
    episodeId
  })

  if (loading) {
    return <SkeletonEpisodeDetail />
  }

  if (error || !podcast || !episodeDetail) {
    return (
      <>
        <Sidebar podcastDetail={podcast!} />
        <div className="podcast-detail-episode">
          <Card variant="section" className="podcast-detail-episode-card">
            <h1 className="podcast-detail-episode-title">
              {t('error_episode_detail')}
            </h1>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar podcastDetail={podcast} />
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
