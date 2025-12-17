import { NextRequest, NextResponse } from 'next/server'

// TODO: Restrict allowed domains for security
/* const ALLOWED_DOMAINS = [
  'itunes.apple.com',
  'feeds.simplecast.com',
  'rss.art19.com'
] */

// TODO: Implement domain restriction logic

/*   
const isAllowedDomain = (url: string): boolean => {
  return true
  try {
    const { hostname } = new URL(url)
    return ALLOWED_DOMAINS.includes(hostname)
  } catch {
    return false
  }
} */

const DEFAULT_TIMEOUT = 5000

const isAllowedDomain = (url: string): boolean => true

export async function GET(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get('url')

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Missing "url" query parameter' },
      { status: 400 }
    )
  }

  if (!isAllowedDomain(targetUrl)) {
    return NextResponse.json(
      { error: 'The requested domain is not allowed' },
      { status: 403 }
    )
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    })

    const body = await response.text()

    clearTimeout(timeoutId)

    return new NextResponse(body, {
      status: response.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*' // TODO: Adjust CORS as needed, related to "ALLOWED_DOMAINS"
      }
    })
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out' }, { status: 504 })
    }

    return NextResponse.json(
      { error: 'Failed to fetch the requested resource' },
      { status: 500 }
    )
  }
}
