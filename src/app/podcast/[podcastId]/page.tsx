'use client'

import { useLoading } from '@/context/NavigationContext'
import BackButton from '@/src/components/BackButton'
import { stopWithTimeout } from '@/utils/utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

const PodcastDetailPage = () => {
  const { podcastId } = useParams<{ podcastId: string }>()
  const { start, stop } = useLoading()

  useEffect(() => {
    stopWithTimeout({ stop })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section style={{ padding: 24 }}>
      <h1>Detalle Podcast</h1>
      <p>ID: {podcastId}</p>

      {/* Demo: links a episodios */}
      <ul>
        <li>
          <Link
            onClick={() => {
              start(`Navigating to podcast ${podcastId} episode 1`)
            }}
            href={`/podcast/${podcastId}/episode/1`}
          >
            Ir al episodio 1
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              start(`Navigating to podcast ${podcastId} episode 2`)
            }}
            href={`/podcast/${podcastId}/episode/2`}
          >
            Ir al episodio 2
          </Link>
        </li>
      </ul>

      <BackButton />
    </section>
  )
}

export default PodcastDetailPage
