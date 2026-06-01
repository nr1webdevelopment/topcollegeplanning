import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * POST /api/upload-image
 * Body: raw image bytes (binary)
 * Query params:
 *   dest=alumni/stephen-colbert.jpg   (relative to /public/)
 *
 * Called from the browser (which can fetch Wikipedia images directly) to
 * save them server-side into /public/ with the correct filename.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request: NextRequest) {
  const dest = request.nextUrl.searchParams.get('dest')
  if (!dest) {
    return NextResponse.json({ error: 'Missing ?dest= parameter' }, { status: 400 })
  }

  // Safety: only allow alphanumeric + slash + dash + dot
  if (!/^[a-zA-Z0-9/_\-\.]+$/.test(dest)) {
    return NextResponse.json({ error: 'Invalid dest path' }, { status: 400 })
  }

  try {
    const buf = Buffer.from(await request.arrayBuffer())
    if (buf.length < 500) {
      return NextResponse.json({ error: `Data too small (${buf.length} bytes)` }, { status: 400 })
    }

    const destAbs = path.join(process.cwd(), 'public', dest)
    fs.mkdirSync(path.dirname(destAbs), { recursive: true })
    fs.writeFileSync(destAbs, buf)

    return NextResponse.json({ ok: true, dest, kb: Math.round(buf.length / 1024) }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  } catch (err) {
    console.error('[upload-image] error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } })
  }
}
