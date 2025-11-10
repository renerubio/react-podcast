'use client'
import AudioPlayer from '@/components/AudioPlayer'
import Card from '@/components/Card'
import Sidebar from '@/components/Sidebar'
import {
  SkeletonAudioPlayer,
  SkeletonDetailSidebar
} from '@/components/Skeletons'
import { useLoading } from '@/context/NavigationContext'
import { t } from '@/src/i18nConfig'
import { lsGetWithTTL, stopWithTimeout } from '@/utils/utils'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const EpisodeDetail = () => {
  const { start, stop } = useLoading()
  const { podcastId, episodeId } = useParams<{
    podcastId: string
    episodeId: string
  }>()
  const [podcastDetail, setPodcastDetail] = useState<any>(null)
  const [episodeDetail, setEpisodeDetail] = useState<any>(null)

  const KEY_PODCAST = `podcastId_${podcastId}`

  useEffect(() => {
    start(t('loading_episode_details') + episodeId + '...')
    stopWithTimeout({ stop })
  }, [episodeId, start, stop])

  useEffect(() => {
    const cachedPodcastDetail = lsGetWithTTL(KEY_PODCAST)
    if (
      cachedPodcastDetail &&
      Object.keys(cachedPodcastDetail).length > 0 &&
      cachedPodcastDetail.episodes
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPodcastDetail(cachedPodcastDetail)
      setEpisodeDetail(
        cachedPodcastDetail.episodes.find(
          (ep: any) => String(ep.id) === String(episodeId)
        )
      )
      return
    }
  }, [KEY_PODCAST, episodeId, podcastId])

  return (
    <main className="podcast-detail-container">
      {podcastDetail ? (
        <Sidebar podcastDetail={podcastDetail} />
      ) : (
        <SkeletonDetailSidebar />
      )}

      {episodeDetail ? (
        <div className="podcast-detail-episode">
          <Card variant="section" className="podcast-detail-episode-card">
            <h1 className="podcast-detail-episode-title">
              {episodeDetail.title}
            </h1>
            <p
              className="podcast-detail-episode-description"
              dangerouslySetInnerHTML={{ __html: episodeDetail.description }}
            />
            <hr />
            <AudioPlayer src={episodeDetail.url} />
          </Card>
        </div>
      ) : (
        <SkeletonAudioPlayer />
      )}
    </main>
  )
}

export default EpisodeDetail
