import Card from '@/components/Card'
import { SKELETON_PODCASTS_LENGTH } from '@/utils/constants'

export const SkeletonLoader = () => <div className="skeleton-loader"></div>

export const SkeletonPodcastItem = () => (
  <div className="skeleton-loader-podcast"></div>
)

export const SkeletonPodcastList = ({ length }: { length: number }) => (
  <div className="podcasts-container">
    {Array.from({ length }).map((_, i) => (
      <SkeletonPodcastItem key={i} />
    ))}
  </div>
)

export const SkeletonFilter = () => (
  <div className="skeleton-filter-podcast-container">
    <div className="skeleton-filter-podcast"></div>
  </div>
)

export const SkeletonHomePage = ({
  length = SKELETON_PODCASTS_LENGTH
}: {
  length?: number
}) => (
  <>
    <SkeletonFilter />
    <SkeletonPodcastList length={length} />
  </>
)

export const SkeletonDetailSidebar = () => (
  <div className="skeleton-loader-sidebar"></div>
)

export const SkeletonDetailTable = ({
  skeleton_rows = 30
}: {
  skeleton_rows?: number
}) => (
  <div className="podcast-detail-episodes">
    <Card className="podcast-detail-episodes-title" variant="header">
      <SkeletonLoader />
    </Card>
    <Card>
      {Array.from({ length: skeleton_rows }).map((_, i) => (
        <SkeletonLoader key={i} />
      ))}
    </Card>
  </div>
)

export const SkeletonPodcastDetail = () => (
  <main className="podcast-detail-container">
    <SkeletonDetailSidebar />
    <SkeletonDetailTable />
  </main>
)

export const SkeletonAudioPlayer = () => (
  <div className="skeleton-audio-player"></div>
)

export const SkeletonEpisodeDetail = () => (
  <main className="podcast-detail-container">
    <SkeletonDetailSidebar />
    <SkeletonAudioPlayer />
  </main>
)
