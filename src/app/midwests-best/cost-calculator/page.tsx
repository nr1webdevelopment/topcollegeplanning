'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

// ── SCHOOL DATA ───────────────────────────────────────────────────────────────
interface MWSchool {
  slug: string
  shortName: string
  fullName: string
  type: 'Private' | 'Public'
  color: string
  logo: string
  tuition: number
  tuitionInState?: number
  tuitionOutState?: number
  tuitionIntl?: number      // intl = out-of-state + intl student fee
  roomBoard: number
  intlHealthInsurance: number
  aidGenerosity: 'high' | 'medium' | 'low'
  intlAidGenerosity: 'high' | 'medium' | 'low' | 'none'
  meetsNeed: boolean
  noLoanPolicy?: boolean
}

const SCHOOLS: MWSchool[] = [
  {
    slug: 'uchicago',
    shortName: 'UChicago',
    fullName: 'University of Chicago',
    type: 'Private',
    color: '#800000',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/79/University_of_Chicago_shield.svg/250px-University_of_Chicago_shield.svg.png',
    tuition: 65442,
    roomBoard: 19614,
    intlHealthInsurance: 3200,
    aidGenerosity: 'high',
    intlAidGenerosity: 'high',   // need-blind for international
    meetsNeed: true,
    noLoanPolicy: true,
  },
  {
    slug: 'northwestern',
    shortName: 'Northwestern',
    fullName: 'Northwestern University',
    type: 'Private',
    color: '#4E2A84',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Northwestern_University_seal.svg/250px-Northwestern_University_seal.svg.png',
    tuition: 65997,
    roomBoard: 19800,
    intlHealthInsurance: 3200,
    aidGenerosity: 'high',
    intlAidGenerosity: 'high',   // meets full need for international
    meetsNeed: true,
    noLoanPolicy: true,
  },
  {
    slug: 'notre-dame',
    shortName: 'Notre Dame',
    fullName: 'University of Notre Dame',
    type: 'Private',
    color: '#0C2340',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/University_of_Notre_Dame_seal_%282%29.svg/250px-University_of_Notre_Dame_seal_%282%29.svg.png',
    tuition: 62693,
    roomBoard: 17196,
    intlHealthInsurance: 3000,
    aidGenerosity: 'high',
    intlAidGenerosity: 'low',
    meetsNeed: true,
    noLoanPolicy: false,
  },
  {
    slug: 'washu',
    shortName: 'Wash U',
    fullName: 'Washington Univ. in St. Louis',
    type: 'Private',
    color: '#A51417',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/WashU_St._Louis_seal.svg/250px-WashU_St._Louis_seal.svg.png',
    tuition: 63494,
    roomBoard: 19790,
    intlHealthInsurance: 3200,
    aidGenerosity: 'high',
    intlAidGenerosity: 'low',
    meetsNeed: true,
    noLoanPolicy: false,
  },
  {
    slug: 'michigan',
    shortName: 'Michigan',
    fullName: 'University of Michigan',
    type: 'Public',
    color: '#00274C',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Seal_of_the_University_of_Michigan.svg/250px-Seal_of_the_University_of_Michigan.svg.png',
    tuition: 57273,
    tuitionInState: 17786,
    tuitionOutState: 57273,
    tuitionIntl: 59273,
    roomBoard: 14000,
    intlHealthInsurance: 3400,
    aidGenerosity: 'medium',
    intlAidGenerosity: 'none',
    meetsNeed: true,
    noLoanPolicy: false,
  },
  {
    slug: 'uiuc',
    shortName: 'UIUC',
    fullName: 'Univ. of Illinois UC',
    type: 'Public',
    color: '#E84A27',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/University_of_Illinois_seal.svg/250px-University_of_Illinois_seal.svg.png',
    tuition: 35672,
    tuitionInState: 17570,
    tuitionOutState: 35672,
    tuitionIntl: 37128,
    roomBoard: 13202,
    intlHealthInsurance: 3800,
    aidGenerosity: 'low',
    intlAidGenerosity: 'none',
    meetsNeed: false,
    noLoanPolicy: false,
  },
  {
    slug: 'wisconsin',
    shortName: 'UW–Madison',
    fullName: 'Univ. of Wisconsin–Madison',
    type: 'Public',
    color: '#C5050C',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Seal_of_the_University_of_Wisconsin.svg/250px-Seal_of_the_University_of_Wisconsin.svg.png',
    tuition: 40603,
    tuitionInState: 11205,
    tuitionOutState: 40603,
    tuitionIntl: 41803,
    roomBoard: 12300,
    intlHealthInsurance: 3600,
    aidGenerosity: 'low',
    intlAidGenerosity: 'none',
    meetsNeed: false,
    noLoanPolicy: false,
  },
  {
    slug: 'ohio-state',
    shortName: 'Ohio State',
    fullName: 'Ohio State University',
    type: 'Public',
    color: '#BA0C2F',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Ohio_State_University_seal.svg/250px-Ohio_State_University_seal.svg.png',
    tuition: 36722,
    tuitionInState: 12485,
    tuitionOutState: 36722,
    tuitionIntl: 37922,
    roomBoard: 13076,
    intlHealthInsurance: 3200,
    aidGenerosity: 'low',
    intlAidGenerosity: 'none',
    meetsNeed: false,
    noLoanPolicy: false,
  },
]

