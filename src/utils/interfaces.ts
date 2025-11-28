type Messages = {
  [key: string]: string
}

type NavigationCtx = {
  loading: boolean
  start: (message?: string) => void
  stop: () => void
  message?: string
}

interface CardProps {
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

interface IEpisode {
  id: string | number
  title: string
  url?: string
  date: string
  duration: number | string
  episodes?: any
  description?: string
}

interface ITop100Podcasts {
  id: string
  title: string
  author: string
  image: string
  summary?: string
}

interface IPodcastDetail {
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
  episodes: object[]
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
  description?: string
}

type AppleEntry = {
  id?: { attributes?: { ['im:id']?: string } }
  ['im:name']?: { label?: string }
  ['im:artist']?: { label?: string }
  ['im:image']?: Array<{ label?: string }>
  summary?: { label?: string }
}
