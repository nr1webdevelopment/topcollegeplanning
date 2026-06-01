'use client'
import Link from 'next/link'
import { globalUniversities, honorableMentions } from '@/data/global-universities-data'
import { nameToSlug, getAlumnusByName } from '@/data/notable-alumni-data'
import { useLanguage } from '@/lib/i18n'
import type { GlobalUniversity } from '@/data/global-universities-data'

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
    </div>
  )
}

function BarRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-semibold text-navy">{label}</span>
        <span className="text-sm font-black" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function GlobalSchoolContent({ school }: { school: GlobalUniversity }) {
  const { t, lang } = useLanguage()

  const allSchools = [...globalUniversities, ...honorableMentions]
  const schoolIndex = globalUniversities.findIndex(u => u.slug === school.slug)
  const isTop10 = schoolIndex !== -1
  const rank = isTop10 ? schoolIndex + 1 : null
  const otherTop10 = globalUniversities.filter(u => u.slug !== school.slug).slice(0, 5)

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="text-white py-16" style={{ backgroundColor: school.color }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/global-top-10"
            className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            ← {t('Global Top 10', '全球十强', 'Top 10 Global')}
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div className="flex-shrink-0 w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-lg p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={school.logoUrl} alt={`${school.name} logo`} className="w-full h-full object-contain" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                  {school.flag} {school.country}
                </span>
                {rank && (
                  <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                    #{rank} {t('Global (English-Speaking)', '全球（英语授课）', 'Global (Habla Inglesa)')}
                  </span>
                )}
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                  {t('Est.', '创立于', 'Fund.')} {school.founded}
                </span>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                  QS #{school.qsRanking}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-1">{school.name}</h1>
              <p className="text-white/70 text-lg">{school.city}</p>
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 bg-black/20 rounded-lg p-6">
            <StatPill label={t('QS World Rank', 'QS世界排名', 'Ranking QS Mundial')} value={`#${school.qsRanking}`} color="#fff" />
            <StatPill label={t('THE World Rank', 'THE世界排名', 'Ranking THE Mundial')} value={`#${school.theRanking}`} color="#fff" />
            <StatPill label={t('Nobel Laureates', '诺贝尔奖得主', 'Premios Nobel')} value={`${school.nobelLaureates}`} color="#FCD34D" />
            <StatPill label={t('Accept Rate', '录取率', 'Tasa de Admisión')} value={school.acceptanceRate} color="#fff" />
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── MAIN COLUMN ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Overview */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span> {t('Overview', '学校概况', 'Descripción General')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {lang === 'zh' ? (school.descriptionZh ?? school.description) : lang === 'es' ? (school.descriptionEs ?? school.description) : school.description}
              </p>
            </section>

            {/* Rankings */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-6 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span> {t('World Rankings', '世界排名', 'Rankings Mundiales')}
              </h2>
              <div className="space-y-1">
                <BarRow
                  label={t('QS World University Rankings 2025', 'QS世界大学排名2025', 'Ranking QS Mundial de Universidades 2025')}
                  value={`#${school.qsRanking}`}
                  pct={Math.max(5, 100 - school.qsRanking * 0.5)}
                  color={school.color}
                />
                <BarRow
                  label={t('Times Higher Education (THE)', '泰晤士高等教育排名', 'Times Higher Education (THE)')}
                  value={`#${school.theRanking}`}
                  pct={Math.max(5, 100 - school.theRanking * 0.3)}
                  color={school.color}
                />
                <BarRow
                  label={t('ARWU / Shanghai Rankings', 'ARWU软科世界大学排名', 'Rankings ARWU / Shanghái')}
                  value={`#${school.arwuRanking}`}
                  pct={Math.max(5, 100 - school.arwuRanking * 0.5)}
                  color={school.color}
                />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-soft p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('Total Students', '在校生总数', 'Total de Estudiantes')}</p>
                  <p className="text-xl font-black text-navy">{school.totalStudents}</p>
                </div>
                <div className="bg-gray-soft p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('International', '国际学生', 'Internacional')}</p>
                  <p className="text-xl font-black text-navy">{school.internationalPct}</p>
                </div>
                <div className="bg-gray-soft p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('Founded', '建校年份', 'Fundada')}</p>
                  <p className="text-xl font-black text-navy">{school.founded}</p>
                </div>
              </div>
            </section>

            {/* Programs & Research */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-6 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span> {t('Programs & Research Strengths', '专业与科研优势', 'Programas y Fortalezas de Investigación')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-navy text-sm uppercase tracking-wider mb-3">{t('Notable Programs', '知名专业', 'Programas Destacados')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {school.notablePrograms.map(p => (
                      <span key={p} className="px-3 py-1 text-xs font-semibold bg-gray-soft border border-gray-200 text-navy">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm uppercase tracking-wider mb-3">{t('Research Strengths', '科研优势', 'Fortalezas de Investigación')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {school.researchStrengths.map(r => (
                      <span key={r} className="px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: school.color }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Program highlights */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-6 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span> {t(`Why ${school.shortName}?`, `为何选择 ${school.shortName}？`)}
              </h2>
              <ul className="space-y-4">
                {(lang === 'zh' ? (school.programHighlightsZh ?? school.programHighlights) : lang === 'es' ? (school.programHighlightsEs ?? school.programHighlights) : school.programHighlights).map((h, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black mt-0.5" style={{ backgroundColor: school.color }}>
                      {i + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Notable alumni */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span> {t('Notable Alumni', '知名校友', 'Alumni Destacados')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {school.notableAlumni.map(name => {
                  const hasProfile = !!getAlumnusByName(name)
                  return hasProfile ? (
                    <Link key={name} href={`/notable-alumni/${nameToSlug(name)}`}
                      className="px-4 py-2 text-sm font-semibold border border-gray-200 text-navy hover:border-brand-orange hover:text-brand-orange transition-colors">
                      {name}
                    </Link>
                  ) : (
                    <span key={name} className="px-4 py-2 text-sm font-semibold border border-gray-200 text-navy cursor-default">
                      {name}
                    </span>
                  )
                })}
              </div>
            </section>
          </div>

          {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Key facts */}
            <div className="bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">📋 {t('Key Facts', '基本信息', 'Datos Clave')}</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-400 font-medium">{t('Country', '国家', 'País')}</dt>
                  <dd className="font-bold text-navy text-right">{school.flag} {school.country}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-400 font-medium">{t('City', '城市', 'Ciudad')}</dt>
                  <dd className="font-bold text-navy text-right">{school.city}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-400 font-medium">{t('Founded', '建校年份', 'Fundada')}</dt>
                  <dd className="font-bold text-navy">{school.founded}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-400 font-medium">{t('Total Students', '在校生总数', 'Total de Estudiantes')}</dt>
                  <dd className="font-bold text-navy">{school.totalStudents}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-400 font-medium">{t('International', '国际学生比例', 'Internacional')}</dt>
                  <dd className="font-bold text-navy">{school.internationalPct}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-400 font-medium">{t('Acceptance Rate', '录取率', 'Tasa de Aceptación')}</dt>
                  <dd className="font-bold text-navy">{school.acceptanceRate}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-400 font-medium">{t('Nobel Laureates', '诺贝尔奖得主', 'Premios Nobel')}</dt>
                  <dd className="font-bold text-yellow-600">{school.nobelLaureates} 🏆</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400 font-medium">{t('Intl Tuition', '国际生学费', 'Matrícula Internacional')}</dt>
                  <dd className="font-bold text-navy text-right text-xs leading-snug">{school.undergradTuitionIntl}</dd>
                </div>
              </dl>
            </div>

            {/* Rankings summary */}
            <div className="p-6 shadow-sm" style={{ backgroundColor: school.color }}>
              <h3 className="font-black text-white text-sm uppercase tracking-wider mb-4">🏆 {t('Rankings', '排名', 'Rankings')}</h3>
              <div className="space-y-3">
                {[
                  { label: t('QS World', 'QS世界', 'QS Mundial'), value: `#${school.qsRanking}` },
                  { label: t('Times Higher Ed', '泰晤士高等教育', 'Times Higher Ed'), value: `#${school.theRanking}` },
                  { label: t('ARWU/Shanghai', 'ARWU软科', 'ARWU/Shanghái'), value: `#${school.arwuRanking}` },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center border-b border-white/20 pb-2 last:border-0 last:pb-0">
                    <span className="text-white/70 text-sm">{r.label}</span>
                    <span className="text-white font-black text-lg">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-soft p-6 text-center">
              <h3 className="font-black text-navy mb-2">{t(`Applying to ${school.shortName}?`, `申请 ${school.shortName}？`)}</h3>
              <p className="text-gray-500 text-sm mb-4">
                {t('Our advisors have helped students gain acceptance to top global universities. Get expert guidance.', '我们的顾问已帮助众多学生获得全球顶尖大学的录取。立即获取专业指导。', 'Nuestros asesores han ayudado a estudiantes a ingresar a las mejores universidades del mundo. Obtén orientación experta.')}
              </p>
              <Link href="/shop" className="btn-primary text-sm">
                {t('Get Expert Guidance', '获取专业指导', 'Obtener Orientación Experta')}
              </Link>
            </div>

            {/* Other schools */}
            <div className="bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">🌍 {t('Other Global Top 10', '其他全球十强', 'Otros del Top 10 Global')}</h3>
              <ul className="space-y-2">
                {otherTop10.map(u => (
                  <li key={u.slug}>
                    <Link href={`/global-top-10/${u.slug}`}
                      className="flex items-center justify-between text-sm font-semibold text-navy hover:text-brand-orange transition-colors py-1">
                      <span>{u.flag} {u.shortName}</span>
                      <span className="text-gray-400 text-xs">QS #{u.qsRanking} →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
