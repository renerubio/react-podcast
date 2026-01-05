import SearchInput from '@/components/ui/SearchInput'
import { ITop100Podcasts } from '@/utils/interfaces'

/**
 * Filter component displaying the number of filtered podcast results and a search input.
 *
 * @param props - Component props.
 * @param props.query - Current search query string.
 * @param props.setQuery - Function to update the search query.
 * @param props.filtered - Array of filtered podcast items.
 * @returns Container with results count and search input.
 *
 * @example
 * ```tsx
 * <Filter query={query} setQuery={setQuery} filtered={filtered} />
 * ```
 */
const Filter = ({
  query,
  setQuery,
  filtered
}: {
  query: string
  setQuery: (query: string) => void
  filtered: ITop100Podcasts[]
}) => (
  <div className="filter-podcast-container">
    <span className="filter-podcast-number-results">{filtered.length}</span>
    <SearchInput value={query} onChange={setQuery} />
  </div>
)

export default Filter
