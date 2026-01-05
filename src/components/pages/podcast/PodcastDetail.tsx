'use client'

import Card from '@/components/ui/Card'
import Sidebar from '@/components/ui/Sidebar'
import {
  SkeletonDetailSidebar,
  SkeletonDetailTable
} from '@/components/ui/Skeletons'
import { usePodcastDetail } from '@/hooks/usePodcastDetailPage'
import { t } from '@/src/i18nConfig'
import { useParams } from 'next/navigation'
import { EpisodesTable } from './EpisodesTable'

/**
 * Displays detailed information about a specific podcast.
 *
 * Renders:
 * - Sidebar with podcast details.
 * - Table of episodes with their count.
 * - Skeleton loaders during the loading state.
 *
 * @returns Podcast detail view or loading skeletons.
 *
 * @remarks
 * Requires `podcastId` as a URL parameter.
 *
 * @example
 * ```tsx
 * <PodcastDetail />
 * ```
 */
const PodcastDetail = () => {
  const { podcastId } = useParams<{
    podcastId: string
  }>()
  const { loading, podcast, episodes, episodesCount, isCached, error } =
    usePodcastDetail({
      podcastId
    })

  if (error) {
    return (
      <>
        {podcast ? (
          <Sidebar podcastDetail={podcast} />
        ) : (
          <SkeletonDetailSidebar />
        )}
        <section className="podcast-detail-episodes">
          <Card className="podcast-detail-episodes-title" variant="header">
            <h3>{t('error_podcast_detail')}</h3>
          </Card>
        </section>
      </>
    )
  }

  if ((loading && !isCached) || !podcast) {
    return (
      <>
        <SkeletonDetailSidebar />
        <SkeletonDetailTable />
      </>
    )
  }

  return (
    <>
      <Sidebar podcastDetail={podcast} />
      <section className="podcast-detail-episodes">
        <Card className="podcast-detail-episodes-title" variant="header">
          <h3>{`${t('episodes')}: ${episodesCount ?? 0}`}</h3>
        </Card>
        <Card variant="nav">
          <EpisodesTable episodes={episodes} podcastId={podcastId} />
        </Card>
      </section>
    </>
  )
}

export default PodcastDetail
