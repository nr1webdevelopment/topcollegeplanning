'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { lawSchools } from '@/data/law-schools-data'
import { useLanguage } from '@/lib/i18n'

function parseCurrency(str: string): number {
  return parseInt(str.replace(/[$,]/g, '')) || 0
}
function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (Math.abs(n) >= 1_000) return `$${Math.round(Math.abs(n) / 1_000)}K`
  return `$${Math.round(Math.abs(n)).toLocaleString()}`
}
function fmtFull(n: number): string {
  return (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString()
}

type CareerPath = 'biglaw' | 'clerkship' | 'government' | 'public'

const careerPaths: { id: CareerPath; en: string; es: string; zh: string; icon: string; desc: string; descEs: string; descZh: string }[] = [
  { id: 'biglaw',     en: 'BigLaw',           es: 'Grandes Firmas',     zh: '大型律所',   icon: '🏙️', desc: 'Top 500 law firms, highest salaries', descEs: 'Grandes firmas de abogados, salarios más altos', descZh: '顶级律所，薪资最高' },
  { id: 'clerkship',  en: 'Federal Clerkship', es: 'Auxiliar Federal',   zh: '联邦书记员', icon: '⚖️', desc: 'Federal judge clerkship then BigLaw',  descEs: 'Auxiliar de juez federal, luego grandes firmas',  descZh: '联邦法院书记员后转大型律所' },
  { id: 'government', en: 'Government',        es: 'Gobierno',           zh: '政府部门',   icon: '🏛️', desc: 'DOJ, DA, federal/state agencies',     descEs: 'DOJ, fiscalía, agencias federales y estatales',  descZh: '司法部、检察官、联邦/州政府机构' },
  { id: 'public',     en: 'Public Interest',   es: 'Interés Público',    zh: '公共利益',   icon: '🤝', desc: 'Non-profit, legal aid, advocacy',     descEs: 'ONG, asistencia legal, defensoría pública',     descZh: '非营利机构、法律援助、倡导组织' },
]

const YEARS = 15

export default function LawSchoolCostCalculatorPage() {
  const { t, lang } = useLanguage()
  const [selectedSlug, setSelectedSlug] = useState('yale-law')
  const [careerPath, setCareerPath] = useState<CareerPath>('biglaw')
  const [preLawSalary, setPreLawSalary] = useState(70000)
  const [livingCostPerYear, setLivingCostPerYear] = useState(28000)
  const [useAvgScholarship, setUseAvgScholarship] = useState(false)
  const [customScholarship, setCustomScholarship] = useState(0)
  const [salaryGrowthPct, setSalaryGrowthPct] = useState(5)
  const [preGrowthPct, setPreGrowthPct] = useState(3)

  const school = lawSchools.find(s => s.slug === selectedSlug)!
  const avgScholarship = parseCurrency(school.avgScholarship)
  const scholarship = useAvgScholarship ? avgScholarship : customScholarship

  // Determine starting salary by career path
  const postLawYear1Salary = useMemo(() => {
    if (careerPath === 'biglaw')     return parseCurrency(school.medianBigLawSalary)
    if (careerPath === 'clerkship')  return 65000  // clerkship stipend year 1, then jumps to BigLaw
    if (careerPath === 'government') return parseCurrency(school.medianPublicSector) + 10000
    return parseCurrency(school.medianPublicSector) - 10000 // public interest
  }, [school, careerPath])

  // For clerkship path, year 2+ jumps to BigLaw rate
  const postLawYear2Salary = useMemo(() => {
    if (careerPath === 'clerkship') return parseCurrency(school.medianBigLawSalary)
    return postLawYear1Salary
  }, [school, careerPath, postLawYear1Salary])

  const calc = useMemo(() => {
    const tuitionPerYear = parseCurrency(school.tuitionPerYear)
    const tuitionTotal = tuitionPerYear * 3  // 3-year JD
    const livingTotal = livingCostPerYear * 3
    const opportunityCost = preLawSalary * 3
    const totalInvestment = tuitionTotal + livingTotal + opportunityCost - scholarship

    // Year-by-year projections
    const data = Array.from({ length: YEARS }, (_, i) => {
      const yr = i + 1
      const baseSalary = yr === 1 ? postLawYear1Salary : postLawYear2Salary
      const withLawSalary = baseSalary * Math.pow(1 + salaryGrowthPct / 100, Math.max(0, i - (careerPath === 'clerkship' ? 1 : 0)))
      const withoutLawSalary = preLawSalary * Math.pow(1 + preGrowthPct / 100, i + 3) // they keep working 3 more years
      return { yr, withLawSalary, withoutLawSalary }
    })

    let cumulative = -totalInvestment
    let breakEvenYear: number | null = null
    const cumulativeData = data.map(({ yr, withLawSalary, withoutLawSalary }) => {
      cumulative += withLawSalary - withoutLawSalary
      if (cumulative >= 0 && breakEvenYear === null) breakEvenYear = yr
      return { yr, cumulative, withLawSalary, withoutLawSalary }
    })

    const yr10Gain = cumulativeData[9]?.cumulative ?? 0
    const yr15Gain = cumulativeData[14]?.cumulative ?? 0

    return {
      tuitionTotal, tuitionPerYear, livingTotal, opportunityCost,
      scholarship, totalInvestment,
      postLawYear1Salary, postLawYear2Salary,
      breakEvenYear, yr10Gain, yr15Gain, cumulativeData,
    }
  }, [school, careerPath, preLawSalary, livingCostPerYear, scholarship, salaryGrowthPct, preGrowthPct, postLawYear1Salary, postLawYear2Salary])

  // Chart
  const chartW = 620
  const chartH = 260
  const padL = 64
  const padR = 20
  const padT = 20
  const padB = 36

  const minVal = Math.min(...calc.cumulativeData.map(d => d.cumulative), -calc.totalInvestment)
  const maxVal = Math.max(...calc.cumulativeData.map(d => d.cumulative), 0)
  const range = maxVal - minVal || 1

  function xPos(yr: number) { return padL + ((yr - 1) / (YEARS - 1)) * (chartW - padL - padR) }
  function yPos(val: number) { return padT + (1 - (val - minVal) / range) * (chartH - padT - padB) }

  const linePoints = calc.cumulativeData.map(d => `${xPos(d.yr)},${yPos(d.cumulative)}`).join(' ')
  const zeroY = yPos(0)

  const careerLabel = (id: CareerPath) => {
    const p = careerPaths.find(c => c.id === id)!
    return lang === 'zh' ? p.zh : lang === 'es' ? p.es : p.en
  }

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ── */}
      <div className="relative text-white py-16 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1673728816987-b085a6d41111?w=1800&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy opacity-85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/top-law-schools" className="inline-flex items-center gap-2 text-sm text-brand-orange font-bold uppercase tracking-widest mb-4 hover:underline">
            ← {t('Top Law Schools', '顶尖法学院', 'Mejores Escuelas de Derecho')}
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            {t('Law School Cost Calculator', '法学院费用计算器', 'Calculadora de Costos — Escuela de Derecho')}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            {t(
              'Calculate your full JD investment, model earnings by career path — BigLaw, clerkship, government or public interest — and find your break-even year.',
              '计算您的JD总投入，按职业路径模拟收益——大型律所、书记员、政府或公共利益，找到您的回本年限。',
              'Calcula tu inversión total en el JD, modela ingresos por trayectoria profesional y encuentra tu año de equilibrio.'
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
              <h2 className="text-xs font-black uppercase tracking-widest text-navy mb-4">
                {t('Select Your School', '选择学校', 'Selecciona tu Escuela')}
              </h2>
              <div className="space-y-2">
                {lawSchools.map(s => (
                  <button
                    key={s.slug}
                    onClick={() => setSelectedSlug(s.slug)}
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
                      <p className="text-xs text-gray-400">#{s.usNewsRanking} · {s.tuitionPerYear}/yr · BigLaw {s.bigLawPlacement}</p>
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

            {/* Career path */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-navy mb-4">
                {t('Career Path After JD', 'JD毕业后职业路径', 'Trayectoria Profesional Tras el JD')}
              </h2>
              <div className="space-y-2">
                {careerPaths.map(cp => (
                  <button
                    key={cp.id}
                    onClick={() => setCareerPath(cp.id)}
                    className={`w-full flex items-center gap-3 p-3 border-2 transition-all text-left ${
                      careerPath === cp.id
                        ? 'border-brand-orange bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{cp.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-navy text-sm">{lang === 'zh' ? cp.zh : lang === 'es' ? cp.es : cp.en}</p>
                      <p className="text-xs text-gray-400 truncate">{lang === 'zh' ? cp.descZh : lang === 'es' ? cp.descEs : cp.desc}</p>
                    </div>
                    {careerPath === cp.id && (
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
              <h2 className="text-xs font-black uppercase tracking-widest text-navy mb-5">
                {t('Your Numbers', '您的数据', 'Tus Datos')}
              </h2>
              <div className="space-y-5">
                <InputSlider
                  label={t('Current Annual Salary (Pre-Law)', '目前年薪（法学院前）', 'Salario Actual (Pre-Derecho)')}
                  value={preLawSalary} min={30000} max={200000} step={5000}
                  format={fmtFull} onChange={setPreLawSalary}
                />
                <InputSlider
                  label={t('Living Expenses / Year', '每年生活费', 'Gastos de Vida / Año')}
                  value={livingCostPerYear} min={15000} max={60000} step={1000}
                  format={fmtFull} onChange={setLivingCostPerYear}
                  hint={t('Housing, food, transport etc.', '住房、餐饮、交通等', 'Vivienda, comida, transporte, etc.')}
                />

                {/* Scholarship */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider">
                      {t('Scholarship / Grant', '奖学金', 'Beca / Subsidio')}
                    </label>
                    <button
                      onClick={() => {
                        const next = !useAvgScholarship
                        setUseAvgScholarship(next)
                        if (next) setCustomScholarship(avgScholarship)
                      }}
                      className={`text-xs font-bold px-2 py-1 border transition-colors ${
                        useAvgScholarship ? 'bg-navy text-white border-navy' : 'text-navy border-gray-300 hover:border-navy'
                      }`}
                    >
                      {t('Use school avg', '用学校均值', 'Usar promedio')}
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
                  <p className="text-xs text-gray-400 mt-1">{t('School avg:', '学校均值：', 'Promedio escolar:')} {school.avgScholarship}</p>
                </div>

                <InputSlider
                  label={t('Post-JD Salary Growth / yr', 'JD后年薪增速', 'Crecimiento Salarial Post-JD / año')}
                  value={salaryGrowthPct} min={2} max={15} step={0.5}
                  format={v => `${v}%`} onChange={setSalaryGrowthPct}
                />
                <InputSlider
                  label={t('Without-JD Salary Growth / yr', '无JD路径年薪增速', 'Crecimiento Sin JD / año')}
                  value={preGrowthPct} min={1} max={10} step={0.5}
                  format={v => `${v}%`} onChange={setPreGrowthPct}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT: RESULTS ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* School + path header */}
            <div className="flex items-center gap-4 pb-2 border-b-2 border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={school.logoUrl} alt={school.shortName} className="w-12 h-12 object-contain" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  {t('Calculating for', '正在计算', 'Calculando para')}:
                </p>
                <h2 className="text-xl font-black text-navy">{school.name}</h2>
                <p className="text-sm text-brand-orange font-bold">
                  {careerPaths.find(c => c.id === careerPath)?.icon} {careerLabel(careerPath)}
                </p>
              </div>
            </div>

            {/* Break-even highlight */}
            <div className="border-l-4 border-brand-orange bg-orange-50 p-5 flex items-center gap-5">
              <div className="text-5xl font-black text-brand-orange leading-none">
                {calc.breakEvenYear ? `Yr ${calc.breakEvenYear}` : '15+'}
              </div>
              <div>
                <p className="text-sm font-black text-navy uppercase tracking-wider">
                  {t('Break-Even Point', '回本年限', 'Punto de Equilibrio')}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {calc.breakEvenYear
                    ? t(`Your JD pays for itself ${calc.breakEvenYear} years after graduation.`, `法学院毕业后第${calc.breakEvenYear}年收回投资。`, `Tu JD se paga solo ${calc.breakEvenYear} años después de graduarte.`)
                    : t('Break-even is beyond year 15 — try adjusting your inputs.', '回本超过15年，请调整参数。', 'El equilibrio supera el año 15 — ajusta los parámetros.')}
                </p>
              </div>
            </div>

            {/* Starting salary callout */}
            <div className="grid grid-cols-3 gap-4">
              <StatBox
                label={t('Year 1 Salary', '第1年薪资', 'Salario Año 1')}
                value={fmt(calc.postLawYear1Salary)}
                sub={careerPath === 'clerkship' ? t('Clerkship stipend', '书记员津贴', 'Estipendio auxiliar') : careerLabel(careerPath)}
              />
              <StatBox
                label={careerPath === 'clerkship' ? t('Year 2+ (BigLaw)', '第2年起（大所）', 'Año 2+ (Grandes Firmas)') : t('BigLaw Median', '大所薪资中位数', 'Mediana Grandes Firmas')}
                value={fmt(parseCurrency(school.medianBigLawSalary))}
              />
              <StatBox label={t('Public Sector', '公共部门', 'Sector Público')} value={fmt(parseCurrency(school.medianPublicSector))} />
            </div>

            {/* Cost breakdown */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-5">
                {t('Total Investment Breakdown (3-Year JD)', '总投入明细（3年JD）', 'Desglose de Inversión Total (JD 3 años)')}
              </h3>
              <div className="space-y-3">
                <CostRow label={t('Tuition (3 years)', '学费（3年）', 'Matrícula (3 años)')} value={calc.tuitionTotal} color="text-navy" />
                <CostRow label={t('Living Expenses (3 years)', '生活费（3年）', 'Gastos de Vida (3 años)')} value={calc.livingTotal} color="text-navy" />
                <CostRow
                  label={t('Opportunity Cost (foregone salary)', '机会成本（放弃薪资）', 'Costo de Oportunidad (salario no percibido)')}
                  value={calc.opportunityCost} color="text-navy"
                  hint={t('3 years of your current salary you give up', '放弃3年现有薪资', '3 años de tu salario actual que sacrificas')}
                />
                {calc.scholarship > 0 && (
                  <CostRow label={t('Scholarship / Grant', '奖学金', 'Beca / Subsidio')} value={-calc.scholarship} color="text-green-600" />
                )}
                <div className="border-t-2 border-navy pt-3 mt-3 flex justify-between items-center">
                  <span className="font-black text-navy uppercase tracking-wide text-sm">
                    {t('Total Investment', '总投入', 'Inversión Total')}
                  </span>
                  <span className="font-black text-navy text-xl">{fmtFull(calc.totalInvestment)}</span>
                </div>
              </div>
            </div>

            {/* School stats */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-5">
                {t('Employment & Placement Outcomes', '就业与录用数据', 'Resultados de Empleo y Colocación')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatBox label={t('BigLaw Rate', 'BigLaw比例', 'Tasa BigLaw')} value={school.bigLawPlacement} accent />
                <StatBox label={t('Bar Pass', '律考通过率', 'Tasa Colegiatura')} value={school.barPassRate} />
                <StatBox label={t('Fed. Clerkship', '联邦书记员', 'Auxiliar Federal')} value={school.federalClerkshipRate} />
                <StatBox label={t('Employed 10mo', '毕业10月就业率', 'Empleado 10m')} value={school.employmentAt10Months} />
              </div>
            </div>

            {/* 10/15 yr gains */}
            <div className="grid grid-cols-2 gap-4">
              <StatBox
                label={t('Cumulative Gain vs No-JD (Yr 10)', '第10年累计净收益', 'Ganancia Acumulada vs Sin JD (Año 10)')}
                value={calc.yr10Gain >= 0 ? `+${fmt(calc.yr10Gain)}` : fmt(calc.yr10Gain)}
                accent={calc.yr10Gain >= 0}
              />
              <StatBox
                label={t('Cumulative Gain vs No-JD (Yr 15)', '第15年累计净收益', 'Ganancia Acumulada vs Sin JD (Año 15)')}
                value={calc.yr15Gain >= 0 ? `+${fmt(calc.yr15Gain)}` : fmt(calc.yr15Gain)}
                accent={calc.yr15Gain >= 0}
              />
            </div>

            {/* ROI Chart */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-1">
                {t('ROI Curve — Cumulative Net Gain vs No-JD Path', '投资回报曲线 — 相对不读法学院的累计净收益', 'Curva ROI — Ganancia Neta vs Sin JD')}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {t('Starts negative (your investment), turns positive when you break even', '从负值（投入）开始，转正时即为回本', 'Comienza negativo (tu inversión), se vuelve positivo al equilibrarse')}
              </p>
              <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ minWidth: 320 }}>
                  <defs>
                    <linearGradient id="lawGainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Zero line */}
                  <line x1={padL} y1={zeroY} x2={chartW - padR} y2={zeroY} stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 3" />
                  <text x={padL - 6} y={zeroY + 4} textAnchor="end" fontSize={10} fill="#94A3B8">$0</text>

                  {/* Y axis labels */}
                  {[minVal, (minVal + maxVal) / 2, maxVal].map((v, i) => (
                    <text key={i} x={padL - 6} y={yPos(v) + 4} textAnchor="end" fontSize={10} fill="#94A3B8">
                      {v >= 0 ? fmt(v) : `-${fmt(Math.abs(v))}`}
                    </text>
                  ))}

                  {/* Shaded fill */}
                  <polygon
                    points={`${padL},${zeroY} ${calc.cumulativeData.map(d => `${xPos(d.yr)},${yPos(d.cumulative)}`).join(' ')} ${xPos(YEARS)},${zeroY}`}
                    fill="url(#lawGainGrad)"
                  />

                  {/* Main line */}
                  <polyline
                    points={`${padL},${yPos(-calc.totalInvestment)} ${linePoints}`}
                    fill="none" stroke="#F97316" strokeWidth={2.5}
                    strokeLinecap="round" strokeLinejoin="round"
                  />

                  {/* Break-even marker */}
                  {calc.breakEvenYear && (
                    <>
                      <line x1={xPos(calc.breakEvenYear)} y1={padT} x2={xPos(calc.breakEvenYear)} y2={chartH - padB}
                        stroke="#F97316" strokeWidth={1.5} strokeDasharray="4 3" />
                      <rect x={xPos(calc.breakEvenYear) - 26} y={padT} width={52} height={18} fill="#F97316" rx={2} />
                      <text x={xPos(calc.breakEvenYear)} y={padT + 12} textAnchor="middle" fontSize={10} fill="white" fontWeight="bold">
                        Yr {calc.breakEvenYear} ✓
                      </text>
                    </>
                  )}

                  {/* X axis labels */}
                  {[1, 3, 5, 7, 10, 13, 15].map(yr => (
                    <text key={yr} x={xPos(yr)} y={chartH - 4} textAnchor="middle" fontSize={10} fill="#94A3B8">Yr {yr}</text>
                  ))}

                  {/* Dots */}
                  {calc.cumulativeData.filter(d => [1,3,5,7,10,13,15].includes(d.yr)).map(d => (
                    <circle key={d.yr} cx={xPos(d.yr)} cy={yPos(d.cumulative)} r={3.5}
                      fill={d.cumulative >= 0 ? '#F97316' : '#1E3A5F'} stroke="white" strokeWidth={1.5} />
                  ))}
                </svg>
              </div>
              <div className="mt-3 flex gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-orange inline-block" />{t('JD ROI curve', 'JD回报曲线', 'Curva ROI del JD')}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-gray-300 inline-block" />{t('Break-even ($0)', '回本线（$0）', 'Equilibrio ($0)')}</span>
              </div>
            </div>

            {/* Year-by-year table */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-4">
                {t('Year-by-Year Projection', '逐年收益预测', 'Proyección Año por Año')}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">{t('Year', '年份', 'Año')}</th>
                      <th className="py-2 text-right text-xs font-bold text-gray-400 uppercase tracking-wide">{t('With JD', '读法学院', 'Con JD')}</th>
                      <th className="py-2 text-right text-xs font-bold text-gray-400 uppercase tracking-wide">{t('No JD', '不读法学院', 'Sin JD')}</th>
                      <th className="py-2 text-right text-xs font-bold text-gray-400 uppercase tracking-wide">{t('Net Position', '累计净收益', 'Posición Neta')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.cumulativeData.filter(d => [1,2,3,5,7,10,12,15].includes(d.yr)).map(d => (
                      <tr key={d.yr} className={`border-b border-gray-100 ${d.yr === calc.breakEvenYear ? 'bg-orange-50' : ''}`}>
                        <td className="py-2.5 font-bold text-navy">
                          {t(`Year ${d.yr}`, `第${d.yr}年`, `Año ${d.yr}`)}
                          {d.yr === calc.breakEvenYear && (
                            <span className="ml-2 text-[10px] font-black text-brand-orange uppercase">✓ {t('Break Even', '回本', 'Equilibrio')}</span>
                          )}
                        </td>
                        <td className="py-2.5 text-right text-navy font-semibold">{fmt(d.withLawSalary)}</td>
                        <td className="py-2.5 text-right text-gray-400">{fmt(d.withoutLawSalary)}</td>
                        <td className={`py-2.5 text-right font-black ${d.cumulative >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {d.cumulative >= 0 ? '+' : ''}{fmt(d.cumulative)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {t('*Net position = cumulative (JD salary − No-JD salary) minus total investment.', '*累计净收益 = 历年（JD薪资 - 不读法学院薪资）之和 - 总投入。', '*Posición neta = (salario JD − salario sin JD) acumulado menos inversión total.')}
              </p>
            </div>

            {/* CTA */}
            <div className="bg-navy p-8 text-center">
              <p className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2">
                {t('Ready to Apply?', '准备好申请了吗？', '¿Listo para Aplicar?')}
              </p>
              <h3 className="text-2xl font-black text-white mb-2">{school.name}</h3>
              <p className="text-gray-400 text-sm mb-5">
                {t('Acceptance rate:', '录取率：', 'Tasa de aceptación:')} {school.acceptanceRate} · LSAT: {school.lsatMedian} · BigLaw: {school.bigLawPlacement}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href={`/top-law-schools/${school.slug}`} className="btn-primary">
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
function InputSlider({ label, value, min, max, step, format, onChange, hint }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void; hint?: string
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-xs font-bold text-navy uppercase tracking-wider">{label}</label>
        <span className="text-sm font-black text-brand-orange">{format(value)}</span>
      </div>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-brand-orange" />
      <div className="flex justify-between text-xs text-gray-300 mt-0.5">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  )
}

function CostRow({ label, value, color, hint }: { label: string; value: number; color: string; hint?: string }) {
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

function StatBox({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`p-4 border ${accent ? 'border-brand-orange bg-orange-50' : 'border-gray-200 bg-white'}`}>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 leading-tight">{label}</p>
      <p className={`text-xl font-black ${accent ? 'text-brand-orange' : 'text-navy'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}
