'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ivyLeagueSchools } from '@/data/ivy-league-data'
import { useLanguage } from '@/lib/i18n'

/* ── helpers ─────────────────────────────────────────────── */
function fmtFull(n: number): string {
  return '$' + Math.round(n).toLocaleString()
}
function fmtK(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${Math.round(n)}`
}

/** Estimate need-based aid grant using a simplified Ivy income model */
function estimateAid(totalCostRaw: number, income: number, siblings: number): number {
  // Simplified Expected Family Contribution (EFC) as a % of income
  let efcPct: number
  if (income <= 65_000)       efcPct = 0.00
  else if (income <= 85_000)  efcPct = 0.05
  else if (income <= 125_000) efcPct = 0.10
  else if (income <= 175_000) efcPct = 0.17
  else if (income <= 250_000) efcPct = 0.24
  else if (income <= 400_000) efcPct = 0.34
  else                         efcPct = 0.50

  // Each sibling enrolled full-time in college typically reduces EFC ~5 %
  const sibDiscount = Math.min(siblings * 0.05, 0.15)
  efcPct = Math.max(0, efcPct - sibDiscount)

  const efc = Math.min(income * efcPct, totalCostRaw)
  const aid  = Math.max(0, totalCostRaw - efc)
  return aid
}

const BOOKS_PER_YEAR    = 1_200
const PERSONAL_PER_YEAR = 2_400
const TRAVEL_COSTS: Record<string, number> = {
  harvard:   800,
  yale:      800,
  princeton: 800,
  columbia:  600, // NYC — lower because many students are local or fly to EWR cheaply
  penn:      800,
  cornell:   1_200, // Ithaca — more remote
  dartmouth: 1_400, // Hanover — most remote
  brown:     900,
}

/* ── page ─────────────────────────────────────────────────── */
export default function IvyCostCalculatorPage() {
  const { t } = useLanguage()

  const [selectedSlug, setSelectedSlug] = useState('harvard')
  const [familyIncome, setFamilyIncome]   = useState(150_000)
  const [siblings, setSiblings]           = useState(0)
  const [includeBooks, setIncludeBooks]   = useState(true)
  const [includePersonal, setIncludePersonal] = useState(true)
  const [includeTravel, setIncludeTravel] = useState(true)

  const school = ivyLeagueSchools.find(s => s.slug === selectedSlug)!

  const calc = useMemo(() => {
    const books   = includeBooks    ? BOOKS_PER_YEAR    : 0
    const personal= includePersonal ? PERSONAL_PER_YEAR : 0
    const travel  = includeTravel   ? (TRAVEL_COSTS[school.slug] ?? 900) : 0

    const extrasPerYear = books + personal + travel
    const totalPerYear  = school.totalCostRaw + extrasPerYear
    const totalFourYear = totalPerYear * 4

    const aidPerYear  = estimateAid(totalPerYear, familyIncome, siblings)
    const netPerYear  = Math.max(0, totalPerYear - aidPerYear)
    const netFourYear = netPerYear * 4

    // Breakdown items
    const items = [
      { label: t('Tuition', '学费', 'Matrícula'),                value: school.tuitionRaw,     color: school.color },
      { label: t('Room & Board', '住宿餐饮', 'Aloj. y Comida'),         value: school.totalCostRaw - school.tuitionRaw, color: '#64748b' },
      ...(books    > 0 ? [{ label: t('Books & Supplies', '书本及用品', 'Libros y Material'),  value: books,    color: '#7c3aed' }] : []),
      ...(personal > 0 ? [{ label: t('Personal Expenses', '个人花费', 'Gastos Personales'),   value: personal, color: '#0891b2' }] : []),
      ...(travel   > 0 ? [{ label: t('Travel', '交通', 'Transporte'),                  value: travel,   color: '#059669' }] : []),
    ]

    // All-Ivy comparison at this income
    const comparison = ivyLeagueSchools
      .map(s => {
        const extras  = (includeBooks ? BOOKS_PER_YEAR : 0)
                      + (includePersonal ? PERSONAL_PER_YEAR : 0)
                      + (includeTravel ? (TRAVEL_COSTS[s.slug] ?? 900) : 0)
        const total   = s.totalCostRaw + extras
        const aid     = estimateAid(total, familyIncome, siblings)
        const net     = Math.max(0, total - aid)
        return { ...s, net, aid, total }
      })
      .sort((a, b) => a.net - b.net)

    return { items, totalPerYear, totalFourYear, aidPerYear, netPerYear, netFourYear, comparison }
  }, [school, familyIncome, siblings, includeBooks, includePersonal, includeTravel, t])

  const maxBar = Math.max(...calc.comparison.map(c => c.total))

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ── */}
      <div className="bg-navy text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
          {[1,2,3].map(i => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width:`${i*400}px`, height:`${i*400}px`, top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/ivy-league"
            className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm uppercase tracking-widest mb-4 hover:underline">
            ← {t('Ivy League', '常青藤联盟', 'Liga Ivy')}
          </Link>
          <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-3">
            {t('Planning Tool', '规划工具', 'Herramienta de Planificación')}
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            {t('Ivy League Cost Calculator', '常青藤费用计算器', 'Calculadora de Costos — Liga Ivy')}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            {t(
              'Enter your family income to estimate your actual net cost at any Ivy League school — including need-based aid, room & board, books, and more.',
              '输入家庭收入，估算您在任意常青藤学校的实际净费用——包括助学金、住宿餐饮、书本等。',
              'Ingresa el ingreso familiar para estimar tu costo neto real en cualquier universidad de la Liga Ivy — incluyendo ayuda financiera, alojamiento, libros y más.'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT: INPUTS ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* School selector */}
            <div className="bg-gray-soft border border-gray-200 p-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-navy mb-4">
                {t('Select School', '选择学校', 'Seleccionar Escuela')}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {ivyLeagueSchools
                  .slice()
                  .sort((a,b) => a.usNewsRanking - b.usNewsRanking)
                  .map(s => (
                  <button
                    key={s.slug}
                    onClick={() => setSelectedSlug(s.slug)}
                    className={`flex items-center gap-2.5 p-3 border-2 transition-all text-left ${
                      selectedSlug === s.slug
                        ? 'border-brand-orange bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 flex-shrink-0 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.logoUrl} alt={s.shortName} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-navy text-xs truncate">{s.shortName}</p>
                      <p className="text-[10px] text-gray-400 truncate">{s.admissionRate} admit</p>
                    </div>
                    {selectedSlug === s.slug && (
                      <div className="ml-auto w-3.5 h-3.5 rounded-full bg-brand-orange flex-shrink-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Income & family */}
            <div className="bg-gray-soft border border-gray-200 p-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-navy mb-5">
                {t('Your Family', '家庭情况', 'Tu Familia')}
              </h2>
              <div className="space-y-6">

                {/* Income slider */}
                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider">
                      {t('Annual Family Income', '家庭年收入', 'Ingreso Familiar Anual')}
                    </label>
                    <span className="text-base font-black text-brand-orange">{fmtFull(familyIncome)}</span>
                  </div>
                  <input
                    type="range" min={20000} max={500000} step={5000}
                    value={familyIncome}
                    onChange={e => setFamilyIncome(Number(e.target.value))}
                    className="w-full accent-brand-orange"
                  />
                  <div className="flex justify-between text-xs text-gray-300 mt-0.5">
                    <span>$20K</span><span>$500K</span>
                  </div>
                  {familyIncome <= 65_000 && (
                    <p className="mt-2 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5">
                      {t('✓ Many Ivies charge $0 tuition for families under $65K', '✓ 许多常青藤对年收入低于6.5万美元的家庭免除学费', '✓ Muchas Ivies cobran $0 de matrícula a familias con ingresos menores de $65K')}
                    </p>
                  )}
                </div>

                {/* Siblings */}
                <div>
                  <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                    {t('Siblings in College Simultaneously', '同期在读大学的兄弟姐妹', 'Hermanos en la Universidad Simultáneamente')}
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    {t('Each sibling reduces your Expected Family Contribution by ~5%', '每位兄弟姐妹可将家庭预期分摊降低约5%', 'Cada hermano reduce tu Contribución Familiar Esperada en ~5%')}
                  </p>
                  <div className="flex gap-2">
                    {[0,1,2,3].map(n => (
                      <button key={n} onClick={() => setSiblings(n)}
                        className={`flex-1 py-2 text-sm font-black border-2 transition-colors ${
                          siblings === n
                            ? 'bg-navy text-white border-navy'
                            : 'border-gray-200 text-navy hover:border-navy'
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extras toggles */}
                <div>
                  <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-3">
                    {t('Include in Estimate', '纳入估算范围', 'Incluir en el Estimado')}
                  </label>
                  <div className="space-y-2">
                    {[
                      { label: t('Books & Supplies', '书本及用品', 'Libros y Material'), sub: `$${BOOKS_PER_YEAR.toLocaleString()}/yr`, val: includeBooks, set: setIncludeBooks },
                      { label: t('Personal Expenses', '个人花费', 'Gastos Personales'), sub: `$${PERSONAL_PER_YEAR.toLocaleString()}/yr`, val: includePersonal, set: setIncludePersonal },
                      { label: t('Travel (est.)', '交通（估算）', 'Transporte (est.)'), sub: `${fmtK(TRAVEL_COSTS[school.slug] ?? 900)}/yr`, val: includeTravel, set: setIncludeTravel },
                    ].map(item => (
                      <button key={item.label} onClick={() => item.set(!item.val)}
                        className={`w-full flex items-center justify-between p-3 border-2 transition-all ${
                          item.val ? 'border-navy bg-navy/5' : 'border-gray-200 bg-white'
                        }`}>
                        <div className="text-left">
                          <p className="text-xs font-bold text-navy">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.sub}</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${item.val ? 'bg-navy' : 'bg-gray-200'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${item.val ? 'left-5' : 'left-0.5'}`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 leading-relaxed">
              {t(
                '* Estimates are based on a simplified income model. Actual aid depends on full financial circumstances including assets, student income, and school-specific formulas. Always use each school\'s official Net Price Calculator for accurate figures.',
                '* 估算基于简化收入模型。实际助学金取决于完整财务状况，包括资产、学生收入及各校专属公式。请使用各校官方净价计算器获取准确数据。',
                '* Los estimados se basan en un modelo de ingresos simplificado. La ayuda real depende de circunstancias financieras completas. Usa siempre la Calculadora de Precio Neto oficial de cada escuela para cifras precisas.'
              )}
            </p>
          </div>

          {/* ── RIGHT: RESULTS ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* School header */}
            <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-100">
              <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center p-2 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={school.logoUrl} alt={school.shortName} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  {t('Estimating cost for', '正在计算费用', 'Calculando costo para')}
                </p>
                <h2 className="text-xl font-black text-navy">{school.name}</h2>
                <p className="text-xs text-gray-400">
                  {school.location.city}, {school.location.state} · Est. {school.founded} · {t('Admit rate', '录取率', 'Tasa de admisión')}: {school.admissionRate}
                </p>
              </div>
              {school.noLoanPolicy && (
                <span className="ml-auto flex-shrink-0 text-xs font-black px-3 py-1.5 text-white"
                  style={{ backgroundColor: school.color }}>
                  {t('No-Loan Policy', '无贷款政策', 'Sin Préstamos')}
                </span>
              )}
            </div>

            {/* Net price callout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 bg-brand-orange text-white p-6">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
                  {t('Estimated Net Price / Year', '估算年净费用', 'Precio Neto Estimado / Año')}
                </p>
                <p className="text-5xl font-black leading-none mb-2">
                  {fmtFull(calc.netPerYear)}
                </p>
                <p className="text-white/70 text-sm">
                  {t('After estimated aid of', '扣除估算助学金', 'Después de ayuda estimada de')} <strong className="text-white">{fmtFull(calc.aidPerYear)}</strong>
                </p>
                <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs">{t('4-Year Total', '四年总费用', 'Total 4 Años')}</p>
                    <p className="text-2xl font-black">{fmtFull(calc.netFourYear)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs">{t('Sticker Price', '挂牌价', 'Precio de Lista')}</p>
                    <p className="text-lg font-bold text-white/70 line-through">{fmtFull(calc.totalPerYear)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-soft border border-gray-100 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {t('Aid Coverage', '助学金覆盖率', 'Cobertura de Ayuda')}
                  </p>
                  <p className="text-3xl font-black text-navy">
                    {Math.round((calc.aidPerYear / calc.totalPerYear) * 100)}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {t('of total cost covered by aid', '的总费用由助学金覆盖', 'del costo total cubierto por ayuda')}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-brand-orange transition-all duration-500"
                      style={{ width: `${Math.round((calc.aidPerYear / calc.totalPerYear) * 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{t('You pay', '您支付', 'Pagas tú')}</span>
                    <span>{t('Aid covers', '助学金覆盖', 'Cubre la ayuda')}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400">
                    {school.aidPct} {t('of students receive need-based aid · Avg package:', '的学生获得助学金 · 平均金额：', 'de estudiantes reciben ayuda · Paquete prom.:')} {school.avgAidPackage}
                  </p>
                </div>
              </div>
            </div>

            {/* Annual cost breakdown */}
            <div className="bg-gray-soft border border-gray-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-5">
                {t('Annual Cost Breakdown', '年度费用明细', 'Desglose de Costos Anuales')}
              </h3>

              {/* Stacked visual bar */}
              <div className="mb-5">
                <div className="flex h-8 w-full rounded-sm overflow-hidden mb-2">
                  {calc.items.map(item => (
                    <div key={item.label}
                      style={{ width: `${(item.value / calc.totalPerYear) * 100}%`, backgroundColor: item.color }}
                      title={`${item.label}: ${fmtFull(item.value)}`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {calc.items.map(item => (
                    <span key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Itemized rows */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                {calc.items.map(item => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-6 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600">{item.label}</span>
                    </div>
                    <span className="font-bold text-navy">{fmtFull(item.value)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                  <span className="font-black text-navy uppercase tracking-wide text-sm">
                    {t('Total (sticker)', '总计（挂牌价）', 'Total (lista)')}
                  </span>
                  <span className="font-black text-navy text-base">{fmtFull(calc.totalPerYear)}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span className="font-bold text-sm">− {t('Estimated Aid', '估算助学金', 'Ayuda Estimada')}</span>
                  <span className="font-black text-base">{fmtFull(calc.aidPerYear)}</span>
                </div>
                <div className="border-t-2 border-navy pt-2 flex justify-between items-center">
                  <span className="font-black text-navy uppercase tracking-wide">
                    {t('Net Price / Year', '年净费用', 'Precio Neto / Año')}
                  </span>
                  <span className="font-black text-brand-orange text-xl">{fmtFull(calc.netPerYear)}</span>
                </div>
              </div>

              {/* 4-year summary */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-200">
                <MiniStat label={t('Sticker × 4 years', '挂牌价 × 4年', 'Lista × 4 años')} value={fmtFull(calc.totalFourYear)} />
                <MiniStat label={t('Total Aid (est.)', '总助学金（估算）', 'Ayuda Total (est.)')} value={fmtFull(calc.aidPerYear * 4)} accent />
                <MiniStat label={t('You Pay (4 years)', '您支付（4年）', 'Pagas tú (4 años)')} value={fmtFull(calc.netFourYear)} highlight />
              </div>
            </div>

            {/* All-Ivy comparison at this income */}
            <div className="bg-gray-soft border border-gray-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-1">
                {t('Net Cost Comparison — All 8 Ivies', '净费用比较——全部8所常青藤', 'Comparación de Costo Neto — Las 8 Ivies')}
              </h3>
              <p className="text-xs text-gray-400 mb-5">
                {t('At your income level of', '在您的收入水平', 'Con tu ingreso familiar de')} {fmtFull(familyIncome)}
              </p>
              <div className="space-y-3">
                {calc.comparison.map(s => {
                  const isSelected = s.slug === selectedSlug
                  const barWidth = (s.net / (maxBar || 1)) * 100
                  const aidWidth = ((s.total - s.net) / (maxBar || 1)) * 100
                  return (
                    <button key={s.slug} onClick={() => setSelectedSlug(s.slug)}
                      className={`w-full text-left transition-all ${isSelected ? 'ring-2 ring-brand-orange' : ''}`}>
                      <div className={`p-3 ${isSelected ? 'bg-orange-50' : 'bg-white border border-gray-100 hover:border-gray-200'}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center p-0.5 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={s.logoUrl} alt={s.shortName} className="w-full h-full object-contain" />
                          </div>
                          <span className={`text-xs font-black ${isSelected ? 'text-brand-orange' : 'text-navy'}`}>
                            {s.shortName}
                          </span>
                          <span className="ml-auto text-xs font-black text-navy">{fmtFull(s.net)}/yr</span>
                        </div>
                        {/* Stacked bar: aid (green) + net (school color) */}
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-green-400 transition-all duration-500"
                            style={{ width: `${aidWidth}%` }} />
                          <div className="h-full transition-all duration-500"
                            style={{ width: `${barWidth}%`, backgroundColor: isSelected ? '#F97316' : s.color }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                          <span>{t('Aid', '助学金', 'Ayuda')}: {fmtK(s.aid)}</span>
                          <span>{t('You pay', '您支付', 'Pagas')}: {fmtK(s.net)}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-green-400 inline-block" />{t('Estimated Aid', '估算助学金', 'Ayuda Estimada')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-brand-orange inline-block" />{t('Your Cost', '您的费用', 'Tu Costo')}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-navy p-8 text-center">
              <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2">
                {t('Next Step', '下一步', 'Siguiente Paso')}
              </p>
              <h3 className="text-2xl font-black text-white mb-2">{school.name}</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                {t(
                  'Get your actual net price from the official Net Price Calculator, then explore the full profile for admissions tips, alumni networks, and more.',
                  '使用官方净价计算器获取您的实际净费用，然后查看完整资料了解招生建议、校友网络等信息。',
                  'Obtén tu precio neto real con la Calculadora de Precio Neto oficial y explora el perfil completo para consejos de admisión, redes de alumni y más.'
                )}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href={`/ivy-league/${school.slug}`} className="btn-primary">
                  {t('View Full Profile →', '查看完整资料 →', 'Ver Perfil Completo →')}
                </Link>
                <a href={school.website} target="_blank" rel="noopener noreferrer"
                  className="border-2 border-white/30 text-white font-bold uppercase tracking-wider px-6 py-3 text-sm hover:bg-white/10 transition-colors">
                  {t('Official Net Price Calculator →', '官方净价计算器 →', 'Calculadora de Precio Neto Oficial →')}
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* ── sub-components ─────────────────────────────────────── */

function MiniStat({ label, value, accent, highlight }: {
  label: string; value: string; accent?: boolean; highlight?: boolean
}) {
  return (
    <div className={`p-3 border text-center ${
      highlight ? 'border-brand-orange bg-orange-50' :
      accent    ? 'border-green-200 bg-green-50' :
                  'border-gray-200 bg-white'
    }`}>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide leading-tight mb-1">{label}</p>
      <p className={`text-base font-black ${
        highlight ? 'text-brand-orange' :
        accent    ? 'text-green-700' :
                    'text-navy'
      }`}>{value}</p>
    </div>
  )
}
