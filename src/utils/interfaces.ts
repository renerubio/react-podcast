/**
 * Props accepted by the shared `Card` component to control semantic variant and styling.
 */
export interface ICardProps {
  children: React.ReactNode
  className?: string
  variant?:
    | 'main'
    | 'article'
    | 'section'
    | 'aside'
    | 'nav'
    | 'header'
    | 'footer'
}

/**
 * Episode model normalized from feeds and lookup responses.
 */
export interface IEpisode {
  id: string | number
  title: string
  url?: string
  date: string
  duration: number | string
  episodes?: any
  description?: string
}

/**
 * Minimal data shape used to render the Top 100 podcasts list.
 */
export interface ITop100Podcasts {
  id: string
  title: string
  author: string
  image: string
  summary?: string
}

/**
 * Full podcast detail returned by the lookup API and enriched with episodes.
 */
export interface IPodcastDetail {
  wrapperType: string
  kind: string
  artistId: number
  artistName: string
  artistViewUrl: string
  artworkUrl30: string
  artworkUrl60: string
  artworkUrl100: string
  artworkUrl600: string
  collectionCensoredName: string
  collectionExplicitness: string
  collectionHdPrice: number
  collectionId: number
  collectionName: string
  collectionPrice: number
  collectionViewUrl: string
  contentAdvisoryRating: string
  country: string
  currency: string
  episodes: IEpisode[]
  feedUrl: string
  genreIds: string[]
  genres: string[]
  primaryGenreName: string
  releaseDate: string
  trackCensoredName: string
  trackCount: number
  trackExplicitness: string
  trackId: number
  trackName: string
  trackPrice: number
  trackTimeMillis: number
  trackViewUrl: string
}

/**
 * Podcast detail with parsed description injected from the RSS feed.
 */
export interface IParsedPodcastDetail extends IPodcastDetail {
  description: string
}
