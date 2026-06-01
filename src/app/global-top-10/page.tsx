'use client'
import Link from 'next/link'
import { globalUniversities, honorableMentions } from '@/data/global-universities-data'
import { useLanguage } from '@/lib/i18n'

export default function GlobalTop10Page() {
  const { t } = useLanguage()

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <div className="relative text-white py-20 overflow-hidden">
        {/* Background photo — Stanford Campus */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/blog/stanford-campus.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Navy overlay */}
        <div className="absolute inset-0 bg-navy opacity-80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-3">{t('World-Class Education', '世界顶尖教育', 'Educación de Clase Mundial')}</p>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">{t('Global Top 10', '全球十强', 'Top 10 Global')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            {t(
              "The world's finest English-speaking universities outside the United States — ranked by QS, THE, and academic reputation. From Oxford's medieval spires to Singapore's innovation hub.",
              '美国以外全球顶尖英语授课大学——综合QS、THE及学术声誉排名。从牛津的中世纪尖塔到新加坡的创新高地。',
              'Las mejores universidades de habla inglesa del mundo fuera de Estados Unidos — clasificadas por QS, THE y reputación académica. Desde las torres medievales de Oxford hasta el hub de innovación de Singapur.'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── RANKINGS TABLE ──────────────────────────────────────────────── */}
        <h2 className="section-title mb-8">{t('Top 10 Ranked Schools', '全球十强院校', 'Las 10 Mejores Universidades del Mundo')}</h2>
        <div className="overflow-x-auto mb-16">
          <table className="w-full border-collapse bg-white shadow-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="py-4 px-4 text-left font-bold w-10">#</th>
                <th className="py-4 px-4 text-left font-bold">{t('University', '大学', 'Universidad')}</th>
                <th className="py-4 px-4 text-center font-bold hidden sm:table-cell">{t('Country', '国家', 'País')}</th>
                <th className="py-4 px-4 text-center font-bold hidden md:table-cell">{t('QS Rank', 'QS排名', 'Ranking QS')}</th>
                <th className="py-4 px-4 text-center font-bold hidden md:table-cell">{t('THE Rank', 'THE排名', 'Ranking THE')}</th>
                <th className="py-4 px-4 text-center font-bold hidden lg:table-cell">{t('Nobel', '诺贝尔', 'Nobel')}</th>
                <th className="py-4 px-4 text-center font-bold">{t('Accept %', '录取率', 'Admisión %')}</th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {globalUniversities.map((school, i) => (
                <tr key={school.slug}
                  className={`border-b border-gray-100 hover:bg-orange-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-4 px-4 font-black text-brand-orange text-lg">{i + 1}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={school.logoUrl} alt={school.shortName} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <Link href={`/global-top-10/${school.slug}`} className="font-bold text-navy hover:text-brand-orange transition-colors block">{school.name}</Link>
                        <span className="text-xs text-gray-400">{school.city}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center hidden sm:table-cell">
                    <span className="text-lg" title={school.country}>{school.flag}</span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-navy hidden md:table-cell">#{school.qsRanking}</td>
                  <td className="py-4 px-4 text-center text-gray-600 text-sm hidden md:table-cell">#{school.theRanking}</td>
                  <td className="py-4 px-4 text-center font-bold text-yellow-600 hidden lg:table-cell">{school.nobelLaureates}</td>
                  <td className="py-4 px-4 text-center text-gray-500 text-sm">{school.acceptanceRate}</td>
                  <td className="py-4 px-4">
                    <Link href={`/global-top-10/${school.slug}`}
                      className="text-brand-orange text-sm font-bold hover:underline whitespace-nowrap">
                      {t('View →', '查看 →', 'Ver →')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── SCHOOL CARDS ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {globalUniversities.map((school, i) => (
            <Link
              key={school.slug}
              href={`/global-top-10/${school.slug}`}
              className="group bg-gray-soft border-l-4 hover:shadow-md transition-all block"
              style={{ borderColor: school.color }}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={school.logoUrl} alt={school.shortName} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg">{school.flag}</span>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: school.color }}>
                        #{i + 1} {t('Global', '全球', 'Global')} · QS #{school.qsRanking}
                      </p>
                    </div>
                    <h3 className="font-bold text-navy text-lg group-hover:text-brand-orange transition-colors leading-tight">{school.name}</h3>
                    <p className="text-sm text-gray-500">{school.city}, {school.country}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">QS</p>
                    <p className="font-black text-navy">#{school.qsRanking}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">THE</p>
                    <p className="font-black text-navy">#{school.theRanking}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{t('Nobel', '诺贝尔', 'Nobel')}</p>
                    <p className="font-black text-yellow-600">{school.nobelLaureates}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{t('Accept', '录取率', 'Admisión')}</p>
                    <p className="font-black text-navy">{school.acceptanceRate}</p>
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider group-hover:underline">
                    {t('Full Profile →', '完整资料 →', 'Perfil Completo →')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── HONORABLE MENTIONS ──────────────────────────────────────────── */}
        <h2 className="section-title mb-4">{t('Honorable Mentions', '荣誉提名', 'Menciones Honoríficas')}</h2>
        <p className="text-gray-500 mb-8">{t('Outstanding English-speaking universities just outside the top 10 — each world-class in their own right.', '顶尖英语授课大学中刚好排在十强之外的优秀院校——每一所都享誉全球。', 'Universidades de habla inglesa excepcionales justo fuera del top 10 — cada una de clase mundial por mérito propio.')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {honorableMentions.map(school => (
            <Link
              key={school.slug}
              href={`/global-top-10/${school.slug}`}
              className="group bg-white border border-gray-200 hover:border-brand-orange hover:shadow-md transition-all block p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center p-1 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={school.logoUrl} alt={school.shortName} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{school.flag}</span>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">QS #{school.qsRanking}</p>
                  </div>
                  <h3 className="font-bold text-navy group-hover:text-brand-orange transition-colors text-sm leading-snug">{school.name}</h3>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{school.description.slice(0, 120)}…</p>
              <div className="mt-3 text-right">
                <span className="text-xs font-bold text-brand-orange group-hover:underline">{t('View Profile →', '查看详情 →', 'Ver Perfil →')}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div className="bg-gray-soft p-10 text-center">
          <h3 className="text-2xl font-bold text-navy mb-3">{t('Thinking About Studying Abroad?', '考虑出国留学？', '¿Pensando en Estudiar en el Extranjero?')}</h3>
          <p className="text-gray-500 mb-6 max-w-xl mx-auto">{t('Our advisors have helped students gain acceptance to Oxford, Cambridge, McGill, and universities across the world. Get personalized guidance today.', '我们的顾问已帮助众多学生成功获得牛津、剑桥、麦吉尔等全球顶尖大学的录取。立即获取个性化指导。', 'Nuestros asesores han ayudado a estudiantes a ser aceptados en Oxford, Cambridge, McGill y universidades de todo el mundo. Obtén orientación personalizada hoy.')}</p>
          <Link href="/shop" className="btn-primary">{t('Get Expert Guidance', '获取专业指导', 'Obtener Orientación Experta')}</Link>
        </div>
      </div>
    </div>
  )
}
