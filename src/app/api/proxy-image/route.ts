import { NextRequest, NextResponse } from 'next/server'

/**
 * Server-side image proxy — fetches external images from the Next.js server
 * so the browser never directly hits hotlink-protected origins.
 *
 * Wikipedia's CDN requires Referer: https://en.wikipedia.org/ — without it
 * every request returns HTTP 400, even from a server.
 */

const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
}

function headersFor(url: string): Record<string, string> {
  if (url.includes('wikimedia.org') || url.includes('wikipedia.org')) {
    return {
      ...BASE_HEADERS,
      'Referer': 'https://en.wikipedia.org/',
      'sec-fetch-dest': 'image',
      'sec-fetch-mode': 'no-cors',
      'sec-fetch-site': 'cross-site',
    }
  }
  return BASE_HEADERS
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing ?url= parameter', { status: 400 })
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return new NextResponse('Only http/https URLs are supported', { status: 400 })
  }

  try {
    const upstream = await fetch(url, { headers: headersFor(url) })

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, { status: upstream.status })
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg'
    const buffer = await upstream.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch (err: unknown) {
    console.error('[proxy-image] fetch failed:', url, err)
    return new NextResponse('Failed to fetch image', { status: 502 })
  }
}
