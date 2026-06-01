'use client'
import Link from 'next/link'
import { midwestSchools } from '@/data/midwest-schools-data'
import type { MidwestSchool } from '@/data/midwest-schools-data'
import { useLanguage } from '@/lib/i18n'

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-gray-100 p-5 flex items-start gap-3 shadow-sm">
      <div className="text-2xl mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-xl font-black text-navy leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export default function MidwestSchoolContent({ school }: { school: MidwestSchool }) {
  const { t, lang } = useLanguage()
  const otherSchools = midwestSchools.filter(s => s.slug !== school.slug)

  return (
    <div className="bg-gray-soft min-h-screen">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ backgroundColor: school.color }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="absolute rounded-full border-2 border-white"
              style={{ width: `${i * 220}px`, height: `${i * 220}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">{t('Home', '首页', 'Inicio')}</Link>
            <span>/</span>
            <Link href="/midwests-best" className="hover:text-white transition-colors">{t("Midwest's Best", '中西部名校', 'Lo Mejor del Medio Oeste')}</Link>
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
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1">
                  {school.type === 'Public' ? t('Public University', '公立大学', 'Universidad Pública') : t('Private University', '私立大学', 'Universidad Privada')}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1">
                  {t('Est.', '创立于', 'Fund.')} {school.founded}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1">
                  #{school.usNewsRanking} US News
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2">{school.name}</h1>
              <p className="text-white/70 text-base font-light italic">&ldquo;{school.motto}&rdquo;</p>
            </div>
            <a href={school.website} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 bg-white text-navy font-bold px-6 py-3 uppercase tracking-wider text-sm hover:bg-gray-100 transition-colors">
              {t('Visit Official Site →', '访问官网 →', 'Visitar Sitio Oficial →')}
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* MAIN COLUMN */}
          <div className="xl:col-span-2 space-y-8">

            {/* About */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span>
                {t(`About ${school.shortName}`, `关于 ${school.shortName}`, `Acerca de ${school.shortName}`)}
              </h2>
              <p className="text-gray-600 leading-relaxed">{lang === 'zh' ? (school.descriptionZh ?? school.description) : lang === 'es' ? (school.descriptionEs ?? school.description) : school.description}</p>
            </section>

            {/* Key Stats */}
            <section>
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span>
                {t('Key Statistics', '关键数据', 'Estadísticas Clave')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon="🏆" label={t('US News Ranking', '美国新闻排名', 'Ranking US News')} value={`#${school.usNewsRanking}`} sub={t('National Universities 2025', '全国大学2025', 'Universidades Nacionales 2025')} />
                <StatCard icon="📬" label={t('Admission Rate', '录取率', 'Tasa de Admisión')} value={school.admissionRate} sub={t('Class of 2028', '2028届录取率', 'Clase de 2028')} />
                <StatCard icon="🏦" label={t('Endowment', '捐赠基金', 'Dotación')} value={school.endowment} />
                <StatCard icon="🎓" label={t('Undergrad Enrollment', '本科生人数', 'Estudiantes de Pregrado')} value={school.undergradEnrollment.toLocaleString()} />
                <StatCard icon="📚" label={t('Total Enrollment', '在校生总数', 'Total Matriculados')} value={school.totalEnrollment.toLocaleString()} />
                <StatCard icon="👥" label={t('Student:Faculty Ratio', '师生比', 'Ratio Estudiante:Docente')} value={school.studentFacultyRatio} />
                <StatCard icon="📊" label={t('SAT Range', 'SAT分数段', 'Rango SAT')} value={school.satRange} sub={t('25th–75th percentile', '25–75百分位', 'Percentil 25–75')} />
                <StatCard icon="📝" label={t('ACT Range', 'ACT分数段', 'Rango ACT')} value={school.actRange} sub={t('25th–75th percentile', '25–75百分位', 'Percentil 25–75')} />
                <StatCard icon="🌍" label={t('International Students', '国际学生占比', 'Estudiantes Internacionales')} value={school.internationalPct} />
              </div>
            </section>

            {/* Tuition & Aid */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-6 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span>
                {t('Tuition & Financial Aid', '学费与奖学金', 'Matrícula y Ayuda Financiera')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {school.type === 'Public' && school.tuitionInState && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{t('In-State Tuition', '州内学费', 'Matrícula Residente')}</p>
                      <p className="text-2xl font-black text-navy">{school.tuitionInState}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                      {school.type === 'Public' ? t('Out-of-State Tuition', '外州学费', 'Matrícula No Residente') : t('Tuition', '学费', 'Matrícula')}
                    </p>
                    <p className="text-2xl font-black text-navy">{school.tuition}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{t('Room & Board', '住宿餐饮', 'Alojamiento y Manutención')}</p>
                    <p className="text-xl font-bold text-navy">{school.roomAndBoard}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{t('Estimated Total Cost', '预计总费用', 'Costo Total Estimado')}</p>
                    <p className="text-2xl font-black" style={{ color: school.color }}>{school.totalCost}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('per year', '每年', 'por año')}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6">
                  <p className="text-sm font-black text-navy mb-4">{t('Financial Aid Overview', '奖学金概况', 'Resumen de Ayuda Financiera')}</p>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">{t('Students Receiving Aid', '获奖学生', 'Estudiantes con Ayuda')}</span>
                        <span className="font-black text-navy">{school.aidPct}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: school.aidPct, backgroundColor: school.color }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{t('Average Aid Package', '平均奖学金', 'Paquete de Ayuda Promedio')}</p>
                      <p className="text-2xl font-black" style={{ color: school.color }}>{school.avgAidPackage}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Link href="/midwests-best/cost-calculator"
                      className="block text-center text-sm font-bold uppercase tracking-wider py-2.5 text-white transition-colors hover:opacity-90"
                      style={{ backgroundColor: school.color }}>
                      {t('Open Cost Calculator →', '打开费用计算器 →', 'Abrir Calculadora →')}
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Program Highlights */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-5 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span>
                {t('Why Choose', '为何选择', 'Por Qué Elegir')} {school.shortName}
              </h2>
              <ul className="space-y-3">
                {school.programHighlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black mt-0.5"
                      style={{ backgroundColor: school.color }}>{i + 1}</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>

            {/* Notable Alumni */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span>
                {t('Notable Alumni', '知名校友', 'Alumni Destacados')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {school.notableAlumni.map((alumnus, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: school.color }} />
                    <span className="text-sm text-gray-700 leading-snug">{alumnus}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* Basic Info */}
            <div className="bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                {t('Basic Info', '基本信息', 'Información Básica')}
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">📍 {t('Location', '位置', 'Ubicación')}</dt>
                  <dd className="text-sm text-navy font-medium">{school.location.city}, {school.location.state}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">📅 {t('Founded', '建校年份', 'Fundada')}</dt>
                  <dd className="text-sm text-navy font-medium">{school.founded}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">🎓 {t('Type', '类型', 'Tipo')}</dt>
                  <dd className="text-sm text-navy font-medium">{school.type} Research University</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">🌐 {t('Website', '官网', 'Sitio Web')}</dt>
                  <dd><a href={school.website} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-brand-orange hover:underline font-medium break-all">{school.website.replace('https://', '')}</a></dd>
                </div>
              </dl>
            </div>

            {/* Strengths */}
            <div className="bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-3 pb-2 border-b border-gray-100">
                {t('Academic Strengths', '优势学科', 'Fortalezas Académicas')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {school.strengths.map(s => (
                  <span key={s} className="text-xs font-bold px-3 py-1.5 text-white rounded-full"
                    style={{ backgroundColor: school.color }}>{s}</span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 text-white" style={{ backgroundColor: school.color }}>
              <h3 className="text-lg font-black mb-2">{t('Planning to Apply?', '计划申请？', '¿Planeas Aplicar?')}</h3>
              <p className="text-white/80 text-sm mb-4 leading-relaxed">
                {t('Our advisors can help you build the strongest possible application for this school.', '我们的顾问可帮助您为该学校制定最佳申请方案。', 'Nuestros asesores pueden ayudarte a construir la solicitud más sólida posible para esta escuela.')}
              </p>
              <Link href="/shop" className="block text-center bg-white font-bold uppercase tracking-wide text-sm px-4 py-3 hover:bg-gray-100 transition-colors"
                style={{ color: school.color }}>
                {t('Get Expert Help →', '获取专业帮助 →', 'Obtener Ayuda Experta →')}
              </Link>
            </div>

            {/* Cost Calculator */}
            <div className="bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-2">
                {t('Calculate Your Cost', '计算您的费用', 'Calcula Tu Costo')}
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                {t('See your real net price after financial aid — for all Midwest schools.', '查看助学金后的真实净费用——适用于所有中西部学校。', 'Ve tu precio neto real después de la ayuda financiera — para todas las escuelas del Medio Oeste.')}
              </p>
              <Link href="/midwests-best/cost-calculator"
                className="block text-center text-sm font-bold uppercase tracking-wider py-2.5 text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: school.color }}>
                {t('Open Calculator →', '打开计算器 →', 'Abrir Calculadora →')}
              </Link>
            </div>

            {/* Other Schools */}
            <div className="bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                {t('Other Midwest Schools', '其他中西部学校', 'Otras Escuelas del Medio Oeste')}
              </h3>
              <div className="space-y-1">
                {otherSchools.map(s => (
                  <Link key={s.slug} href={`/midwests-best/${s.slug}`}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 group transition-colors">
                    <span className="text-sm font-semibold text-navy group-hover:text-brand-orange transition-colors">{s.shortName}</span>
                    <span className="text-xs text-gray-400">#{s.usNewsRanking} →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
