'use client'
import { alumni } from '@/lib/content'
import { proxyImage } from '@/lib/image-utils'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import { useState, useMemo } from 'react'

// ── Category config ────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'All',           label: 'All',           emoji: '🎓' },
  { key: 'Government',    label: 'Government',    emoji: '🏛️' },
  { key: 'Business',      label: 'Business',      emoji: '💼' },
  { key: 'Tech',          label: 'Tech',          emoji: '💻' },
  { key: 'Entertainment', label: 'Entertainment', emoji: '🎬' },
  { key: 'Sports',        label: 'Sports',        emoji: '🏆' },
  { key: 'Media',         label: 'Media',         emoji: '📺' },
  { key: 'Literature',    label: 'Literature',    emoji: '📚' },
]

// ── Affiliation filter chips ────────────────────────────────────────────────
// Each entry defines keywords matched against bio + title + degree fields
const AFFILIATIONS: { key: string; label: string; emoji: string; keywords: string[] }[] = [
  { key: 'US President',  label: 'US President',  emoji: '🇺🇸', keywords: ['president of the united states', '44th president', '43rd president', '42nd president', '41st president', '40th president', 'potus'] },
  { key: 'Goldman Sachs', label: 'Goldman Sachs', emoji: '🏦', keywords: ['goldman sachs', 'goldman'] },
  { key: 'JPMorgan',      label: 'JPMorgan',      emoji: '🏦', keywords: ['jpmorgan', 'jp morgan', 'j.p. morgan'] },
  { key: 'Morgan Stanley',label: 'Morgan Stanley',emoji: '🏦', keywords: ['morgan stanley'] },
  { key: 'BlackRock',     label: 'BlackRock',     emoji: '🏦', keywords: ['blackrock'] },
]

function matchesAffiliation(a: { bio?: string; title: string; degree?: string }, affKey: string): boolean {
  const aff = AFFILIATIONS.find(af => af.key === affKey)
  if (!aff) return false
  const text = `${a.bio || ''} ${a.title} ${a.degree || ''}`.toLowerCase()
  return aff.keywords.some(kw => text.includes(kw))
}

const CATEGORY_COLORS: Record<string, string> = {
  Government:    '#1a2e5a',
  Business:      '#0f3d23',
  Tech:          '#0d2b4a',
  Entertainment: '#4a1a2e',
  Sports:        '#2a1a4a',
  Media:         '#4a3010',
  Literature:    '#3a1040',
}

// Normalize graduate/professional school names → parent university
const SCHOOL_NORMALIZE: Record<string, string> = {
  'Harvard Business School':          'Harvard University',
  'Harvard College':                  'Harvard University',
  'Harvard Law':                      'Harvard University',
  'Harvard Law School':               'Harvard University',
  'Stanford GSB':                     'Stanford University',
  'Stanford Graduate School of Business': 'Stanford University',
  'Yale College':                     'Yale University',
  'Yale Law':                         'Yale University',
  'Yale Law School':                  'Yale University',
  'Columbia Business School':         'Columbia University',
  'Columbia Law School':              'Columbia University',
  'Penn Law':                         'University of Pennsylvania',
  'University of Pennsylvania (Wharton)': 'University of Pennsylvania',
  'Wharton':                          'University of Pennsylvania',
  'Cornell Law School':               'Cornell University',
  'Dartmouth College':                'Dartmouth University',
  'Tuck School of Business':          'Dartmouth University',
  'Princeton University':             'Princeton University',
  'UCLA': 'University of California, Los Angeles',
  'University of Southern California': 'University of Southern California',
}

// Schools to exclude from the dropdown (secondary/foreign institutions)
const SCHOOL_EXCLUDE = new Set(['Oxford'])

function normalizeSchool(raw: string): string {
  return SCHOOL_NORMALIZE[raw.trim()] ?? raw.trim()
}

function getSchools(university: string): string[] {
  return university.split('&').map(s => normalizeSchool(s))
}

