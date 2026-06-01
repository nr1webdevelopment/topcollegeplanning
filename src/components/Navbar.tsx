'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage, Lang } from '@/lib/i18n'

const ivyLeagueLinks = [
  { name: 'Harvard', href: '/ivy-league/harvard' },
  { name: 'Yale', href: '/ivy-league/yale' },
  { name: 'Princeton', href: '/ivy-league/princeton' },
  { name: 'Columbia', href: '/ivy-league/columbia' },
  { name: 'Penn', href: '/ivy-league/penn' },
  { name: 'Cornell', href: '/ivy-league/cornell' },
  { name: 'Dartmouth', href: '/ivy-league/dartmouth' },
  { name: 'Brown', href: '/ivy-league/brown' },
]

const languages: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '中文', short: '中文' },
  { code: 'es', label: 'Español', short: 'ES' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [ivyOpen, setIvyOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const { lang, setLang, t } = useLanguage()
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('tcp_user'))
  }, [])

  // Close lang dropdown on outside click
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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
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
          <nav className="hidden md:flex items-center gap-8">

            {/* Ivy League Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIvyOpen(true)}
              onMouseLeave={() => setIvyOpen(false)}
            >
              <div className="flex items-center gap-0.5">
                <Link
                  href="/ivy-league"
                  className="font-semibold text-navy hover:text-brand-orange transition-colors py-2 pr-1"
                >
                  {t('Ivy League', '常青藤联盟', 'Liga Ivy')}
                </Link>
                <button
                  className="p-1 text-navy hover:text-brand-orange transition-colors"
                  aria-label="Toggle Ivy League menu"
                >
                  <svg className={`w-4 h-4 transition-transform ${ivyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {ivyOpen && (
                <div className="absolute top-full left-0 bg-white shadow-xl border-t-2 border-brand-orange w-52 py-2 z-50">
                  <Link
                    href="/ivy-league"
                    className="flex items-center justify-between px-4 py-2.5 mb-1 border-b border-gray-100 text-brand-orange font-bold text-sm hover:bg-orange-50 transition-colors"
                  >
                    {t('View All Ivy Schools', '查看所有常青藤', 'Ver Todas')}
                    <span className="text-xs">→</span>
                  </Link>
                  {ivyLeagueLinks.map(link => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-2 text-navy hover:bg-gray-soft hover:text-brand-orange transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      href="/ivy-league/cost-calculator"
                      className="flex items-center justify-between px-4 py-2.5 text-brand-orange font-bold text-sm hover:bg-orange-50 transition-colors"
                    >
                      <span>🧮 {t('Cost Calculator', '费用计算器', 'Calculadora')}</span>
                      <span className="text-xs">→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/top-law-schools" className="font-semibold text-navy hover:text-brand-orange transition-colors">
              {t('Top Law Schools', '顶尖法学院', 'Mejores Escuelas de Derecho')}
            </Link>
            <Link href="/m7-business-schools" className="font-semibold text-navy hover:text-brand-orange transition-colors">
              {t('M7 Business Schools', 'M7商学院', 'Escuelas M7')}
            </Link>
            <Link href="/californias-best" className="font-semibold text-navy hover:text-brand-orange transition-colors">
              {t("California's Best", '加州名校', 'Lo Mejor de California')}
            </Link>
            <Link href="/midwests-best" className="font-semibold text-navy hover:text-brand-orange transition-colors">
              {t("Midwest's Best", '中西部名校', 'Lo Mejor del Medio Oeste')}
            </Link>
            <Link href="/global-top-10" className="font-semibold text-navy hover:text-brand-orange transition-colors">
              {t('Global Top 10', '全球十强', 'Top 10 Global')}
            </Link>
            <Link href="/blog" className="font-semibold text-navy hover:text-brand-orange transition-colors">
              {t('Blog', '博客', 'Blog')}
            </Link>

            {/* Globe language picker */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-xs font-bold border border-gray-200 px-2.5 py-1.5 text-navy hover:border-brand-orange hover:text-brand-orange transition-colors"
                aria-label="Switch language"
              >
                {/* Globe SVG */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {loggedIn ? (
              <Link href="/dashboard" className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-2 transition-colors">
                {t('My Dashboard', '我的控制台', 'Mi Panel')}
              </Link>
            ) : (
              <Link href="/login" className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-2 transition-colors">
                {t('Login', '登录', 'Iniciar Sesión')}
              </Link>
            )}
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
          <nav className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-1">
            <Link href="/ivy-league" className="px-4 py-3 font-semibold text-navy hover:text-brand-orange" onClick={() => setMobileOpen(false)}>
              {t('Ivy League', '常青藤联盟', 'Liga Ivy')}
            </Link>
            <Link href="/top-law-schools" className="px-4 py-3 font-semibold text-navy hover:text-brand-orange" onClick={() => setMobileOpen(false)}>
              {t('Top Law Schools', '顶尖法学院', 'Mejores Escuelas de Derecho')}
            </Link>
            <Link href="/m7-business-schools" className="px-4 py-3 font-semibold text-navy hover:text-brand-orange" onClick={() => setMobileOpen(false)}>
              {t('M7 Business Schools', 'M7商学院', 'Escuelas M7')}
            </Link>
            <Link href="/californias-best" className="px-4 py-3 font-semibold text-navy hover:text-brand-orange" onClick={() => setMobileOpen(false)}>
              {t("California's Best", '加州名校', 'Lo Mejor de California')}
            </Link>
            <Link href="/midwests-best" className="px-4 py-3 font-semibold text-navy hover:text-brand-orange" onClick={() => setMobileOpen(false)}>
              {t("Midwest's Best", '中西部名校', 'Lo Mejor del Medio Oeste')}
            </Link>
            <Link href="/global-top-10" className="px-4 py-3 font-semibold text-navy hover:text-brand-orange" onClick={() => setMobileOpen(false)}>
              {t('Global Top 10', '全球十强', 'Top 10 Global')}
            </Link>
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
    </header>
  )
}
