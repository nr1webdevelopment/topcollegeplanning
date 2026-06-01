import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// All 59 post slugs mapped to verified 800px Wikimedia Commons thumbnail URLs.
// Thumbnails are guaranteed JPEGs (no SVGs), reliably served from Wikimedia CDN.
const SLUG_TO_DIRECT_URL: Record<string, string> = {
  // ── Commencement speakers ──────────────────────────────────────────────────
  'elon-musk-usc-commencement-speech-2014':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg/800px-Elon_Musk_-_54820081119_%28cropped%29.jpg',
  'conan-obrien-addresses-the-harvard-class-of-2000':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Conan_O%27Brien_at_the_2025_Sundance_Film_Festival_03_%28cropped%29.jpg/800px-Conan_O%27Brien_at_the_2025_Sundance_Film_Festival_03_%28cropped%29.jpg',
  '2024-commencement-address-by-roger-federer-at-dartmouth':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Roger_Federer_2015_%28cropped%29.jpg/800px-Roger_Federer_2015_%28cropped%29.jpg',
  'president-obama-at-michigan-commencement-2010':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/800px-President_Barack_Obama.jpg',
  'president-obama-speaks-at-barnard-college-commencement-ceremony':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/800px-President_Barack_Obama.jpg',

  // ── Business school / MBA / Career ────────────────────────────────────────
  'executive-education':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Columbia_University_-_Low_Memorial_Library_%2848170370506%29.jpg/800px-Columbia_University_-_Low_Memorial_Library_%2848170370506%29.jpg',
  'what-is-an-mba':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Harper_Center_by_Matthew_Bisanz.jpg/800px-Harper_Center_by_Matthew_Bisanz.jpg',
  'm7-business-school-chicago-booth':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Harper_Center_by_Matthew_Bisanz.jpg/800px-Harper_Center_by_Matthew_Bisanz.jpg',
  'career':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/SeniorsBIA.JPG/800px-SeniorsBIA.JPG',

  // ── Stanford ───────────────────────────────────────────────────────────────
  'alumni-spotlight-feliciano-at-stanford':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hoover_Tower_Stanford_January_2013.jpg/800px-Hoover_Tower_Stanford_January_2013.jpg',
  'steve-jobs-2005-stanford-commencement-address':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Stanford_Memorial_Church_%282025%29-L1007381.jpg/800px-Stanford_Memorial_Church_%282025%29-L1007381.jpg',
  'stanford-success-a-roadmap-for-international-students-applying-and-excelling-at-stanford-university':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hoover_Tower_Stanford_January_2013.jpg/800px-Hoover_Tower_Stanford_January_2013.jpg',

  // ── Ivy League general ─────────────────────────────────────────────────────
  'what-are-ivy-league-schools':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/The_iconic_Van_Wickle_Gates_at_Brown_University%2C_one_of_America%27s_prestigious_%22Ivy_League%22_colleges%2C_in_Providence%2C_the_capital_of%2C_and_largest_city_in%2C_Rhode_Island.jpg/800px-thumbnail.jpg',
  'is-there-an-exchange-program-within-the-ivy-league':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/The_iconic_Van_Wickle_Gates_at_Brown_University%2C_one_of_America%27s_prestigious_%22Ivy_League%22_colleges%2C_in_Providence%2C_the_capital_of%2C_and_largest_city_in%2C_Rhode_Island.jpg/800px-thumbnail.jpg',
  'what-is-ivy-day':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/The_iconic_Van_Wickle_Gates_at_Brown_University%2C_one_of_America%27s_prestigious_%22Ivy_League%22_colleges%2C_in_Providence%2C_the_capital_of%2C_and_largest_city_in%2C_Rhode_Island.jpg/800px-thumbnail.jpg',

  // ── Harvard ────────────────────────────────────────────────────────────────
  'a-comprehensive-guide-to-applying-to-harvard-university-as-an-international-student':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/WidenerLibrary_HarvardUniversity_Springtime.jpg/800px-WidenerLibrary_HarvardUniversity_Springtime.jpg',
  'bill-gates-harvard-commencement-address-2007':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/WidenerLibrary_HarvardUniversity_Springtime.jpg/800px-WidenerLibrary_HarvardUniversity_Springtime.jpg',
  'facebook-founder-mark-zuckerberg-commencement-address-harvard-commencement-2017':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/WidenerLibrary_HarvardUniversity_Springtime.jpg/800px-WidenerLibrary_HarvardUniversity_Springtime.jpg',

  // ── Columbia ───────────────────────────────────────────────────────────────
  'columbia-calling-a-handbook-for-international-students-applying-to-columbia-university':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Columbia_University_-_Low_Memorial_Library_%2848170370506%29.jpg/800px-Columbia_University_-_Low_Memorial_Library_%2848170370506%29.jpg',

  // ── Princeton ──────────────────────────────────────────────────────────────
  'unveiling-the-secrets-to-excellence-at-princeton-university':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Cannon_Green_and_Nassau_Hall%2C_Princeton_University.jpg/800px-Cannon_Green_and_Nassau_Hall%2C_Princeton_University.jpg',

  // ── UCLA ───────────────────────────────────────────────────────────────────
  'ucla-uncovered-a-guide-for-international-students-applying-to-the-university-of-california-los-angeles':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Royce_Hall_edit.jpg/800px-Royce_Hall_edit.jpg',
  'uc-personal-insight-questions-how-to-write-essays-that-get-you-in':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Royce_Hall_edit.jpg/800px-Royce_Hall_edit.jpg',

  // ── UC Berkeley ────────────────────────────────────────────────────────────
  'berkeley-bound-a-guide-for-international-students-applying-to-the-university-of-california-berkeley':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Campanile_Hi-Res_-_reduced_file_size.jpg/800px-Campanile_Hi-Res_-_reduced_file_size.jpg',
  'uc-admissions-for-out-of-state-students':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Campanile_Hi-Res_-_reduced_file_size.jpg/800px-Campanile_Hi-Res_-_reduced_file_size.jpg',
  'international-students-guide-to-uc-admissions':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Campanile_Hi-Res_-_reduced_file_size.jpg/800px-Campanile_Hi-Res_-_reduced_file_size.jpg',
  'uc-berkeley-vs-ucla-side-by-side-comparison':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Campanile_Hi-Res_-_reduced_file_size.jpg/800px-Campanile_Hi-Res_-_reduced_file_size.jpg',
  'getting-into-uc-schools-as-a-california-resident':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Campanile_Hi-Res_-_reduced_file_size.jpg/800px-Campanile_Hi-Res_-_reduced_file_size.jpg',

  // ── MIT ────────────────────────────────────────────────────────────────────
  'mit-dreams-navigating-the-admissions-process-and-thriving-as-an-international-scholar':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/MIT_Great_Dome_doors.jpg/800px-MIT_Great_Dome_doors.jpg',
  'mark-rober-gave-the-mit-commencement-speech':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/MIT_Great_Dome_doors.jpg/800px-MIT_Great_Dome_doors.jpg',

  // ── USC ────────────────────────────────────────────────────────────────────
  'why-usc-might-be-better-than-uc-for-some-students':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg/800px-Elon_Musk_-_54820081119_%28cropped%29.jpg',
  'usc-vs-uc-financial-aid-compared-which-is-better-value':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/2015_SRNS_Family_Scholarships_%2835559759033%29.jpg/800px-2015_SRNS_Family_Scholarships_%2835559759033%29.jpg',

  // ── Pepperdine ─────────────────────────────────────────────────────────────
  'pepperdine-university-california-guide':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/MalibuAir.jpg/800px-MalibuAir.jpg',

  // ── UChicago ───────────────────────────────────────────────────────────────
  'uchicago-vs-northwestern':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Rockefeller_Chapel_by_Matthew_Bisanz.jpg/800px-Rockefeller_Chapel_by_Matthew_Bisanz.jpg',
  'charting-success-a-comprehensive-guide-to-applying-to-the-university-of-chicago-as-an-international-student':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Rockefeller_Chapel_by_Matthew_Bisanz.jpg/800px-Rockefeller_Chapel_by_Matthew_Bisanz.jpg',

  // ── Michigan ───────────────────────────────────────────────────────────────
  'michigan-mavericks-celebrating-prominent-alumni-from-the-university-of-michigan':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/The_Big_House.jpg/800px-The_Big_House.jpg',
  'the-university-of-michigan-a-tapestry-of-excellence-and-innovation':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/The_Big_House.jpg/800px-The_Big_House.jpg',
  'unlocking-potential-the-financial-gateway-to-excellence-at-the-university-of-michigan':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/The_Big_House.jpg/800px-The_Big_House.jpg',

  // ── Penn ───────────────────────────────────────────────────────────────────
  'penn-pursuits-charting-success-for-international-students-applying-to-the-university-of-pennsylvania':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Franklin_Field_aerial.jpg/800px-Franklin_Field_aerial.jpg',
  'penn-school-song-red-and-blue':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Franklin_Field_aerial.jpg/800px-Franklin_Field_aerial.jpg',
  'denzel-washington-commencement-speech-university-of-pennsylvania':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Franklin_Field_aerial.jpg/800px-Franklin_Field_aerial.jpg',

  // ── Yale ───────────────────────────────────────────────────────────────────
  'yale-journeys-navigating-admissions-and-excelling-as-an-international-scholar':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/YaleUniversity_PhelpsGate.jpg/800px-YaleUniversity_PhelpsGate.jpg',
  'tom-hanks-addresses-the-yale-class-of-2011':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/YaleUniversity_PhelpsGate.jpg/800px-YaleUniversity_PhelpsGate.jpg',
  'hillary-rodham-clinton-2018-yale-class-day-speaker':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/YaleUniversity_PhelpsGate.jpg/800px-YaleUniversity_PhelpsGate.jpg',

  // ── Notre Dame ─────────────────────────────────────────────────────────────
  'u-s-senate-confirms-nd-law-school-alum-edward-s-kiel-as-federal-judge':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Touchdown_Jesus_at_Notre_Dame.jpg/800px-Touchdown_Jesus_at_Notre_Dame.jpg',

  // ── Northwestern ───────────────────────────────────────────────────────────
  'northwestern-tops-slp-program-in-the-us':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Northwestern_University_arch_and_lake.jpg/800px-Northwestern_University_arch_and_lake.jpg',

  // ── UC Santa Barbara / San Diego ───────────────────────────────────────────
  'uc-santa-barbara-admissions-guide':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/UC_Santa_Barbara_campus_view.jpg/800px-UC_Santa_Barbara_campus_view.jpg',
  'uc-san-diego-ucsd-admissions-guide':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/UCSD-campus-aerial-view-from-south.jpg/800px-UCSD-campus-aerial-view-from-south.jpg',

  // ── Cal State / community college ─────────────────────────────────────────
  'uc-vs-csu-which-california-public-university-is-right-for-you':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/SeniorsBIA.JPG/800px-SeniorsBIA.JPG',
  'community-college-to-uc-transfer-complete-roadmap':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/SeniorsBIA.JPG/800px-SeniorsBIA.JPG',

  // ── General admissions / study tips ───────────────────────────────────────
  'how-to-submit-a-successful-college-application':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/SeniorsBIA.JPG/800px-SeniorsBIA.JPG',
  'forging-futures-the-crucial-role-of-relationships-in-university-life-and-beyond':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/SeniorsBIA.JPG/800px-SeniorsBIA.JPG',
  'building-bridges-to-success-the-importance-of-preparing-for-university-through-english-language-proficiency-and-career-focused-vocabulary':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/SeniorsBIA.JPG/800px-SeniorsBIA.JPG',
  'pursuing-excellence-spotlight-on-representative-careers-at-top-u-s-universities-for-international-students':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/2015_SRNS_Family_Scholarships_%2835559759033%29.jpg/800px-2015_SRNS_Family_Scholarships_%2835559759033%29.jpg',
  'boosting-your-uc-application-extracurriculars-research-leadership':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Kids_Camp_2015_Day_3_%2818936933418%29.jpg/800px-Kids_Camp_2015_Day_3_%2818936933418%29.jpg',
  'uc-gpa-requirements-how-uc-calculates-your-academic-record':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/SeniorsBIA.JPG/800px-SeniorsBIA.JPG',

  // ── Financial aid / scholarships ───────────────────────────────────────────
  'california-financial-aid-guide-fafsa-cal-grant-dream-act':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/2015_SRNS_Family_Scholarships_%2835559759033%29.jpg/800px-2015_SRNS_Family_Scholarships_%2835559759033%29.jpg',
  'top-scholarships-for-california-high-school-students':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/2015_SRNS_Family_Scholarships_%2835559759033%29.jpg/800px-2015_SRNS_Family_Scholarships_%2835559759033%29.jpg',

  // ── Oprah / Stanford ───────────────────────────────────────────────────────
  'oprah-speaks-to-the-stanford-class-of-2008':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hoover_Tower_Stanford_January_2013.jpg/800px-Hoover_Tower_Stanford_January_2013.jpg',

  // ── Conan / Dartmouth ──────────────────────────────────────────────────────
  'conan-obrien-delivers-dartmouths-commencement-address':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Conan_O%27Brien_at_the_2025_Sundance_Film_Festival_03_%28cropped%29.jpg/800px-Conan_O%27Brien_at_the_2025_Sundance_Film_Festival_03_%28cropped%29.jpg',
}

