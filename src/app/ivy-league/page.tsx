'use client'
import { ivyLeagueSchools } from '@/data/ivy-league-data'
import { posts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'


const ivyFacts = [
  { icon: '📅', label: 'Founded',            labelZh: '创办年份',  labelEs: 'Fundada',         value: '1636',  sub: 'Oldest Ivy — Harvard' },
  { icon: '📉', label: 'Lowest Admit Rate',   labelZh: '最低录取率', labelEs: 'Menor Admisión',  value: '3.6%',  sub: 'Harvard University' },
  { icon: '🏦', label: 'Largest Endowment',   labelZh: '最大捐赠金', labelEs: 'Mayor Dotación',  value: '$50.9B',sub: 'Harvard University' },
  { icon: '🎓', label: 'Member Schools',      labelZh: '成员学校数', labelEs: 'Escuelas Miembro',value: '8',     sub: 'All in the Northeast US' },
  { icon: '🌍', label: 'Intl. Students',      labelZh: '国际学生',  labelEs: 'Est. Internac.',  value: '~25%',  sub: 'Avg. across all Ivies' },
  { icon: '💰', label: 'Avg. Aid Package',    labelZh: '平均奖学金', labelEs: 'Ayuda Promedio',  value: '$57K',  sub: 'For qualifying students' },
]

export default function IvyLeaguePage() {
  const { t, lang } = useLanguage()
  const relatedPosts = posts.slice(0, 6)
  const sortedByRank = [...ivyLeagueSchools].sort((a, b) => a.usNewsRanking - b.usNewsRanking)
  const maxEndowment = Math.max(...ivyLeagueSchools.map(s => s.endowmentRaw))

  const factLabel = (f: typeof ivyFacts[0]) =>
    lang === 'zh' ? f.labelZh : lang === 'es' ? f.labelEs : f.label

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative text-white py-20 overflow-hidden">
        {/* Background photo — Harvard campus */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1800&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Navy overlay */}
        <div className="absolute inset-0 bg-navy opacity-80" />
        {/* subtle radial rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          {[1,2,3].map(i => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${i * 400}px`, height: `${i * 400}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-3">
            {t('Elite Universities', '精英大学', 'Universidades de Élite')}
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
            {t('The Ivy League', '常青藤联盟', 'La Liga Ivy')}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed mb-6">
            {t(
              'Eight of the world\'s most prestigious universities. Real data on admissions, costs, financial aid, and the people who shaped history — everything you need to plan your application.',
              '世界上最负盛名的八所大学。涵盖招生、费用、奖学金及历史名人等真实数据——助您制定完整申请计划。',
              'Las ocho universidades más prestigiosas del mundo. Datos reales sobre admisiones, costos, ayuda financiera y las personas que marcaron la historia — todo lo que necesitas para planificar tu solicitud.'
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#schools" className="btn-primary">
              {t('Explore Schools', '探索院校', 'Explorar Escuelas')}
            </a>
            <Link href="/ivy-league/cost-calculator" className="btn-outline border-white text-white hover:bg-white hover:text-navy">
              {t('Cost Calculator', '费用计算器', 'Calculadora de Costos')}
            </Link>
          </div>

          {/* Hero stat strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-10 pt-10 border-t border-white/10">
            {ivyFacts.map(f => (
              <div key={f.label}>
                <p className="text-2xl font-black text-brand-orange">{f.value}</p>
                <p className="text-white text-xs font-bold mt-0.5">{factLabel(f)}</p>
                <p className="text-gray-400 text-xs">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT IS THE IVY LEAGUE? ───────────────────────────── */}
      <div className="bg-gray-soft border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-3">
                {t('About the League', '关于常青藤联盟', 'Sobre la Liga')}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-navy mb-5 leading-tight">
                {t('What is the Ivy League?', '什么是常青藤联盟？', '¿Qué es la Liga Ivy?')}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t(
                  'The Ivy League is an athletic conference of eight private research universities in the northeastern United States. The term was coined in 1954 when the schools formalized their athletic association — but today the name carries far more weight as a symbol of academic prestige, selective admissions, and elite networking.',
                  '常青藤联盟是由美国东北部八所私立研究型大学组成的体育联盟。该名称于1954年正式确立，但如今已远超体育范畴，成为学术声望、严格选拔和精英人脉的象征。',
                  'La Liga Ivy es una conferencia atlética de ocho universidades privadas de investigación en el noreste de Estados Unidos. El término fue acuñado en 1954 cuando las escuelas formalizaron su asociación atlética — pero hoy el nombre tiene un peso mucho mayor como símbolo de prestigio académico, admisiones selectivas y redes de élite.'
                )}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t(
                  'All eight schools — Harvard, Yale, Princeton, Columbia, Penn, Cornell, Dartmouth, and Brown — consistently rank among the top universities worldwide. They share a commitment to need-blind admissions, generous financial aid, and groundbreaking research that shapes policy, science, and culture globally.',
                  '哈佛、耶鲁、普林斯顿、哥伦比亚、宾大、康奈尔、达特茅斯和布朗——这八所学校始终跻身全球顶尖大学之列，共同秉承不考虑家庭经济状况录取、提供丰厚奖学金以及推动影响全球政策、科学与文化的突破性研究。',
                  'Las ocho escuelas — Harvard, Yale, Princeton, Columbia, Penn, Cornell, Dartmouth y Brown — se clasifican consistentemente entre las mejores universidades del mundo. Comparten un compromiso con la admisión sin considerar necesidad económica, generosa ayuda financiera e investigación innovadora que moldea la política, la ciencia y la cultura globalmente.'
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🏛️', title: t('Ancient Roots', '历史渊源', 'Raíces Históricas'), body: t('The oldest Ivy (Harvard, 1636) predates American independence by 140 years. Six of the eight were founded before 1776.', '历史最悠久的常青藤院校哈佛（1636年）比美国独立早140年，八所中有六所在1776年前创建。', 'La Ivy más antigua (Harvard, 1636) precede a la independencia americana por 140 años. Seis de las ocho fueron fundadas antes de 1776.') },
                { icon: '🔬', title: t('Research Powerhouses', '科研重镇', 'Potencias de Investigación'), body: t('Ivy League schools collectively produce thousands of patents, Nobel laureates, and peer-reviewed papers every year.', '常青藤学校每年共同产出数千项专利、诺贝尔奖得主及同行评审论文。', 'Las escuelas de la Liga Ivy producen colectivamente miles de patentes, premios Nobel y artículos revisados por pares cada año.') },
                { icon: '💼', title: t('Need-Blind Admissions', '不考虑经济状况录取', 'Admisión Sin Considerar Necesidad'), body: t('All eight Ivies practice need-blind admissions for US students and meet 100% of demonstrated financial need.', '八所常青藤均对美国学生实行不考虑经济状况录取，并满足100%的经证明经济需求。', 'Las ocho Ivies practican la admisión sin considerar necesidad para estudiantes estadounidenses y cubren el 100% de la necesidad financiera demostrada.') },
                { icon: '🌐', title: t('Global Alumni Networks', '全球校友网络', 'Redes Globales de Alumni'), body: t('Ivy alumni lead Fortune 500 companies, head governments, win Olympic medals, and win Nobel Prizes in every discipline.', '常青藤校友领导着财富500强企业、主导各国政府、摘得奥运奖牌并在各领域荣获诺贝尔奖。', 'Los alumni de la Liga Ivy lideran empresas del Fortune 500, dirigen gobiernos, ganan medallas olímpicas y obtienen premios Nobel en todas las disciplinas.') },
              ].map(card => (
                <div key={card.title} className="bg-white border border-gray-100 p-5 shadow-sm">
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <h3 className="font-black text-navy text-sm mb-1">{card.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SCHOOL CARDS ─────────────────────────────────────── */}
      <div id="schools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Cost Calculator CTA Banner */}
        <div className="bg-navy text-white p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 mb-12">
          <div className="flex items-center gap-5">
            <div className="text-4xl flex-shrink-0">🧮</div>
            <div>
              <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-1">
                {t('Free Planning Tool', '免费规划工具', 'Herramienta de Planificación Gratuita')}
              </p>
              <h3 className="text-lg font-black text-white leading-tight">
                {t('What will an Ivy actually cost your family?', '常青藤对您的家庭实际费用是多少？', '¿Cuánto le costará realmente una Ivy a tu familia?')}
              </h3>
              <p className="text-gray-400 text-sm mt-0.5">
                {t('Enter your income → get an instant net price estimate for all 8 schools.', '输入收入 → 立即获取全部8所学校的净费用估算。', 'Ingresa tu ingreso → obtén una estimación instantánea del costo neto para las 8 escuelas.')}
              </p>
            </div>
          </div>
          <Link href="/ivy-league/cost-calculator"
            className="flex-shrink-0 bg-brand-orange hover:bg-brand-orange-dark text-white font-black uppercase tracking-widest px-6 py-3 text-sm transition-colors whitespace-nowrap">
            {t('Open Calculator →', '打开计算器 →', 'Abrir Calculadora →')}
          </Link>
        </div>

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2">
              {t('All Eight Schools', '全部八所学校', 'Las Ocho Escuelas')}
            </p>
            <h2 className="section-title mb-0">
              {t('The Ivy League Schools', '常青藤联盟学校', 'Las Escuelas de la Liga Ivy')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {sortedByRank.map(school => (
            <Link key={school.slug} href={`/ivy-league/${school.slug}`}
              className="group bg-gray-soft border border-transparent hover:border-brand-orange hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              {/* color bar */}
              <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: school.color }} />

              <div className="p-6 flex flex-col flex-1">
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="w-12 h-12 mb-3 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={school.logoUrl} alt={`${school.shortName} logo`} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="font-black text-navy text-lg leading-tight group-hover:text-brand-orange transition-colors">
                      {school.shortName}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {school.location.city}, {school.location.state} · {t('Est.', '创立于', 'Fund.')} {school.founded}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs font-black px-2 py-1 text-white rounded-sm"
                    style={{ backgroundColor: school.color }}>#{school.usNewsRanking}</span>
                </div>

                {/* Stats */}
                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">{t('Admit Rate', '录取率', 'Tasa de Admisión')}</span>
                    <span className="font-black text-navy">{school.admissionRate}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">{t('Tuition', '学费', 'Matrícula')}</span>
                    <span className="font-bold text-navy">{school.tuition}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">{t('Avg. Aid', '平均奖学金', 'Ayuda Prom.')}</span>
                    <span className="font-bold text-navy">{school.avgAidPackage}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">{t('Endowment', '捐赠基金', 'Dotación')}</span>
                    <span className="font-bold text-navy">{school.endowment}</span>
                  </div>
                </div>

                {/* Alumni preview */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400 font-medium mb-1.5">{t('Notable Alumni', '知名校友', 'Alumni Destacados')}</p>
                  <p className="text-xs text-navy leading-relaxed">
                    {school.notableAlumni.slice(0, 3).join(' · ')}
                  </p>
                </div>

                {/* No-loan badge */}
                {school.noLoanPolicy && (
                  <div className="mt-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-sm text-white" style={{ backgroundColor: school.color }}>
                      {t('No-Loan Policy ✓', '无贷款政策 ✓', 'Sin Préstamos ✓')}
                    </span>
                  </div>
                )}

                <div className="mt-auto pt-4 text-xs font-bold text-brand-orange group-hover:underline">
                  {t('View Full Profile →', '查看完整资料 →', 'Ver Perfil Completo →')}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── COMPARISON TABLE ──────────────────────────────── */}
        <div className="mb-20">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2">
            {t('Side by Side', '横向对比', 'Comparación')}
          </p>
          <h2 className="section-title mb-6">{t('Quick Comparison', '快速比较', 'Comparación Rápida')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left px-4 py-3 font-bold">{t('School', '学校', 'Escuela')}</th>
                  <th className="text-center px-4 py-3 font-bold whitespace-nowrap">{t('Rank', '排名', 'Ranking')}</th>
                  <th className="text-center px-4 py-3 font-bold whitespace-nowrap">{t('Admit Rate', '录取率', 'Admisión')}</th>
                  <th className="text-center px-4 py-3 font-bold whitespace-nowrap">{t('Tuition', '学费', 'Matrícula')}</th>
                  <th className="text-center px-4 py-3 font-bold whitespace-nowrap">{t('Total Cost', '总费用', 'Costo Total')}</th>
                  <th className="text-center px-4 py-3 font-bold whitespace-nowrap">{t('Avg. Aid', '平均奖学金', 'Ayuda Prom.')}</th>
                  <th className="text-center px-4 py-3 font-bold whitespace-nowrap">{t('Aid Recipients', '获奖比例', 'Becados')}</th>
                  <th className="text-right px-4 py-3 font-bold whitespace-nowrap">{t('Endowment', '捐赠基金', 'Dotación')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedByRank.map((school, i) => (
                  <tr key={school.slug}
                    className={`border-b border-gray-100 hover:bg-orange-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-soft'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-8 rounded-sm flex-shrink-0" style={{ backgroundColor: school.color }} />
                        <div>
                          <Link href={`/ivy-league/${school.slug}`}
                            className="font-bold text-navy hover:text-brand-orange transition-colors block">
                            {school.name}
                          </Link>
                          <p className="text-xs text-gray-400">{school.location.city}, {school.location.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 text-white text-xs font-black rounded-sm"
                        style={{ backgroundColor: school.color }}>#{school.usNewsRanking}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-navy">{school.admissionRate}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{school.tuition}</td>
                    <td className="px-4 py-3 text-center font-semibold text-navy">{school.totalCost}</td>
                    <td className="px-4 py-3 text-center font-bold" style={{ color: school.color }}>{school.avgAidPackage}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{school.aidPct}</td>
                    <td className="px-4 py-3 text-right font-bold text-navy">{school.endowment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {t(
              '* Tuition figures are for 2024–25. Aid packages represent averages for need-based recipients. Always verify directly with the school.',
              '* 学费数据为2024–25学年。奖学金数额代表经济援助受助者的平均水平。请以学校官方信息为准。',
              '* Las cifras de matrícula corresponden al año 2024–25. Los paquetes de ayuda representan promedios para beneficiarios basados en necesidad. Verifica siempre directamente con la escuela.'
            )}
          </p>
        </div>

        {/* ── ENDOWMENT VISUAL ─────────────────────────────── */}
        <div className="mb-20 bg-navy text-white p-8 md:p-12">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2">
            {t('Financial Strength', '财务实力', 'Solidez Financiera')}
          </p>
          <h2 className="text-2xl md:text-3xl font-black mb-8">
            {t('Endowment Rankings', '捐赠基金排名', 'Clasificación por Dotación')}
          </h2>
          <div className="space-y-4">
            {[...ivyLeagueSchools].sort((a, b) => b.endowmentRaw - a.endowmentRaw).map(school => (
              <div key={school.slug} className="flex items-center gap-4">
                <Link href={`/ivy-league/${school.slug}`}
                  className="w-24 text-right text-sm font-bold text-white/80 hover:text-white transition-colors flex-shrink-0">
                  {school.shortName}
                </Link>
                <div className="flex-1 h-8 bg-white/10 rounded-sm overflow-hidden">
                  <div className="h-full rounded-sm flex items-center pl-3 transition-all duration-700"
                    style={{ width: `${(school.endowmentRaw / maxEndowment) * 100}%`, backgroundColor: school.color }}>
                    <span className="text-white text-xs font-black whitespace-nowrap">{school.endowment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FINANCIAL AID SECTION ────────────────────────── */}
        <div className="mb-20">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2">
            {t('Affordability', '经济可及性', 'Accesibilidad Económica')}
          </p>
          <h2 className="section-title mb-3">{t('Financial Aid at the Ivies', '常青藤的奖学金', 'Ayuda Financiera en las Ivy')}</h2>
          <p className="text-gray-500 max-w-2xl mb-10 leading-relaxed">
            {t(
              'Sticker prices look daunting — but all eight Ivies meet 100% of demonstrated financial need. For many middle- and lower-income families, an Ivy can cost less than a state school.',
              '标价看起来令人望而却步——但八所常青藤均满足100%的经证明经济需求。对于许多中低收入家庭来说，常青藤的实际费用可能低于州立大学。',
              'Los precios de lista parecen intimidantes — pero las ocho Ivies cubren el 100% de la necesidad financiera demostrada. Para muchas familias de ingresos medios y bajos, una Ivy puede costar menos que una universidad estatal.'
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sortedByRank.map(school => (
              <div key={school.slug} className="bg-gray-soft border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-navy">{school.shortName}</h3>
                  {school.noLoanPolicy && (
                    <span className="text-xs font-bold px-1.5 py-0.5 text-white rounded-sm"
                      style={{ backgroundColor: school.color }}>
                      {t('No Loans', '无贷款', 'Sin Préstamos')}
                    </span>
                  )}
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{t('Total Sticker Price', '总标价', 'Precio Total')}</p>
                    <p className="font-black text-navy text-lg">{school.totalCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{t('Avg. Aid Package', '平均奖学金', 'Paquete de Ayuda Prom.')}</p>
                    <p className="font-bold" style={{ color: school.color }}>{school.avgAidPackage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{t('Students Receiving Aid', '获奖学生比例', 'Estudiantes con Ayuda')}</p>
                    <p className="font-bold text-navy">{school.aidPct}</p>
                    {/* mini bar */}
                    <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{ width: school.aidPct, backgroundColor: school.color }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── NOTABLE ALUMNI SPOTLIGHT ─────────────────────── */}
        <div className="mb-20">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2">
            {t('Legacy', '校友遗产', 'Legado')}
          </p>
          <h2 className="section-title mb-3">{t('Notable Alumni Spotlight', '知名校友聚焦', 'Alumni Destacados')}</h2>
          <p className="text-gray-500 max-w-2xl mb-10 leading-relaxed">
            {t(
              'Ivy League alumni have shaped every corner of modern life — from the White House to Silicon Valley, the Supreme Court to Hollywood.',
              '常青藤校友塑造了现代生活的每个角落——从白宫到硅谷，从最高法院到好莱坞。',
              'Los alumni de la Liga Ivy han dado forma a todos los rincones de la vida moderna — desde la Casa Blanca hasta Silicon Valley, desde la Corte Suprema hasta Hollywood.'
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sortedByRank.map(school => (
              <div key={school.slug} className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1.5" style={{ backgroundColor: school.color }} />
                <div className="p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={school.logoUrl} alt={`${school.shortName} logo`} className="w-full h-full object-contain" />
                    </div>
                    <Link href={`/ivy-league/${school.slug}`}
                      className="font-black text-navy text-sm hover:text-brand-orange transition-colors">
                      {school.shortName}
                    </Link>
                  </div>
                  <ul className="space-y-1.5">
                    {school.notableAlumni.map(name => (
                      <li key={name} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="flex-shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full mt-1.5"
                          style={{ backgroundColor: school.color }} />
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA BANNER ───────────────────────────────────── */}
        <div className="mb-20 bg-brand-orange text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">
              {t('Ready to Start Your Ivy Application?', '准备好开始您的常青藤申请了吗？', '¿Listo para Comenzar tu Solicitud Ivy?')}
            </h2>
            <p className="text-white/80 text-sm max-w-lg leading-relaxed">
              {t(
                'Our expert advisors specialize in Ivy League strategy — from building your activities list to crafting essays that stand out. Get personalized guidance free.',
                '我们的专家顾问专注于常青藤申请策略——从构建活动清单到撰写脱颖而出的文书。免费获取个性化指导。',
                'Nuestros asesores expertos se especializan en estrategia para la Liga Ivy — desde construir tu lista de actividades hasta redactar ensayos que destaquen. Obtén orientación personalizada gratis.'
              )}
            </p>
          </div>
          <Link href="/login"
            className="flex-shrink-0 bg-white text-brand-orange font-black uppercase tracking-widest px-8 py-4 hover:bg-gray-100 transition-colors whitespace-nowrap text-sm">
            {t('Get Started Free →', '免费开始 →', 'Comenzar Gratis →')}
          </Link>
        </div>

        {/* ── BLOG / GUIDES ────────────────────────────────── */}
        <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2">
          {t('Resources', '资源', 'Recursos')}
        </p>
        <h2 className="section-title mb-8">{t('Ivy League Guides & Articles', '常青藤指南与文章', 'Guías y Artículos sobre la Liga Ivy')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map(post => (<PostCard key={post.id} post={post} />))}
        </div>
        <div className="text-center mt-10">
          <Link href="/blog" className="btn-primary">{t('View All Articles', '查看所有文章', 'Ver Todos los Artículos')}</Link>
        </div>
      </div>
    </div>
  )
}
