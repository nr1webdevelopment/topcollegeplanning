'use client'
import Link from 'next/link'
import { proxyImageSrc } from '@/lib/image-utils'
import { useLanguage } from '@/lib/i18n'

const universityLogos = [
  { name: 'Northwestern University', src: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Northwestern_Wildcats_logo.svg' },
  { name: 'USC Trojans', src: 'https://upload.wikimedia.org/wikipedia/commons/9/94/USC_Trojans_logo.svg' },
  { name: 'Columbia University', src: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Columbia_Lions_logo.svg' },
]

export default function HomePage() {
  const { t } = useLanguage()

  const stats = [
    { value: '20+', en: 'Years of Experience Combined', zh: '年综合经验', es: 'Años de Experiencia' },
    { value: '50+', en: 'Universities Represented', zh: '所合作高校', es: 'Universidades Asociadas' },
    { value: '500+', en: 'Students Helped', zh: '服务学生', es: 'Estudiantes Asesorados' },
    { value: '95%', en: 'Acceptance Rate', zh: '录取成功率', es: 'Tasa de Aceptación' },
  ]

  const categoryLinks = [
    { en: 'Ivy League', zh: '常青藤联盟', es: 'Liga Ivy', href: '/ivy-league', icon: '🎓', descEn: 'Harvard, Yale, Princeton, and more', descZh: '哈佛、耶鲁、普林斯顿等', descEs: 'Harvard, Yale, Princeton y más' },
    { en: 'M7 Business Schools', zh: 'M7商学院', es: 'Escuelas M7', href: '/m7-business-schools', icon: '📊', descEn: 'Wharton, Booth, Kellogg & more', descZh: '沃顿、布斯、凯洛格等', descEs: 'Wharton, Booth, Kellogg y más' },
    { en: 'Top Law Schools', zh: '顶尖法学院', es: 'Mejores Escuelas de Derecho', href: '/top-law-schools', icon: '⚖️', descEn: 'Yale Law, Harvard Law & more', descZh: '耶鲁法学院、哈佛法学院等', descEs: 'Yale Law, Harvard Law y más' },
    {
      en: "California's Best", zh: '加州名校', es: 'Lo Mejor de California', href: '/californias-best', icon: '🌴',
      descEn: 'UCLA, USC, Berkeley & more', descZh: '加大洛杉矶分校、南加大、伯克利等', descEs: 'UCLA, USC, Berkeley y más',
      logos: [
        { name: 'UCLA', src: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/UCLA_Bruins_logo.svg' },
        { name: 'USC', src: 'https://upload.wikimedia.org/wikipedia/commons/9/94/USC_Trojans_logo.svg' },
        { name: 'Berkeley', src: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/California_Golden_Bears_logo.svg' },
        { name: 'Stanford', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Stanford_Cardinal_logo.svg' },
      ],
    },
  ]

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                {t(
                  'Your Higher Education Success Begins Here.',
                  '您的高等教育成功之路，从这里开始。',
                  'Tu Camino al Éxito Universitario Comienza Aquí.'
                )}
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
                {t(
                  'Welcome to Top College Planning. We are a team of expert advisors from the Top 50 US Universities, here to guide you to your dream school.',
                  '欢迎来到 Top College Planning。我们是来自美国前50名大学的专业顾问团队，助您迈向梦想院校。',
                  'Bienvenido a Top College Planning. Somos un equipo de asesores expertos de las mejores 50 universidades de EE.UU., aquí para guiarte a tu escuela ideal.'
                )}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/blog" className="btn-primary">
                  {t('Explore Our Guides', '浏览升学指南', 'Explorar Nuestras Guías')}
                </Link>
                <Link href="/alumni" className="btn-outline">
                  {t('Meet Our Alumni', '了解知名校友', 'Conoce a Nuestros Egresados')}
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="rounded-full overflow-hidden w-[420px] h-[420px] mx-auto border-4 border-white/10 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/students-campus-background.jpg"
                  alt="College graduate"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROUD ALUMNI OF ──────────────────────────────────── */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-navy mb-8">
                {t('We are proud alumni of...', '我们是以下名校的骄傲校友...', 'Somos orgullosos egresados de...')}
              </h2>
              <div className="flex flex-wrap gap-6 items-center">
                {universityLogos.map(logo => (
                  <div key={logo.name} className="border border-gray-200 px-6 py-4 flex items-center justify-center h-20 w-44">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={proxyImageSrc(logo.src)} alt={logo.name} className="object-contain h-12 w-auto" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">
                {t(
                  "*Logos are for reference only. We are not associated or affiliated with displayed institutes. But we know how to get you in because we went to these schools. That's what makes us even more special.",
                  '*标识仅供参考。我们与所示院校无直接关联，但我们曾就读这些学校，深知如何助您成功入读——这正是我们的独特优势。',
                  '*Los logos son solo de referencia. No estamos afiliados con estas instituciones, pero estudiamos en ellas y sabemos cómo ayudarte a ingresar — eso nos hace únicos.'
                )}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/blog" className="btn-primary text-center block">
                {t('BROWSE SCHOOL DIRECTORY', '浏览学校目录', 'VER DIRECTORIO DE ESCUELAS')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY CARDS ───────────────────────────────────── */}
      <section className="bg-gray-soft py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-10">{t('Explore By Category', '按类别探索', 'Explorar por Categoría')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryLinks.map(cat => (
              <Link
                key={cat.en}
                href={cat.href}
                className="group bg-white p-8 text-center hover:bg-navy transition-colors duration-300 shadow-sm"
              >
                {'logos' in cat && cat.logos ? (
                  <div className="grid grid-cols-2 gap-2 mb-4 h-16 items-center justify-items-center">
                    {cat.logos.map(logo => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={logo.name} src={logo.src} alt={logo.name} className="h-7 w-auto object-contain group-hover:brightness-200 transition-all" />
                    ))}
                  </div>
                ) : (
                  <div className="text-4xl mb-4">{cat.icon}</div>
                )}
                <h3 className="text-lg font-bold text-navy group-hover:text-white mb-2 transition-colors">{t(cat.en, cat.zh, cat.es)}</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">{t(cat.descEn, cat.descZh, cat.descEs)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(stat => (
              <div key={stat.en}>
                <div className="text-4xl md:text-5xl font-black text-brand-orange mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm font-medium">{t(stat.en, stat.zh, stat.es)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ───────────────────────────────────── */}
      <section className="bg-gray-soft py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-navy mb-4 leading-tight">
            {t(
              'You Deserve The Extra Boost To Get Into Your Dream School',
              '您值得获得迈入梦校的专业助力',
              'Mereces el Impulso Extra para Entrar a tu Escuela Ideal'
            )}
          </h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            {t(
              "Become our Gold Member and join our weekly Zoom call to learn more about exclusive insider's tips.",
              '成为黄金会员，加入每周 Zoom 直播，获取独家升学内幕技巧。',
              'Conviértete en Miembro Gold y únete a nuestra llamada Zoom semanal para obtener consejos exclusivos.'
            )}
          </p>
          <Link href="/shop" className="btn-primary text-base">
            {t('SUBSCRIBE NOW', '立即订阅', 'SUSCRÍBETE AHORA')}
          </Link>
        </div>
      </section>
    </>
  )
}
