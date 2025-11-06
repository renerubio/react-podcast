import '@/styles/components.css'
import SearchInput from './SearchInput'

/**
 * Filter component for displaying the number of filtered podcast results and a search input.
 *
 * @param query - The current search query string.
 * @param setQuery - Function to update the search query.
 * @param filtered - Array of filtered podcast items.
 *
 * @returns A container with the number of results and a search input, which is disabled if there are no results.
 */
const Filter = ({
  query,
  setQuery,
  filtered
}: {
  query: string
  setQuery: (query: string) => void
  filtered: any[]
}) => (
  <div className="filter-podcast-container">
    <span className="filter-podcast-number-results">{filtered.length}</span>
    <SearchInput
      value={query}
      onChange={setQuery}
      disable={filtered.length === 0}
    />
  </div>
)

export default Filter
