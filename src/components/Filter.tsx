import '@/styles/components.css'
import SearchInput from './SearchInput'

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
    <SearchInput value={query} onChange={setQuery} />
  </div>
)

export default Filter
