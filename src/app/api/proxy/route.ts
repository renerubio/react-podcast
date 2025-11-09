import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const target = searchParams.get('url')

  if (!target)
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })

  try {
    const res = await fetch(target, {
      // Evita cachear para desarrollo
      cache: 'no-store',
      headers: { 'User-Agent': 'Mozilla/5.0 (RAG Fetch Proxy)' }
    })
    const text = await res.text()

    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*' // tu respuesta sí permite CORS
      }
    })
  } catch (err: any) {
    console.error('[Proxy error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
