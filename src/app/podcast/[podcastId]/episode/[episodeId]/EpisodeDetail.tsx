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
  const [podcastDetail, setPodcastDetail] = useState<IPodcastDetail | null>(
    null
  )
  const [episodeDetail, setEpisodeDetail] = useState<IEpisode | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const KEY_PODCAST = `podcastId_${podcastId}`

  useEffect(() => {
    start(t('loading_episode_details') + episodeId + '...')
    if (podcastDetail && episodeDetail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false)
      stopWithTimeout({ stop })
    }
  }, [episodeDetail, episodeId, podcastDetail, start, stop])

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
          (ep: IEpisode) => String(ep.id) === String(episodeId)
        )
      )
      return
    }
  }, [KEY_PODCAST, episodeId, podcastId])

  return isLoading ? (
    <>
      <SkeletonDetailSidebar />
      <SkeletonAudioPlayer />
    </>
  ) : (
    <>
      {<Sidebar podcastDetail={podcastDetail!} />}
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
