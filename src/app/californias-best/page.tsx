'use client'
import { posts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

// ── FEATURED SCHOOL TILES ────────────────────────────────────────────────────
const featuredSchools = [
  { name: 'Stanford University',    type: 'Private',      city: 'Stanford',      rank: '#3 National',      logo: '/images/logos/stanford.svg',        profileSlug: 'stanford',         articleSlug: null },
  { name: 'UC Berkeley',            type: 'Public UC',    city: 'Berkeley',      rank: '#1 Public',        logo: '/images/logos/uc-berkeley.svg',     profileSlug: 'uc-berkeley',      articleSlug: 'berkeley-bound-a-guide-for-international-students-applying-to-the-university-of-california-berkeley' },
  { name: 'Caltech',                type: 'Private',      city: 'Pasadena',      rank: '#9 National',      logo: '/images/logos/caltech.svg',         profileSlug: 'caltech',          articleSlug: null },
  { name: 'UCLA',                   type: 'Public UC',    city: 'Los Angeles',   rank: '#2 Public',        logo: '/images/logos/ucla.svg',            profileSlug: 'ucla',             articleSlug: 'ucla-uncovered-a-guide-for-international-students-applying-to-the-university-of-california-los-angeles' },
  { name: 'USC',                    type: 'Private',      city: 'Los Angeles',   rank: 'Top 25 National',  logo: '/images/logos/usc.svg',             profileSlug: 'usc',              articleSlug: 'why-usc-might-be-better-than-uc-for-some-students' },
  { name: 'UC San Diego',           type: 'Public UC',    city: 'La Jolla',      rank: 'Top 15 Public',    logo: '/images/logos/uc-san-diego.png',    profileSlug: 'uc-san-diego',     articleSlug: 'uc-san-diego-ucsd-admissions-guide' },
  { name: 'UC Santa Barbara',       type: 'Public UC',    city: 'Santa Barbara', rank: 'Top 10 Public',    logo: '/images/logos/uc-santa-barbara.png', profileSlug: 'uc-santa-barbara', articleSlug: 'uc-santa-barbara-admissions-guide' },
  { name: 'Pepperdine University',  type: 'Private',      city: 'Malibu',        rank: 'Top 60 National',  logo: '/images/logos/pepperdine.png',      profileSlug: 'pepperdine',       articleSlug: 'pepperdine-university-california-guide' },
  { name: 'UC Davis',               type: 'Public UC',    city: 'Davis',         rank: 'Top 40 National',  logo: '/images/logos/uc-davis.png',        profileSlug: 'uc-davis',         articleSlug: null },
  { name: 'UC Irvine',              type: 'Public UC',    city: 'Irvine',        rank: 'Top 35 Public',    logo: '/images/logos/uc-irvine.png',       profileSlug: 'uc-irvine',        articleSlug: null },
  { name: 'Pomona College',         type: 'Liberal Arts', city: 'Claremont',     rank: '#4 Liberal Arts',  logo: '/images/logos/pomona.svg',          profileSlug: 'pomona',           articleSlug: null },
  { name: 'Harvey Mudd College',    type: 'Liberal Arts', city: 'Claremont',     rank: '#2 Engineering',   logo: '/images/logos/harvey-mudd.png',     profileSlug: 'harvey-mudd',      articleSlug: null },
]

// ── TOP 100 LIST ─────────────────────────────────────────────────────────────
const top100 = {
  uc: [
    { rank: 1,  name: 'UC Berkeley',        city: 'Berkeley',       notes: 'Flagship; #1 public nationally',        slug: 'berkeley-bound-a-guide-for-international-students-applying-to-the-university-of-california-berkeley' },
    { rank: 2,  name: 'UCLA',               city: 'Los Angeles',    notes: '#2 public; top medical + film school',  slug: 'ucla-uncovered-a-guide-for-international-students-applying-to-the-university-of-california-los-angeles' },
    { rank: 3,  name: 'UC San Diego',       city: 'La Jolla',       notes: 'Top STEM + research; 6 Nobel laureates', slug: 'uc-san-diego-ucsd-admissions-guide' },
    { rank: 4,  name: 'UC Santa Barbara',   city: 'Santa Barbara',  notes: 'Top physics + environmental sciences',  slug: 'uc-santa-barbara-admissions-guide' },
    { rank: 5,  name: 'UC Davis',           city: 'Davis',          notes: 'Top agriculture, vet med, biology',     slug: null },
    { rank: 6,  name: 'UC Irvine',          city: 'Irvine',         notes: 'Top CS, health sciences, business',     slug: null },
    { rank: 7,  name: 'UC Santa Cruz',      city: 'Santa Cruz',     notes: 'Strong sciences, arts, and CS',        slug: null },
    { rank: 8,  name: 'UC Riverside',       city: 'Riverside',      notes: 'TAG school; growing research profile',  slug: null },
    { rank: 9,  name: 'UC Merced',          city: 'Merced',         notes: 'Newest UC; accessible + research-focused', slug: null },
  ],
  private: [
    { rank: 1,  name: 'Stanford University',          city: 'Stanford',        notes: '#3 national; top engineering, CS, business', slug: null },
    { rank: 2,  name: 'Caltech',                      city: 'Pasadena',        notes: '#9 national; world\'s top STEM institution',  slug: null },
    { rank: 3,  name: 'USC',                          city: 'Los Angeles',     notes: 'Top 25 national; film, business, engineering', slug: 'why-usc-might-be-better-than-uc-for-some-students' },
    { rank: 4,  name: 'Pomona College',               city: 'Claremont',       notes: '#4 liberal arts nationally',                 slug: null },
    { rank: 5,  name: 'Harvey Mudd College',          city: 'Claremont',       notes: 'Top STEM liberal arts; highest-earning grads', slug: null },
    { rank: 6,  name: 'Claremont McKenna College',    city: 'Claremont',       notes: 'Top 10 liberal arts; finance + government',  slug: null },
    { rank: 7,  name: 'Scripps College',              city: 'Claremont',       notes: 'Top women\'s liberal arts college',           slug: null },
    { rank: 8,  name: 'Pitzer College',               city: 'Claremont',       notes: 'Social justice, environmental focus',        slug: null },
    { rank: 9,  name: 'Pepperdine University',        city: 'Malibu',          notes: 'Top 60 national; strong business + law',     slug: 'pepperdine-university-california-guide' },
    { rank: 10, name: 'Loyola Marymount University',  city: 'Los Angeles',     notes: 'Top LA private; film, business, law',        slug: null },
    { rank: 11, name: 'Santa Clara University',       city: 'Santa Clara',     notes: 'Jesuit; top Silicon Valley pipeline school', slug: null },
    { rank: 12, name: 'University of San Francisco',  city: 'San Francisco',   notes: 'Jesuit; social justice focus, great location', slug: null },
    { rank: 13, name: 'Occidental College',           city: 'Los Angeles',     notes: 'Liberal arts; top political science',        slug: null },
    { rank: 14, name: 'University of the Pacific',    city: 'Stockton',        notes: 'Oldest CA university; strong pharmacy + music', slug: null },
    { rank: 15, name: 'Chapman University',           city: 'Orange',          notes: 'Film, business, and law programs',           slug: null },
    { rank: 16, name: 'Biola University',             city: 'La Mirada',       notes: 'Christian university; strong nursing + film', slug: null },
    { rank: 17, name: 'Azusa Pacific University',     city: 'Azusa',           notes: 'Christian; nursing + business focus',        slug: null },
    { rank: 18, name: 'Mills College at Northeastern', city: 'Oakland',        notes: 'Women-founded; social justice + arts',       slug: null },
    { rank: 19, name: 'Whittier College',             city: 'Whittier',        notes: 'Liberal arts; diverse student body',         slug: null },
    { rank: 20, name: 'Point Loma Nazarene University', city: 'San Diego',     notes: 'Christian; beautiful coastal campus',       slug: null },
  ],
  csu: [
    { rank: 1,  name: 'Cal Poly San Luis Obispo',  city: 'San Luis Obispo', notes: 'Top engineering + architecture; "learn by doing"', slug: null },
    { rank: 2,  name: 'Cal Poly Pomona',           city: 'Pomona',          notes: 'STEM + business; polytechnic focus',              slug: null },
    { rank: 3,  name: 'San Diego State University', city: 'San Diego',      notes: 'Large research CSU; strong business + health',    slug: null },
    { rank: 4,  name: 'Cal State Long Beach',       city: 'Long Beach',     notes: 'Most applied-to CSU; diverse + urban',            slug: null },
    { rank: 5,  name: 'San Jose State University',  city: 'San Jose',       notes: 'Silicon Valley campus; top engineering pipeline', slug: null },
    { rank: 6,  name: 'Cal State Fullerton',        city: 'Fullerton',      notes: 'Large OC campus; business + communications',      slug: null },
    { rank: 7,  name: 'Cal State Northridge',       city: 'Northridge',     notes: 'Strong business, engineering + education',        slug: null },
    { rank: 8,  name: 'SF State University',        city: 'San Francisco',  notes: 'Urban campus; arts, social justice, media',       slug: null },
    { rank: 9,  name: 'Cal State Los Angeles',      city: 'Los Angeles',    notes: 'Diverse + urban; strong health sciences',         slug: null },
    { rank: 10, name: 'Fresno State',               city: 'Fresno',         notes: 'Central Valley campus; agriculture + athletics',  slug: null },
    { rank: 11, name: 'Cal State Bakersfield',      city: 'Bakersfield',    notes: 'Growing campus; nursing + business',              slug: null },
    { rank: 12, name: 'Sonoma State University',    city: 'Rohnert Park',   notes: 'Wine region campus; arts + environment',          slug: null },
    { rank: 13, name: 'Humboldt State (Cal Poly)',  city: 'Arcata',         notes: 'Recently reclassified as Cal Poly; environmental', slug: null },
    { rank: 14, name: 'Cal State Sacramento',       city: 'Sacramento',     notes: 'Capital city campus; public administration',      slug: null },
    { rank: 15, name: 'Cal State East Bay',         city: 'Hayward',        notes: 'Bay Area access; diverse student population',     slug: null },
    { rank: 16, name: 'San Luis Obispo (CSU-adjacent)', city: 'San Luis Obispo', notes: 'See Cal Poly SLO above',                  slug: null },
    { rank: 17, name: 'Cal State Dominguez Hills',  city: 'Carson',         notes: 'South LA; nursing + health admin programs',       slug: null },
    { rank: 18, name: 'Cal Maritime Academy',       city: 'Vallejo',        notes: 'Specialized maritime engineering + logistics',    slug: null },
    { rank: 19, name: 'Cal State Channel Islands',  city: 'Camarillo',      notes: 'Small + innovative; interdisciplinary focus',     slug: null },
    { rank: 20, name: 'Cal State San Marcos',       city: 'San Marcos',     notes: 'Growing SoCal campus; nursing + business',        slug: null },
  ],
  community: [
    'De Anza College (Cupertino) — Top Silicon Valley CC; exceptional UC transfer rate',
    'Santa Monica College — Top transfer to UCLA; large international student body',
    'Diablo Valley College (Pleasant Hill) — High UC transfer rate, Bay Area location',
    'Pasadena City College — Historic CC with strong UC transfer to Caltech and UCLA',
    'Foothill College (Los Altos Hills) — Strong STEM and health sciences programs',
    'Orange Coast College (Costa Mesa) — Large CC with excellent transfer outcomes',
    'Mount San Antonio College (Walnut) — Largest single-campus CC in California',
    'Cypress College — Strong business and health science programs',
    'Irvine Valley College — Near UC Irvine; excellent TAG transfer support',
    'San Diego Mesa College — Top San Diego CC for UC San Diego transfers',
    'City College of San Francisco — Largest CC in CA; diverse programs',
    'Skyline College (San Bruno) — Bay Area; strong STEM pipeline',
  ],
}

// California articles
const caArticles = posts.filter(p =>
  p.categories.includes('California') ||
  p.title.toLowerCase().includes('california') ||
  p.title.toLowerCase().includes('ucla') ||
  p.title.toLowerCase().includes('berkeley') ||
  p.title.toLowerCase().includes('usc') ||
  p.title.toLowerCase().includes(' uc ') ||
  p.slug.includes('uc-') ||
  p.slug.includes('california') ||
  p.slug.includes('pepperdine') ||
  p.slug.includes('santa-barbara') ||
  p.slug.includes('san-diego')
)

export default function CaliforniasBestPage() {
  const { t } = useLanguage()
  const typeColor = (type: string) => {
    if (type === 'Public UC') return 'bg-blue-100 text-blue-700'
    if (type === 'Private') return 'bg-orange-100 text-orange-700'
    if (type === 'Liberal Arts') return 'bg-purple-100 text-purple-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative text-white py-20 overflow-hidden">
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1800&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Navy overlay at 50% opacity */}
        <div className="absolute inset-0 bg-navy opacity-80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-3">{t('West Coast Excellence', '西海岸顶尖学府', 'Excelencia en la Costa Oeste')}</p>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">{t("California's Best", '加州名校', 'Lo Mejor de California')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed mb-6">
            {t(
              "From Stanford and Caltech to the UC system and liberal arts gems in Claremont — California has more world-class universities per square mile than anywhere else on Earth.",
              '从斯坦福、加州理工到加州大学系统，再到克莱蒙特的文理学院精品——加州拥有全球密度最高的世界级大学。',
              'De Stanford y Caltech al sistema UC y las joyas de artes liberales en Claremont — California tiene más universidades de clase mundial por kilómetro cuadrado que cualquier otro lugar del mundo.'
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#top100" className="btn-primary">{t('View Top 100 List', '查看百强榜单', 'Ver Lista de las 100 Mejores')}</a>
            <Link href="/californias-best/cost-calculator" className="btn-outline text-white border-white hover:bg-white hover:text-navy">
              {t('Cost Calculator', '费用计算器', 'Calculadora de Costos')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── FEATURED SCHOOLS GRID ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="section-title mb-2">{t('Featured California Schools', '加州精选院校', 'Mejores Escuelas de California')}</h2>
        <p className="text-gray-500 mb-8">{t('Click any school to read our full admissions guide.', '点击任意院校，阅读完整申请指南。', 'Haz clic en cualquier escuela para leer nuestra guía completa de admisión.')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {featuredSchools.map(school => {
            const inner = (
              <>
                <div className="h-14 flex items-center justify-center mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={school.logo} alt={school.name} className="max-h-12 max-w-[80%] object-contain" />
                </div>
                <h3 className="font-bold text-navy text-sm mb-1 leading-tight group-hover:text-brand-orange transition-colors">{school.name}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 ${typeColor(school.type)}`}>
                  {school.type}
                </span>
                <p className="text-xs text-gray-400 mt-1">{school.city}</p>
                <p className="text-xs text-gray-500 mt-0.5">{school.rank}</p>
                <p className="text-xs text-brand-orange font-bold mt-2">{t('View Profile →', '查看详情 →', 'Ver Perfil →')}</p>
              </>
            )
            return (
              <Link
                key={school.name}
                href={`/californias-best/${school.profileSlug}`}
                className="group bg-gray-soft p-5 text-center hover:shadow-md hover:bg-white border border-transparent hover:border-brand-orange transition-all"
              >
                {inner}
              </Link>
            )
          })}
        </div>

        {/* Calculator CTA */}
        <div className="bg-brand-orange text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-14">
          <div>
            <div className="font-black text-lg">{t('Calculate Your True Cost of College', '计算您的真实大学费用', 'Calcula el Costo Real de la Universidad')}</div>
            <div className="text-orange-100 text-sm">{t('Compare UC, CSU, and private school costs side-by-side with our free calculator.', '使用我们的免费计算器，并排比较加州大学、州立大学和私立学校的费用。', 'Compara los costos de UC, CSU y escuelas privadas lado a lado con nuestra calculadora gratuita.')}</div>
          </div>
          <Link href="/college-cost-calculator" className="flex-shrink-0 bg-white text-brand-orange font-black uppercase tracking-wide text-sm px-6 py-3 hover:bg-gray-100 transition-colors">
            {t('Open Calculator →', '打开计算器 →', 'Abrir Calculadora →')}
          </Link>
        </div>

        {/* ── TOP 100 LIST ─────────────────────────────────────── */}
        <div id="top100">
          <h2 className="section-title mb-2">{t('Top 100 California Colleges & Universities', '加州百强大学排行', 'Las 100 Mejores Universidades de California')}</h2>
          <p className="text-gray-500 mb-10 max-w-3xl">
            {t(
              'Ranked by academic reputation, research output, graduate outcomes, and program strength. Schools with a guide link have full admissions breakdowns — click to read.',
              '按学术声誉、科研产出、毕业生成果及专业实力综合排名。有链接的院校提供完整申请分析，点击阅读。',
              'Clasificadas por reputación académica, producción de investigación, resultados de egresados y fortaleza de programas. Las escuelas con enlace tienen análisis completos de admisión — haz clic para leer.'
            )}
          </p>

          {/* UC System */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-blue-600" />
              <h3 className="text-xl font-black text-navy">{t('University of California System', '加州大学系统', 'Sistema de la Universidad de California')}</h3>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5">{t('PUBLIC', '公立', 'PÚBLICA')}</span>
            </div>
            <div className="space-y-1">
              {top100.uc.map(s => (
                <div key={s.name} className="flex items-start gap-4 py-3 border-b border-gray-50 hover:bg-gray-50 px-2 transition-colors">
                  <span className="text-brand-orange font-black text-sm w-6 flex-shrink-0 mt-0.5">{s.rank}</span>
                  <div className="flex-1 min-w-0">
                    {s.slug ? (
                      <Link href={`/blog/${s.slug}`} className="font-bold text-navy hover:text-brand-orange transition-colors">
                        {s.name}
                      </Link>
                    ) : (
                      <span className="font-bold text-navy">{s.name}</span>
                    )}
                    <span className="text-gray-400 text-xs ml-2">{s.city}, CA</span>
                    {s.slug && <span className="ml-2 text-xs text-brand-orange font-bold">→ {t('Read Guide', '阅读指南', 'Leer Guía')}</span>}
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs hidden sm:block">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Private Universities */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-orange-500" />
              <h3 className="text-xl font-black text-navy">{t('Private Universities', '私立大学', 'Universidades Privadas')}</h3>
              <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5">{t('PRIVATE', '私立', 'PRIVADA')}</span>
            </div>
            <div className="space-y-1">
              {top100.private.map(s => (
                <div key={s.name} className="flex items-start gap-4 py-3 border-b border-gray-50 hover:bg-gray-50 px-2 transition-colors">
                  <span className="text-brand-orange font-black text-sm w-6 flex-shrink-0 mt-0.5">{s.rank}</span>
                  <div className="flex-1 min-w-0">
                    {s.slug ? (
                      <Link href={`/blog/${s.slug}`} className="font-bold text-navy hover:text-brand-orange transition-colors">
                        {s.name}
                      </Link>
                    ) : (
                      <span className="font-bold text-navy">{s.name}</span>
                    )}
                    <span className="text-gray-400 text-xs ml-2">{s.city}, CA</span>
                    {s.slug && <span className="ml-2 text-xs text-brand-orange font-bold">→ {t('Read Guide', '阅读指南', 'Leer Guía')}</span>}
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs hidden sm:block">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CSU System */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-green-600" />
              <h3 className="text-xl font-black text-navy">{t('California State University System', '加州州立大学系统', 'Sistema de la Universidad Estatal de California')}</h3>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5">{t('PUBLIC CSU', '公立州立', 'CSU PÚBLICA')}</span>
            </div>
            <div className="space-y-1">
              {top100.csu.map(s => (
                <div key={s.name} className="flex items-start gap-4 py-3 border-b border-gray-50 hover:bg-gray-50 px-2 transition-colors">
                  <span className="text-brand-orange font-black text-sm w-6 flex-shrink-0 mt-0.5">{s.rank}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-navy">{s.name}</span>
                    <span className="text-gray-400 text-xs ml-2">{s.city}, CA</span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs hidden sm:block">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Community Colleges */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-purple-600" />
              <h3 className="text-xl font-black text-navy">{t('Top Community Colleges (Transfer Pathways)', '顶尖社区学院（转学通道）', 'Mejores Community Colleges (Transferencias)')}</h3>
              <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5">CCC</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{t("California's community colleges offer guaranteed pathways to UC and CSU campuses through TAG and IGETC. These are the top performers for UC transfers.", '加州社区学院通过TAG和IGETC项目提供升读加州大学和州立大学的保证通道，以下是在加大转学方面表现最优的院校。', 'Los community colleges de California ofrecen vías garantizadas a las UC y CSU a través de TAG e IGETC. Estos son los mejores en transferencias a la UC.')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {top100.community.map((s, i) => (
                <div key={i} className="flex items-start gap-3 py-2 px-3 bg-gray-50 border border-gray-100">
                  <span className="text-brand-orange font-black text-xs w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-gray-700">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CALIFORNIA ARTICLES ───────────────────────────────── */}
        <div className="border-t border-gray-100 pt-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title mb-0">{t('California Admissions Guides', '加州申请指南', 'Guías de Admisión a California')}</h2>
            <Link href="/blog" className="text-brand-orange font-bold text-sm uppercase tracking-wide hover:text-brand-orange-dark">
              {t('View All →', '查看全部 →', 'Ver Todo →')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caArticles.slice(0, 9).map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
