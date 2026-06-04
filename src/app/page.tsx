'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

// ── Data ───────────────────────────────────────────────────────────────────

const universityLogos = [
  { name: 'Harvard',   src: '/images/logos/ivy-harvard.svg' },
  { name: 'Yale',      src: '/images/logos/ivy-yale.svg' },
  { name: 'Princeton', src: '/images/logos/ivy-princeton.svg' },
  { name: 'Columbia',  src: '/images/logos/ivy-columbia.png' },
  { name: 'Penn',      src: '/images/logos/ivy-penn.svg' },
  { name: 'Cornell',   src: '/images/logos/ivy-cornell.svg' },
  { name: 'Dartmouth', src: '/images/logos/ivy-dartmouth.svg' },
  { name: 'Brown',     src: '/images/logos/ivy-brown.svg' },
]

const stats = [
  { value: '20+',  en: 'Years of Experience Combined',  zh: '年综合经验',   es: 'Años de Experiencia' },
  { value: '50+',  en: 'Universities Represented',      zh: '所合作高校',   es: 'Universidades Asociadas' },
  { value: '500+', en: 'Students Helped',               zh: '服务学生',     es: 'Estudiantes Asesorados' },
  { value: '95%',  en: 'Acceptance Rate',               zh: '录取成功率',   es: 'Tasa de Aceptación' },
]

const categoryLinks = [
  {
    en: 'Ivy League', zh: '常青藤联盟', es: 'Liga Ivy',
    href: '/ivy-league',
    img: '/images/blog/what-are-ivy-league-schools.jpg',
    descEn: 'Harvard, Yale, Princeton & more',
    descZh: '哈佛、耶鲁、普林斯顿等',
    descEs: 'Harvard, Yale, Princeton y más',
  },
  {
    en: 'M7 Business Schools', zh: 'M7商学院', es: 'Escuelas M7',
    href: '/m7-business-schools',
    img: '/images/blog/m7-business-school-chicago-booth.jpg',
    descEn: 'Wharton, Booth, Kellogg & more',
    descZh: '沃顿、布斯、凯洛格等',
    descEs: 'Wharton, Booth, Kellogg y más',
  },
  {
    en: 'Top Law Schools', zh: '顶尖法学院', es: 'Mejores Escuelas de Derecho',
    href: '/top-law-schools',
    img: '/images/blog/u-s-senate-confirms-nd-law-school-alum-edward-s-kiel-as-federal-judge.jpg',
    descEn: 'Yale Law, Harvard Law & more',
    descZh: '耶鲁法学院、哈佛法学院等',
    descEs: 'Yale Law, Harvard Law y más',
  },
  {
    en: "California's Best", zh: '加州名校', es: 'Lo Mejor de California',
    href: '/californias-best',
    img: '/images/blog/stanford-campus.jpg',
    descEn: 'UCLA, USC, Berkeley & more',
    descZh: '加大洛杉矶分校、南加大、伯克利等',
    descEs: 'UCLA, USC, Berkeley y más',
  },
  {
    en: "Midwest's Best", zh: '中西部名校', es: 'Lo Mejor del Medio Oeste',
    href: '/midwests-best',
    img: '/images/blog/u-of-m.jpg',
    descEn: 'Northwestern, UChicago & more',
    descZh: '西北大学、芝加哥大学等',
    descEs: 'Northwestern, UChicago y más',
  },
  {
    en: 'Global Top 10', zh: '全球十强', es: 'Top 10 Global',
    href: '/global-top-10',
    img: '/images/blog/forging-futures-the-crucial-role-of-relationships-in-university-life-and-beyond.jpg',
    descEn: 'Oxford, Cambridge, MIT & more',
    descZh: '牛津、剑桥、麻省理工等',
    descEs: 'Oxford, Cambridge, MIT y más',
  },
]

const featuredPosts = [
  {
    title: 'What Are Ivy League Schools?',
    slug: 'what-are-ivy-league-schools',
    excerpt: 'Learn what makes the Ivy League so prestigious, which schools are included, and what it takes to get accepted.',
    image: '/images/blog/what-are-ivy-league-schools.jpg',
    category: 'Ivy League',
    date: 'May 2025',
  },
  {
    title: 'How to Submit a Successful College Application',
    slug: 'how-to-submit-a-successful-college-application',
    excerpt: 'A step-by-step breakdown of what top admissions officers are really looking for in your application.',
    image: '/images/blog/how-to-submit-a-successful-college-application.jpg',
    category: 'Admissions',
    date: 'Apr 2025',
  },
  {
    title: 'UC Berkeley vs UCLA: Side-by-Side Comparison',
    slug: 'uc-berkeley-vs-ucla-side-by-side-comparison',
    excerpt: "Two of California's greatest universities — but which one is the right fit for you? We break it all down.",
    image: '/images/blog/uc-berkeley-vs-ucla-side-by-side-comparison.jpg',
    category: "California's Best",
    date: 'Mar 2025',
  },
]

