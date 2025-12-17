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
 * PodcastDetail component displays detailed information about a specific podcast.
 *
 * This component fetches and renders:
 * - A sidebar with podcast details
 * - A table of episodes with their count
 * - Skeleton loaders during the loading state
 *
 * @component
 * @returns The rendered podcast detail page with sidebar and episodes table,
 * or skeleton loaders if data is still loading
 *
 * @remarks
 * - Requires `podcastId` as a URL parameter
 * - Displays loading skeletons while fetching data
 * - Shows podcast information and associated episodes when loaded
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
