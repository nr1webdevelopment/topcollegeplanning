#!/usr/bin/env node
/**
 * download-images.js
 *
 * Downloads all external images to /public/ with clean SEO-friendly filenames.
 * Uses curl (built into macOS) which handles Wikipedia's strict TLS checks.
 *
 * Run from project root:  node scripts/download-images.js
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PUBLIC      = path.join(__dirname, '..', 'public')
const CONTENT_JSON = path.join(__dirname, '..', 'src', 'data', 'content.json')

// ── Site images ────────────────────────────────────────────────────────────────
// WordPress images from the old site are 404 — using open-license alternatives.
const SITE_IMAGES = [
  // Logo — try multiple WordPress URLs (different crops stored in WP media library)
  {
    url: 'https://topcollegeplanning.com/wp-content/uploads/2022/03/Logo-header@2x.png',
    dest: 'images/top-college-planning-logo.png',
    fallback: 'https://topcollegeplanning.com/wp-content/uploads/2022/03/Logo-header402x.png',
  },

  // Hero graduate photo (Unsplash free licence, no hotlink protection)
  {
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=840&q=80&fit=crop',
    dest: 'images/college-graduate-hero.jpg',
  },

  // Students campus background
  {
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80&fit=crop',
    dest: 'images/students-campus-background.jpg',
  },

  // University logos — official SVGs via Wikimedia Commons (open licence)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Northwestern_Wildcats_logo.svg/200px-Northwestern_Wildcats_logo.svg.png',
    dest: 'images/northwestern-university-logo.png',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/USC_Trojans_logo.svg/200px-USC_Trojans_logo.svg.png',
    dest: 'images/usc-trojans-logo.png',
    fallback: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/USC_Trojans_logo.svg/200px-USC_Trojans_logo.svg.png',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Columbia_Lions_logo.svg/200px-Columbia_Lions_logo.svg.png',
    dest: 'images/columbia-lions-logo.png',
  },
]

// ── Alumni photos (Wikipedia Commons) ─────────────────────────────────────────
const ALUMNI_PHOTOS = [
  { slug: 'stephen-colbert',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Stephen_Colbert_2019.jpg/440px-Stephen_Colbert_2019.jpg' },
  { slug: 'christopher-reeve',     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Christopher_Reeve_in_1980.jpg/440px-Christopher_Reeve_in_1980.jpg' },
  { slug: 'mehmet-oz',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Dr_Oz_2012.jpg/440px-Dr_Oz_2012.jpg' },
  { slug: 'dr-seuss',              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Ted_Geisel_NYWTS.jpg/440px-Ted_Geisel_NYWTS.jpg' },
  { slug: 'natalie-portman',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Natalie_Portman_Cannes_2015_3.jpg/440px-Natalie_Portman_Cannes_2015_3.jpg' },
  { slug: 'benjamin-franklin',     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Benjamin_Franklin_by_Joseph-Siffrein_Duplessis.jpg/440px-Benjamin_Franklin_by_Joseph-Siffrein_Duplessis.jpg' },
  { slug: 'john-legend',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/John_Legend_2019.jpg/440px-John_Legend_2019.jpg' },
  { slug: 'bill-clinton',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/440px-Bill_Clinton.jpg' },
  { slug: 'george-w-bush',         url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/George-W-Bush.jpeg/440px-George-W-Bush.jpeg' },
  { slug: 'michael-phelps',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Michael_Phelps_2012.jpg/440px-Michael_Phelps_2012.jpg' },
  { slug: 'donald-trump',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/440px-Donald_Trump_official_portrait.jpg' },
  { slug: 'george-stephanopoulos', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/George_Stephanopoulos_2011.jpg/440px-George_Stephanopoulos_2011.jpg' },
  { slug: 'michelle-obama',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Michelle_Obama_2013_official_portrait.jpg/440px-Michelle_Obama_2013_official_portrait.jpg' },
  { slug: 'mark-zuckerberg',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29.jpg' },
  { slug: 'conan-obrien',          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Conan_O%27Brien_2019.jpg/440px-Conan_O%27Brien_2019.jpg" },
  { slug: 'tom-brady',             url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Tom_Brady%2C_2017.jpg/440px-Tom_Brady%2C_2017.jpg" },
  { slug: 'tiger-woods',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Tiger_Woods_at_the_2010_Ryder_Cup.jpg/440px-Tiger_Woods_at_the_2010_Ryder_Cup.jpg' },
  { slug: 'warren-buffett',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Warren_Buffett_KU_Visit.jpg/440px-Warren_Buffett_KU_Visit.jpg' },
  { slug: 'bill-gates',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg' },
  { slug: 'jeff-bezos',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Jeff_Bezos_2016.jpg/440px-Jeff_Bezos_2016.jpg' },
  { slug: 'elon-musk',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg' },
  { slug: 'michael-bloomberg',     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Michael_Bloomberg_Shankbone_2010_NYC.jpg/440px-Michael_Bloomberg_Shankbone_2010_NYC.jpg' },
]

// ── Download via curl (handles Wikipedia's strict TLS) ─────────────────────────
function curlDownload(url, destAbs) {
  fs.mkdirSync(path.dirname(destAbs), { recursive: true })
  // -L  follow redirects
  // -s  silent
  // -f  fail on HTTP error (exit code 22)
  // --max-time 20
  const cmd = `curl -L -s -f --max-time 20 ` +
    `-H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" ` +
    `-H "Accept: image/webp,image/apng,image/*,*/*;q=0.8" ` +
    `-H "Accept-Language: en-US,en;q=0.9" ` +
    `-o "${destAbs}" "${url}"`
  execSync(cmd, { stdio: 'pipe' })

  const size = fs.statSync(destAbs).size
  if (size < 500) {
    fs.unlinkSync(destAbs)
    throw new Error(`File too small (${size} bytes) — probably an error page`)
  }
}

