'use client'
import { posts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

// ── TOP MIDWEST (US News National Top 50) ────────────────────────────────────
const topMidwestSchools = [
  {
    name: 'University of Chicago',
    shortName: 'UChicago',
    type: 'Private',
    city: 'Chicago, IL',
    nationalRank: '#6',
    acceptRate: '5%',
    color: '#800000',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/79/University_of_Chicago_shield.svg/250px-University_of_Chicago_shield.svg.png',
    strength: 'Economics, Law, Social Sciences',
    profileSlug: 'uchicago',
  },
  {
    name: 'Northwestern University',
    shortName: 'Northwestern',
    type: 'Private',
    city: 'Evanston, IL',
    nationalRank: '#9',
    acceptRate: '7%',
    color: '#4E2A84',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Northwestern_University_seal.svg/250px-Northwestern_University_seal.svg.png',
    strength: 'Journalism, Law, Engineering',
    profileSlug: 'northwestern',
  },
  {
    name: 'University of Notre Dame',
    shortName: 'Notre Dame',
    type: 'Private',
    city: 'South Bend, IN',
    nationalRank: '#20',
    acceptRate: '13%',
    color: '#0C2340',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/University_of_Notre_Dame_seal_%282%29.svg/250px-University_of_Notre_Dame_seal_%282%29.svg.png',
    strength: 'Business, Law, Engineering',
    profileSlug: 'notre-dame',
  },
  {
    name: 'Carnegie Mellon University',
    shortName: 'CMU',
    type: 'Private',
    city: 'Pittsburgh, PA',
    nationalRank: '#22',
    acceptRate: '11%',
    color: '#C41230',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Carnegie_Mellon_University_seal.svg/250px-Carnegie_Mellon_University_seal.svg.png',
    strength: 'CS, Robotics, Engineering, Drama',
    profileSlug: 'cmu',
  },
  {
    name: 'University of Pittsburgh',
    shortName: 'Pitt',
    type: 'Public',
    city: 'Pittsburgh, PA',
    nationalRank: '#54',
    acceptRate: '49%',
    color: '#003594',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fb/University_of_Pittsburgh_seal.svg/250px-University_of_Pittsburgh_seal.svg.png',
    strength: 'Medicine, Public Health, Engineering',
    profileSlug: 'pitt',
  },
  {
    name: 'University of Michigan',
    shortName: 'Michigan',
    type: 'Public',
    city: 'Ann Arbor, MI',
    nationalRank: '#23',
    acceptRate: '17%',
    color: '#00274C',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Seal_of_the_University_of_Michigan.svg/250px-Seal_of_the_University_of_Michigan.svg.png',
    strength: 'Law, Business, Engineering, Medicine',
    profileSlug: 'michigan',
  },
  {
    name: 'Washington Univ. in St. Louis',
    shortName: 'Wash U',
    type: 'Private',
    city: 'St. Louis, MO',
    nationalRank: '#24',
    acceptRate: '13%',
    color: '#A51417',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/WashU_St._Louis_seal.svg/250px-WashU_St._Louis_seal.svg.png',
    strength: 'Medicine, Social Work, Business',
    profileSlug: 'washu',
  },
  {
    name: 'Univ. of Illinois Urbana-Champaign',
    shortName: 'UIUC',
    type: 'Public',
    city: 'Champaign, IL',
    nationalRank: '#35',
    acceptRate: '45%',
    color: '#E84A27',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/University_of_Illinois_seal.svg/250px-University_of_Illinois_seal.svg.png',
    strength: 'CS, Engineering, Business',
    profileSlug: 'uiuc',
  },
  {
    name: 'University of Wisconsin–Madison',
    shortName: 'UW–Madison',
    type: 'Public',
    city: 'Madison, WI',
    nationalRank: '#41',
    acceptRate: '49%',
    color: '#C5050C',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Seal_of_the_University_of_Wisconsin.svg/250px-Seal_of_the_University_of_Wisconsin.svg.png',
    strength: 'Research, Agriculture, Education',
    profileSlug: 'wisconsin',
  },
  {
    name: 'Ohio State University',
    shortName: 'Ohio State',
    type: 'Public',
    city: 'Columbus, OH',
    nationalRank: '#49',
    acceptRate: '54%',
    color: '#BA0C2F',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Ohio_State_University_seal.svg/250px-Ohio_State_University_seal.svg.png',
    strength: 'Business, Engineering, Research',
    profileSlug: 'ohio-state',
  },
]

// ── FEATURED SCHOOLS ─────────────────────────────────────────────────────────
const featuredSchools = [
  { name: 'Purdue University',           type: 'Public',       city: 'W. Lafayette, IN',  rank: '#53 National',     logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/61/Purdue_University_seal.svg/250px-Purdue_University_seal.svg.png',        profileSlug: 'purdue' },
  { name: 'University of Minnesota',     type: 'Public',       city: 'Minneapolis, MN',   rank: '#56 National',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Seal_of_the_University_of_Minnesota.svg/250px-Seal_of_the_University_of_Minnesota.svg.png',     profileSlug: 'minnesota' },
  { name: 'Michigan State University',   type: 'Public',       city: 'East Lansing, MI',  rank: '#80 National',     logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Michigan_State_University_seal.svg/250px-Michigan_State_University_seal.svg.png',           profileSlug: 'msu' },
  { name: 'Indiana University',          type: 'Public',       city: 'Bloomington, IN',   rank: '#116 National',    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Indiana_University_seal.svg/250px-Indiana_University_seal.svg.png',       profileSlug: 'indiana' },
  { name: 'Case Western Reserve',        type: 'Private',      city: 'Cleveland, OH',     rank: '#130 National',    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/08/Case_Western_Reserve_University_seal.svg/250px-Case_Western_Reserve_University_seal.svg.png',  profileSlug: 'case-western' },
  { name: 'Carleton College',            type: 'Liberal Arts', city: 'Northfield, MN',    rank: '#8 Liberal Arts',  logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Combined_logo_and_seal_for_Carleton_College.png/330px-Combined_logo_and_seal_for_Carleton_College.png',      profileSlug: 'carleton' },
  { name: 'Macalester College',          type: 'Liberal Arts', city: 'St. Paul, MN',      rank: '#26 Liberal Arts', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/Macalester_seal_hires.png/250px-Macalester_seal_hires.png',    profileSlug: 'macalester' },
  { name: 'Grinnell College',            type: 'Liberal Arts', city: 'Grinnell, IA',      rank: '#17 Liberal Arts', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bc/Grinnell_College_seal.svg/250px-Grinnell_College_seal.svg.png',      profileSlug: 'grinnell' },
  { name: 'Oberlin College',             type: 'Liberal Arts', city: 'Oberlin, OH',       rank: '#36 Liberal Arts', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/75/Formal_Seal_of_Oberlin_College%2C_Oberlin%2C_OH%2C_USA.svg/250px-Formal_Seal_of_Oberlin_College%2C_Oberlin%2C_OH%2C_USA.svg.png',       profileSlug: 'oberlin' },
  { name: 'Kenyon College',              type: 'Liberal Arts', city: 'Gambier, OH',       rank: '#52 Liberal Arts', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kenyon_College_seal.svg/250px-Kenyon_College_seal.svg.png',        profileSlug: 'kenyon' },
]

// ── RANKED LISTS ─────────────────────────────────────────────────────────────
const topSchools = {
  private: [
    { rank: 1,  name: 'University of Chicago',              city: 'Chicago, IL',        notes: '#6 national; world leader in economics, law, and social sciences' },
    { rank: 2,  name: 'Carnegie Mellon University',         city: 'Pittsburgh, PA',     notes: '#22 national; #1 CS & robotics nationally; top engineering and arts' },
    { rank: 3,  name: 'Northwestern University',            city: 'Evanston, IL',       notes: '#9 national; top journalism, law, engineering, and Kellogg MBA' },
    { rank: 4,  name: 'University of Notre Dame',           city: 'South Bend, IN',     notes: '#20 national; top business, law, and engineering; strong alumni network' },
    { rank: 5,  name: 'Washington Univ. in St. Louis',      city: 'St. Louis, MO',      notes: '#24 national; top medical school, social work, and business' },
    { rank: 6,  name: 'Vanderbilt University',              city: 'Nashville, TN',      notes: '#18 national; strong medicine, law, education, and liberal arts' },
    { rank: 7,  name: 'Case Western Reserve University',    city: 'Cleveland, OH',      notes: '#130 national; top STEM, engineering, and medical research' },
    { rank: 8,  name: 'Marquette University',               city: 'Milwaukee, WI',      notes: 'Jesuit; top law, nursing, and business programs' },
    { rank: 9,  name: 'DePaul University',                  city: 'Chicago, IL',        notes: 'Largest Catholic university in US; strong business and arts' },
    { rank: 10, name: 'Loyola University Chicago',          city: 'Chicago, IL',        notes: 'Jesuit; top healthcare, law, and social sciences programs' },
  ],
  bigten: [
    { rank: 1,  name: 'University of Michigan',             city: 'Ann Arbor, MI',      notes: '#23 national; #1 public Midwest; top law, business, engineering, medicine' },
    { rank: 2,  name: 'Univ. of Illinois Urbana-Champaign', city: 'Champaign, IL',      notes: '#35 national; #1 CS program nationally; top engineering + business' },
    { rank: 3,  name: 'University of Wisconsin–Madison',    city: 'Madison, WI',        notes: '#41 national; top research, agriculture, education, and journalism' },
    { rank: 4,  name: 'Ohio State University',              city: 'Columbus, OH',       notes: '#49 national; large research enterprise; top business and engineering' },
    { rank: 5,  name: 'Purdue University',                  city: 'W. Lafayette, IN',   notes: '#53 national; top engineering and ag; Purdue Polytechnic renowned' },
    { rank: 6,  name: 'University of Minnesota',            city: 'Minneapolis, MN',    notes: '#56 national; top medical research; strong sciences and law' },
    { rank: 7,  name: 'Penn State University',              city: 'University Park, PA', notes: '#77 national; large research university; Smeal business school' },
    { rank: 8,  name: 'Michigan State University',          city: 'East Lansing, MI',   notes: '#80 national; top agriculture, education, and communications' },
    { rank: 9,  name: 'Indiana University',                 city: 'Bloomington, IN',    notes: '#116 national; top Kelley business school; music and law programs' },
    { rank: 10, name: 'University of Iowa',                 city: 'Iowa City, IA',      notes: 'Big Ten; top writing program (MFA); strong medicine and law' },
    { rank: 11, name: 'University of Nebraska',             city: 'Lincoln, NE',        notes: 'Big Ten; top engineering and agricultural sciences' },
    { rank: 12, name: 'Rutgers University',                 city: 'New Brunswick, NJ',  notes: 'Big Ten; strong pharmacy, public health, and social work' },
    { rank: 13, name: 'University of Pittsburgh',           city: 'Pittsburgh, PA',     notes: '#54 national; top medical school, public health, and engineering research' },
  ],
  liberalarts: [
    { rank: 1,  name: 'Carleton College',                   city: 'Northfield, MN',     notes: '#8 liberal arts nationally; exceptional science and mathematics programs' },
    { rank: 2,  name: 'Grinnell College',                   city: 'Grinnell, IA',       notes: '#17 liberal arts; need-blind admissions; 100% financial need met' },
    { rank: 3,  name: 'Macalester College',                 city: 'St. Paul, MN',       notes: '#26 liberal arts; top international studies; highly diverse campus' },
    { rank: 4,  name: 'Oberlin College',                    city: 'Oberlin, OH',        notes: '#36 liberal arts; world-renowned conservatory of music' },
    { rank: 5,  name: 'Kenyon College',                     city: 'Gambier, OH',        notes: '#52 liberal arts; exceptional English and creative writing programs' },
    { rank: 6,  name: 'Lawrence University',                city: 'Appleton, WI',       notes: 'Top conservatory + liberal arts dual program; small and rigorous' },
    { rank: 7,  name: 'Beloit College',                     city: 'Beloit, WI',         notes: 'Strong liberal arts; top anthropology and social sciences' },
    { rank: 8,  name: 'Knox College',                       city: 'Galesburg, IL',      notes: 'Site of Lincoln-Douglas debates; strong humanities and sciences' },
    { rank: 9,  name: 'Ripon College',                      city: 'Ripon, WI',          notes: 'Small liberal arts; strong pre-professional programs' },
    { rank: 10, name: 'Wabash College',                     city: 'Crawfordsville, IN', notes: 'Top men\'s liberal arts college; exceptional outcomes for graduates' },
  ],
  technical: [
    { rank: 1,  name: 'Purdue University (Engineering)',     city: 'W. Lafayette, IN',   notes: '#4 engineering nationally; aerospace, ECE, and ME are world-class' },
    { rank: 2,  name: 'Univ. of Illinois (CS/Engineering)', city: 'Champaign, IL',      notes: '#1 CS program nationally; produces more Fortune 500 tech leaders than any other' },
    { rank: 3,  name: 'University of Michigan (Engineering)', city: 'Ann Arbor, MI',    notes: 'Top 5 engineering nationally; exceptional automotive and robotics research' },
    { rank: 4,  name: 'Case Western Reserve University',    city: 'Cleveland, OH',      notes: 'Top 50 engineering; strong biomedical engineering and polymer science' },
    { rank: 5,  name: 'Rose-Hulman Institute of Technology', city: 'Terre Haute, IN',   notes: '#1 undergraduate engineering college in the US (US News)' },
    { rank: 6,  name: 'Ohio State (Engineering)',           city: 'Columbus, OH',       notes: 'Top 25 engineering; strong industrial, materials, and aerospace programs' },
    { rank: 7,  name: 'Milwaukee School of Engineering',    city: 'Milwaukee, WI',      notes: 'Highly focused STEM; strong industry connections in manufacturing' },
    { rank: 8,  name: 'Kettering University',               city: 'Flint, MI',          notes: 'Co-op focused engineering; strong automotive and manufacturing ties' },
  ],
}

export default function MidwestsBestPage() {
  const { t } = useLanguage()

  const typeColor = (type: string) => {
    if (type === 'Public')       return 'bg-blue-100 text-blue-700'
    if (type === 'Private')      return 'bg-orange-100 text-orange-700'
    if (type === 'Liberal Arts') return 'bg-purple-100 text-purple-700'
    return 'bg-gray-100 text-gray-600'
  }

  const midwestPosts = posts.filter(p =>
    p.title.toLowerCase().includes('midwest') ||
    p.title.toLowerCase().includes('chicago') ||
    p.title.toLowerCase().includes('michigan') ||
    p.title.toLowerCase().includes('notre dame') ||
    p.title.toLowerCase().includes('northwestern') ||
    p.slug.includes('midwest') ||
    p.slug.includes('chicago') ||
    p.slug.includes('michigan')
  )
  const displayPosts = midwestPosts.length >= 3 ? midwestPosts : posts.slice(0, 6)

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative text-white py-20 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1800&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy opacity-80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-3">
            {t('Heartland Excellence', '中西部顶尖学府', 'Excelencia del Medio Oeste')}
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
            {t("Midwest's Best", '中西部名校', 'Lo Mejor del Medio Oeste')}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed mb-6">
            {t(
              "From UChicago and Northwestern to the Big Ten giants and elite liberal arts colleges — the Midwest is home to some of America's most rigorous universities, world-class research institutions, and exceptional value in higher education.",
              '从芝加哥大学、西北大学到大十联盟巨头和顶尖文理学院——中西部是美国部分最严谨大学、世界一流研究机构和卓越高等教育价值的聚集地。',
              'Desde la Universidad de Chicago y Northwestern hasta los gigantes de la Big Ten y las mejores colleges de artes liberales — el Medio Oeste alberga algunas de las universidades más rigurosas de América, instituciones de investigación de clase mundial y un valor excepcional en educación superior.'
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#top-midwest" className="btn-primary">
              {t('Explore Top Schools', '探索顶尖院校', 'Explorar Mejores Escuelas')}
            </a>
            <Link href="/midwests-best/cost-calculator" className="btn-outline border-white text-white hover:bg-white hover:text-navy">
              {t('Cost Calculator', '费用计算器', 'Calculadora de Costos')}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ── TOP MIDWEST (US News Top 50) ─────────────────────── */}
        <div id="top-midwest" className="mb-16">
          <div className="flex items-end gap-4 mb-2">
            <h2 className="section-title mb-0">{t('Top Midwest Universities', '中西部顶尖大学', 'Mejores Universidades del Medio Oeste')}</h2>
            <span className="text-xs font-bold bg-brand-orange text-white px-2 py-1 mb-1">US NEWS TOP 50</span>
          </div>
          <p className="text-gray-500 mb-8">
            {t(
              'These 10 schools in the Midwest and greater region rank among the top 60 nationally — combining elite academics with strong research, career outcomes, and value.',
              '这10所中西部及周边地区学校跻身全国前60——兼具顶尖学术、强劲科研、优异就业前景和卓越性价比。',
              'Estas 10 escuelas del Medio Oeste y región circundante se clasifican entre las 60 mejores a nivel nacional — combinando educación de élite con sólida investigación, resultados laborales y excelente valor.'
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {topMidwestSchools.map(school => (
              <Link
                key={school.name}
                href={`/midwests-best/${school.profileSlug}`}
                className="group bg-gray-soft border-l-4 hover:shadow-md transition-all block"
                style={{ borderColor: school.color }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={school.logo} alt={school.shortName} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: school.color }}>
                          US News {school.nationalRank}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 ${typeColor(school.type)}`}>
                          {school.type}
                        </span>
                      </div>
                      <h3 className="font-black text-navy text-lg leading-tight group-hover:text-brand-orange transition-colors">
                        {school.name}
                      </h3>
                      <p className="text-sm text-gray-500">{school.city}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center mb-3">
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{t('Accept Rate', '录取率', 'Admisión')}</p>
                      <p className="font-black text-navy text-lg">{school.acceptRate}</p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{t('Known For', '优势专业', 'Conocido Por')}</p>
                      <p className="font-bold text-xs leading-tight" style={{ color: school.color }}>{school.strength}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-wider group-hover:underline">
                      {t('Full Profile →', '完整资料 →', 'Perfil Completo →')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── NOTRE DAME NOTABLE ALUMNI SPOTLIGHT ─────────────── */}
        <div className="mb-16">
          <div className="flex items-end gap-4 mb-2">
            <h2 className="section-title mb-0">{t('Notable Midwest Alumni Spotlight', '中西部知名校友聚焦', 'Alumni Destacados del Medio Oeste')}</h2>
            <span className="text-xs font-bold bg-[#0C2340] text-white px-2 py-1 mb-1">NOTRE DAME LAW</span>
          </div>
          <p className="text-gray-500 mb-6">
            {t(
              "Notre Dame Law School — ranked #22 nationally — produced one of the most consequential figures in American law.",
              '圣母大学法学院——全国排名第22位——培养了美国法律界最具影响力的人物之一。',
              'La Escuela de Derecho de Notre Dame — clasificada #22 a nivel nacional — formó a una de las figuras más influyentes del derecho estadounidense.'
            )}
          </p>
          <div className="bg-[#0C2340] text-white overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Portrait */}
              <div className="flex-shrink-0 md:w-64 h-72 md:h-auto overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/41/Official_Amy_Barrett_photo.jpg"
                  alt="Justice Amy Coney Barrett"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Content */}
              <div className="flex-1 p-8">
                <p className="text-[#C99700] font-bold uppercase tracking-widest text-xs mb-2">
                  {t('U.S. Supreme Court · Associate Justice', '美国最高法院 · 大法官', 'Corte Suprema de EE.UU. · Magistrada Asociada')}
                </p>
                <h3 className="text-3xl font-black mb-1">Amy Coney Barrett</h3>
                <p className="text-blue-200 text-sm mb-4">
                  Notre Dame Law School, <span className="font-bold">J.D. 1997</span> &nbsp;·&nbsp; Appointed 2020 by President Donald Trump
                </p>
                <p className="text-gray-300 leading-relaxed mb-5">
                  {t(
                    'Justice Barrett graduated summa cum laude from Notre Dame Law School, where she later served as a professor for 15 years — teaching federal courts, civil procedure, and constitutional law. Before joining the Supreme Court, she served on the U.S. Court of Appeals for the Seventh Circuit. She clerked for the late Justice Antonin Scalia, whose originalist philosophy profoundly shaped her approach to the law.',
                    'Barrett大法官以最优等成绩毕业于圣母大学法学院，此后在该院执教15年，讲授联邦法院、民事诉讼和宪法等课程。在加入最高法院之前，她曾任职于美国第七巡回上诉法院。她曾担任已故大法官安东宁·斯卡利亚的书记员，其原旨主义哲学对她的法律理念产生了深远影响。',
                    'La magistrada Barrett se graduó summa cum laude de la Escuela de Derecho de Notre Dame, donde posteriormente ejerció como profesora durante 15 años — impartiendo cursos de tribunales federales, procedimiento civil y derecho constitucional. Antes de unirse a la Corte Suprema, sirvió en el Tribunal de Apelaciones del Séptimo Circuito. Fue pasante del difunto magistrado Antonin Scalia, cuya filosofía originalista influyó profundamente en su enfoque del derecho.'
                  )}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: t('Law School', '法学院', 'Escuela de Derecho'), value: 'Notre Dame' },
                    { label: t('Graduation', '毕业年份', 'Graduación'), value: '1997' },
                    { label: t('Appointed', '任命年份', 'Nombrada'), value: '2020' },
                    { label: t('Clerked For', '书记员导师', 'Pasantía Con'), value: 'Justice Scalia' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/10 rounded p-3 text-center">
                      <p className="text-xs text-blue-200 uppercase tracking-wide mb-1">{stat.label}</p>
                      <p className="font-black text-white text-sm">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Originalism', 'Textualism', 'Constitutional Law', '7th Circuit (2017–2020)', 'Notre Dame Faculty (2002–2017)'].map(tag => (
                    <span key={tag} className="text-xs bg-white/10 text-blue-100 px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Footer bar */}
            <div className="bg-[#C99700] px-8 py-3 flex items-center justify-between">
              <p className="text-[#0C2340] font-bold text-sm">
                {t('Notre Dame Law School — #22 Nationally (US News)', '圣母大学法学院——全国排名第22（美国新闻）', 'Escuela de Derecho de Notre Dame — #22 Nacional (US News)')}
              </p>
              <Link href="/top-law-schools" className="text-[#0C2340] font-black text-xs uppercase tracking-wider hover:underline">
                {t('View Top Law Schools →', '查看顶尖法学院 →', 'Ver Mejores Escuelas de Derecho →')}
              </Link>
            </div>
          </div>
        </div>

        {/* ── CALCULATOR CTA ───────────────────────────────────── */}
        <div className="bg-brand-orange text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
          <div>
            <div className="font-black text-lg">
              {t('Calculate Your True Cost of College', '计算您的真实大学费用', 'Calcula el Costo Real de la Universidad')}
            </div>
            <div className="text-orange-100 text-sm">
              {t('Compare Midwest public and private school costs side-by-side with our free calculator.', '使用免费计算器，并排比较中西部公立和私立学校的费用。', 'Compara los costos de escuelas públicas y privadas del Medio Oeste con nuestra calculadora gratuita.')}
            </div>
          </div>
          <Link href="/midwests-best/cost-calculator"
            className="flex-shrink-0 bg-white text-brand-orange font-black uppercase tracking-wide text-sm px-6 py-3 hover:bg-gray-100 transition-colors">
            {t('Open Calculator →', '打开计算器 →', 'Abrir Calculadora →')}
          </Link>
        </div>

        {/* ── FEATURED SCHOOLS ─────────────────────────────────── */}
        <div id="featured" className="mb-16">
          <h2 className="section-title mb-2">{t('Featured Schools', '精选院校', 'Escuelas Destacadas')}</h2>
          <p className="text-gray-500 mb-8">
            {t(
              'More outstanding Midwest institutions — from Big Ten flagships to elite liberal arts colleges.',
              '更多杰出的中西部院校——从大十旗舰大学到顶尖文理学院。',
              'Más instituciones destacadas del Medio Oeste — desde las públicas Big Ten hasta las mejores colleges de artes liberales.'
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {featuredSchools.map(school => (
              <div
                key={school.name}
                className="group bg-gray-soft p-5 text-center hover:shadow-md hover:bg-white border border-transparent hover:border-brand-orange transition-all cursor-default"
              >
                <div className="h-14 flex items-center justify-center mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={school.logo} alt={school.name} className="max-h-12 max-w-[80%] object-contain" />
                </div>
                <h3 className="font-bold text-navy text-sm mb-1 leading-tight">{school.name}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 ${typeColor(school.type)}`}>
                  {school.type}
                </span>
                <p className="text-xs text-gray-400 mt-1">{school.city}</p>
                <p className="text-xs text-gray-500 mt-0.5">{school.rank}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RANKED LISTS ─────────────────────────────────────── */}
        <div id="top-schools">
          <h2 className="section-title mb-2">
            {t("Top Midwest Colleges & Universities", '中西部顶尖大学排行', 'Mejores Universidades del Medio Oeste')}
          </h2>
          <p className="text-gray-500 mb-10 max-w-3xl">
            {t(
              'Ranked by academic reputation, research output, graduate outcomes, and program strength across four categories: private universities, Big Ten publics, liberal arts colleges, and technical/engineering schools.',
              '按学术声誉、科研产出、毕业生成果及专业实力综合排名，涵盖私立大学、大十公立、文理学院和技术/工程学校四大类别。',
              'Clasificadas por reputación académica, producción de investigación, resultados de egresados y fortaleza de programas en cuatro categorías: universidades privadas, públicas Big Ten, colleges de artes liberales e instituciones técnicas y de ingeniería.'
            )}
          </p>

          {/* Private Universities */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-brand-orange" />
              <h3 className="text-xl font-black text-navy">{t('Private Universities', '私立大学', 'Universidades Privadas')}</h3>
              <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5">{t('PRIVATE', '私立', 'PRIVADA')}</span>
            </div>
            <div className="space-y-1">
              {topSchools.private.map(s => (
                <div key={s.name} className="flex items-start gap-4 py-3 border-b border-gray-50 hover:bg-gray-50 px-2 transition-colors">
                  <span className="text-brand-orange font-black text-sm w-6 flex-shrink-0 mt-0.5">{s.rank}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-navy">{s.name}</span>
                    <span className="text-gray-400 text-xs ml-2">{s.city}</span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs hidden sm:block">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Big Ten Public Universities */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-blue-600" />
              <h3 className="text-xl font-black text-navy">{t('Big Ten Public Universities', '大十联盟公立大学', 'Universidades Públicas Big Ten')}</h3>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5">{t('PUBLIC', '公立', 'PÚBLICA')}</span>
            </div>
            <div className="space-y-1">
              {topSchools.bigten.map(s => (
                <div key={s.name} className="flex items-start gap-4 py-3 border-b border-gray-50 hover:bg-gray-50 px-2 transition-colors">
                  <span className="text-brand-orange font-black text-sm w-6 flex-shrink-0 mt-0.5">{s.rank}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-navy">{s.name}</span>
                    <span className="text-gray-400 text-xs ml-2">{s.city}</span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs hidden sm:block">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Liberal Arts Colleges */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-purple-600" />
              <h3 className="text-xl font-black text-navy">{t('Liberal Arts Colleges', '文理学院', 'Colleges de Artes Liberales')}</h3>
              <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5">{t('LIBERAL ARTS', '文理', 'ARTES LIBERALES')}</span>
            </div>
            <div className="space-y-1">
              {topSchools.liberalarts.map(s => (
                <div key={s.name} className="flex items-start gap-4 py-3 border-b border-gray-50 hover:bg-gray-50 px-2 transition-colors">
                  <span className="text-brand-orange font-black text-sm w-6 flex-shrink-0 mt-0.5">{s.rank}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-navy">{s.name}</span>
                    <span className="text-gray-400 text-xs ml-2">{s.city}</span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs hidden sm:block">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical & Engineering Schools */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-green-600" />
              <h3 className="text-xl font-black text-navy">{t('Technical & Engineering Schools', '技术与工程院校', 'Escuelas Técnicas y de Ingeniería')}</h3>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5">{t('TECH / ENGINEERING', '技术/工程', 'TÉC. / INGENIERÍA')}</span>
            </div>
            <div className="space-y-1">
              {topSchools.technical.map(s => (
                <div key={s.name} className="flex items-start gap-4 py-3 border-b border-gray-50 hover:bg-gray-50 px-2 transition-colors">
                  <span className="text-brand-orange font-black text-sm w-6 flex-shrink-0 mt-0.5">{s.rank}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-navy">{s.name}</span>
                    <span className="text-gray-400 text-xs ml-2">{s.city}</span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs hidden sm:block">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── WHY THE MIDWEST ───────────────────────────────────── */}
        <div className="bg-navy text-white p-10 md:p-14 mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-3">
                {t('Why Choose the Midwest', '为何选择中西部', 'Por Qué Elegir el Medio Oeste')}
              </p>
              <h2 className="text-3xl font-black mb-4 leading-tight">
                {t("America's Underrated Academic Powerhouse", '美国被低估的学术重镇', 'La Potencia Académica Subestimada de América')}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t(
                  "While coasts get the headlines, the Midwest quietly produces more engineering graduates, Nobel laureates per capita, and Fortune 500 CEOs than most regions of the world. UChicago alone has more Nobel laureates than most countries.",
                  '沿海地区往往占据头条，而中西部却悄然培育出更多工程学毕业生、人均诺贝尔奖得主和财富500强CEO。仅芝加哥大学一所学校拥有的诺贝尔奖得主就超过大多数国家。',
                  'Mientras las costas acaparan los titulares, el Medio Oeste produce silenciosamente más egresados de ingeniería, premios Nobel per cápita y CEOs del Fortune 500 que la mayoría de las regiones del mundo. La Universidad de Chicago por sí sola tiene más premios Nobel que la mayoría de los países.'
                )}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t(
                  "Lower cost of living means your aid package stretches further. Midwestern schools are known for their rigorous academics, collaborative culture, and exceptionally strong alumni networks in finance, tech, medicine, and law.",
                  '较低的生活成本意味着您的助学金更加充裕。中西部院校以严谨的学术风气、合作文化以及在金融、科技、医疗和法律领域极为强大的校友网络而著称。',
                  'El menor costo de vida significa que tu paquete de ayuda financiera rinde más. Las escuelas del Medio Oeste son conocidas por su rigor académico, cultura colaborativa y redes de alumni excepcionalmente sólidas en finanzas, tecnología, medicina y derecho.'
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🏆', title: t('Nobel Laureates', '诺贝尔奖得主', 'Premios Nobel'), body: t('UChicago leads all universities with 100+ Nobel laureates affiliated. Michigan, Northwestern, and Wisconsin each have dozens.', '芝加哥大学以100+诺贝尔奖得主高居所有大学首位，密歇根、西北和威斯康星各有数十位。', 'La U. de Chicago lidera con más de 100 premios Nobel afiliados. Michigan, Northwestern y Wisconsin tienen docenas cada una.') },
                { icon: '💻', title: t('#1 in CS', 'CS全国第一', '#1 en Informática'), body: t("UIUC's CS program is ranked #1 nationally and produces more Big Tech engineers than nearly any school in America.", 'UIUC计算机科学专业全国排名第一，培育的科技巨头工程师数量居全美前列。', 'El programa de Ciencias de la Computación de UIUC es #1 nacional y produce más ingenieros de Big Tech que casi cualquier otra escuela.') },
                { icon: '💰', title: t('Better Value', '更高性价比', 'Mejor Valor'), body: t('Top Midwest publics cost 30–50% less than equivalent private schools, with many offering merit aid to out-of-state students.', '顶尖中西部公立大学比同等私立学校便宜30-50%，且许多学校向外州学生提供奖学金。', 'Las mejores públicas del Medio Oeste cuestan un 30–50% menos que las privadas equivalentes, y muchas ofrecen becas por mérito a estudiantes de otros estados.') },
                { icon: '🤝', title: t('Collaborative Culture', '合作文化', 'Cultura Colaborativa'), body: t("Known for 'work hard, help others' ethos — Midwest schools top rankings for faculty accessibility and student support.", '以"努力工作，助人为乐"精神著称——中西部院校在师生互动和学生支持方面名列前茅。', 'Conocidas por el espíritu de "trabaja duro, ayuda a los demás" — las escuelas del Medio Oeste lideran rankings de accesibilidad docente y apoyo estudiantil.') },
              ].map(card => (
                <div key={card.title} className="bg-white/10 p-5">
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <h3 className="font-black text-white text-sm mb-1">{card.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ARTICLES ──────────────────────────────────────────── */}
        <div className="border-t border-gray-100 pt-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title mb-0">{t('Midwest College Guides & Articles', '中西部大学指南与文章', 'Guías y Artículos sobre Universidades del Medio Oeste')}</h2>
            <Link href="/blog" className="text-brand-orange font-bold text-sm uppercase tracking-wide hover:text-brand-orange-dark">
              {t('View All →', '查看全部 →', 'Ver Todo →')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.slice(0, 6).map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
