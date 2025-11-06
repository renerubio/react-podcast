'use client'

import { useLoading } from '@/src/context/NavigationContext'
import { stopWithTimeout } from '@/utils/utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

const EpisodeDetailPage = () => {
  const { podcastId, episodeId } = useParams<{
    podcastId: string
    episodeId: string
  }>()
  const { stop } = useLoading()

  useEffect(() => {
    stopWithTimeout({ stop })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section style={{ padding: 24 }}>
      <h1>Detalle Episodio</h1>
      <p>Podcast: {podcastId}</p>
      <p>Episodio: {episodeId}</p>

      <div style={{ marginTop: 16 }}>
        <Link href={`/podcast/${podcastId}`}>← Volver al podcast</Link>
      </div>
    </section>
  )
}

export default EpisodeDetailPage
