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
  { key: 'Law',           label: 'Law',           emoji: '⚖️' },
  { key: 'Nobel',         label: 'Nobel Prize',   emoji: '🏅' },
  { key: 'NASA',          label: 'NASA',          emoji: '🚀' },
]

// ── Affiliation filter chips ───────────────────────────────────────────────
const AFFILIATIONS: { key: string; label: string; emoji: string; keywords: string[] }[] = [
  { key: 'US President',  label: 'US President',  emoji: '🇺🇸', keywords: ['president of the united states', '44th president', '43rd president', '42nd president', '41st president', '40th president', 'potus'] },
  { key: 'Banking',       label: 'Banking',       emoji: '🏦', keywords: ['goldman sachs', 'goldman', 'jpmorgan', 'jp morgan', 'j.p. morgan', 'morgan stanley', 'blackrock', 'citigroup', 'citibank', 'bank of america', 'wells fargo', 'federal reserve'] },
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
  Law:           '#2a1a0a',
  Nobel:         '#7B5200',
  NASA:          '#0b3d91',
}

// Normalize graduate/professional school names → parent university
const SCHOOL_NORMALIZE: Record<string, string> = {
  'Harvard Business School':               'Harvard University',
  'Harvard College':                       'Harvard University',
  'Harvard Law':                           'Harvard University',
  'Harvard Law School':                    'Harvard University',
  'Stanford GSB':                          'Stanford University',
  'Stanford Graduate School of Business':  'Stanford University',
  'Yale College':                          'Yale University',
  'Yale Law':                              'Yale University',
  'Yale Law School':                       'Yale University',
  'Columbia Business School':              'Columbia University',
  'Columbia Law School':                   'Columbia University',
  'Penn Law':                              'University of Pennsylvania',
  'University of Pennsylvania (Wharton)':  'University of Pennsylvania',
  'Wharton':                               'University of Pennsylvania',
  'Cornell Law School':                    'Cornell University',
  'Dartmouth College':                     'Dartmouth University',
  'Tuck School of Business':               'Dartmouth University',
  'Princeton University':                  'Princeton University',
  'UCLA':                                  'University of California, Los Angeles',
  'University of Southern California':     'University of Southern California',
}

const SCHOOL_EXCLUDE = new Set(['Oxford'])

function normalizeSchool(raw: string): string {
  return SCHOOL_NORMALIZE[raw.trim()] ?? raw.trim()
}

function getSchools(university: string): string[] {
  return university.split('&').map(s => normalizeSchool(s))
}

// ── View toggle icons ──────────────────────────────────────────────────────
function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={active ? 'text-brand-orange' : 'text-gray-400'}>
      <rect x="1" y="1" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="10" y="1" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="1" y="10" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="10" y="10" width="7" height="7" rx="1" fill="currentColor" />
    </svg>
  )
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={active ? 'text-brand-orange' : 'text-gray-400'}>
      <rect x="1" y="2" width="16" height="2.5" rx="1" fill="currentColor" />
      <rect x="1" y="7.75" width="16" height="2.5" rx="1" fill="currentColor" />
      <rect x="1" y="13.5" width="16" height="2.5" rx="1" fill="currentColor" />
    </svg>
  )
}

