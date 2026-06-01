'use client'
import Link from 'next/link'
import { m7Schools } from '@/data/m7-data'
import { nameToSlug, getAlumnusByName } from '@/data/notable-alumni-data'
import { useLanguage } from '@/lib/i18n'
import type { M7School } from '@/data/m7-data'

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

function BarRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-semibold text-navy">{label}</span>
        <span className="text-sm font-black" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function SalaryBar({ label, valueK, maxK, color }: { label: string; valueK: number; maxK: number; color: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-semibold text-navy">{label}</span>
        <span className="text-sm font-black" style={{ color }}>${valueK}K</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${(valueK / maxK) * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function M7SchoolContent({ school }: { school: M7School }) {
  const { t, lang } = useLanguage()
  const otherSchools = m7Schools.filter(s => s.slug !== school.slug)

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
            <Link href="/m7-business-schools" className="hover:text-white transition-colors">{t('M7 Business Schools', 'M7商学院', 'Escuelas de Negocios M7')}</Link>
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
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-sm">M7 MBA</span>
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-sm">{t('Est.', '创立于', 'Fund.')} {school.founded}</span>
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-sm">FT #{school.ftRanking} {t('Global', '全球', 'Global')}</span>
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
              { en: 'Avg Base Salary', zh: '平均基本薪资', es: 'Salario Base Prom.', value: school.avgBaseSalary },
              { en: 'Acceptance Rate', zh: '录取率', es: 'Tasa de Admisión', value: school.acceptanceRate },
              { en: 'GMAT Median', zh: 'GMAT中位数', es: 'GMAT Mediano', value: school.gmatMedian.toString() },
              { en: 'Employment (3 mo)', zh: '就业率（3个月）', es: 'Empleo (3 meses)', value: school.employmentAt3Months },
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
                <StatCard icon="🎓" label={t('Program', '项目', 'Programa')} value={school.programLength} />
                <StatCard icon="👥" label={t('Class Size', '班级规模', 'Tamaño de Clase')} value={school.classSize.toString()} sub={t('students per year', '每年招生人数', 'estudiantes por año')} />
                <StatCard icon="🌍" label={t('International', '国际学生', 'Internacional')} value={school.internationalPct} />
                <StatCard icon="👩" label={t('Women', '女生比例', 'Mujeres')} value={school.womenPct} />
              </div>
            </section>

            {/* Salary */}
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider border-l-4 pl-4 mb-6" style={{ borderColor: school.color }}>
                💰 {t('Salary & Career Outcomes', '薪资与职业成果', 'Salarios y Resultados Profesionales')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-5 bg-gray-soft border border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{t('Avg Base Salary', '平均基本薪资', 'Salario Base Prom.')}</p>
                  <p className="text-3xl font-black" style={{ color: school.color }}>{school.avgBaseSalary}</p>
                </div>
                <div className="text-center p-5 bg-gray-soft border border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{t('Avg Signing Bonus', '平均签约奖金', 'Bono de Firma Prom.')}</p>
                  <p className="text-3xl font-black" style={{ color: school.color }}>{school.avgSigningBonus}</p>
                </div>
                <div className="text-center p-5 bg-gray-soft border border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{t('Avg Total Comp', '平均总薪酬', 'Comp. Total Prom.')}</p>
                  <p className="text-3xl font-black" style={{ color: school.color }}>{school.avgTotalComp}</p>
                </div>
              </div>
              <h3 className="font-bold text-navy mb-4 text-sm uppercase tracking-wider">{t('Salary Progression', '薪资增长', 'Progresión Salarial')}</h3>
              <SalaryBar label={t('Pre-MBA (typical)', 'MBA前（典型值）', 'Pre-MBA (típico)')} valueK={100} maxK={300} color="#9ca3af" />
              <SalaryBar label={t(`Post-MBA Base (${school.shortName})`, `MBA后基本薪资（${school.shortName}）`, `Base Post-MBA (${school.shortName})`)} valueK={school.avgBaseSalaryRaw} maxK={300} color={school.color} />
              <SalaryBar label={t('3-Year Median Comp', '3年薪酬中位数', 'Comp. Mediana a 3 Años')} valueK={parseInt(school.medianSalary3yr.replace(/\D/g,''))/1000} maxK={300} color={school.color} />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-100 p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">{t('Employed at Graduation', '毕业时就业率', 'Empleados al Graduarse')}</p>
                  <p className="text-2xl font-black text-green-700">{school.employmentAtGraduation}</p>
                </div>
                <div className="bg-green-50 border border-green-100 p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">{t('Employed at 3 Months', '毕业3个月就业率', 'Empleados a los 3 Meses')}</p>
                  <p className="text-2xl font-black text-green-700">{school.employmentAt3Months}</p>
                </div>
              </div>
            </section>

            {/* Where graduates go */}
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider border-l-4 pl-4 mb-6" style={{ borderColor: school.color }}>
                📊 {t('Where Graduates Go', '毕业生去向', 'Destino de los Egresados')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-navy mb-4 text-sm uppercase tracking-wider">{t('By Industry', '按行业', 'Por Industria')}</h3>
                  {school.topIndustries.map(ind => (
                    <BarRow key={ind.name} label={ind.name} value={ind.pct} pct={parseFloat(ind.pct)} color={school.color} />
                  ))}
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-4 text-sm uppercase tracking-wider">{t('By Function', '按职能', 'Por Función')}</h3>
                  {school.topFunctions.map(fn => (
                    <BarRow key={fn.name} label={fn.name} value={fn.pct} pct={parseFloat(fn.pct)} color={school.color} />
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <h3 className="font-bold text-navy mb-4 text-sm uppercase tracking-wider">{t('Top Recruiting Employers', '主要招聘雇主', 'Principales Empleadores')}</h3>
                <div className="flex flex-wrap gap-2">
                  {school.topEmployers.map(emp => (
                    <span key={emp} className="px-3 py-1.5 text-sm font-semibold bg-gray-soft border border-gray-200 text-navy">{emp}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Admissions */}
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider border-l-4 pl-4 mb-6" style={{ borderColor: school.color }}>
                📋 {t('Admissions', '招生信息', 'Admisiones')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <StatCard icon="📝" label={t('GMAT Median', 'GMAT中位数', 'GMAT Mediano')} value={school.gmatMedian.toString()} sub={`Range: ${school.gmatRange}`} />
                <StatCard icon="📊" label={t('GRE Median', 'GRE中位数', 'GRE Mediano')} value={school.greMedian.toString()} sub={`Range: ${school.greRange}`} />
                <StatCard icon="🎯" label={t('GPA Median', 'GPA中位数', 'GPA Mediano')} value={school.gpaMedian.toFixed(2)} sub={`Range: ${school.gpaRange}`} />
              </div>
              <div className="mb-6">
                <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wider">{t('Acceptance Rate', '录取率', 'Tasa de Aceptación')}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${school.acceptanceRateRaw * 100}%`, backgroundColor: school.color }} />
                  </div>
                  <span className="font-black text-xl" style={{ color: school.color }}>{school.acceptanceRate}</span>
                </div>
              </div>
              <div className="mb-6">
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
              <div>
                <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wider">{t('Concentrations / Majors', '专业方向', 'Concentraciones / Especialidades')}</h3>
                <div className="flex flex-wrap gap-2">
                  {school.concentrations.map(c => (
                    <span key={c} className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-orange-50 text-brand-orange border border-orange-100">{c}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Highlights */}
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider border-l-4 pl-4 mb-6" style={{ borderColor: school.color }}>
                ⭐ {t('Program Highlights', '项目亮点', 'Aspectos Destacados del Programa')}
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
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">💵 {t('Program Cost', '项目费用', 'Costo del Programa')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">{t('Tuition / Year', '每年学费', 'Matrícula / Año')}</span>
                  <span className="font-bold text-navy">{school.tuitionPerYear}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">{t('Total Program Cost', '总项目费用', 'Costo Total del Programa')}</span>
                  <span className="font-bold text-navy">{school.totalProgramCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t('Avg Scholarship', '平均奖学金', 'Beca Promedio')}</span>
                  <span className="font-bold text-green-600">{school.avgScholarship}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-100 text-center">
                <p className="text-xs text-green-700 font-semibold">{t('ROI: MBA pays back in ~2 years at top employers', 'ROI：在顶级雇主处约2年内收回MBA投资', 'ROI: el MBA se recupera en ~2 años en los mejores empleadores')}</p>
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">🏆 {t('Rankings', '排名', 'Rankings')}</h3>
              <div className="space-y-3">
                {[
                  { label: t('Financial Times Global MBA', '金融时报全球MBA', 'Financial Times MBA Global'), rank: school.ftRanking },
                  { label: 'US News & World Report', rank: school.usNewsRanking },
                  { label: 'The Economist', rank: school.economistRanking },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{r.label}</span>
                    <span className="font-black text-lg" style={{ color: school.color }}>#{r.rank}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">🔗 {t('Joint Degree Programs', '联合学位项目', 'Programas de Doble Titulación')}</h3>
              <ul className="space-y-2">
                {school.jointDegrees.map(d => (
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
              <p className="text-white/70 text-sm mb-4">{t('Get expert MBA admissions guidance', '获取专业MBA申请指导', 'Obtén orientación experta para admisión al MBA')}</p>
              <Link href="/shop" className="block bg-white font-bold px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors" style={{ color: school.color }}>
                {t('Get Expert Help →', '获取专业帮助 →', 'Obtener Ayuda Experta →')}
              </Link>
            </div>

            <div className="bg-white p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">{t('Other M7 Schools', '其他M7商学院', 'Otras Escuelas M7')}</h3>
              <ul className="space-y-2">
                {otherSchools.map(s => (
                  <li key={s.slug}>
                    <Link href={`/m7-business-schools/${s.slug}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-orange transition-colors font-medium py-1">
                      <span className="text-brand-orange">›</span>{s.name}
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
