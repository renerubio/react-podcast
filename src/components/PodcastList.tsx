'use client'
import { Podcast } from '@/components/Podcast'

/**
 * Renders a list of podcasts using the provided filtered podcast data.
 *
 * @param podcastsFiltered - An array of `ITop100Podcasts` objects to display.
 * @returns A React element containing the list of podcasts, or nothing if the array is empty.
 */
const PodcastList = ({
  podcastsFiltered
}: {
  podcastsFiltered: ITop100Podcasts[]
}) => (
  <div className="podcasts-container">
    {podcastsFiltered.length > 0 &&
      podcastsFiltered.map((podcast: ITop100Podcasts) => (
        <Podcast key={podcast.id} podcast={podcast} />
      ))}
  </div>
)

export default PodcastList
