'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function EpisodeDetailPage() {
  const { podcastId, episodeId } = useParams<{
    podcastId: string
    episodeId: string
  }>()

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
