'use client'
import { useState } from 'react'

const ALUMNI: [string, string][] = [
  ['stephen-colbert',       'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Stephen_Colbert_2019.jpg/440px-Stephen_Colbert_2019.jpg'],
  ['christopher-reeve',     'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Christopher_Reeve_in_1980.jpg/440px-Christopher_Reeve_in_1980.jpg'],
  ['mehmet-oz',             'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Dr_Oz_2012.jpg/440px-Dr_Oz_2012.jpg'],
  ['dr-seuss',              'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Ted_Geisel_NYWTS.jpg/440px-Ted_Geisel_NYWTS.jpg'],
  ['natalie-portman',       'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Natalie_Portman_Cannes_2015_3.jpg/440px-Natalie_Portman_Cannes_2015_3.jpg'],
  ['benjamin-franklin',     'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Benjamin_Franklin_by_Joseph-Siffrein_Duplessis.jpg/440px-Benjamin_Franklin_by_Joseph-Siffrein_Duplessis.jpg'],
  ['john-legend',           'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/John_Legend_2019.jpg/440px-John_Legend_2019.jpg'],
  ['bill-clinton',          'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/440px-Bill_Clinton.jpg'],
  ['george-w-bush',         'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/George-W-Bush.jpeg/440px-George-W-Bush.jpeg'],
  ['michael-phelps',        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Michael_Phelps_2012.jpg/440px-Michael_Phelps_2012.jpg'],
  ['donald-trump',          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/440px-Donald_Trump_official_portrait.jpg'],
  ['george-stephanopoulos', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/George_Stephanopoulos_2011.jpg/440px-George_Stephanopoulos_2011.jpg'],
  ['michelle-obama',        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Michelle_Obama_2013_official_portrait.jpg/440px-Michelle_Obama_2013_official_portrait.jpg'],
  ['mark-zuckerberg',       'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29.jpg'],
  ['conan-obrien',          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Conan_O%27Brien_2019.jpg/440px-Conan_O%27Brien_2019.jpg"],
  ['tom-brady',             "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Tom_Brady%2C_2017.jpg/440px-Tom_Brady%2C_2017.jpg"],
  ['tiger-woods',           'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Tiger_Woods_at_the_2010_Ryder_Cup.jpg/440px-Tiger_Woods_at_the_2010_Ryder_Cup.jpg'],
  ['warren-buffett',        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Warren_Buffett_KU_Visit.jpg/440px-Warren_Buffett_KU_Visit.jpg'],
  ['bill-gates',            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg'],
  ['jeff-bezos',            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Jeff_Bezos_2016.jpg/440px-Jeff_Bezos_2016.jpg'],
  ['elon-musk',             'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg'],
  ['michael-bloomberg',     'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Michael_Bloomberg_Shankbone_2010_NYC.jpg/440px-Michael_Bloomberg_Shankbone_2010_NYC.jpg'],
]

const SITE: [string, string][] = [
  ['college-graduate-hero',        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=840&q=80&fit=crop'],
  ['students-campus-background',   'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80&fit=crop'],
  ['northwestern-university-logo', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Northwestern_Wildcats_logo.svg/200px-Northwestern_Wildcats_logo.svg.png'],
  ['usc-trojans-logo',             'https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/USC_Trojans_logo.svg/200px-USC_Trojans_logo.svg.png'],
  ['columbia-lions-logo',          'https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Columbia_Lions_logo.svg/200px-Columbia_Lions_logo.svg.png'],
]

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function DevPage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({})
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)

  function proxyUrl(url: string) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`
  }

  function ext(url: string) {
    const m = url.match(/\.(jpe?g|png|webp|svg)/i)
    return m ? '.' + m[1].toLowerCase().replace('jpeg', 'jpg') : '.jpg'
  }

  async function downloadOne(slug: string, url: string) {
    setStatuses(s => ({ ...s, [slug]: 'loading' }))
    try {
      const res = await fetch(proxyUrl(url))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = slug + ext(url)
      document.body.appendChild(a)
      a.click()
      a.remove()
      setStatuses(s => ({ ...s, [slug]: 'done' }))
      setLog(l => [...l, `✓ ${slug}${ext(url)}`])
    } catch (e) {
      setStatuses(s => ({ ...s, [slug]: 'error' }))
      setLog(l => [...l, `✗ ${slug} — ${e}`])
    }
  }

  async function downloadAll() {
    setRunning(true)
    setLog([])
    const all = [...ALUMNI, ...SITE]
    for (const [slug, url] of all) {
      await downloadOne(slug, url)
      await new Promise(r => setTimeout(r, 300))
    }
    setRunning(false)
    setLog(l => [...l, '— All done. Move files to public/alumni/ and public/images/ —'])
  }

  const color = (s: Status) =>
    s === 'done' ? '#22c55e' : s === 'error' ? '#ef4444' : s === 'loading' ? '#f59e0b' : '#d1d5db'

  return (
    <div style={{ fontFamily: 'system-ui', padding: 32, maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>🎓 Image Downloader</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Downloads all images through the local proxy (same-origin, no CORS). Files go to your <strong>Downloads</strong> folder.
        Then move: alumni photos → <code>public/alumni/</code> · site images → <code>public/images/</code>
      </p>

      <button
        onClick={downloadAll}
        disabled={running}
        style={{
          background: running ? '#9ca3af' : '#e85d26', color: '#fff', border: 'none',
          padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: running ? 'default' : 'pointer',
          borderRadius: 6, marginBottom: 24,
        }}
      >
        {running ? 'Downloading…' : '⬇ Download All Images'}
      </button>

      <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 12 }}>
        Alumni photos → <code>public/alumni/</code>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: 12, marginBottom: 32 }}>
        {ALUMNI.map(([slug, url]) => (
          <div key={slug} style={{ background: '#f9fafb', borderRadius: 8, overflow: 'hidden', border: '2px solid ' + color(statuses[slug] ?? 'idle') }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={proxyUrl(url)} alt={slug} style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '6px 8px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, wordBreak: 'break-all' }}>{slug}.jpg</div>
              <button
                onClick={() => downloadOne(slug, url)}
                style={{ width: '100%', fontSize: 11, background: '#1a1a3e', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 0', cursor: 'pointer' }}
              >Save</button>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 12 }}>
        Site images → <code>public/images/</code>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: 12, marginBottom: 32 }}>
        {SITE.map(([slug, url]) => (
          <div key={slug} style={{ background: '#f9fafb', borderRadius: 8, overflow: 'hidden', border: '2px solid ' + color(statuses[slug] ?? 'idle') }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={proxyUrl(url)} alt={slug} style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '6px 8px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, wordBreak: 'break-all' }}>{slug}{ext(url)}</div>
              <button
                onClick={() => downloadOne(slug, url)}
                style={{ width: '100%', fontSize: 11, background: '#1a1a3e', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 0', cursor: 'pointer' }}
              >Save</button>
            </div>
          </div>
        ))}
      </div>

      {log.length > 0 && (
        <div style={{ background: '#1a1a3e', color: '#86efac', fontFamily: 'monospace', fontSize: 12, padding: 16, borderRadius: 8, maxHeight: 200, overflowY: 'auto' }}>
          {log.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

      <div style={{ marginTop: 32, background: '#fefce8', border: '1px solid #fde68a', borderRadius: 8, padding: 16, fontSize: 13 }}>
        <strong>After downloading, run this in your terminal to update content.json:</strong>
        <pre style={{ background: '#fff', padding: 10, borderRadius: 4, marginTop: 8, overflowX: 'auto' }}>{`node -e "
const fs=require('fs'),p='src/data/content.json';
const d=JSON.parse(fs.readFileSync(p));
d.alumni.forEach(a=>{if(a.photo&&a.photo.includes('wikimedia'))a.photo='/alumni/'+a.slug+'.jpg'});
fs.writeFileSync(p,JSON.stringify(d,null,2));
console.log('Done');
"`}</pre>
      </div>
    </div>
  )
}