const BOOKS = 1200
const PERSONAL = 2200
const TRAVEL: Record<string, number> = {
  uchicago: 700, northwestern: 700, 'notre-dame': 900, washu: 900,
  michigan: 1000, uiuc: 900, wisconsin: 1000, 'ohio-state': 1000,
}

type Residency = 'instate' | 'outofstate' | 'international'

function getTuition(school: MWSchool, residency: Residency): number {
  if (residency === 'international') return school.tuitionIntl ?? school.tuitionOutState ?? school.tuition
  if (school.type === 'Private') return school.tuition
  return residency === 'instate' ? (school.tuitionInState ?? school.tuition) : (school.tuitionOutState ?? school.tuition)
}

function estimateAid(
  totalCost: number, income: number, siblings: number,
  school: MWSchool, residency: Residency
): number {
  const intl = residency === 'international'
  const gen = intl ? school.intlAidGenerosity : school.aidGenerosity

  if (gen === 'none') return 0

  let familyPct: number
  if (income <= 65000)       familyPct = 0.00
  else if (income <= 85000)  familyPct = 0.06
  else if (income <= 125000) familyPct = 0.13
  else if (income <= 175000) familyPct = 0.22
  else if (income <= 250000) familyPct = 0.34
  else if (income <= 400000) familyPct = 0.48
  else                       familyPct = 0.62

  if (gen === 'medium') familyPct = Math.min(familyPct * 1.1 + 0.04, 0.90)
  if (gen === 'low')    familyPct = Math.min(familyPct * 1.4 + 0.12, 0.95)

  if (school.type === 'Public' && residency === 'outofstate') {
    familyPct = Math.min(familyPct * 1.25 + 0.08, 0.97)
  }

  const siblingDiscount = Math.min(siblings * 0.05, 0.15)
  familyPct = Math.max(0, familyPct - siblingDiscount)

  return Math.max(0, Math.round(totalCost * (1 - familyPct)))
}

function fmt(n: number) { return '$' + n.toLocaleString() }

const RESIDENCY_OPTIONS: { value: Residency; label: string; labelZh: string }[] = [
  { value: 'instate',       label: 'In-State',          labelZh: '州内' },
  { value: 'outofstate',    label: 'Out-of-State',       labelZh: '州外' },
  { value: 'international', label: 'International',      labelZh: '国际生' },
]

