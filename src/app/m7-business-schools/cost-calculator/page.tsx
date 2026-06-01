'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { m7Schools } from '@/data/m7-data'
import { useLanguage } from '@/lib/i18n'

function parseCurrency(str: string): number {
  return parseInt(str.replace(/[$,]/g, '')) || 0
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${Math.round(n).toLocaleString()}`
}

function fmtFull(n: number): string {
  return '$' + Math.round(n).toLocaleString()
}

const YEARS = 15

export default function M7CostCalculatorPage() {
  const { t } = useLanguage()
  const [selectedSlug, setSelectedSlug] = useState('harvard-business-school')
  const [preMBASalary, setPreMBASalary] = useState(100000)
  const [livingCostPerYear, setLivingCostPerYear] = useState(30000)
  const [useAvgScholarship, setUseAvgScholarship] = useState(false)
  const [customScholarship, setCustomScholarship] = useState(0)
  const [salaryGrowthPct, setSalaryGrowthPct] = useState(5)
  const [preGrowthPct, setPreGrowthPct] = useState(3)

  const school = m7Schools.find(s => s.slug === selectedSlug)!
  const avgScholarship = parseCurrency(school.avgScholarship)
  const scholarship = useAvgScholarship ? avgScholarship : customScholarship

  const calc = useMemo(() => {
    const tuitionPerYear = parseCurrency(school.tuitionPerYear)
    const tuitionTotal = tuitionPerYear * 2
    const livingTotal = livingCostPerYear * 2
    const opportunityCost = preMBASalary * 2
    const totalInvestment = tuitionTotal + livingTotal + opportunityCost - scholarship

    const postMBABase = school.avgBaseSalaryRaw * 1000
    const signingBonus = parseCurrency(school.avgSigningBonus)

    // Build year-by-year projections (years = post-graduation years)
    const data = Array.from({ length: YEARS }, (_, i) => {
      const yr = i + 1
      const withMBASalary = postMBABase * Math.pow(1 + salaryGrowthPct / 100, i)
      const withMBAIncome = yr === 1 ? withMBASalary + signingBonus : withMBASalary
      const withoutMBASalary = preMBASalary * Math.pow(1 + preGrowthPct / 100, i + 2) // they keep working 2 more years
      return { yr, withMBASalary: withMBAIncome, withoutMBASalary }
    })

    // Cumulative net position (vs no-MBA path), starting at -totalInvestment
    let cumulative = -totalInvestment
    let breakEvenYear: number | null = null
    const cumulativeData = data.map(({ yr, withMBASalary, withoutMBASalary }) => {
      cumulative += withMBASalary - withoutMBASalary
      if (cumulative >= 0 && breakEvenYear === null) breakEvenYear = yr
      return { yr, cumulative, withMBASalary, withoutMBASalary }
    })

    const yr10GainRaw = cumulativeData[9]?.cumulative ?? 0
    const yr15GainRaw = cumulativeData[14]?.cumulative ?? 0

    return {
      tuitionTotal,
      tuitionPerYear,
      livingTotal,
      opportunityCost,
      scholarship,
      totalInvestment,
      postMBABase,
      signingBonus,
      breakEvenYear,
      yr10GainRaw,
      yr15GainRaw,
      cumulativeData,
    }
  }, [school, preMBASalary, livingCostPerYear, scholarship, salaryGrowthPct, preGrowthPct])

  // SVG chart dimensions
  const chartW = 620
  const chartH = 260
  const padL = 64
  const padR = 20
  const padT = 20
  const padB = 36

  const minVal = Math.min(...calc.cumulativeData.map(d => d.cumulative), -calc.totalInvestment)
  const maxVal = Math.max(...calc.cumulativeData.map(d => d.cumulative), 0)
  const range = maxVal - minVal || 1

  function xPos(yr: number) {
    return padL + ((yr - 1) / (YEARS - 1)) * (chartW - padL - padR)
  }
  function yPos(val: number) {
    return padT + (1 - (val - minVal) / range) * (chartH - padT - padB)
  }

  const linePoints = calc.cumulativeData.map(d => `${xPos(d.yr)},${yPos(d.cumulative)}`).join(' ')
  const zeroY = yPos(0)

  // Color for break-even label
  const beColor = calc.breakEvenYear ? '#F97316' : '#94A3B8'

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ── */}
      <div className="relative text-white py-16 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1800&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy opacity-85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/m7-business-schools" className="inline-flex items-center gap-2 text-sm text-brand-orange font-bold uppercase tracking-widest mb-4 hover:underline">
            ← {t('M7 Business Schools', 'M7商学院', 'Escuelas M7')}
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            {t('MBA Cost Calculator', 'MBA费用计算器', 'Calculadora de Costos MBA')}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            {t(
              'Model your total MBA investment, project post-graduation earnings, and see exactly when you break even.',
              '估算您的MBA总投入，预测毕业后收入，并精准测算回本年限。',
              'Calcula tu inversión total en el MBA, proyecta tus ingresos post-graduación y descubre exactamente cuándo recuperas lo invertido.'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT: INPUTS ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* School selector */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-navy mb-4">{t('Select Your School', '选择学校', 'Selecciona tu Escuela')}</h2>
              <div className="space-y-2">
                {m7Schools.map(s => (
                  <button
                    key={s.slug}
                    onClick={() => {
                      setSelectedSlug(s.slug)
                      if (useAvgScholarship) setCustomScholarship(parseCurrency(s.avgScholarship))
                    }}
                    className={`w-full flex items-center gap-3 p-3 border-2 transition-all text-left ${
                      selectedSlug === s.slug
                        ? 'border-brand-orange bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.logoUrl} alt={s.shortName} className="w-8 h-8 object-contain flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-navy text-sm truncate">{s.shortName}</p>
                      <p className="text-xs text-gray-400">{s.tuitionPerYear}/yr · Avg salary {s.avgBaseSalary}</p>
                    </div>
                    {selectedSlug === s.slug && (
                      <div className="w-4 h-4 rounded-full bg-brand-orange flex-shrink-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Your numbers */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-navy mb-5">{t('Your Numbers', '您的数据', 'Tus Números')}</h2>
              <div className="space-y-5">

                <InputSlider
                  label={t('Current Annual Salary (Pre-MBA)', '目前年薪（MBA前）', 'Salario Anual Actual (Pre-MBA)')}
                  value={preMBASalary}
                  min={40000} max={300000} step={5000}
                  format={fmtFull}
                  onChange={setPreMBASalary}
                />

                <InputSlider
                  label={t('Living Expenses / Year', '每年生活费', 'Gastos de Vida / Año')}
                  value={livingCostPerYear}
                  min={15000} max={70000} step={1000}
                  format={fmtFull}
                  onChange={setLivingCostPerYear}
                  hint={t('Housing, food, transport etc.', '住房、餐饮、交通等', 'Vivienda, comida, transporte, etc.')}
                />

                {/* Scholarship */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider">{t('Scholarship / Grant', '奖学金', 'Beca / Subvención')}</label>
                    <button
                      onClick={() => {
                        const next = !useAvgScholarship
                        setUseAvgScholarship(next)
                        if (next) setCustomScholarship(avgScholarship)
                      }}
                      className={`text-xs font-bold px-2 py-1 border transition-colors ${
                        useAvgScholarship
                          ? 'bg-navy text-white border-navy'
                          : 'text-navy border-gray-300 hover:border-navy'
                      }`}
                    >
                      {t('Use school avg', '用学校均值', 'Usar prom. escuela')}
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      value={customScholarship}
                      onChange={e => { setCustomScholarship(Number(e.target.value)); setUseAvgScholarship(false) }}
                      className="w-full border border-gray-200 pl-7 pr-4 py-2.5 text-sm font-bold text-navy focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{t('School avg:', '学校均值：', 'Prom. escuela:')} {school.avgScholarship}</p>
                </div>

                <InputSlider
                  label={t('Post-MBA Salary Growth / yr', 'MBA后年薪增速', 'Crecimiento Salarial Post-MBA / año')}
                  value={salaryGrowthPct}
                  min={2} max={15} step={0.5}
                  format={v => `${v}%`}
                  onChange={setSalaryGrowthPct}
                  hint={t('Your expected annual raise after MBA', 'MBA后预期年薪增长率', 'Tu aumento anual esperado tras el MBA')}
                />

                <InputSlider
                  label={t('Without-MBA Salary Growth / yr', '无MBA路径年薪增速', 'Crecimiento Salarial Sin MBA / año')}
                  value={preGrowthPct}
                  min={1} max={10} step={0.5}
                  format={v => `${v}%`}
                  onChange={setPreGrowthPct}
                  hint={t('How fast your salary would grow without the MBA', '不读MBA时的预期年薪增速', 'Qué tan rápido crecería tu salario sin el MBA')}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT: RESULTS ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* School name header */}
            <div className="flex items-center gap-4 pb-2 border-b-2 border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={school.logoUrl} alt={school.shortName} className="w-12 h-12 object-contain" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('Calculating for', '正在计算', 'Calculando para')}:</p>
                <h2 className="text-xl font-black text-navy">{school.name}</h2>
              </div>
            </div>

            {/* Break-even highlight */}
            <div className="border-l-4 border-brand-orange bg-orange-50 p-5 flex items-center gap-5">
              <div className="text-5xl font-black text-brand-orange leading-none">
                {calc.breakEvenYear ? `Yr ${calc.breakEvenYear}` : '15+'}
              </div>
              <div>
                <p className="text-sm font-black text-navy uppercase tracking-wider">{t('Break-Even Point', '回本年限', 'Punto de Equilibrio')}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {calc.breakEvenYear
                    ? t(`Your MBA pays for itself ${calc.breakEvenYear} years after graduation.`, `MBA毕业后第${calc.breakEvenYear}年收回投资。`)
                    : t('Extend your projection — you break even after year 15.', '回本年限超过15年，请调整参数。', 'Extiende tu proyección — alcanzas el equilibrio después del año 15.')
                  }
                </p>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-5">{t('Total Investment Breakdown', '总投入明细', 'Desglose de Inversión Total')}</h3>
              <div className="space-y-3">
                <CostRow label={t('Tuition (2 years)', '学费（2年）', 'Matrícula (2 años)')} value={calc.tuitionTotal} color="text-navy" />
                <CostRow label={t('Living Expenses (2 years)', '生活费（2年）', 'Gastos de Vida (2 años)')} value={calc.livingTotal} color="text-navy" />
                <CostRow label={t('Opportunity Cost (foregone salary)', '机会成本（放弃薪资）', 'Costo de Oportunidad (salario no percibido)')} value={calc.opportunityCost} color="text-navy"
                  hint={t('2 years of your current salary you give up', '放弃2年现有薪资', '2 años de tu salario actual que dejas de percibir')} />
                {calc.scholarship > 0 && (
                  <CostRow label={t('Scholarship / Grant', '奖学金', 'Beca / Subvención')} value={-calc.scholarship} color="text-green-600" />
                )}
                <div className="border-t-2 border-navy pt-3 mt-3 flex justify-between items-center">
                  <span className="font-black text-navy uppercase tracking-wide text-sm">{t('Total Investment', '总投入', 'Inversión Total')}</span>
                  <span className="font-black text-navy text-xl">{fmtFull(calc.totalInvestment)}</span>
                </div>
              </div>
            </div>

            {/* Post-MBA earnings */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-5">{t('Post-MBA Earnings', 'MBA后薪资', 'Ingresos Post-MBA')}</h3>
              <div className="grid grid-cols-3 gap-4">
                <StatBox label={t('Yr 1 Base', '第1年底薪', 'Base Año 1')} value={fmt(calc.postMBABase)} sub={school.avgBaseSalary} />
                <StatBox label={t('Signing Bonus', '签约奖金', 'Bono de Firma')} value={fmt(calc.signingBonus)} sub={school.avgSigningBonus} />
                <StatBox label={t('Yr 1 Total', '第1年总收入', 'Total Año 1')} value={fmt(calc.postMBABase + calc.signingBonus)} accent />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <StatBox label={t('Cumulative Gain vs No-MBA (Yr 10)', '第10年累计收益（vs不读MBA）', 'Ganancia Acum. vs Sin MBA (Año 10)')} value={calc.yr10GainRaw >= 0 ? fmt(calc.yr10GainRaw) : `-${fmt(Math.abs(calc.yr10GainRaw))}`} accent={calc.yr10GainRaw >= 0} />
                <StatBox label={t('Cumulative Gain vs No-MBA (Yr 15)', '第15年累计收益（vs不读MBA）', 'Ganancia Acum. vs Sin MBA (Año 15)')} value={calc.yr15GainRaw >= 0 ? fmt(calc.yr15GainRaw) : `-${fmt(Math.abs(calc.yr15GainRaw))}`} accent={calc.yr15GainRaw >= 0} />
              </div>
            </div>

            {/* Break-even chart */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-1">{t('ROI Curve — Cumulative Net Gain vs No-MBA Path', '投资回报曲线 — 相对不读MBA的累计净收益', 'Curva de ROI — Ganancia Neta Acumulada vs Sin MBA')}</h3>
              <p className="text-xs text-gray-400 mb-4">{t('Starts negative (your investment), turns positive when you break even', '从负值（投入）开始，转正时即为回本', 'Comienza negativo (tu inversión), se vuelve positivo al recuperarla')}</p>

              <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ minWidth: 320 }}>
                  {/* Zero line */}
                  <line x1={padL} y1={zeroY} x2={chartW - padR} y2={zeroY} stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 3" />
                  <text x={padL - 6} y={zeroY + 4} textAnchor="end" fontSize={10} fill="#94A3B8">$0</text>

                  {/* Y axis labels */}
                  {[minVal, (minVal + maxVal) / 2, maxVal].map((v, i) => (
                    <text key={i} x={padL - 6} y={yPos(v) + 4} textAnchor="end" fontSize={10} fill="#94A3B8">
                      {v >= 0 ? fmt(v) : `-${fmt(Math.abs(v))}`}
                    </text>
                  ))}

                  {/* Shaded area under line */}
                  <defs>
                    <linearGradient id="gainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>

                  {/* Filled area */}
                  <polygon
                    points={`${padL},${zeroY} ${calc.cumulativeData.map(d => `${xPos(d.yr)},${yPos(d.cumulative)}`).join(' ')} ${xPos(YEARS)},${zeroY}`}
                    fill={calc.yr15GainRaw >= 0 ? 'url(#gainGrad)' : 'url(#lossGrad)'}
                  />

                  {/* Main line */}
                  <polyline
                    points={`${padL},${yPos(-calc.totalInvestment)} ${linePoints}`}
                    fill="none"
                    stroke="#F97316"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Break-even vertical marker */}
                  {calc.breakEvenYear && (
                    <>
                      <line
                        x1={xPos(calc.breakEvenYear)} y1={padT}
                        x2={xPos(calc.breakEvenYear)} y2={chartH - padB}
                        stroke="#F97316" strokeWidth={1.5} strokeDasharray="4 3"
                      />
                      <rect x={xPos(calc.breakEvenYear) - 26} y={padT} width={52} height={18} fill="#F97316" rx={2} />
                      <text x={xPos(calc.breakEvenYear)} y={padT + 12} textAnchor="middle" fontSize={10} fill="white" fontWeight="bold">
                        Yr {calc.breakEvenYear} ✓
                      </text>
                    </>
                  )}

                  {/* X axis labels */}
                  {[1, 3, 5, 7, 10, 13, 15].map(yr => (
                    <text key={yr} x={xPos(yr)} y={chartH - 4} textAnchor="middle" fontSize={10} fill="#94A3B8">
                      Yr {yr}
                    </text>
                  ))}

                  {/* Dot at each data point */}
                  {calc.cumulativeData.filter(d => [1,3,5,7,10,13,15].includes(d.yr)).map(d => (
                    <circle
                      key={d.yr}
                      cx={xPos(d.yr)} cy={yPos(d.cumulative)}
                      r={3.5}
                      fill={d.cumulative >= 0 ? '#F97316' : '#1E3A5F'}
                      stroke="white" strokeWidth={1.5}
                    />
                  ))}
                </svg>
              </div>

              <div className="mt-3 flex gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-orange inline-block" />{t('MBA ROI curve', 'MBA回报曲线', 'Curva de ROI del MBA')}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-gray-300 inline-block" />{t('Break-even ($0)', '回本线（$0）', 'Equilibrio ($0)')}</span>
              </div>
            </div>

            {/* Year-by-year table */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-4">{t('Year-by-Year Projection', '逐年收益预测', 'Proyección Año a Año')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">{t('Year', '年份', 'Año')}</th>
                      <th className="py-2 text-right text-xs font-bold text-gray-400 uppercase tracking-wide">{t('With MBA', '读MBA', 'Con MBA')}</th>
                      <th className="py-2 text-right text-xs font-bold text-gray-400 uppercase tracking-wide">{t('No MBA', '不读MBA', 'Sin MBA')}</th>
                      <th className="py-2 text-right text-xs font-bold text-gray-400 uppercase tracking-wide">{t('Net Position', '累计净收益', 'Posición Neta')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.cumulativeData.filter(d => [1,2,3,5,7,10,12,15].includes(d.yr)).map(d => (
                      <tr key={d.yr} className={`border-b border-gray-100 ${d.yr === calc.breakEvenYear ? 'bg-orange-50' : ''}`}>
                        <td className="py-2.5 font-bold text-navy">
                          {t(`Year ${d.yr}`, `第${d.yr}年`)}
                          {d.yr === calc.breakEvenYear && <span className="ml-2 text-[10px] font-black text-brand-orange uppercase">✓ {t('Break Even', '回本', 'Equilibrio')}</span>}
                        </td>
                        <td className="py-2.5 text-right text-navy font-semibold">{fmt(d.withMBASalary)}</td>
                        <td className="py-2.5 text-right text-gray-400">{fmt(d.withoutMBASalary)}</td>
                        <td className={`py-2.5 text-right font-black ${d.cumulative >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {d.cumulative >= 0 ? '+' : ''}{fmt(d.cumulative)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {t('*Net position = cumulative (MBA salary − No-MBA salary) minus total investment. Year 1 includes signing bonus.', '*累计净收益 = 历年（MBA薪资 - 不读MBA薪资）之和 - 总投入。第1年含签约奖金。', '*Posición neta = (salario MBA − salario sin MBA) acumulado menos inversión total. El año 1 incluye bono de firma.')}
              </p>
            </div>

            {/* CTA */}
            <div className="bg-navy p-8 text-center">
              <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2">{t('Ready to Apply?', '准备好申请了吗？', '¿Listo para Aplicar?')}</p>
              <h3 className="text-2xl font-black text-white mb-2">{school.name}</h3>
              <p className="text-gray-400 text-sm mb-5">
                {t('Acceptance rate:', '录取率：', 'Tasa de admisión:')} {school.acceptanceRate} · GMAT: {school.gmatMedian} · {t('Class of', '班级规模', 'Clase de')} {school.classSize}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href={`/m7-business-schools/${school.slug}`} className="btn-primary">
                  {t('View Full Profile →', '查看完整资料 →', 'Ver Perfil Completo →')}
                </Link>
                <Link href="/shop" className="border-2 border-white/30 text-white font-bold uppercase tracking-wider px-6 py-3 text-sm hover:bg-white/10 transition-colors">
                  {t('Get Advising', '获取申请指导', 'Obtener Asesoría')}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function InputSlider({
  label, value, min, max, step, format, onChange, hint
}: {
  label: string, value: number, min: number, max: number, step: number,
  format: (v: number) => string, onChange: (v: number) => void, hint?: string
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-xs font-bold text-navy uppercase tracking-wider">{label}</label>
        <span className="text-sm font-black text-brand-orange">{format(value)}</span>
      </div>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-brand-orange"
      />
      <div className="flex justify-between text-xs text-gray-300 mt-0.5">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  )
}

function CostRow({ label, value, color, hint }: { label: string, value: number, color: string, hint?: string }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`font-bold text-sm ${color}`}>
          {value < 0 ? `–${fmtFull(Math.abs(value))}` : fmtFull(value)}
        </span>
      </div>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )
}

function StatBox({ label, value, sub, accent }: { label: string, value: string, sub?: string, accent?: boolean }) {
  return (
    <div className={`p-4 border ${accent ? 'border-brand-orange bg-orange-50' : 'border-gray-200 bg-white'}`}>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 leading-tight">{label}</p>
      <p className={`text-xl font-black ${accent ? 'text-brand-orange' : 'text-navy'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}
