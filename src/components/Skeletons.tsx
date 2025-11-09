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

type Props = { rows?: number }

export const SkeletonPodcastDetail = ({ rows = 10 }: Props) => {
  const items = Array.from({ length: rows })

  return (
    <main className="skeleton-podcast-container skeleton-podcast-detail">
      {/* Sidebar card */}
      <div className="podcast-detail-resume skeleton-card">
        <div className="skeleton-logo skeleton-block" />
        <div className="skeleton-title skeleton-block" />
        <div className="skeleton-subtitle skeleton-block" />
        <div className="skeleton-section-label skeleton-block" />
        <div className="skeleton-paragraph skeleton-block" />
        <div className="skeleton-paragraph-short skeleton-block" />
      </div>

      {/* Episodes table */}
      <section className="skeleton-episodes">
        <div className="skeleton-episodes-header skeleton-block" />
        <div className="skeleton-table">
          <div className="skeleton-thead">
            <div className="skeleton-th">Title</div>
            <div className="skeleton-th skeleton-col-date">Date</div>
            <div className="skeleton-th skeleton-col-dur">Duration</div>
          </div>

          <div className="skeleton-tbody">
            {items.map((_, i) => (
              <div className="skeleton-tr" key={i}>
                <div className="skeleton-td">
                  <div className="skeleton-line skeleton-w-70 skeleton-block" />
                </div>
                <div className="skeleton-td skeleton-col-date">
                  <div className="skeleton-line skeleton-w-40 skeleton-block" />
                </div>
                <div className="skeleton-td skeleton-col-dur">
                  <div className="skeleton-line skeleton-w-30 skeleton-block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
