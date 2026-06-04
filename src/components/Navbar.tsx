'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage, Lang } from '@/lib/i18n'

// ── Dropdown configs ────────────────────────────────────────────────────────

const navDropdowns = [
  {
    key: 'ivy',
    labelEn: 'Ivy League', labelZh: '常青藤联盟', labelEs: 'Liga Ivy',
    href: '/ivy-league',
    viewAllEn: 'View All Ivy Schools', viewAllZh: '查看所有常青藤', viewAllEs: 'Ver Todas',
    calcHref: '/ivy-league/cost-calculator',
    schools: [
      { name: 'Harvard',   href: '/ivy-league/harvard' },
      { name: 'Yale',      href: '/ivy-league/yale' },
      { name: 'Princeton', href: '/ivy-league/princeton' },
      { name: 'Columbia',  href: '/ivy-league/columbia' },
      { name: 'Penn',      href: '/ivy-league/penn' },
      { name: 'Cornell',   href: '/ivy-league/cornell' },
      { name: 'Dartmouth', href: '/ivy-league/dartmouth' },
      { name: 'Brown',     href: '/ivy-league/brown' },
    ],
  },
  {
    key: 'law',
    labelEn: 'Top Law Schools', labelZh: '顶尖法学院', labelEs: 'Mejores Escuelas de Derecho',
    href: '/top-law-schools',
    viewAllEn: 'View All Law Schools', viewAllZh: '查看所有法学院', viewAllEs: 'Ver Todas',
    calcHref: '/top-law-schools/cost-calculator',
    schools: [
      { name: 'Yale Law',      href: '/top-law-schools/yale-law' },
      { name: 'Harvard Law',   href: '/top-law-schools/harvard-law' },
      { name: 'Stanford Law',  href: '/top-law-schools/stanford-law' },
      { name: 'Columbia Law',  href: '/top-law-schools/columbia-law' },
      { name: 'Chicago Law',   href: '/top-law-schools/uchicago-law' },
      { name: 'NYU Law',       href: '/top-law-schools/nyu-law' },
      { name: 'Penn Law',      href: '/top-law-schools/penn-law' },
      { name: 'Michigan Law',  href: '/top-law-schools/michigan-law' },
    ],
  },
  {
    key: 'm7',
    labelEn: 'M7 Business Schools', labelZh: 'M7商学院', labelEs: 'Escuelas M7',
    href: '/m7-business-schools',
    viewAllEn: 'View All M7 Schools', viewAllZh: '查看所有M7院校', viewAllEs: 'Ver Todas',
    calcHref: '/m7-business-schools/cost-calculator',
    schools: [
      { name: 'HBS',          href: '/m7-business-schools/harvard-business-school' },
      { name: 'Wharton',      href: '/m7-business-schools/wharton' },
      { name: 'Booth',        href: '/m7-business-schools/chicago-booth' },
      { name: 'Kellogg',      href: '/m7-business-schools/kellogg' },
      { name: 'MIT Sloan',    href: '/m7-business-schools/mit-sloan' },
      { name: 'CBS',          href: '/m7-business-schools/columbia-business-school' },
      { name: 'Stanford GSB', href: '/m7-business-schools/stanford-gsb' },
    ],
  },
  {
    key: 'cal',
    labelEn: "California's Best", labelZh: '加州名校', labelEs: 'Lo Mejor de California',
    href: '/californias-best',
    viewAllEn: "View All California Schools", viewAllZh: '查看所有加州院校', viewAllEs: 'Ver Todas',
    calcHref: '/californias-best/cost-calculator',
    schools: [
      { name: 'Stanford',      href: '/californias-best/stanford' },
      { name: 'UC Berkeley',   href: '/californias-best/uc-berkeley' },
      { name: 'UCLA',          href: '/californias-best/ucla' },
      { name: 'USC',           href: '/californias-best/usc' },
      { name: 'Caltech',       href: '/californias-best/caltech' },
      { name: 'UC San Diego',  href: '/californias-best/uc-san-diego' },
      { name: 'UC Santa Barbara', href: '/californias-best/uc-santa-barbara' },
      { name: 'Pepperdine',    href: '/californias-best/pepperdine' },
    ],
  },
  {
    key: 'midwest',
    labelEn: "Midwest's Best", labelZh: '中西部名校', labelEs: 'Lo Mejor del Medio Oeste',
    href: '/midwests-best',
    viewAllEn: 'View All Midwest Schools', viewAllZh: '查看所有中西部院校', viewAllEs: 'Ver Todas',
    calcHref: '/midwests-best/cost-calculator',
    schools: [
      { name: 'UChicago',    href: '/midwests-best/uchicago' },
      { name: 'Northwestern', href: '/midwests-best/northwestern' },
      { name: 'Notre Dame',  href: '/midwests-best/notre-dame' },
      { name: 'Michigan',    href: '/midwests-best/michigan' },
      { name: 'Wash U',      href: '/midwests-best/washu' },
      { name: 'CMU',         href: '/midwests-best/cmu' },
      { name: 'UIUC',        href: '/midwests-best/uiuc' },
      { name: 'UW–Madison',  href: '/midwests-best/wisconsin' },
    ],
  },
  {
    key: 'global',
    labelEn: 'Global Top 10', labelZh: '全球十强', labelEs: 'Top 10 Global',
    href: '/global-top-10',
    viewAllEn: 'View All Global Schools', viewAllZh: '查看所有全球院校', viewAllEs: 'Ver Todas',
    calcHref: null,
    schools: [
      { name: 'Oxford',    href: '/global-top-10/oxford' },
      { name: 'Cambridge', href: '/global-top-10/cambridge' },
      { name: 'Imperial',  href: '/global-top-10/imperial-college-london' },
      { name: 'UCL',       href: '/global-top-10/ucl' },
      { name: 'U of T',    href: '/global-top-10/university-of-toronto' },
      { name: 'McGill',    href: '/global-top-10/mcgill' },
      { name: 'NUS',       href: '/global-top-10/national-university-of-singapore' },
      { name: 'Melbourne', href: '/global-top-10/university-of-melbourne' },
      { name: 'Edinburgh', href: '/global-top-10/university-of-edinburgh' },
      { name: 'UBC',       href: '/global-top-10/ubc' },
    ],
  },
]

