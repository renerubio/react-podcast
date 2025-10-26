'use client'

import { useNavigationContext } from '@/context/NavigationContext'
import { fetchTopPodcasts, type TopPodcast } from '@/services/podcasts'
import { t } from '@/src/i18nConfig'
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
        setError(`Error: ${e} - ${t('error_load_top_100')}`)
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [setLoading])

  if (error)
    return <main style={{ padding: 24 }}>{t('error_loading_data')}</main>
  if (!data) return <main style={{ padding: 24 }}>{t('loading')}</main>

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ margin: '0 0 12px' }}>{t('home_title')}</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
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
              borderRadius: 5,
              padding: '0 12px 12px',
              textDecoration: 'none',
              background: '#fff',
              textAlign: 'center',
              marginTop: '80px',
              height: 'fit-content',
              transition: 'transform 0.18s, box-shadow 0.18s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.transform =
                'translateY(-6px) scale(1.03)'
              ;(e.currentTarget as HTMLElement).style.boxShadow =
                '0 6px 24px rgba(0,0,0,0.14)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.transform = ''
              ;(e.currentTarget as HTMLElement).style.boxShadow =
                '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            <Image
              src={p.image}
              alt={p.title}
              width={100}
              height={100}
              style={{
                width: 'auto',
                height: 'auto',
                borderRadius: '50%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                marginTop: '-40px'
              }}
            />
            <h3
              style={{
                margin: '2px 0 10px',
                fontSize: 14,
                textTransform: 'uppercase'
              }}
            >
              {p.title}
            </h3>
            <p style={{ margin: 0, opacity: 0.7, fontSize: 14 }}>
              {t('author')}: {p.author}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