const notableAlumni = [
  { name: 'Barack Obama',     school: 'Harvard Law',       img: '/images/alumni/barack-obama.jpg' },
  { name: 'Michelle Obama',   school: 'Princeton & Harvard', img: '/images/alumni/michelle-obama.jpg' },
  { name: 'Elon Musk',        school: 'Penn / Wharton',    img: '/images/alumni/elon-musk.jpg' },
  { name: 'Jeff Bezos',       school: 'Princeton',          img: '/images/alumni/jeff-bezos.jpg' },
  { name: 'Mark Zuckerberg',  school: 'Harvard',            img: '/images/alumni/mark-zuckerberg.jpg' },
  { name: 'Jensen Huang',     school: 'Stanford',           img: '/images/alumni/jensen-huang.jpg' },
  { name: 'Warren Buffett',   school: 'Columbia',           img: '/images/alumni/warren-buffett.jpg' },
  { name: 'Sam Altman',       school: 'Stanford',           img: '/alumni/sam-altman.jpg' },
]

const testimonials = [
  {
    quote: "Top College Planning helped me craft the perfect application. I got into Harvard — and I couldn't have done it without their guidance.",
    name: 'Sarah K.',
    detail: 'Harvard Class of 2026',
  },
  {
    quote: 'As a parent I was overwhelmed by the process. Their team gave us a clear roadmap from day one. My son is now at Stanford.',
    name: 'Michael T.',
    detail: "Father of Stanford '25",
  },
  {
    quote: 'The weekly Zoom calls were invaluable — real insider knowledge from people who actually attended these schools. Worth every penny.',
    name: 'Priya M.',
    detail: 'Wharton MBA Class of 2025',
  },
]

