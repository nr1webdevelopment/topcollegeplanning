import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * GET /api/save-images
 *
 * Downloads every external image server-side and saves it to /public/ with
 * clean SEO-friendly filenames. Also patches content.json alumni photo paths.
 *
 * Visit http://localhost:3000/api/save-images in your browser to run it.
 * Takes ~30 seconds for all 26 images.
 */

const PUBLIC = path.join(process.cwd(), 'public')
const CONTENT_JSON = path.join(process.cwd(), 'src', 'data', 'content.json')

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
}

// Wikipedia's CDN requires Referer to be a Wikipedia domain — otherwise it returns 400.
const WIKI_HEADERS = {
  ...HEADERS,
  'Referer': 'https://en.wikipedia.org/',
  'sec-fetch-dest': 'image',
  'sec-fetch-mode': 'no-cors',
  'sec-fetch-site': 'cross-site',
}

function headersFor(url: string) {
  if (url.includes('wikimedia.org') || url.includes('wikipedia.org')) return WIKI_HEADERS
  if (url.includes('unsplash.com')) {
    return {
      ...HEADERS,
      'Referer': 'https://unsplash.com/',
      'Origin': 'https://unsplash.com',
    }
  }
  if (url.includes('gstatic.com') || url.includes('google.com')) {
    return {
      ...HEADERS,
      'Referer': 'https://www.google.com/',
      'Origin': 'https://www.google.com',
    }
  }
  return HEADERS
}

