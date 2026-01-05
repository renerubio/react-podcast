import { t } from '@/src/i18nConfig'
import {
  IEpisode,
  IParsedPodcastDetail,
  IPodcastDetail
} from '@/utils/interfaces'
import { TAppleEntry } from '@/utils/types'

/**
 * Normalizes a string for comparison or search operations.
 *
 * - Converts to lowercase.
 * - Removes diacritics.
 * - Trims whitespace.
 *
 * @pure
 * @param text - Input string to normalize.
 * @returns Normalized string.
 *
 * @example
 * ```typescript
 * normalizeText('  Árbol  ')
 * // => 'arbol'
 * ```
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Converts various raw episode GUID formats into a stable episode ID.
 * Handles provider-specific formats (e.g., blubrry, 500songs).
 * @param idRaw - The raw GUID string from the feed.
 * @returns A normalized episode ID, or an empty string if not found.
 */
function normalizeEpisodeId(idRaw: string): string {
  if (!idRaw) return ''
  if (idRaw.includes('blubrry')) return idRaw.split('/')[4] ?? ''
  if (idRaw.includes('500songs')) return idRaw.split('=')[2] ?? ''
  return idRaw
}

/**
 * Extracts and trims the podcast description from a feed XML document.
 *
 * @pure
 * @param xml - Parsed podcast feed as an XMLDocument.
 * @returns Podcast description, or an empty string if not present.
 */
export function parsePodcastDescription(xml: XMLDocument): string {
  return xml.querySelector('channel > description')?.textContent?.trim() ?? ''
}

/**
 * Parses episode items from a podcast feed XML document.
 *
 * Normalizes episode IDs and durations, and fills unknown durations with a fallback label.
 *
 * @pure
 * @param xml - Parsed podcast feed as an XMLDocument.
 * @param unknownLabel - Fallback label for unknown durations.
 * @returns Array of normalized episode objects.
 */
export function parseEpisodesFromFeedPure(
  xml: XMLDocument,
  unknownLabel: string
): IEpisode[] {
  return Array.from(xml.querySelectorAll('item'))
    .map((item) => {
      const idRaw = item.querySelector('guid')?.textContent ?? ''
      const id = normalizeEpisodeId(idRaw)
      const durationRaw =
        item.getElementsByTagName('itunes:duration')[0]?.textContent
      const duration =
        durationRaw && durationRaw !== '0:00' ? durationRaw : unknownLabel

      return {
        id,
        title: item.querySelector('title')?.textContent ?? '',
        url: item.querySelector('enclosure')?.getAttribute('url') ?? undefined,
        date: item.querySelector('pubDate')?.textContent ?? '',
        duration,
        description: item.querySelector('description')?.textContent ?? ''
      } as IEpisode
    })
    .filter(({ id }) => id !== '')
}

/**
 * Parses episode items from a podcast feed XML document.
 *
 * Normalizes episode IDs and durations, and fills unknown durations with a localized label.
 *
 * @impure
 * @remarks
 * - Depends on i18n state via `t('unknown')`.
 *
 * @param xml - Parsed podcast feed as an XMLDocument.
 * @returns Array of normalized episode objects.
 */
export function parseEpisodesFromFeed(xml: XMLDocument): IEpisode[] {
  return parseEpisodesFromFeedPure(xml, t('unknown'))
}

/**
 * Combines podcast metadata and feed data into a normalized podcast detail object.
 *
 * @pure
 * @param params - Input data for normalization.
 * @param params.podcast - Podcast metadata from the API.
 * @param params.xml - Parsed podcast feed as an XMLDocument.
 * @returns Normalized podcast detail for UI consumption.
 */
export function parsePodcastDetail({
  podcast,
  xml
}: {
  podcast: IPodcastDetail
  xml: XMLDocument
}): IParsedPodcastDetail {
  return {
    ...podcast,
    description: parsePodcastDescription(xml),
    episodes: parseEpisodesFromFeed(xml)
  }
}

/**
 * Formats an ISO date string using a provided formatter.
 *
 * @pure
 * @param iso - ISO date string to format.
 * @param formatter - Formatter function for a Date instance.
 * @returns Formatted date string.
 */
export function formatDateWithFormatter(
  iso: string,
  formatter: (date: Date) => string
): string {
  return formatter(new Date(iso))
}

/**
 * Formats an ISO date string into a locale-specific date string.
 *
 * @impure
 * @remarks
 * - Uses runtime locale/timezone when `undefined` is passed to `Intl.DateTimeFormat`.
 *
 * @param iso - ISO date string to format.
 * @returns Formatted date string according to the user's locale.
 */
export function formatDate(iso: string): string {
  const formatter = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  })
  return formatDateWithFormatter(iso, (date) => formatter.format(date))
}

/**
 * Formats a duration value (in seconds) as a string in `m:ss` format.
 *
 * @pure
 * @param duration - Duration to format, as seconds or a preformatted string.
 * @returns Formatted duration string, or the original string if input is already a string.
 *
 * @example
 * ```typescript
 * formatDuration(65)
 * // => '1:05'
 * ```
 */
export function formatDuration(duration: number | string): string {
  if (typeof duration === 'string') return duration
  const m = Math.floor(duration / 60)
  const s = Math.floor(duration % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Normalizes raw podcast entries from the iTunes API into a consistent format.
 *
 * @pure
 * @param podcasts - Array of raw podcast entries from the iTunes API.
 * @returns Array of normalized podcast objects with id, title, author, image, and summary.
 */
export function normalizePodcasts(podcasts: TAppleEntry[]): Array<{
  id: string
  title: string
  author: string
  image: string
  summary: string
}> {
  return podcasts.map((podcast, idx) => ({
    id: podcast?.id?.attributes?.['im:id'] ?? String(idx),
    title: podcast?.['im:name']?.label ?? '',
    author: podcast?.['im:artist']?.label ?? '',
    image:
      podcast?.['im:image']?.[2]?.label ||
      podcast?.['im:image']?.[0]?.label ||
      '',
    summary: podcast?.summary?.label ?? ''
  }))
}