export default function AlumniPage() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory]   = useState('All')
  const [activeAffiliation, setActiveAffiliation] = useState('All')
  const [selectedSchool, setSelectedSchool]   = useState('All')
  const [searchQuery, setSearchQuery]         = useState('')
  const [viewMode, setViewMode]               = useState<'grid' | 'list'>('grid')

  // Collect unique normalized schools sorted alphabetically
  const schools = useMemo(() => {
    const set = new Set<string>()
    alumni.forEach(a => {
      if (!a.university) return
      getSchools(a.university).forEach(s => { if (s && !SCHOOL_EXCLUDE.has(s)) set.add(s) })
    })
    return ['All', ...Array.from(set).sort()]
  }, [])

  // Filtered + searched list
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = alumni.filter(a => {
      const catMatch  = activeCategory === 'All' || a.category === activeCategory
      const schoolMatch = selectedSchool === 'All' || (a.university ? getSchools(a.university).includes(selectedSchool) : false)
      const affMatch  = activeAffiliation === 'All' || matchesAffiliation(a, activeAffiliation)
      // Only search name, university, degree, category — NOT bio (bio mentions other people's names)
      const searchMatch = !q || [a.title, a.university, a.degree, a.category]
        .filter(Boolean).some(field => field!.toLowerCase().includes(q))
      return catMatch && schoolMatch && affMatch && searchMatch
    })
    // In list view always sort A–Z
    if (viewMode === 'list') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    }
    return list
  }, [activeCategory, selectedSchool, activeAffiliation, searchQuery, viewMode])

  const clearFilters = () => {
    setActiveCategory('All')
    setActiveAffiliation('All')
    setSelectedSchool('All')
    setSearchQuery('')
  }
  const hasFilters = activeCategory !== 'All' || selectedSchool !== 'All' || activeAffiliation !== 'All' || searchQuery !== ''

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <div className="bg-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {t('Notable Alumni', '知名校友', 'Alumni Destacados')}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t(
              "Celebrated figures who walked the same halls you're aiming for — Nobel laureates, presidents, founders, and cultural icons who graduated from the world's top universities.",
              '曾在你向往的校园中学习的杰出人物——诺贝尔奖得主、国家元首、创业先驱和文化偶像，他们都毕业于全球顶尖大学。',
              'Figuras célebres que caminaron por los mismos pasillos que tú aspiras — premios Nobel, presidentes, fundadores e íconos culturales graduados de las mejores universidades del mundo.'
            )}
          </p>
        </div>
      </div>

      {/* ── FILTER BAR ────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3">

          {/* Row 1 — Search + View toggle */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, school, or field…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-brand-orange outline-none pl-9 pr-4 py-2 text-sm font-medium text-navy placeholder-gray-400 bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 border-2 border-gray-200 p-1 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-brand-orange' : 'hover:bg-gray-100'}`}
                title="Grid view"
              >
                <GridIcon active={viewMode === 'grid'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-brand-orange' : 'hover:bg-gray-100'}`}
                title="List view (A–Z)"
              >
                <ListIcon active={viewMode === 'list'} />
              </button>
            </div>
          </div>

          {/* Row 2 — All filter chips (single-select) */}
          <div className="flex flex-wrap gap-2 items-center">
            {CATEGORIES.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => { setActiveCategory(key); setActiveAffiliation('All') }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-150 border-2 ${
                  activeCategory === key && activeAffiliation === 'All'
                    ? 'bg-brand-orange border-brand-orange text-white shadow'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}

            {/* Divider */}
            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Affiliation chips — same row, single-select */}
            {AFFILIATIONS.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => {
                  if (activeAffiliation === key) { setActiveAffiliation('All') }
                  else { setActiveAffiliation(key); setActiveCategory('All') }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-150 border-2 ${
                  activeAffiliation === key
                    ? 'bg-brand-orange border-brand-orange text-white shadow'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Row 3 — School dropdown + Clear */}
          <div className="flex flex-wrap items-center gap-3 pb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">School</span>
            <select
              value={selectedSchool}
              onChange={e => setSelectedSchool(e.target.value)}
              className="border-2 border-gray-200 text-sm font-semibold text-navy px-3 py-1.5 focus:outline-none focus:border-brand-orange bg-white max-w-[220px] cursor-pointer"
            >
              {schools.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Schools' : s}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-gray-400 hover:text-brand-orange font-bold uppercase tracking-wide transition-colors whitespace-nowrap"
              >
                ✕ Clear all
              </button>
            )}
          </div>
        </div>

        {/* Result count */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2.5">
          <p className="text-xs text-gray-400 font-medium">
            {filtered.length === alumni.length
              ? `Showing all ${alumni.length} alumni`
              : `${filtered.length} of ${alumni.length} alumni`}
            {activeCategory !== 'All' && <span className="ml-1 text-brand-orange">· {activeCategory}</span>}
            {activeAffiliation !== 'All' && <span className="ml-1 text-brand-orange">· {activeAffiliation}</span>}
            {selectedSchool !== 'All' && <span className="ml-1 text-brand-orange">· {selectedSchool.split('&')[0].trim()}</span>}
            {searchQuery && <span className="ml-1 text-brand-orange">· &ldquo;{searchQuery}&rdquo;</span>}
            {viewMode === 'list' && <span className="ml-1 text-gray-300">· A–Z</span>}
          </p>
        </div>
      </div>

      {/* ── RESULTS ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400 text-lg font-medium">No alumni match this search.</p>
            <button onClick={clearFilters} className="mt-4 text-brand-orange font-bold text-sm uppercase tracking-wide hover:underline">
              Clear filters →
            </button>
          </div>
        ) : viewMode === 'grid' ? (

          /* ── GRID VIEW ── */
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
                  <div className="relative w-full h-64 overflow-hidden" style={{ backgroundColor: catColor }}>
                    {alumnus.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={proxyImage(alumnus.photo)}
                        alt={alumnus.title}
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white font-black text-6xl opacity-60">{alumnus.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {alumnus.category && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-white/30">
                          {CATEGORIES.find(c => c.key === alumnus.category)?.emoji}{' '}{alumnus.category}
                        </span>
                      </div>
                    )}
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
                    <h2 className="text-lg font-black text-navy group-hover:text-brand-orange transition-colors mb-1">{alumnus.title}</h2>
                    {alumnus.degree && (
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">{alumnus.degree}</p>
                    )}
                    {alumnus.bio && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{alumnus.bio}</p>
                    )}
                    <span className="mt-4 inline-block text-brand-orange font-bold text-sm uppercase tracking-wide">
                      {t('Read Profile →', '查看简介 →', 'Leer Perfil →')}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

        ) : (

          /* ── LIST VIEW (A–Z) ── */
          <div className="border border-gray-100 divide-y divide-gray-100">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-5 py-2 bg-gray-50">
              <span className="col-span-4 text-xs font-bold uppercase tracking-widest text-gray-400">Name</span>
              <span className="col-span-4 text-xs font-bold uppercase tracking-widest text-gray-400">School</span>
              <span className="col-span-2 text-xs font-bold uppercase tracking-widest text-gray-400">Field</span>
              <span className="col-span-2 text-xs font-bold uppercase tracking-widest text-gray-400"></span>
            </div>

            {filtered.map(alumnus => {
              const catColor = CATEGORY_COLORS[alumnus.category || ''] || '#1a2e5a'
              const catEmoji = CATEGORIES.find(c => c.key === alumnus.category)?.emoji || ''
              return (
                <Link
                  key={alumnus.id}
                  href={`/alumni/${alumnus.slug}`}
                  className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-orange-50 transition-colors group"
                >
                  {/* Name + photo */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden"
                      style={{ backgroundColor: catColor }}
                    >
                      {alumnus.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={proxyImage(alumnus.photo)}
                          alt={alumnus.title}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white font-black text-sm">{alumnus.title.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-navy text-sm group-hover:text-brand-orange transition-colors leading-tight">
                      {alumnus.title}
                    </span>
                  </div>

                  {/* School */}
                  <div className="col-span-4">
                    <span className="text-sm text-gray-600 leading-tight">
                      {alumnus.university?.split('&')[0].trim() || '—'}
                    </span>
                    {alumnus.degree && (
                      <p className="text-xs text-gray-400 mt-0.5">{alumnus.degree.split('/')[0].trim()}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    {alumnus.category && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white px-2 py-0.5"
                        style={{ backgroundColor: catColor }}
                      >
                        {catEmoji} {alumnus.category}
                      </span>
                    )}
                  </div>

                  {/* Link */}
                  <div className="col-span-2 text-right">
                    <span className="text-xs font-bold text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                      Profile →
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
