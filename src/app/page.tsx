import Podcasts from '@/components/pages/podcasts/Podcasts'
import '@/styles/filter.css'
import '@/styles/podcasts.css'

/**
 * Server-rendered podcast home page.
 *
 * @returns Main section containing the podcasts page.
 *
 * @example
 * ```tsx
 * <PodcastsPage />
 * ```
 */
const PodcastsPage = () => (
  <main>
    <Podcasts />
  </main>
)

export default PodcastsPage