function tryDownload(url, destAbs, fallback) {
  try {
    curlDownload(url, destAbs)
    return true
  } catch (e) {
    if (fallback) {
      try {
        curlDownload(fallback, destAbs)
        return true
      } catch (e2) {
        throw new Error(`Primary: ${e.message} | Fallback: ${e2.message}`)
      }
    }
    throw e
  }
}

// ── Main ────────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n🎓 Top College Planning — Image Downloader\n')

  let ok = 0, fail = 0

  // Site images
  console.log('── Site images ─────────────────────────────────────────')
  for (const { url, dest, fallback } of SITE_IMAGES) {
    const abs = path.join(PUBLIC, dest)
    if (fs.existsSync(abs)) { console.log(`  ✓ skip  ${dest}`); ok++; continue }
    process.stdout.write(`  ↓ ${dest} ...`)
    try {
      tryDownload(url, abs, fallback)
      console.log(` ✓  (${Math.round(fs.statSync(abs).size / 1024)}KB)`)
      ok++
    } catch (e) {
      console.log(` ✗  ${e.message}`)
      fail++
    }
  }

  // Alumni photos
  console.log('\n── Alumni photos ───────────────────────────────────────')
  const downloaded = []
  for (const { slug, url } of ALUMNI_PHOTOS) {
    const dest = `alumni/${slug}.jpg`
    const abs  = path.join(PUBLIC, dest)
    if (fs.existsSync(abs)) {
      console.log(`  ✓ skip  ${dest}`)
      ok++
      downloaded.push({ slug, localPath: `/${dest}` })
      continue
    }
    process.stdout.write(`  ↓ ${dest} ...`)
    try {
      curlDownload(url, abs)
      console.log(` ✓  (${Math.round(fs.statSync(abs).size / 1024)}KB)`)
      ok++
      downloaded.push({ slug, localPath: `/${dest}` })
    } catch (e) {
      console.log(` ✗  ${e.message}`)
      fail++
    }
  }

  // Patch content.json
  if (downloaded.length > 0) {
    console.log('\n── Patching content.json ───────────────────────────────')
    const data = JSON.parse(fs.readFileSync(CONTENT_JSON, 'utf8'))
    let patched = 0
    for (const { slug, localPath } of downloaded) {
      const a = data.alumni.find(x => x.slug === slug)
      if (a && a.photo !== localPath) { a.photo = localPath; patched++ }
    }
    fs.writeFileSync(CONTENT_JSON, JSON.stringify(data, null, 2))
    console.log(`  ✓ Updated ${patched} alumni photo paths in content.json`)
  }

  // Summary
  console.log(`\n${'─'.repeat(55)}`)
  console.log(`  ✅ ${ok} succeeded   ❌ ${fail} failed`)
  console.log(`${'─'.repeat(55)}`)

  if (fail === 0) {
    console.log('\n🎉 All done! Restart your dev server: npm run dev\n')
  } else {
    console.log('\n⚠️  Some images failed. The /api/proxy-image route will serve')
    console.log('   them as a fallback. Run the script again to retry.\n')
  }
}

run().catch(e => { console.error(e); process.exit(1) })
