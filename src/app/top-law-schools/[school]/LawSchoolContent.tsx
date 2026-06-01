'use client'
import Link from 'next/link'
import { lawSchools } from '@/data/law-schools-data'
import { nameToSlug, getAlumnusByName } from '@/data/notable-alumni-data'
import { useLanguage } from '@/lib/i18n'
import type { LawSchool } from '@/data/law-schools-data'

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-gray-100 p-5 flex items-start gap-4 shadow-sm">
      <div className="text-2xl mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-navy leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function OutcomeBar({ label, value, pct, color, sublabel }: { label: string; value: string; pct: number; color: string; sublabel?: string }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-1">
        <div>
          <span className="text-sm font-semibold text-navy">{label}</span>
          {sublabel && <span className="text-xs text-gray-400 ml-2">{sublabel}</span>}
        </div>
        <span className="text-sm font-black" style={{ color }}>{value}</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct * 100, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function LawSchoolContent({ school }: { school: LawSchool }) {
  const { t, lang } = useLanguage()
  const otherSchools = lawSchools.filter(s => s.slug !== school.slug)

  return (
    <div className="bg-gray-soft min-h-screen">
      {/* HERO */}
      <div className="relative overflow-hidden" style={{ backgroundColor: school.color }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          {[1,2,3].map(i => (
            <div key={i} className="absolute rounded-full border-2 border-white"
              style={{ width: `${i*260}px`, height: `${i*260}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">{t('Home', '首页', 'Inicio')}</Link>
            <span>/</span>
            <Link href="/top-law-schools" className="hover:text-white transition-colors">{t('Top Law Schools', '顶尖法学院', 'Mejores Escuelas de Derecho')}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{school.shortName}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            <div className="flex-shrink-0 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={school.logoUrl} alt={`${school.name} logo`} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-sm">{t('JD Program', '法学博士项目', 'Programa JD')}</span>
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-sm">{t('Est.', '创立于', 'Fund.')} {school.founded}</span>
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-sm">US News #{school.usNewsRanking}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2">{school.name}</h1>
              <p className="text-white/70 text-lg font-light">{school.university} · {school.location.city}, {school.location.state}</p>
            </div>
            <a href={school.website} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 bg-white text-navy font-bold px-6 py-3 uppercase tracking-wider text-sm hover:bg-gray-100 transition-colors">
              {t('Visit Official Site →', '访问官网 →', 'Visitar Sitio Oficial →')}
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { en: 'LSAT Median', zh: 'LSAT中位数', es: 'LSAT Mediano', value: school.lsatMedian.toString() },
              { en: 'Bar Pass Rate', zh: '律考通过率', es: 'Aprobación Barra', value: school.barPassRate },
              { en: 'BigLaw Placement', zh: '大所录用率', es: 'Empleo BigLaw', value: school.bigLawPlacement },
              { en: 'Acceptance Rate', zh: '录取率', es: 'Tasa de Admisión', value: school.acceptanceRate },
            ].map(stat => (
              <div key={stat.en} className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">{t(stat.en, stat.zh, stat.es)}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* About */}
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider border-l-4 pl-4 mb-4" style={{ borderColor: school.color }}>
                {t(`About ${school.shortName}`, `关于 ${school.shortName}`, `Acerca de ${school.shortName}`)}
              </h2>
              <p className="text-gray-600 leading-relaxed">{lang === 'zh' ? (school.descriptionZh ?? school.description) : lang === 'es' ? (school.descriptionEs ?? school.description) : school.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <StatCard icon="⚖️" label={t('Program', '项目', 'Programa')} value={school.programLength} />
                <StatCard icon="👥" label={t('Class Size', '班级规模', 'Tamaño de Clase')} value={school.classSize.toString()} sub={t('students per year', '每年招生人数', 'estudiantes por año')} />
                <StatCard icon="🌍" label={t('International', '国际学生', 'Internacional')} value={school.internationalPct} />
                <StatCard icon="👩" label={t('Women', '女生比例', 'Mujeres')} value={school.womenPct} />
              </div>
            </section>

            {/* LSAT & Admissions */}
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider border-l-4 pl-4 mb-6" style={{ borderColor: school.color }}>
                📝 {t('LSAT, GPA & Admissions', 'LSAT、GPA与录取', 'LSAT, GPA y Admisiones')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="border-2 p-6 text-center" style={{ borderColor: school.color }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{t('LSAT Median', 'LSAT中位数', 'LSAT Mediano')}</p>
                  <p className="text-5xl font-black mb-2" style={{ color: school.color }}>{school.lsatMedian}</p>
                  <p className="text-sm text-gray-500">25th–75th pct: <strong>{school.lsatRange}</strong></p>
                  <p className="text-xs text-gray-400 mt-2">{t('Max score: 180', '满分：180', 'Puntaje máx: 180')}</p>
                  <div className="mt-3 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(school.lsatMedian / 180) * 100}%`, backgroundColor: school.color }} />
                  </div>
                </div>
                <div className="border-2 p-6 text-center" style={{ borderColor: school.color }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{t('GPA Median', 'GPA中位数', 'GPA Mediano')}</p>
                  <p className="text-5xl font-black mb-2" style={{ color: school.color }}>{school.gpaMedian.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">25th–75th pct: <strong>{school.gpaRange}</strong></p>
                  <p className="text-xs text-gray-400 mt-2">{t('Max GPA: 4.00', '满分GPA：4.00', 'GPA máx: 4.00')}</p>
                  <div className="mt-3 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(school.gpaMedian / 4.0) * 100}%`, backgroundColor: school.color }} />
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wider">{t('Acceptance Rate', '录取率', 'Tasa de Aceptación')}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${school.acceptanceRateRaw * 100}%`, backgroundColor: school.color }} />
                  </div>
                  <span className="font-black text-xl w-16 text-right" style={{ color: school.color }}>{school.acceptanceRate}</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wider">{t('Application Deadlines', '申请截止日期', 'Fechas Límite de Solicitud')}</h3>
                <div className="flex flex-wrap gap-3">
                  {school.applicationDeadlines.map(d => (
                    <div key={d.round} className="border border-gray-200 px-4 py-2 text-sm">
                      <span className="font-bold text-navy">{d.round}:</span>
                      <span className="text-gray-500 ml-2">{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bar Passage & Outcomes */}
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider border-l-4 pl-4 mb-6" style={{ borderColor: school.color }}>
                ⚖️ {t('Bar Passage & Career Outcomes', '律考通过率与职业成果', 'Aprobación de Barra y Resultados Profesionales')}
              </h2>
              <div className="mb-8 p-6 bg-gray-soft border border-gray-200">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{t('First-Time Bar Pass Rate', '首次律考通过率', 'Aprobación de Barra (1er Intento)')}</p>
                    <p className="text-5xl font-black" style={{ color: school.color }}>{school.barPassRate}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('National average: ~80%', '全国平均：约80%', 'Promedio nacional: ~80%')}</p>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="mb-2 flex justify-between text-xs text-gray-400">
                      <span>{t('National avg (~80%)', '全国平均（约80%）', 'Prom. nacional (~80%)')}</span>
                      <span>{school.shortName} ({school.barPassRate})</span>
                    </div>
                    <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute h-full bg-gray-400 rounded-full opacity-50" style={{ width: '80%' }} />
                      <div className="absolute h-full rounded-full" style={{ width: `${school.barPassRateRaw * 100}%`, backgroundColor: school.color }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {school.barPassRateRaw >= 0.96
                        ? t(`${school.shortName} graduates pass the bar at one of the highest rates in the country.`, `${school.shortName}毕业生的律考通过率位居全国最高水平之列。`, `Los egresados de ${school.shortName} aprueban la barra a una de las tasas más altas del país.`)
                        : t(`${school.shortName} graduates consistently outperform the national bar passage average.`, `${school.shortName}毕业生的律考通过率持续高于全国平均水平。`, `Los egresados de ${school.shortName} superan consistentemente el promedio nacional de aprobación de la barra.`)}
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-navy mb-4 text-sm uppercase tracking-wider">{t('Employment at 10 Months (Class of 2023)', '毕业10个月就业情况（2023届）', 'Empleo a 10 Meses (Clase de 2023)')}</h3>
              <OutcomeBar label={t('Overall Employment', '总体就业率', 'Empleo General')} value={school.employmentAt10Months} pct={school.employmentAt10MonthsRaw} color={school.color} />
              <OutcomeBar label={t('BigLaw Placement', '大所录用率', 'Empleo BigLaw')} value={school.bigLawPlacement} pct={school.bigLawPlacementRaw} color={school.color} sublabel={t('firms 500+ attorneys · starting salary $225K', '500人以上律所·起薪$225K', 'firmas 500+ abogados · salario inicial $225K')} />
              <OutcomeBar label={t('Federal Clerkships', '联邦法院书记员', 'Pasantías Federales')} value={school.federalClerkshipRate} pct={school.federalClerkshipRateRaw} color={school.color} sublabel={t('highly prestigious, gateway to SCOTUS clerkships', '极具声望，通往最高法院书记员职位的通道', 'muy prestigioso, puerta a pasantías en la Corte Suprema')} />
              <OutcomeBar label={t('Public Interest', '公共利益', 'Interés Público')} value={school.publicInterestPct} pct={parseFloat(school.publicInterestPct) / 100} color="#16a34a" />
              <OutcomeBar label={t('Government', '政府部门', 'Gobierno')} value={school.governmentPct} pct={parseFloat(school.governmentPct) / 100} color="#2563eb" />
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-5 bg-gray-soft border border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{t('BigLaw Salary', '大所薪资', 'Salario BigLaw')}</p>
                  <p className="text-2xl font-black" style={{ color: school.color }}>{school.medianBigLawSalary}</p>
                </div>
                <div className="text-center p-5 bg-gray-soft border border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{t('Private Sector Median', '私营部门中位薪资', 'Mediana Sector Privado')}</p>
                  <p className="text-2xl font-black" style={{ color: school.color }}>{school.medianPrivateSector}</p>
                </div>
                <div className="text-center p-5 bg-gray-soft border border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{t('Public / Gov Median', '公共/政府部门中位薪资', 'Mediana Público/Gobierno')}</p>
                  <p className="text-2xl font-black text-gray-600">{school.medianPublicSector}</p>
                </div>
              </div>
            </section>

            {/* Specializations */}
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider border-l-4 pl-4 mb-6" style={{ borderColor: school.color }}>
                📚 {t('Specializations & Clinics', '专业方向与实训诊所', 'Especializaciones y Clínicas')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wider">{t('Areas of Specialization', '专业方向', 'Áreas de Especialización')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {school.specializations.map(s => (
                      <span key={s} className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-orange-50 text-brand-orange border border-orange-100">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wider">{t('Clinical Programs', '实训诊所项目', 'Programas Clínicos')}</h3>
                  <ul className="space-y-1.5">
                    {school.clinics.map(c => (
                      <li key={c} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-brand-orange font-bold mt-0.5">›</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Why */}
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider border-l-4 pl-4 mb-6" style={{ borderColor: school.color }}>
                ⭐ {t(`Why ${school.shortName}`, `为何选择 ${school.shortName}`, `Por Qué ${school.shortName}`)}
              </h2>
              <ul className="space-y-3">
                {(lang === 'zh' ? (school.programHighlightsZh ?? school.programHighlights) : lang === 'es' ? (school.programHighlightsEs ?? school.programHighlights) : school.programHighlights).map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black mt-0.5" style={{ backgroundColor: school.color }}>{i + 1}</span>
                    <span className="text-gray-700 leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">💵 {t('Program Cost (JD)', '项目费用（JD）', 'Costo del Programa (JD)')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">{t('Tuition / Year', '每年学费', 'Matrícula / Año')}</span>
                  <span className="font-bold text-navy">{school.tuitionPerYear}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">{t('Total (3 Years)', '总费用（3年）', 'Total (3 Años)')}</span>
                  <span className="font-bold text-navy">{school.totalProgramCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t('Avg Scholarship', '平均奖学金', 'Beca Promedio')}</span>
                  <span className="font-bold text-green-600">{school.avgScholarship}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 text-center">
                <p className="text-xs text-blue-700 font-semibold">{t('BigLaw salary recoups tuition in under 2 years', '大所薪资可在不到2年内收回全部学费', 'El salario BigLaw recupera la matrícula en menos de 2 años')}</p>
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">🏆 {t('Rankings', '排名', 'Rankings')}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">US News & World Report</span>
                <span className="font-black text-2xl" style={{ color: school.color }}>#{school.usNewsRanking}</span>
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">📰 {t('Law Reviews', '法律评论', 'Revistas de Derecho')}</h3>
              <ul className="space-y-2">
                {school.lawReviews.map(r => (
                  <li key={r} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-brand-orange font-bold">›</span>{r}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">🔗 {t('Dual Degree Programs', '双学位项目', 'Programas de Doble Titulación')}</h3>
              <ul className="space-y-2">
                {school.dualDegrees.map(d => (
                  <li key={d} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-brand-orange font-bold mt-0.5">›</span>{d}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">🌟 {t('Notable Alumni', '知名校友', 'Alumni Destacados')}</h3>
              <ul className="space-y-2">
                {school.notableAlumni.map(a => {
                  const hasProfile = !!getAlumnusByName(a)
                  return (
                    <li key={a} className="text-sm flex items-start gap-2">
                      <span className="text-brand-orange font-bold flex-shrink-0">›</span>
                      {hasProfile ? (
                        <Link href={`/notable-alumni/${nameToSlug(a)}`} className="text-navy hover:text-brand-orange transition-colors font-semibold">{a}</Link>
                      ) : (
                        <span className="text-gray-600">{a}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="p-6 text-center" style={{ backgroundColor: school.color }}>
              <p className="text-white font-black text-lg mb-2">{t('Ready to Apply?', '准备好申请了吗？', '¿Listo para Aplicar?')}</p>
              <p className="text-white/70 text-sm mb-4">{t('Get expert law school admissions guidance', '获取专业法学院申请指导', 'Obtén orientación experta para admisión a la escuela de derecho')}</p>
              <Link href="/shop" className="block bg-white font-bold px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors" style={{ color: school.color }}>
                {t('Get Expert Help →', '获取专业帮助 →', 'Obtener Ayuda Experta →')}
              </Link>
            </div>

            <div className="bg-white p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">{t('Other Top Law Schools', '其他顶尖法学院', 'Otras Mejores Escuelas de Derecho')}</h3>
              <ul className="space-y-1">
                {otherSchools.slice(0, 8).map(s => (
                  <li key={s.slug}>
                    <Link href={`/top-law-schools/${s.slug}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-orange transition-colors font-medium py-1">
                      <span className="text-brand-orange text-xs font-black w-5">#{s.usNewsRanking}</span>{s.name}
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