const WIKI_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://en.wikipedia.org/',
  'sec-fetch-dest': 'image',
  'sec-fetch-mode': 'no-cors',
  'sec-fetch-site': 'cross-site',
}

async function downloadImage(imageUrl: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(imageUrl, { headers: WIKI_HEADERS })
    if (!res.ok) return false
    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length < 5000) return false
    fs.writeFileSync(destPath, buffer)
    return true
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slugParam = searchParams.get('slug')
  const force = searchParams.get('force') === 'true'

  const blogDir = path.join(process.cwd(), 'public', 'images', 'blog')
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true })

  const allSlugs = Object.keys(SLUG_TO_DIRECT_URL)
  const slugs = slugParam ? [slugParam] : allSlugs

  const results: Record<string, string> = {}

  for (const slug of slugs) {
    const destPath = path.join(blogDir, `${slug}.jpg`)
    if (!force && fs.existsSync(destPath)) {
      results[slug] = 'exists'
      continue
    }

    const url = SLUG_TO_DIRECT_URL[slug]
    if (!url) { results[slug] = 'no_url'; continue }

    const ok = await downloadImage(url, destPath)
    results[slug] = ok ? 'downloaded' : `fail:${url.slice(60, 120)}`
  }

  const succeeded = Object.values(results).filter(v => v === 'downloaded' || v === 'exists').length
  return NextResponse.json({ succeeded, total: slugs.length, results })
}
