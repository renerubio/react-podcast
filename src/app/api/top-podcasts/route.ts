import { NextResponse } from 'next/server'

const APPLE_TOP100 =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'

export const dynamic = 'force-dynamic' // ejecuta en runtime (dev/prod)

export async function GET() {
  try {
    const res = await fetch(APPLE_TOP100, { cache: 'no-store' })
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Top 100' },
        { status: res.status }
      )
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }
}
