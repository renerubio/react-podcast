'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PodcastDetailPage() {
  const { podcastId } = useParams<{ podcastId: string }>()

  return (
    <section style={{ padding: 24 }}>
      <h1>Detalle Podcast</h1>
      <p>ID: {podcastId}</p>

      {/* Demo: links a episodios */}
      <ul>
        <li>
          <Link href={`/podcast/${podcastId}/episode/1`}>Ir al episodio 1</Link>
        </li>
        <li>
          <Link href={`/podcast/${podcastId}/episode/2`}>Ir al episodio 2</Link>
        </li>
      </ul>

      <div style={{ marginTop: 16 }}>
        <Link href="/">← Volver a Home</Link>
      </div>
    </section>
  )
}
