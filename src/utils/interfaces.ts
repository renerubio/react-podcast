/**
 * Props accepted by the shared `Card` component to control semantic variant and styling.
 *
 * @property children - Content to render inside the card.
 * @property className - Optional additional CSS classes.
 * @property variant - Semantic/visual variant for the card container.
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
 *
 * @property id - Episode identifier from feed or API.
 * @property title - Episode title.
 * @property url - Optional audio URL.
 * @property date - Publication date string.
 * @property duration - Duration in seconds or formatted string.
 * @property description - Optional episode description.
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
 *
 * @property id - Podcast identifier.
 * @property title - Podcast title.
 * @property author - Podcast author.
 * @property image - Artwork URL.
 * @property summary - Optional summary text.
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
 *
 * @remarks
 * Field names align with the Apple iTunes Lookup API response.
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
 *
 * @property description - Parsed description from the podcast RSS feed.
 */
export interface IParsedPodcastDetail extends IPodcastDetail {
  description: string
}
