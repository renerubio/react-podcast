'use client'

import { useNavigationContext } from '@/context/NavigationContext'
import { fetchTopPodcasts, type TopPodcast } from '@/services/podcasts'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [data, setData] = useState<TopPodcast[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { setLoading } = useNavigationContext()

  useEffect(() => {
    let alive = true
    async function run() {
      try {
        setLoading(true)
        const list = await fetchTopPodcasts()
        if (!alive) return
        setData(list)
      } catch (e) {
        console.error(e)
        setError('Failed to load Top 100')
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [setLoading])

  if (error) return <main style={{ padding: 24 }}>Error loading data.</main>
  if (!data) return <main style={{ padding: 24 }}>Loading…</main>

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ margin: '0 0 12px' }}>Top 100 Podcasts</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16
        }}
      >
        {data.map((p) => (
          <Link
            key={p.id}
            href={`/podcast/${p.id}`}
            style={{
              display: 'block',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 16,
              textDecoration: 'none',
              color: 'inherit',
              background: '#fff'
            }}
          >
            <Image
              src={p.image}
              alt={p.title}
              width={220}
              height={220}
              style={{
                width: '100%',
                borderRadius: 8,
                aspectRatio: '1 / 1',
                objectFit: 'cover'
              }}
            />
            <h3 style={{ margin: '12px 0 4px', fontSize: 16 }}>{p.title}</h3>
            <p style={{ margin: 0, opacity: 0.7, fontSize: 14 }}>{p.author}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