const languages: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '中文',    short: '中文' },
  { code: 'es', label: 'Español', short: 'ES' },
]

// ── Component ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [openMenu,   setOpenMenu]     = useState<string | null>(null)
  const [langOpen,   setLangOpen]     = useState(false)
  const [loggedIn,   setLoggedIn]     = useState(false)
  const { lang, setLang, t } = useLanguage()
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('tcp_user'))
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (pathname?.startsWith('/dashboard')) return null

  return (
    <header className="sticky top-0 z-50">

      {/* ── Top mini bar ─────────────────────────────────────────────────── */}
      <div className="bg-navy text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">

          {/* Left: tagline */}
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            {t('Expert advisors from the Top 50 US Universities', '来自美国前50名大学的专业顾问', 'Asesores expertos de las mejores 50 universidades de EE.UU.')}
          </p>

          {/* Right: Language + Login */}
          <div className="flex items-center gap-4">

            {/* Language picker */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                aria-label="Switch language"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                  <path strokeWidth="1.8" strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                </svg>
                <span>{languages.find(l => l.code === lang)?.short}</span>
                <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white shadow-lg border border-gray-100 py-1 w-36 z-50">
                  {languages.map(opt => (
                    <button
                      key={opt.code}
                      onClick={() => { setLang(opt.code); setLangOpen(false) }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                        lang === opt.code ? 'text-brand-orange font-bold' : 'text-navy'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {lang === opt.code && (
                        <svg className="w-3.5 h-3.5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <span className="w-px h-3.5 bg-white/20" />

            {/* Login */}
            {loggedIn ? (
              <Link href="/dashboard" className="text-xs font-bold text-gray-300 hover:text-white transition-colors uppercase tracking-wider">
                {t('My Dashboard', '我的控制台', 'Mi Panel')}
              </Link>
            ) : (
              <Link href="/login" className="text-xs font-bold text-gray-300 hover:text-white transition-colors uppercase tracking-wider">
                {t('Login', '登录', 'Iniciar Sesión')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main nav bar ─────────────────────────────────────────────────── */}
      <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/images/tcp-logo-horizontal-cropped.png"
              alt="Top College Planning"
              width={220}
              height={60}
              className="h-14 w-auto object-contain"
              unoptimized
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">

            {navDropdowns.map(item => (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.key)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                {/* Label + chevron */}
                <div className="flex items-center gap-0.5">
                  <Link
                    href={item.href}
                    className="font-semibold text-navy hover:text-brand-orange transition-colors py-2 pr-1 text-sm whitespace-nowrap"
                  >
                    {t(item.labelEn, item.labelZh, item.labelEs)}
                  </Link>
                  <button
                    className="p-1 text-navy hover:text-brand-orange transition-colors"
                    aria-label={`Toggle ${item.labelEn} menu`}
                  >
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${openMenu === item.key ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Dropdown panel */}
                {openMenu === item.key && (
                  <div className="absolute top-full left-0 bg-white shadow-xl border-t-2 border-brand-orange w-52 py-2 z-50">
                    {/* View All */}
                    <Link
                      href={item.href}
                      className="flex items-center justify-between px-4 py-2.5 mb-1 border-b border-gray-100 text-brand-orange font-bold text-sm hover:bg-orange-50 transition-colors"
                    >
                      {t(item.viewAllEn, item.viewAllZh, item.viewAllEs)}
                      <span className="text-xs">→</span>
                    </Link>

                    {/* Individual schools */}
                    {item.schools.map(school => (
                      <Link
                        key={school.name}
                        href={school.href}
                        className="block px-4 py-2 text-navy hover:bg-gray-soft hover:text-brand-orange transition-colors font-medium text-sm"
                      >
                        {school.name}
                      </Link>
                    ))}

                    {/* Cost Calculator */}
                    {item.calcHref && (
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link
                          href={item.calcHref}
                          className="flex items-center justify-between px-4 py-2.5 text-brand-orange font-bold text-sm hover:bg-orange-50 transition-colors"
                        >
                          <span>🧮 {t('Cost Calculator', '费用计算器', 'Calculadora')}</span>
                          <span className="text-xs">→</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <Link href="/blog" className="font-semibold text-navy hover:text-brand-orange transition-colors text-sm">
              {t('Blog', '博客', 'Blog')}
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
            {navDropdowns.map(item => (
              <div key={item.key}>
                <Link
                  href={item.href}
                  className="px-4 py-3 font-semibold text-navy hover:text-brand-orange block"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(item.labelEn, item.labelZh, item.labelEs)}
                </Link>
                <div className="pl-6 flex flex-col">
                  {item.schools.map(school => (
                    <Link
                      key={school.name}
                      href={school.href}
                      className="py-1.5 text-sm text-gray-600 hover:text-brand-orange font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      {school.name}
                    </Link>
                  ))}
                  {item.calcHref && (
                    <Link
                      href={item.calcHref}
                      className="py-1.5 text-sm text-brand-orange font-bold"
                      onClick={() => setMobileOpen(false)}
                    >
                      🧮 {t('Cost Calculator', '费用计算器', 'Calculadora')}
                    </Link>
                  )}
                </div>
              </div>
            ))}

            <Link href="/blog" className="px-4 py-3 font-semibold text-navy hover:text-brand-orange" onClick={() => setMobileOpen(false)}>
              {t('Blog', '博客', 'Blog')}
            </Link>

            {/* Mobile language switcher */}
            <div className="px-4 py-3 border-t border-gray-100 mt-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Language', '语言', 'Idioma')}</p>
              <div className="flex gap-2">
                {languages.map(opt => (
                  <button
                    key={opt.code}
                    onClick={() => { setLang(opt.code); setMobileOpen(false) }}
                    className={`px-3 py-1.5 text-sm font-bold border transition-colors ${
                      lang === opt.code
                        ? 'bg-brand-orange text-white border-brand-orange'
                        : 'border-gray-200 text-navy hover:border-brand-orange'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Link href="/login" className="mx-4 mt-2 bg-brand-orange text-white font-bold px-6 py-3 text-center" onClick={() => setMobileOpen(false)}>
              {t('Login', '登录', 'Iniciar Sesión')}
            </Link>
          </nav>
        )}
      </div>
      </div>
    </header>
  )
}
