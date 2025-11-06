'use client'
import { Podcast } from '@/components/Podcast'
import { TopPodcast } from '@/services/podcasts'

const PodcastList = ({
  podcastsFiltered
}: {
  podcastsFiltered: TopPodcast[]
}) => (
  <div className="podcasts-container">
    {podcastsFiltered.map((podcast: TopPodcast) => (
      <Podcast key={podcast.id} podcast={podcast} />
    ))}
  </div>
)

export default PodcastList
