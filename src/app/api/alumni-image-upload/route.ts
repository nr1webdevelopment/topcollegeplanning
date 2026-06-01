import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * POST /api/alumni-image-upload
 * Body: { slug: string, base64: string }
 * Saves the base64-encoded image to public/alumni/{slug}.jpg
 */
export async function POST(req: NextRequest) {
  try {
    const { slug, base64 } = await req.json()
    if (!slug || !base64) {
      return NextResponse.json({ error: 'missing slug or base64' }, { status: 400 })
    }

    const alumniDir = path.join(process.cwd(), 'public', 'alumni')
    if (!fs.existsSync(alumniDir)) fs.mkdirSync(alumniDir, { recursive: true })

    // Strip the data URI prefix if present
    const raw = base64.replace(/^data:[^;]+;base64,/, '')
    const buffer = Buffer.from(raw, 'base64')

    if (buffer.length < 5000) {
      return NextResponse.json({ error: 'image too small', bytes: buffer.length }, { status: 400 })
    }

    const destPath = path.join(alumniDir, `${slug}.jpg`)
    fs.writeFileSync(destPath, buffer)

    return NextResponse.json({ ok: true, slug, bytes: buffer.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
