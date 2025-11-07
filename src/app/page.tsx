import PodcastHomePage from '@/components/PodcastHomePage'
import { fetchTopPodcasts } from '@/services/podcasts'
import '@/styles/components.css'

const HomePage = async () => {
  const data = await fetchTopPodcasts()
  return (
    <main>
      <PodcastHomePage data={data} />
    </main>
  )
}

export default HomePage
