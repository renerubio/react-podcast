import { SKELETON_PODCASTS_LENGTH } from '@/utils/constants'

export const SkeletonPodcastItem = () => (
  <div className="skeleton-loader-podcast"></div>
)

export const SkeletonPodcastList = ({
  length = SKELETON_PODCASTS_LENGTH
}: {
  length?: number
}) => (
  <div className="podcasts-container">
    {Array.from({ length }).map((_, i) => (
      <SkeletonPodcastItem key={i} />
    ))}
  </div>
)

export const SkeletonFilter = () => (
  <div className="filter-podcast-container">
    <div className="skeleton-filter"></div>
  </div>
)