const ALUMNI_PHOTOS: { slug: string; url: string }[] = [
  { slug: 'stephen-colbert',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/StephenColbert-byPhilipRomano.jpg/500px-StephenColbert-byPhilipRomano.jpg' },
  { slug: 'christopher-reeve',     url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/C_Reeve_in_Marriage_of_Figaro_Opening_night_1985.jpg' },
  { slug: 'mehmet-oz',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/CMS_Admin_Dr_Mehmet_Oz.png/500px-CMS_Admin_Dr_Mehmet_Oz.png' },
  { slug: 'dr-seuss',              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Theodor_Seuss_Geisel_%2801037v%29.jpg/500px-Theodor_Seuss_Geisel_%2801037v%29.jpg' },
  { slug: 'natalie-portman',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/NataliePortman.jpg/500px-NataliePortman.jpg' },
  { slug: 'benjamin-franklin',     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Joseph_Siffrein_Duplessis_-_Benjamin_Franklin_-_Google_Art_Project.jpg/500px-Joseph_Siffrein_Duplessis_-_Benjamin_Franklin_-_Google_Art_Project.jpg' },
  { slug: 'john-legend',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/JohnLegend-byPhilipRomano.jpg/500px-JohnLegend-byPhilipRomano.jpg' },
  { slug: 'bill-clinton',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Bill_Clinton_%28cropped_4%29.jpg/500px-Bill_Clinton_%28cropped_4%29.jpg' },
  { slug: 'george-w-bush',         url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/George-W-Bush_%28cropped_2%29.jpeg/500px-George-W-Bush_%28cropped_2%29.jpeg' },
  { slug: 'michael-phelps',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Michael_Phelps_Rio_Olympics_2016.jpg/500px-Michael_Phelps_Rio_Olympics_2016.jpg' },
  { slug: 'donald-trump',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29_%28cropped%29%282%29.jpg/500px-Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29_%28cropped%29%282%29.jpg' },
  { slug: 'george-stephanopoulos', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/George_Stephanopoulos_in_2024_%28cropped%29.jpg/500px-George_Stephanopoulos_in_2024_%28cropped%29.jpg' },
  { slug: 'michelle-obama',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Michelle_Obama_2013_official_portrait.jpg/500px-Michelle_Obama_2013_official_portrait.jpg' },
  { slug: 'mark-zuckerberg',       url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Mark_Zuckerberg_in_September_2025_%28cropped%29.jpg' },
  { slug: 'conan-obrien',          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Conan_O%27Brien_at_the_2025_Sundance_Film_Festival_03_%28cropped%29.jpg/500px-Conan_O%27Brien_at_the_2025_Sundance_Film_Festival_03_%28cropped%29.jpg" },
  { slug: 'tom-brady',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Tom_Brady_-_240422_191334_%28cropped%29_%28cropped%29.jpg/500px-25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Tom_Brady_-_240422_191334_%28cropped%29_%28cropped%29.jpg' },
  { slug: 'tiger-woods',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/President_Donald_Trump_hosts_a_reception_honoring_Black_History_Month_%2854341713089%29_%28cropped%29.jpg/500px-President_Donald_Trump_hosts_a_reception_honoring_Black_History_Month_%2854341713089%29_%28cropped%29.jpg' },
  { slug: 'warren-buffett',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit_%28cropped%29.jpg/500px-Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit_%28cropped%29.jpg' },
  { slug: 'bill-gates',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Bill_Gates_at_the_European_Commission_-_P067383-987995_%28cropped%29_5.jpg/500px-Bill_Gates_at_the_European_Commission_-_P067383-987995_%28cropped%29_5.jpg' },
  { slug: 'jeff-bezos',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg/500px-260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg' },
  { slug: 'elon-musk',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg/500px-Elon_Musk_-_54820081119_%28cropped%29.jpg' },
  { slug: 'michael-bloomberg',     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/MichaelBloomberg-byPhilipRomano_%28cropped%29.jpg/500px-MichaelBloomberg-byPhilipRomano_%28cropped%29.jpg' },
  { slug: 'john-ternus',           url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/John_Ternus_at_the_Apple_50th_Anniversary_Kickoff_%28cropped%29.jpg' },
  { slug: 'jamie-dimon',           url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Chancellor_Rachel_Reeves_meets_Jamie_Dimon_%2854838700663%29_%28cropped%29_%28cropped%29.jpg' },
  { slug: 'richard-li',            url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Richard_Li_20230430.jpg' },
  { slug: 'sam-altman',            url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Sam_Altman_TechCrunch_SF_2019_Day_2_Oct_3_%28cropped_3%29.jpg' },
  { slug: 'jane-fraser',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Jane_Fraser_%28cropped%29.jpg/500px-Jane_Fraser_%28cropped%29.jpg' },
  { slug: 'ted-pick',              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6Sx2VXuRBe9roYo_QzJcODqPzW07sf7OmPjcJ8lGpCCg6U86e9fDvTlygkGm3B9Ji5CDpjnba8BqVoV5a71NYN3NGWorFZsOgJAUN7Q&s=10' },
  { slug: 'jensen-huang',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Jen-Hsun_Huang_2025.jpg/500px-Jen-Hsun_Huang_2025.jpg' },
  { slug: 'andy-jassy',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Andy_Jassy.jpg/500px-Andy_Jassy.jpg' },
  { slug: 'brian-moynihan',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Brian_Moynihan%2C_official_portrait%2C_Homeland_Security_Council.jpg/500px-Brian_Moynihan%2C_official_portrait%2C_Homeland_Security_Council.jpg' },
  { slug: 'brian-roberts',         url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Brian_Roberts_Comcast_%28cropped%29.jpg/500px-Brian_Roberts_Comcast_%28cropped%29.jpg' },
  { slug: 'gail-boudreaux',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Gail_Boudreaux_headshot.jpg/500px-Gail_Boudreaux_headshot.jpg' },
  { slug: 'john-donahoe',          url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/JohnDonahoe.jpg' },
  // ── US PRESIDENTS ──────────────────────────────────────────────────────────
  { slug: 'john-adams',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/John_Adams_Portrait.jpg/500px-John_Adams_Portrait.jpg' },
  { slug: 'john-quincy-adams',     url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/JQA_Photo_Crop_%28cropped%29.jpg' },
  { slug: 'james-madison',         url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/James_Madison.jpg' },
  { slug: 'theodore-roosevelt',    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Theodore_Roosevelt_by_the_Pach_Bros_%284x5_cropped%29.jpg' },
  { slug: 'woodrow-wilson',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/President_Woodrow_Wilson_Harris_%26_Ewing_%283x4_cropped_b%29.jpg/500px-President_Woodrow_Wilson_Harris_%26_Ewing_%283x4_cropped_b%29.jpg' },
  { slug: 'franklin-roosevelt',    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/FDR-1944-Campaign-Portrait_%283x4_retouched%2C_cropped%29.jpg' },
  { slug: 'john-f-kennedy',        url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/John_F._Kennedy%2C_White_House_color_photo_portrait.jpg' },
  { slug: 'william-howard-taft',   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/William_Howard_Taft_by_Pach_Brothers_%283x4_ropped%29_%28cropped%29.jpg/500px-William_Howard_Taft_by_Pach_Brothers_%283x4_ropped%29_%28cropped%29.jpg' },
  { slug: 'gerald-ford',           url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Gerald_Ford_presidential_portrait_%28cropped%29.jpg' },
  { slug: 'george-hw-bush',        url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/George_H._W._Bush_presidential_portrait_%28cropped_5%29.jpg' },
  { slug: 'barack-obama',          url: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg' },
  // ── USC ────────────────────────────────────────────────────────────────────
  { slug: 'marc-benioff',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Marc_Benioff.jpg/500px-Marc_Benioff.jpg' },
  { slug: 'george-lucas',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/George_Lucas_by_Gage_Skidmore.jpg/500px-George_Lucas_by_Gage_Skidmore.jpg' },
  { slug: 'will-ferrell',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Will_Ferrell_at_the_2024_Toronto_International_Film_Festival_5_%28cropped%29.jpg/500px-Will_Ferrell_at_the_2024_Toronto_International_Film_Festival_5_%28cropped%29.jpg' },
  { slug: 'shonda-rhimes',         url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/ShondaRhimes-byPhilipRomano.jpg/500px-ShondaRhimes-byPhilipRomano.jpg' },
  // ── More Stanford ──────────────────────────────────────────────────────────
  { slug: 'peter-thiel',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Peter_Thiel_by_Gage_Skidmore.jpg/500px-Peter_Thiel_by_Gage_Skidmore.jpg' },
  { slug: 'reed-hastings',         url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Re_publica_2015_-_Tag_1_%2817381870955%29_%28cropped%29.jpg/500px-Re_publica_2015_-_Tag_1_%2817381870955%29_%28cropped%29.jpg' },
  { slug: 'phil-knight',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Phil_Knight_with_Tom_Matthyssens_in_Universal_Studios_Orlando_1999_%28cropped%29.jpg/500px-Phil_Knight_with_Tom_Matthyssens_in_Universal_Studios_Orlando_1999_%28cropped%29.jpg' },
  { slug: 'condoleezza-rice',      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Condoleezza_Rice_cropped.jpg/500px-Condoleezza_Rice_cropped.jpg' },
  // ── USC Athletes ───────────────────────────────────────────────────────────
  { slug: 'marcus-allen',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Pro_Football_Hall_of_Famer_Speaks_at_Award_Ceremony_130104-A-GX635-439_%28cropped%29.jpg/500px-Pro_Football_Hall_of_Famer_Speaks_at_Award_Ceremony_130104-A-GX635-439_%28cropped%29.jpg' },
  { slug: 'reggie-bush',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Reggie_Bush_by_Gage_Skidmore.jpg/500px-Reggie_Bush_by_Gage_Skidmore.jpg' },
  // ── UCLA Athletes ──────────────────────────────────────────────────────────
  { slug: 'kareem-abdul-jabbar',   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Kareem_Abdul-Jabbar_May_2014.jpg/500px-Kareem_Abdul-Jabbar_May_2014.jpg' },
  { slug: 'jackie-robinson',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Jackie_Robinson%2C_NPG_97_135.jpg/500px-Jackie_Robinson%2C_NPG_97_135.jpg' },
  { slug: 'bill-walton',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bill_walton_blazers_photo.jpg/500px-Bill_walton_blazers_photo.jpg' },
  // ── International Athletes ─────────────────────────────────────────────────
  { slug: 'eileen-gu',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/%E8%B0%B7%E7%88%B1%E5%87%8C%E4%BA%8E2023-24%E8%B5%9B%E5%AD%A3%E5%9B%BD%E9%99%85%E9%9B%AA%E8%81%94U%E5%9E%8B%E5%9C%BA%E5%9C%B0%E4%B8%96%E7%95%8C%E6%9D%AF%E4%BA%91%E9%A1%B6%E7%AB%99%E6%AF%94%E8%B5%9B%E5%A4%BA%E5%86%A0.png/500px-%E8%B0%B7%E7%88%B1%E5%87%8C%E4%BA%8E2023-24%E8%B5%9B%E5%AD%A3%E5%9B%BD%E9%99%85%E9%9B%AA%E8%81%94U%E5%9E%8B%E5%9C%BA%E5%9C%B0%E4%B8%96%E7%95%8C%E6%9D%AF%E4%BA%91%E9%A1%B6%E7%AB%99%E6%AF%94%E8%B5%9B%E5%A4%BA%E5%86%A0.png' },
]

const SITE_IMAGES: { dest: string; url: string }[] = [
  { dest: 'images/college-graduate-hero.jpg',        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=840&q=80&fit=crop&auto=format' },
  { dest: 'images/students-campus-background.jpg',   url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80&fit=crop&auto=format' },
  { dest: 'images/northwestern-university-logo.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Northwestern_Wildcats_logo.svg/200px-Northwestern_Wildcats_logo.svg.png' },
  { dest: 'images/usc-trojans-logo.png',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/USC_Trojans_logo.svg/200px-USC_Trojans_logo.svg.png' },
  { dest: 'images/columbia-lions-logo.png',          url: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Columbia_Lions_logo.svg/200px-Columbia_Lions_logo.svg.png' },
]

async function saveImage(url: string, destAbs: string, force = false): Promise<{ ok: boolean; kb?: number; error?: string }> {
  if (!force && fs.existsSync(destAbs)) {
    const kb = Math.round(fs.statSync(destAbs).size / 1024)
    return { ok: true, kb }
  }
  try {
    const res = await fetch(url, { headers: headersFor(url) })
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 500) return { ok: false, error: `Too small (${buf.length}b)` }
    fs.mkdirSync(path.dirname(destAbs), { recursive: true })
    fs.writeFileSync(destAbs, buf)
    return { ok: true, kb: Math.round(buf.length / 1024) }
  } catch (e: unknown) {
    return { ok: false, error: String(e) }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const force = searchParams.get('force') === 'true'
  const onlySlug = searchParams.get('slug') // optional: download just one slug

  const results: Record<string, { ok: boolean; kb?: number; error?: string }> = {}

  // Download alumni photos (with delay to avoid 429 rate limiting)
  const photosToProcess = onlySlug
    ? ALUMNI_PHOTOS.filter(p => p.slug === onlySlug)
    : ALUMNI_PHOTOS

  for (const { slug, url } of photosToProcess) {
    const dest = path.join(PUBLIC, 'alumni', `${slug}.jpg`)
    results[`alumni/${slug}.jpg`] = await saveImage(url, dest, force)
    await new Promise(r => setTimeout(r, 500))
  }

  // Download site images
  for (const { dest, url } of SITE_IMAGES) {
    const destAbs = path.join(PUBLIC, dest)
    results[dest] = await saveImage(url, destAbs)
    await new Promise(r => setTimeout(r, 2000))
  }

  // Patch content.json — update alumni photo paths to local /alumni/slug.jpg
  const successfulSlugs = ALUMNI_PHOTOS
    .filter(({ slug }) => results[`alumni/${slug}.jpg`]?.ok)
    .map(({ slug }) => slug)

  let patchedCount = 0
  if (successfulSlugs.length > 0) {
    const data = JSON.parse(fs.readFileSync(CONTENT_JSON, 'utf8'))
    for (const slug of successfulSlugs) {
      const alumnus = data.alumni.find((a: { slug: string }) => a.slug === slug)
      const localPath = `/alumni/${slug}.jpg`
      if (alumnus && alumnus.photo !== localPath) {
        alumnus.photo = localPath
        patchedCount++
      }
    }
    fs.writeFileSync(CONTENT_JSON, JSON.stringify(data, null, 2))
  }

  const ok    = Object.values(results).filter(r => r.ok).length
  const fail  = Object.values(results).filter(r => !r.ok).length

  return NextResponse.json({
    summary: { ok, fail, contentJsonPatched: patchedCount },
    results,
  }, { status: 200 })
}