// ── Component ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative text-white py-20 md:py-28 overflow-hidden">
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/students-campus-background.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Navy overlay */}
        <div className="absolute inset-0 bg-navy opacity-80" />
        {/* Decorative radial rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{ width: `${i * 420}px`, height: `${i * 420}px`, top: '50%', right: '-5%', transform: 'translateY(-50%)' }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Copy */}
            <div>
              <p className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-3">
                {t('Expert College Advisors', '专业升学顾问', 'Asesores Universitarios Expertos')}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                {t(
                  'Your Higher Education Success Begins Here.',
                  '您的高等教育成功之路，从这里开始。',
                  'Tu Camino al Éxito Universitario Comienza Aquí.'
                )}
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
                {t(
                  'We are a team of expert advisors from the Top 50 US Universities, here to guide you to your dream school.',
                  '我们是来自美国前50名大学的专业顾问团队，助您迈向梦想院校。',
                  'Somos un equipo de asesores expertos de las mejores 50 universidades de EE.UU., aquí para guiarte a tu escuela ideal.'
                )}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="btn-primary">
                  {t('Get Started Free', '免费开始', 'Comenzar Gratis')}
                </Link>
                <Link href="/blog" className="btn-outline text-white border-white hover:bg-white hover:text-navy">
                  {t('Explore Our Guides', '浏览升学指南', 'Explorar Nuestras Guías')}
                </Link>
              </div>
            </div>

            {/* Stats glass card */}
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-6">
                  {t('Our Track Record', '我们的成绩', 'Nuestro Historial')}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map(stat => (
                    <div key={stat.en}>
                      <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                      <div className="text-gray-300 text-xs font-medium leading-snug">{t(stat.en, stat.zh, stat.es)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS STRIP ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(stat => (
              <div key={stat.en}>
                <div className="text-4xl md:text-5xl font-black text-brand-orange mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm font-medium">{t(stat.en, stat.zh, stat.es)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROUD ALUMNI OF ─────────────────────────────────────────────── */}
      <section className="bg-gray-soft py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
            {t('Our advisors are proud alumni of', '我们的顾问毕业于', 'Nuestros asesores son egresados de')}
          </h2>
          <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
            {universityLogos.map(logo => (
              <div
                key={logo.name}
                className="bg-white border border-gray-200 px-5 py-3 flex items-center justify-center h-16 w-32 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.name} className="object-contain h-10 w-auto" />
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
            <p className="text-xs text-gray-400 text-center max-w-md leading-relaxed">
              {t(
                '*Logos are for reference only. We are not affiliated with these institutions, but our advisors attended them — and that is what makes us uniquely qualified.',
                '*标识仅供参考。我们与所示院校无直接关联，但我们的顾问曾就读这些学校。',
                '*Los logos son solo de referencia. No estamos afiliados, pero nuestros asesores estudiaron allí.'
              )}
            </p>
            <Link href="/ivy-league" className="btn-primary whitespace-nowrap text-sm px-6 py-3">
              {t('Browse School Directory', '浏览学校目录', 'Ver Directorio de Escuelas')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORY CARDS ──────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">
              {t('Explore By Category', '按类别探索', 'Explorar por Categoría')}
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              {t(
                'Deep-dive guides for every path to your dream school.',
                '每条通往梦校的深度指南。',
                'Guías detalladas para cada camino a tu escuela ideal.'
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryLinks.map(cat => (
              <Link
                key={cat.en}
                href={cat.href}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 aspect-[4/3] flex items-end"
              >
                {/* Background photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.img}
                  alt={cat.en}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy/50 to-transparent" />
                {/* Text */}
                <div className="relative p-6 w-full">
                  <h3 className="text-xl font-black text-white mb-1">
                    {t(cat.en, cat.zh, cat.es)}
                  </h3>
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {t(cat.descEn, cat.descZh, cat.descEs)}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-brand-orange text-xs font-bold uppercase tracking-wider">
                    {t('Learn more', '了解更多', 'Saber más')}
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST GUIDES ───────────────────────────────────────────────── */}
      <section className="bg-gray-soft py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title mb-1">
                {t('Latest Guides & Insights', '最新指南与资讯', 'Guías e Insights Recientes')}
              </h2>
              <p className="text-gray-500 text-sm">
                {t('Expert advice from advisors who went to these schools.', '来自亲历者的专业建议。', 'Consejos expertos de quienes asistieron a estas escuelas.')}
              </p>
            </div>
            <Link href="/blog" className="text-brand-orange font-bold text-sm uppercase tracking-widest hover:underline hidden sm:block whitespace-nowrap ml-4">
              {t('View All →', '查看全部 →', 'Ver Todo →')}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-2">{post.category}</span>
                  <h3 className="font-bold text-navy text-lg leading-snug mb-3 group-hover:text-brand-orange transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                      {t('Read More →', '阅读更多 →', 'Leer Más →')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link href="/blog" className="btn-outline">
              {t('View All Articles', '查看所有文章', 'Ver Todos los Artículos')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── NOTABLE ALUMNI SHOWCASE ─────────────────────────────────────── */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              {t('World Top Leaders from Top Colleges', '顶尖院校的全球领袖', 'Líderes Mundiales de las Mejores Universidades')}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              {t(
                'The schools we advise for have shaped some of the most influential people in history.',
                '我们所建议的学校培养了一些历史上最具影响力的人物。',
                'Las escuelas que asesoramos han formado a algunas de las personas más influyentes de la historia.'
              )}
            </p>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
            {notableAlumni.map(person => (
              <Link key={person.name} href="/alumni" className="group text-center">
                <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-white/10 group-hover:border-brand-orange transition-colors duration-300 mb-2 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-white text-xs font-bold leading-tight truncate">{person.name}</p>
                <p className="text-gray-400 text-[10px] truncate">{person.school}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/alumni"
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-navy font-bold uppercase tracking-widest px-8 py-4 transition-colors duration-200 rounded-sm"
            >
              {t('Find Out More', '了解更多', 'Descubrir Más')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">
              {t('What Our Students Say', '学员心声', 'Lo Que Dicen Nuestros Estudiantes')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, i) => (
              <div key={i} className="bg-gray-soft rounded-2xl p-8 flex flex-col">
                <div className="text-brand-orange font-serif text-5xl leading-none mb-4 opacity-40 select-none">&ldquo;</div>
                <p className="text-gray-700 leading-relaxed flex-1 italic">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="font-bold text-navy text-sm">{item.name}</p>
                  <p className="text-brand-orange text-xs font-semibold mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ──────────────────────────────────────────────── */}
      <section className="bg-navy py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            {t(
              'You Deserve The Extra Boost To Get Into Your Dream School',
              '您值得获得迈入梦校的专业助力',
              'Mereces el Impulso Extra para Entrar a tu Escuela Ideal'
            )}
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {t(
              "Become our Gold Member and join our weekly Zoom call to learn more about exclusive insider's tips.",
              '成为黄金会员，加入每周 Zoom 直播，获取独家升学内幕技巧。',
              'Conviértete en Miembro Gold y únete a nuestra llamada Zoom semanal para obtener consejos exclusivos.'
            )}
          </p>
          <Link href="/login" className="btn-primary text-base">
            {t('SUBSCRIBE NOW', '立即订阅', 'SUSCRÍBETE AHORA')}
          </Link>
        </div>
      </section>
    </>
  )
}
