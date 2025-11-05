'use client'

import Filter from '@/components/Filter'
import { PodcastsList } from '@/components/Podcast'
import { SkeletonFilter, SkeletonPodcastList } from '@/components/Skeletons'
import { useLoading } from '@/context/NavigationContext'
import { fetchTopPodcasts, type TopPodcast } from '@/services/podcasts'
import { normalize } from '@/src/utils/normalize'
import '@/styles/components.css'
import { SKELETON_PODCASTS_LENGTH } from '@/utils/constants'
import { stopWithTimeout } from '@/utils/utils'
import { useEffect, useMemo, useState } from 'react'

const HomePage = () => {
  const [data, setData] = useState<TopPodcast[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const { start, stop } = useLoading()

  useEffect(() => {
    async function run() {
      try {
        start('Loading top podcasts...')
        const list = await fetchTopPodcasts()
        setData(list)
      } catch (e) {
        console.error(e)
        setError(`t('error_load_top_100'): ${(e as Error).message}`)
      } finally {
        stopWithTimeout({ stop })
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    const q = normalize(query)
    if (!q) return data
    return data.filter((p) => {
      const title = normalize(p.title)
      const author = normalize(p.author)
      return title.includes(q) || author.includes(q)
    })
  }, [data, query])

  if (error) console.error(error)

  return (
    <main>
      {!data ? (
        <>
          <SkeletonFilter />
          <SkeletonPodcastList length={SKELETON_PODCASTS_LENGTH} />
        </>
      ) : (
        <>
          <Filter query={query} setQuery={setQuery} filtered={filtered} />
          <PodcastsList podcasts={filtered} startNavigation={start} />
        </>
      )}
    </main>
  )
}

export default HomePage
