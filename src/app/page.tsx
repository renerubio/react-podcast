'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Home</h1>
      <p>Página principal. (Aquí irá el Top 100 y el filtro)</p>

      {/* Demo de navegación */}
      <div style={{ marginTop: 16 }}>
        <Link href="/podcast/934552872">Ir a un podcast de ejemplo</Link>
      </div>
    </section>
  )
}
