import Podcasts from '@/components/pages/podcasts/Podcasts'

/**
 * Server-side rendered podcast home page component.
 *
 * This component serves as the main entry point for the podcast home page,
 * implementing React's Suspense pattern to display a skeleton loader while
 * the main content is being fetched.
 *
 * @returns {JSX.Element} A main section containing the podcast home page with loading fallback
 *
 */
const PodcastsPage = () => (
  <main>
    <Podcasts />
  </main>
)

export default PodcastsPage