export default function AlumniPage() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeAffiliation, setActiveAffiliation] = useState('All')
  const [selectedSchool, setSelectedSchool] = useState('All')

  // Collect unique normalized schools sorted alphabetically, excluding unwanted entries
  const schools = useMemo(() => {
    const set = new Set<string>()
    alumni.forEach(a => {
      if (!a.university) return
      getSchools(a.university).forEach(s => { if (s && !SCHOOL_EXCLUDE.has(s)) set.add(s) })
    })
    return ['All', ...Array.from(set).sort()]
  }, [])

  // Filtered list — all three filters are independent (AND logic)
  const filtered = useMemo(() => {
    return alumni.filter(a => {
      const catMatch = activeCategory === 'All' || a.category === activeCategory
      const schoolMatch =
        selectedSchool === 'All' ||
        (a.university ? getSchools(a.university).includes(selectedSchool) : false)
      const affMatch =
        activeAffiliation === 'All' || matchesAffiliation(a, activeAffiliation)
      return catMatch && schoolMatch && affMatch
    })
  }, [activeCategory, selectedSchool, activeAffiliation])

  const clearFilters = () => { setActiveCategory('All'); setActiveAffiliation('All'); setSelectedSchool('All') }
  const hasFilters = activeCategory !== 'All' || selectedSchool !== 'All' || activeAffiliation !== 'All'

  // School change never resets category or affiliation
  const handleSchoolChange = (school: string) => {
    setSelectedSchool(school)
    // intentionally does NOT touch activeCategory or activeAffiliation
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="bg-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t('Notable Alumni', '知名校友', 'Alumni Destacados')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t(
              "Celebrated figures who walked the same halls you're aiming for — Nobel laureates, presidents, founders, and cultural icons who graduated from the world's top universities.",
              '曾在你向往的校园中学习的杰出人物——诺贝尔奖得主、国家元首、创业先驱和文化偶像，他们都毕业于全球顶尖大学。',
              'Figuras célebres que caminaron por los mismos pasillos que tú aspiras — premios Nobel, presidentes, fundadores e íconos culturales graduados de las mejores universidades del mundo.'
            )}
          </p>
        </div>
      </div>

      {/* ── FILTER BAR ───────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex flex-col gap-2">

          {/* Row 1: Category chips + School dropdown */}
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-150 border-2 ${
                    activeCategory === key
                      ? 'bg-brand-orange border-brand-orange text-white shadow'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* School dropdown + clear */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  School
                </label>
                <select
                  value={selectedSchool}
                  onChange={e => handleSchoolChange(e.target.value)}
                  className="border-2 border-gray-200 text-sm font-semibold text-navy px-3 py-1.5 focus:outline-none focus:border-brand-orange bg-white max-w-[230px] cursor-pointer"
                >
                  {schools.map(s => (
                    <option key={s} value={s}>{s === 'All' ? 'All Schools' : s}</option>
                  ))}
                </select>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-brand-orange font-bold uppercase tracking-wide transition-colors whitespace-nowrap"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Affiliation chips */}
          <div className="flex flex-wrap gap-2 pb-1">
            {AFFILIATIONS.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => setActiveAffiliation(activeAffiliation === key ? 'All' : key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wide transition-all duration-150 border-2 ${
                  activeAffiliation === key
                    ? 'bg-navy border-navy text-white shadow'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-navy hover:text-navy'
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2.5">
          <p className="text-xs text-gray-400 font-medium">
            {filtered.length === alumni.length
              ? `Showing all ${alumni.length} alumni`
              : `${filtered.length} of ${alumni.length} alumni`}
            {activeCategory !== 'All' && (
              <span className="ml-1 text-brand-orange">· {activeCategory}</span>
            )}
            {activeAffiliation !== 'All' && (
              <span className="ml-1 text-brand-orange">· {activeAffiliation}</span>
            )}
            {selectedSchool !== 'All' && (
              <span className="ml-1 text-brand-orange">· {selectedSchool.split('&')[0].trim()}</span>
            )}
          </p>
        </div>
      </div>

      {/* ── GRID ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400 text-lg font-medium">No alumni match this filter.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-brand-orange font-bold text-sm uppercase tracking-wide hover:underline"
            >
              Clear filters →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map(alumnus => {
              const catColor = CATEGORY_COLORS[alumnus.category || ''] || '#1a2e5a'
              return (
                <Link
                  key={alumnus.id}
                  href={`/alumni/${alumnus.slug}`}
                  className="group bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:border-brand-orange transition-all duration-300"
                >
                  {/* Photo */}
                  <div
                    className="relative w-full h-64 overflow-hidden"
                    style={{ backgroundColor: catColor }}
                  >
                    {alumnus.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={proxyImage(alumnus.photo)}
                        alt={alumnus.title}
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white font-black text-6xl opacity-60">
                          {alumnus.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category badge top-left */}
                    {alumnus.category && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-white/30">
                          {CATEGORIES.find(c => c.key === alumnus.category)?.emoji}{' '}
                          {alumnus.category}
                        </span>
                      </div>
                    )}

                    {/* University badge bottom */}
                    {alumnus.university && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="inline-block bg-brand-orange text-white text-xs font-bold uppercase tracking-wider px-2 py-1">
                          {alumnus.university.split('&')[0].trim()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h2 className="text-lg font-black text-navy group-hover:text-brand-orange transition-colors mb-1">
                      {alumnus.title}
                    </h2>
                    {alumnus.degree && (
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                        {alumnus.degree}
                      </p>
                    )}
                    {alumnus.bio && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {alumnus.bio}
                      </p>
                    )}
                    <span className="mt-4 inline-block text-brand-orange font-bold text-sm uppercase tracking-wide">
                      {t('Read Profile →', '查看简介 →', 'Leer Perfil →')}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
