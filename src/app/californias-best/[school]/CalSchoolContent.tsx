'use client'
import Link from 'next/link'
import { proxyImageSrc } from '@/lib/image-utils'
import { nameToSlug, getAlumnusByName } from '@/data/notable-alumni-data'
import { californiasSchools } from '@/data/californias-best-data'
import { useLanguage } from '@/lib/i18n'
import type { CalSchool } from '@/data/californias-best-data'

function StatCard({
  icon, label, value, sub,
}: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-gray-100 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-3xl mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-navy leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function BarStat({
  label, value, pct, color,
}: { label: string; value: string; pct: number; color: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-semibold text-navy">{label}</span>
        <span className="text-sm font-black" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(pct * 100, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function CalSchoolContent({ school }: { school: CalSchool }) {
  const { t, lang } = useLanguage()

  const otherSchools = californiasSchools.filter(s => s.slug !== school.slug)
  const enrollmentTotal = school.undergradEnrollment + school.gradEnrollment
  const maxEndowment = Math.max(...californiasSchools.map(s => s.endowmentRaw))

  const typeLabel = lang === 'zh'
    ? ({
        'Private': '私立大学',
        'Public UC': 'UC系统 · 公立',
        'Public CSU': 'CSU系统 · 公立',
        'Liberal Arts': '文理学院',
      }[school.type] ?? school.type)
    : lang === 'es'
    ? ({
        'Private': 'Universidad Privada',
        'Public UC': 'Sistema UC · Pública',
        'Public CSU': 'Sistema CSU · Pública',
        'Liberal Arts': 'Colegio de Artes Liberales',
      }[school.type] ?? school.type)
    : ({
        'Private': 'Private University',
        'Public UC': 'UC System · Public',
        'Public CSU': 'CSU System · Public',
        'Liberal Arts': 'Liberal Arts College',
      }[school.type] ?? school.type)

  return (
    <div className="bg-gray-soft min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ backgroundColor: school.color }}>
        {/* Decorative rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="absolute rounded-full border-2 border-white"
              style={{
                width: `${i * 220}px`, height: `${i * 220}px`,
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">{t('Home', '首页', 'Inicio')}</Link>
            <span>/</span>
            <Link href="/californias-best" className="hover:text-white transition-colors">{t("California's Best", '加州优质大学')}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{school.shortName}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 w-24 h-24 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center shadow-lg overflow-hidden p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proxyImageSrc(school.logoUrl)}
                alt={`${school.shortName} logo`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title block */}
            <div className="flex-1 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-sm">
                  {typeLabel}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-sm">
                  {t('Est.', '建校', 'Fund.')} {school.founded}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-sm">
                  #{school.usNewsRanking} {school.usNewsLabel.includes('Public')
                    ? t('Public', '公立', 'Pública')
                    : school.usNewsLabel.includes('Liberal')
                    ? t('Liberal Arts', '文理', 'Artes Liberales')
                    : 'U.S. News'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2">{school.name}</h1>
              <p className="text-white/70 text-lg font-light italic">&ldquo;{school.motto}&rdquo;</p>
            </div>

            {/* Official site CTA */}
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-white text-navy font-bold px-6 py-3 uppercase tracking-wider text-sm hover:bg-gray-100 transition-colors"
            >
              {t('Visit Official Site →', '访问官方网站 →', 'Visitar Sitio Oficial →')}
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* ── LEFT / MAIN ───────────────────────────────────────────────── */}
          <div className="xl:col-span-2 space-y-8">

            {/* About */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span> {t(`About ${school.shortName}`, `关于 ${school.shortName}`)}
              </h2>
              <p className="text-gray-600 leading-relaxed">{lang === 'zh' ? (school.descriptionZh ?? school.description) : lang === 'es' ? (school.descriptionEs ?? school.description) : school.description}</p>
            </section>

            {/* Key Stats Grid */}
            <section>
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span> {t('Key Statistics', '关键数据', 'Estadísticas Clave')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon="🏦" label={t('Endowment', '捐赠基金', 'Dotación')} value={school.endowment} sub={t('Total university endowment', '大学捐赠基金总额')} />
                <StatCard icon="🏆" label={t('US News Ranking', 'US News排名', 'Ranking US News')} value={`#${school.usNewsRanking}`} sub={lang === 'zh' ? (school.usNewsLabel.includes('Public') ? '全国公立大学2025' : school.usNewsLabel.includes('Liberal') ? '文理学院2025' : '全国大学2025') : lang === 'es' ? (school.usNewsLabel.includes('Public') ? 'Universidades Públicas 2025' : school.usNewsLabel.includes('Liberal') ? 'Artes Liberales 2025' : 'Universidades Nacionales 2025') : school.usNewsLabel} />
                <StatCard icon="📬" label={t('Admission Rate', '录取率', 'Tasa de Admisión')} value={school.admissionRate} sub={t('Class of 2028 acceptance rate', '2028届录取率', 'Tasa de admisión, clase de 2028')} />
                <StatCard icon="🎓" label={t('Undergrad Students', '本科生人数', 'Estudiantes de Pregrado')} value={school.undergradEnrollment.toLocaleString()} sub={t('Current undergraduate enrollment', '当前本科在读人数', 'Matrícula actual de pregrado')} />
                <StatCard
                  icon="📚"
                  label={t('Graduate Students', '研究生人数', 'Estudiantes de Posgrado')}
                  value={school.gradEnrollment > 0 ? school.gradEnrollment.toLocaleString() : t('N/A', '暂无', 'N/D')}
                  sub={school.gradEnrollment > 0 ? t('Graduate & professional programs', '研究生及专业学位项目', 'Programas de posgrado y profesionales') : t('Undergraduate-only institution', '纯本科院校', 'Institución solo de pregrado')}
                />
                <StatCard icon="🌍" label={t('International Students', '国际学生', 'Estudiantes Internacionales')} value={school.internationalStudents.toLocaleString()} sub={`${school.internationalPct} ${t('of total enrollment', '的在校生占比', 'del total matriculado')}`} />
                <StatCard icon="👥" label={t('Total Enrollment', '在校生总数', 'Total de Matriculados')} value={school.totalEnrollment.toLocaleString()} sub={t('All students combined', '所有在校学生总计', 'Todos los estudiantes combinados')} />
                <StatCard icon="📐" label={t('Student:Faculty Ratio', '师生比', 'Ratio Estudiante:Docente')} value={school.studentFacultyRatio} sub={t('Across all programs', '覆盖所有项目', 'En todos los programas')} />
                <StatCard icon="📅" label={t('Year Founded', '建校年份', 'Año de Fundación')} value={String(school.founded)} sub={`${new Date().getFullYear() - school.founded} ${t('years of history', '年历史', 'años de historia')}`} />
              </div>
            </section>

            {/* Enrollment breakdown */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-6 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span> {t('Enrollment Breakdown', '在校生结构', 'Distribución de Matrícula')}
              </h2>
              <BarStat
                label={t('Undergraduate Students', '本科生', 'Estudiantes de Pregrado')}
                value={school.undergradEnrollment.toLocaleString()}
                pct={school.undergradEnrollment / (enrollmentTotal || school.undergradEnrollment)}
                color={school.color}
              />
              {school.gradEnrollment > 0 && (
                <BarStat
                  label={t('Graduate Students', '研究生', 'Estudiantes de Posgrado')}
                  value={school.gradEnrollment.toLocaleString()}
                  pct={school.gradEnrollment / enrollmentTotal}
                  color="#64748b"
                />
              )}
              <BarStat
                label={t('International Students', '国际学生', 'Estudiantes Internacionales')}
                value={school.internationalStudents.toLocaleString()}
                pct={school.internationalStudents / school.totalEnrollment}
                color="#f59e0b"
              />
              <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                {t('Total Enrollment:', '在校生总数：', 'Total de Matriculados:')} <strong className="text-navy">{school.totalEnrollment.toLocaleString()}</strong>
              </div>
            </section>

            {/* Admissions */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-6 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span> {t('Admissions at a Glance', '录取概况', 'Admisiones en Resumen')}
              </h2>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg"
                    style={{ backgroundColor: school.color }}
                  >
                    {school.admissionRate}
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-navy mb-1">{t('Acceptance Rate', '录取率', 'Tasa de Aceptación')}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {lang === 'zh'
                      ? `${school.shortName} 约每100名申请者中录取 ${Math.round(school.admissionRateRaw * 100)} 人。${school.admissionRateRaw < 0.12 ? '这使其成为全国最具竞争力的大学之一。出色的学术成绩、有力的文书和独特的课外活动至关重要。' : '录取审核采用综合评估方式，考量学术成绩、文书、课外活动及对该校特定项目的关注度。'}`
                      : lang === 'es'
                      ? `${school.shortName} admite aproximadamente ${Math.round(school.admissionRateRaw * 100)} de cada 100 solicitantes.${school.admissionRateRaw < 0.12 ? ' Esto la convierte en una de las universidades más selectivas del país. Un expediente sólido, ensayos convincentes y actividades extracurriculares diferenciadas son esenciales.' : ' Una revisión holística considera el expediente académico, ensayos, actividades e interés demostrado en los programas específicos de la escuela.'}`
                      : `${school.shortName} admits approximately ${Math.round(school.admissionRateRaw * 100)} out of every 100 applicants.${school.admissionRateRaw < 0.12 ? ' This makes it one of the most selective universities in the country. Strong academics, compelling essays, and differentiated extracurriculars are essential.' : " A holistic review considers academics, essays, activities, and demonstrated interest in the school's specific programs."}`
                    }
                  </p>
                </div>
              </div>

              {/* Comparison bar */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {t('Acceptance Rate vs. Other CA Schools', '录取率 vs. 其他加州学校', 'Tasa de Admisión vs. Otras Escuelas de CA')}
                </p>
                {californiasSchools
                  .sort((a, b) => a.admissionRateRaw - b.admissionRateRaw)
                  .map(s => (
                    <div key={s.slug} className={`flex items-center gap-3 mb-2 ${s.slug === school.slug ? 'opacity-100' : 'opacity-40'}`}>
                      <span className="w-24 text-xs font-semibold text-right text-navy flex-shrink-0 truncate">{s.shortName}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(s.admissionRateRaw / 0.45) * 100}%`,
                            backgroundColor: s.slug === school.slug ? school.color : '#94a3b8',
                          }}
                        />
                      </div>
                      <span className="w-10 text-xs font-bold text-navy flex-shrink-0">{s.admissionRate}</span>
                    </div>
                  ))}
              </div>
            </section>

            {/* Notable Alumni */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <span style={{ color: school.color }}>▌</span> {t('Notable Alumni', '知名校友', 'Alumni Destacados')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {school.notableAlumni.map(name => {
                  const slug = nameToSlug(name)
                  const hasProfile = !!getAlumnusByName(name)
                  return hasProfile ? (
                    <Link
                      key={name}
                      href={`/notable-alumni/${slug}`}
                      className="px-4 py-2 text-sm font-semibold border border-gray-200 text-navy hover:border-brand-orange hover:text-brand-orange transition-colors"
                    >
                      {name}
                    </Link>
                  ) : (
                    <span
                      key={name}
                      className="px-4 py-2 text-sm font-semibold border border-gray-200 text-navy cursor-default"
                    >
                      {name}
                    </span>
                  )
                })}
              </div>
            </section>
          </div>

          {/* ── SIDEBAR ───────────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Basic info */}
            <div className="bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                {t('Basic Info', '基本信息', 'Información Básica')}
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">📍 {t('Location', '地址', 'Ubicación')}</dt>
                  <dd className="text-sm text-navy font-medium">{school.location.city}, {school.location.state}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">🏠 {t('Address', '详细地址', 'Dirección')}</dt>
                  <dd className="text-sm text-navy">{school.location.address}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">🌐 {t('Website', '官网', 'Sitio Web')}</dt>
                  <dd>
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-orange hover:underline font-medium break-all"
                    >
                      {school.website.replace('https://', '')}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">📅 {t('Founded', '建校年份', 'Fundada')}</dt>
                  <dd className="text-sm text-navy font-medium">{school.founded}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">🎓 {t('Type', '类型', 'Tipo')}</dt>
                  <dd className="text-sm text-navy font-medium">{typeLabel}</dd>
                </div>
              </dl>
            </div>

            {/* Endowment comparison */}
            <div className="bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                {t('Endowment vs. CA Schools', '捐赠基金对比', 'Dotación vs. Escuelas de CA')}
              </h3>
              {californiasSchools
                .sort((a, b) => b.endowmentRaw - a.endowmentRaw)
                .map(s => (
                  <div key={s.slug} className={`flex items-center gap-2 mb-3 ${s.slug === school.slug ? '' : 'opacity-40'}`}>
                    <span className="w-20 text-xs font-semibold text-right text-navy flex-shrink-0 truncate">{s.shortName}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(s.endowmentRaw / maxEndowment) * 100}%`,
                          backgroundColor: s.slug === school.slug ? school.color : '#94a3b8',
                        }}
                      />
                    </div>
                    <span className="w-14 text-xs text-navy font-bold flex-shrink-0 text-right">
                      {s.endowmentRaw >= 1 ? `$${s.endowmentRaw}B` : `$${Math.round(s.endowmentRaw * 1000)}M`}
                    </span>
                  </div>
                ))}
            </div>

            {/* CTA */}
            <div className="p-6 text-white" style={{ backgroundColor: school.color }}>
              <h3 className="text-lg font-black mb-2">{t('Planning to Apply?', '准备申请？', '¿Planeas Aplicar?')}</h3>
              <p className="text-white/80 text-sm mb-4 leading-relaxed">
                {lang === 'zh'
                  ? `我们的顾问对${school.shortName}了如指掌，可为您提供个性化的申请策略指导。`
                  : lang === 'es'
                  ? `Nuestros asesores conocen ${school.shortName} a fondo. Obtén orientación personalizada para tu estrategia de solicitud.`
                  : `Our advisors know ${school.shortName} inside and out. Get personalized guidance for your application strategy.`}
              </p>
              <Link
                href="/login"
                className="block text-center bg-white font-bold uppercase tracking-wide text-sm px-4 py-3 transition-colors hover:bg-gray-100"
                style={{ color: school.color }}
              >
                {t('Get Started Free →', '免费开始 →', 'Comenzar Gratis →')}
              </Link>
            </div>

            {/* Other CA Schools */}
            <div className="bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                {t('Other California Schools', '其他加州学校', 'Otras Escuelas de California')}
              </h3>
              <div className="space-y-1">
                {otherSchools.map(s => (
                  <Link
                    key={s.slug}
                    href={`/californias-best/${s.slug}`}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 group transition-colors"
                  >
                    <span className="text-sm font-semibold text-navy group-hover:text-brand-orange transition-colors">
                      {s.shortName}
                    </span>
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
