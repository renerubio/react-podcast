import { t } from '@/src/i18nConfig'
import {
  IEpisode,
  IParsedPodcastDetail,
  IPodcastDetail
} from '@/utils/interfaces'
import { TAppleEntry } from '@/utils/types'

/**
 * Normalizes a string for comparison or search operations.
 * - Converts to lowercase.
 * - Removes diacritics.
 * - Trims whitespace.
 * @param text - The input string to normalize.
 * @returns The normalized string.
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
 * @param xml - The parsed podcast feed as an XMLDocument.
 * @returns The podcast description, or an empty string if not present.
 */
export function parsePodcastDescription(xml: XMLDocument): string {
  return xml.querySelector('channel > description')?.textContent?.trim() ?? ''
}

/**
 * Parses episode items from a podcast feed XML document.
 * Normalizes episode IDs and durations, and fills unknown durations with a localized label.
 * @param xml - The parsed podcast feed as an XMLDocument.
 * @returns An array of normalized episode objects.
 */
export function parseEpisodesFromFeed(xml: XMLDocument): IEpisode[] {
  return Array.from(xml.querySelectorAll('item'))
    .map((item) => {
      const idRaw = item.querySelector('guid')?.textContent ?? ''
      const id = normalizeEpisodeId(idRaw)
      const durationRaw =
        item.getElementsByTagName('itunes:duration')[0]?.textContent
      const duration =
        durationRaw && durationRaw !== '0:00' ? durationRaw : t('unknown')

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
 * Combines podcast metadata and feed data into a normalized podcast detail object.
 * Includes description and episodes parsed from the feed.
 * @param params - Object containing podcast metadata and parsed feed XML.
 * @param params.podcast - The podcast metadata from the API.
 * @param params.xml - The parsed podcast feed as an XMLDocument.
 * @returns A normalized podcast detail object for UI consumption.
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
 * Formats an ISO date string into a locale-specific date string with numeric day, month, and year.
 *
 * @param iso - The ISO date string to format.
 * @returns The formatted date string according to the user's locale.
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).format(new Date(iso))
}

/**
 * Formats a duration value (in seconds) as a string in "m:ss" format.
 * If the input is already a string, it returns the input unchanged.
 *
 * @param duration - The duration to format, either as a number (seconds) or a string.
 * @returns The formatted duration string in "m:ss" format, or the original string if input is a string.
 */
export function formatDuration(duration: number | string): string {
  if (typeof duration === 'string') return duration
  const m = Math.floor(duration / 60)
  const s = Math.floor(duration % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Normalizes an array of raw podcast entries from the iTunes API into a consistent format.
 * Safely extracts podcast metadata with fallback values.
 * @param podcasts - Array of raw podcast entries from the iTunes API.
 * @returns An array of normalized podcast objects with id, title, author, image, and summary.
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
