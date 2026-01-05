'use client'
import { ITop100Podcasts } from '@/utils/interfaces'
import { Podcast } from './Podcast'

/**
 * Renders a list of podcasts using the provided filtered podcast data.
 *
 * @param props - Component props.
 * @param props.podcastsFiltered - Array of podcasts to display.
 * @returns Container with the list of podcasts.
 *
 * @example
 * ```tsx
 * <PodcastList podcastsFiltered={filtered} />
 * ```
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