export default function MidwestCostCalculatorPage() {
  const { t } = useLanguage()
  const [selectedSlug, setSelectedSlug] = useState('uchicago')
  const [income, setIncome] = useState(120000)
  const [siblings, setSiblings] = useState(0)
  const [residency, setResidency] = useState<Residency>('outofstate')
  const [includeBooks, setIncludeBooks] = useState(true)
  const [includePersonal, setIncludePersonal] = useState(true)
  const [includeTravel, setIncludeTravel] = useState(true)
  const [includeInsurance, setIncludeInsurance] = useState(true)

  const school = SCHOOLS.find(s => s.slug === selectedSlug) ?? SCHOOLS[0]
  const isIntl = residency === 'international'

  const tuition = getTuition(school, residency)
  const insurance = isIntl && includeInsurance ? school.intlHealthInsurance : 0
  const extras = (includeBooks ? BOOKS : 0) + (includePersonal ? PERSONAL : 0) + (includeTravel ? (TRAVEL[school.slug] ?? 800) : 0) + insurance
  const totalCost = tuition + school.roomBoard + extras
  const aid = useMemo(() => estimateAid(totalCost, income, siblings, school, residency), [totalCost, income, siblings, school, residency])
  const netPrice = Math.max(0, totalCost - aid)
  const aidPct = totalCost > 0 ? Math.round((aid / totalCost) * 100) : 0

  const comparison = SCHOOLS.map(s => {
    const t_ = getTuition(s, residency)
    const ins = isIntl && includeInsurance ? s.intlHealthInsurance : 0
    const ext = (includeBooks ? BOOKS : 0) + (includePersonal ? PERSONAL : 0) + (includeTravel ? (TRAVEL[s.slug] ?? 800) : 0) + ins
    const total = t_ + s.roomBoard + ext
    const a = estimateAid(total, income, siblings, s, residency)
    return { ...s, total, aid: a, net: Math.max(0, total - a) }
  }).sort((a, b) => a.net - b.net)

  const incomeLabel = income >= 500000 ? '$500K+' : fmt(income)
  const sliderPct = ((income - 20000) / (500000 - 20000)) * 100

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/midwests-best" className="text-brand-orange text-sm font-bold uppercase tracking-widest hover:underline mb-4 inline-block">
            ← {t("Midwest's Best", '中西部名校')}
          </Link>
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            {t('Midwest College Cost Calculator', '中西部大学费用计算器', 'Calculadora de Costos — Universidades del Medio Oeste')}
          </h1>
          <p className="text-gray-300 max-w-2xl">
            {t(
              'Estimate your net price at top Midwest universities — for in-state, out-of-state, and international students.',
              '估算顶尖中西部大学的净费用——适用于州内、州外及国际学生。'
            )}
          </p>
        </div>
      </div>

      {/* ── MAIN LAYOUT ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT PANEL ────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-7">

            {/* School Selector */}
            <div>
              <h2 className="font-black text-navy text-sm uppercase tracking-widest mb-3">
                {t('Select School', '选择学校', 'Seleccionar Escuela')}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {SCHOOLS.map(s => (
                  <button
                    key={s.slug}
                    onClick={() => setSelectedSlug(s.slug)}
                    className={`flex items-center gap-2 px-3 py-2.5 border-2 transition-all text-left ${
                      selectedSlug === s.slug
                        ? 'border-brand-orange bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.logo} alt={s.shortName} className="w-7 h-7 object-contain flex-shrink-0" />
                    <div className="min-w-0">
                      <div className={`font-bold text-xs leading-tight truncate ${selectedSlug === s.slug ? 'text-brand-orange' : 'text-navy'}`}>
                        {s.shortName}
                      </div>
                      <div className="text-xs text-gray-400">{s.type}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Residency — shown for ALL schools */}
            <div>
              <h2 className="font-black text-navy text-sm uppercase tracking-widest mb-3">
                {t('Student Status', '学生类型', 'Tipo de Estudiante')}
              </h2>
              <div className="flex rounded overflow-hidden border border-gray-200">
                {RESIDENCY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setResidency(opt.value)}
                    className={`flex-1 py-2.5 text-xs font-bold transition-colors border-r last:border-r-0 border-gray-200 ${
                      residency === opt.value ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-gray-50'
                    }`}
                  >
                    {t(opt.label, opt.labelZh)}
                  </button>
                ))}
              </div>
              {school.type === 'Private' && residency === 'instate' && (
                <p className="text-xs text-blue-600 font-semibold mt-2">
                  {t('Private schools charge the same tuition regardless of state residency.', '私立大学无论居住地均收取相同学费。', 'Las escuelas privadas cobran la misma matrícula sin importar el estado de residencia.')}
                </p>
              )}
              {isIntl && school.intlAidGenerosity === 'high' && (
                <p className="text-xs text-green-600 font-semibold mt-2">
                  {t('✓ This school is need-blind for international students and meets full demonstrated need.', '✓ 该校对国际学生实行需求盲招，并满足全部需求。', '✓ Esta escuela es ciego a necesidad para estudiantes internacionales y cubre el 100% de la necesidad demostrada.')}
                </p>
              )}
              {isIntl && school.intlAidGenerosity === 'none' && (
                <p className="text-xs text-orange-600 font-semibold mt-2">
                  {t('⚠ This school offers very limited need-based aid for international students.', '⚠ 该校为国际学生提供的需求型助学金非常有限。', '⚠ Esta escuela ofrece ayuda según necesidad muy limitada para estudiantes internacionales.')}
                </p>
              )}
            </div>

            {/* Income Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-black text-navy text-sm uppercase tracking-widest">
                  {t('Household Income', '家庭年收入', 'Ingreso del Hogar')}
                </h2>
                <span className="text-brand-orange font-black text-lg">{incomeLabel}</span>
              </div>
              <input
                type="range" min={20000} max={500000} step={5000} value={income}
                onChange={e => setIncome(Number(e.target.value))}
                className="w-full h-2 appearance-none rounded cursor-pointer"
                style={{ background: `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${sliderPct}%, #e5e7eb ${sliderPct}%, #e5e7eb 100%)` }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$20K</span><span>$500K+</span>
              </div>
            </div>

            {/* Siblings */}
            <div>
              <h2 className="font-black text-navy text-sm uppercase tracking-widest mb-3">
                {t('Siblings in College', '同时在读大学的兄弟姐妹', 'Hermanos en la Universidad')}
              </h2>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map(n => (
                  <button
                    key={n} onClick={() => setSiblings(n)}
                    className={`w-12 h-10 font-bold text-sm border-2 transition-colors ${
                      siblings === n
                        ? 'bg-brand-orange text-white border-brand-orange'
                        : 'bg-white text-navy border-gray-200 hover:border-brand-orange'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Expense Toggles */}
            <div>
              <h2 className="font-black text-navy text-sm uppercase tracking-widest mb-3">
                {t('Include in Estimate', '费用估算包含', 'Incluir en el Estimado')}
              </h2>
              <div className="space-y-2">
                {[
                  { label: t('Books & Supplies', '书本与学习用品', 'Libros y Material'), value: includeBooks, set: setIncludeBooks, amount: BOOKS, always: true },
                  { label: t('Personal Expenses', '个人生活费', 'Gastos Personales'), value: includePersonal, set: setIncludePersonal, amount: PERSONAL, always: true },
                  { label: t('Travel', '交通费', 'Transporte'), value: includeTravel, set: setIncludeTravel, amount: TRAVEL[school.slug] ?? 800, always: true },
                  { label: t('Health Insurance (Intl)', '健康保险（国际生）', 'Seguro de Salud (Intl.)'), value: includeInsurance, set: setIncludeInsurance, amount: school.intlHealthInsurance, always: false },
                ]
                  .filter(item => item.always || isIntl)
                  .map(item => (
                    <label key={item.label} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm text-navy font-medium group-hover:text-brand-orange transition-colors">
                        {item.label}
                        <span className="text-gray-400 ml-1 text-xs">({fmt(item.amount)}/yr)</span>
                      </span>
                      <div
                        onClick={() => item.set(!item.value)}
                        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${item.value ? 'bg-brand-orange' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    </label>
                  ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ───────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">

            {/* School Header */}
            <div className="flex items-center gap-4 p-5 border-l-4 bg-gray-soft" style={{ borderColor: school.color }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={school.logo} alt={school.shortName} className="w-14 h-14 object-contain flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: school.color }}>
                    {school.type} · {residency === 'instate' ? t('In-State', '州内', 'En el Estado') : residency === 'outofstate' ? t('Out-of-State', '州外', 'Fuera del Estado') : t('International', '国际生', 'Internacional')}
                  </span>
                  {school.noLoanPolicy && <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5">{t('NO LOANS', '无贷款政策', 'SIN PRÉSTAMOS')}</span>}
                  {isIntl && school.intlAidGenerosity === 'high' && <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5">{t('NEED-BLIND INTL', '需求盲招国际生', 'CIEGO A NECESIDAD INTL')}</span>}
                  {isIntl && school.intlAidGenerosity === 'none' && <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5">{t('LIMITED INTL AID', '国际生助学金有限', 'AYUDA INTL LIMITADA')}</span>}
                </div>
                <h2 className="font-black text-navy text-xl">{school.fullName}</h2>
              </div>
            </div>

            {/* Net Price Callout */}
            <div className="bg-brand-orange text-white p-6 text-center">
              <p className="text-orange-200 text-sm uppercase tracking-widest font-bold mb-1">
                {t('Estimated Net Price Per Year', '预计每年净费用', 'Precio Neto Estimado Por Año')}
              </p>
              <p className="text-5xl font-black mb-1">{fmt(netPrice)}</p>
              <p className="text-orange-100 text-sm">
                {aid > 0
                  ? t(`${fmt(aid)} in estimated aid (${aidPct}% covered)`, `预计获得${fmt(aid)}助学金（覆盖${aidPct}%）`)
                  : t('No need-based aid available for this student status', '该学生类型无需求型助学金', 'Sin ayuda según necesidad para este tipo de estudiante')
                }
              </p>
            </div>

            {/* Aid Meter */}
            {aid > 0 && (
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  <span>{t('Aid Coverage', '助学金覆盖率', 'Cobertura de Ayuda')}</span>
                  <span style={{ color: school.color }}>{aidPct}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${aidPct}%`, backgroundColor: school.color }} />
                </div>
              </div>
            )}

            {/* Cost Breakdown */}
            <div className="border border-gray-100">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                <h3 className="font-black text-navy text-sm uppercase tracking-widest">{t('Annual Cost Breakdown', '年度费用明细', 'Desglose de Costos Anuales')}</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { label: t('Tuition & Fees', '学费及杂费', 'Matrícula y Cuotas'), amount: tuition, color: school.color },
                  { label: t('Room & Board', '住宿及餐饮', 'Aloj. y Comida'), amount: school.roomBoard, color: '#6B7280' },
                  ...(includeBooks    ? [{ label: t('Books & Supplies', '书本及学习用品', 'Libros y Material'), amount: BOOKS, color: '#9CA3AF' }] : []),
                  ...(includePersonal ? [{ label: t('Personal Expenses', '个人生活费', 'Gastos Personales'), amount: PERSONAL, color: '#9CA3AF' }] : []),
                  ...(includeTravel   ? [{ label: t('Travel', '交通费', 'Transporte'), amount: TRAVEL[school.slug] ?? 800, color: '#9CA3AF' }] : []),
                  ...(isIntl && includeInsurance ? [{ label: t('Health Insurance', '健康保险', 'Seguro de Salud'), amount: school.intlHealthInsurance, color: '#F59E0B' }] : []),
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: row.color }} />
                      <span className="text-sm text-navy">{row.label}</span>
                    </div>
                    <span className="font-bold text-navy text-sm">{fmt(row.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50">
                  <span className="font-bold text-navy text-sm">{t('Total Cost of Attendance', '总出勤费用', 'Costo Total de Asistencia')}</span>
                  <span className="font-black text-navy">{fmt(totalCost)}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3 bg-green-50">
                  <span className="font-bold text-green-700 text-sm">{t('Estimated Aid Package', '预计助学金', 'Paquete de Ayuda Estimado')}</span>
                  <span className="font-black text-green-700">−{fmt(aid)}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-4 bg-orange-50">
                  <span className="font-black text-navy">{t('Your Net Price', '净费用', 'Tu Precio Neto')}</span>
                  <span className="font-black text-brand-orange text-lg">{fmt(netPrice)}</span>
                </div>
              </div>
            </div>

            {/* 4-Year Summary */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: t('4-Year Net Cost', '四年净费用', 'Costo Neto a 4 Años'), value: fmt(netPrice * 4), sub: t('at current rates', '按当前费率', 'a tarifas actuales') },
                { label: t('Total Aid (4yr)', '四年助学金', 'Ayuda Total (4 años)'), value: fmt(aid * 4), sub: t('estimated grant aid', '预计助学金总额', 'ayuda estimada en becas') },
                { label: t('Per Month', '每月费用', 'Por Mes'), value: fmt(Math.round(netPrice / 12)), sub: t('÷ 12 months', '÷12个月', '÷ 12 meses') },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-soft p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className="font-black text-navy text-lg">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* All-Schools Comparison */}
            <div>
              <h3 className="font-black text-navy text-sm uppercase tracking-widest mb-3">
                {t('All Midwest Schools — Estimated Net Price', '中西部所有院校净费用比较', 'Todas las Escuelas del Medio Oeste — Precio Neto Estimado')}
              </h3>
              <div className="space-y-2">
                {comparison.map((s, i) => {
                  const maxNet = comparison[comparison.length - 1].total
                  const barWidth = maxNet > 0 ? Math.round((s.net / maxNet) * 100) : 0
                  const isSelected = s.slug === selectedSlug
                  return (
                    <button
                      key={s.slug} onClick={() => setSelectedSlug(s.slug)}
                      className={`w-full text-left p-3 border-2 transition-all ${isSelected ? 'border-brand-orange bg-orange-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-gray-400 w-4">{i + 1}</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.logo} alt={s.shortName} className="w-6 h-6 object-contain" />
                          <span className={`font-bold text-sm ${isSelected ? 'text-brand-orange' : 'text-navy'}`}>{s.shortName}</span>
                          {s.intlAidGenerosity === 'none' && isIntl && <span className="text-xs text-orange-500 font-semibold">No aid</span>}
                        </div>
                        <span className="font-black text-sm" style={{ color: isSelected ? '#FF6B35' : s.color }}>{fmt(s.net)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${barWidth}%`, backgroundColor: isSelected ? '#FF6B35' : s.color }} />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-soft p-5 text-xs text-gray-500 leading-relaxed">
              <p className="font-bold text-gray-600 mb-1">{t('Important Disclaimer', '重要声明', 'Aviso Importante')}</p>
              {t(
                'These are estimates based on published data. Actual aid depends on your complete FAFSA/CSS Profile, assets, and each school\'s policies. International student aid varies significantly by school. Always use each school\'s official Net Price Calculator.',
                '这些估算基于公开数据。实际助学金取决于您完整的FAFSA/CSS档案、资产及各校政策。国际学生助学金因校而异，差异显著。请务必使用各校官方净价格计算器。'
              )}
            </div>

            <div className="text-center pt-2">
              <Link href="/midwests-best" className="text-brand-orange font-bold text-sm hover:underline">
                ← {t("Back to Midwest's Best", '返回中西部名校')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
