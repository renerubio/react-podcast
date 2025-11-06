import { SKELETON_PODCASTS_LENGTH } from '@/utils/constants'

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
