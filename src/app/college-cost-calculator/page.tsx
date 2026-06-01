'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

const SCHOOL_PRESETS: Record<string, { tuition: number; roomBoard: number; label: string }> = {
  custom:      { tuition: 0,     roomBoard: 0,     label: 'Custom / Enter Manually' },
  uc_resident: { tuition: 14312, roomBoard: 21000, label: 'UC Campus — CA Resident' },
  uc_nonres:   { tuition: 44066, roomBoard: 21000, label: 'UC Campus — Non-Resident' },
  csu:         { tuition: 7928,  roomBoard: 17000, label: 'CSU Campus — CA Resident' },
  usc:         { tuition: 66640, roomBoard: 20000, label: 'USC (Private)' },
  stanford:    { tuition: 65127, roomBoard: 21000, label: 'Stanford University' },
  pepperdine:  { tuition: 63370, roomBoard: 18000, label: 'Pepperdine University' },
  private_avg: { tuition: 58000, roomBoard: 19000, label: 'Private University (Average)' },
}

const LOAN_RATES: Record<string, number> = {
  federal_sub: 6.53,
  federal_unsub: 6.53,
  grad_plus: 8.08,
  private: 7.5,
}

function formatDollar(n: number) {
  return '$' + Math.round(n).toLocaleString()
}

function calcMonthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

type Section = { label: string; value: number; color: string }

function DonutChart({ sections, total }: { sections: Section[]; total: number }) {
  const size = 200
  const radius = 80
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius

  let cumulative = 0
  const slices = sections.map(s => {
    const pct = total > 0 ? s.value / total : 0
    const slice = { ...s, pct, offset: cumulative }
    cumulative += pct
    return slice
  })

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px] mx-auto">
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={s.color}
          strokeWidth={36}
          strokeDasharray={`${s.pct * circumference} ${circumference}`}
          strokeDashoffset={-s.offset * circumference}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      ))}
      <text x={cx} y={cy - 10} textAnchor="middle" className="text-xs" fill="#1a2e4a" fontSize="13" fontWeight="bold">
        Total
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#f97316" fontSize="14" fontWeight="bold">
        {formatDollar(total)}
      </text>
    </svg>
  )
}

function LoanBar({ year, balance, payment, maxBalance }: { year: number; balance: number; payment: number; maxBalance: number }) {
  const pct = maxBalance > 0 ? (balance / maxBalance) * 100 : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-14 text-gray-500 flex-shrink-0">Yr {year}</span>
      <div className="flex-1 bg-gray-100 h-4 relative overflow-hidden">
        <div
          className="h-full bg-navy transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-24 text-right text-gray-700">{formatDollar(balance)}</span>
    </div>
  )
}

export default function CollegeCostCalculator() {
  const { t } = useLanguage()
  const [preset, setPreset] = useState('uc_resident')
  const [tuition, setTuition] = useState(SCHOOL_PRESETS.uc_resident.tuition)
  const [roomBoard, setRoomBoard] = useState(SCHOOL_PRESETS.uc_resident.roomBoard)
  const [books, setBooks] = useState(1200)
  const [personal, setPersonal] = useState(2500)
  const [transport, setTransport] = useState(800)
  const [grants, setGrants] = useState(0)
  const [scholarships, setScholarships] = useState(0)
  const [loanYears, setLoanYears] = useState(10)
  const [loanRate, setLoanRate] = useState(6.53)
  const [years, setYears] = useState(4)

  function applyPreset(key: string) {
    setPreset(key)
    if (key !== 'custom') {
      setTuition(SCHOOL_PRESETS[key].tuition)
      setRoomBoard(SCHOOL_PRESETS[key].roomBoard)
    }
  }

  const annualCost = tuition + roomBoard + books + personal + transport
  const annualAid = grants + scholarships
  const annualNet = Math.max(0, annualCost - annualAid)
  const totalGross = annualCost * years
  const totalAid = annualAid * years
  const totalNet = annualNet * years
  const loanPrincipal = totalNet
  const monthlyPayment = calcMonthlyPayment(loanPrincipal, loanRate, loanYears)
  const totalRepayment = monthlyPayment * loanYears * 12
  const totalInterest = totalRepayment - loanPrincipal

  const costSections: Section[] = [
    { label: t('Tuition & Fees', '学费', 'Matrícula y Cuotas'), value: tuition, color: '#1a2e4a' },
    { label: t('Room & Board', '住宿餐饮', 'Aloj. y Comida'), value: roomBoard, color: '#f97316' },
    { label: t('Books', '书本费', 'Libros'), value: books, color: '#3b82f6' },
    { label: t('Personal', '个人支出', 'Gastos Pers.'), value: personal, color: '#10b981' },
    { label: t('Transport', '交通', 'Transporte'), value: transport, color: '#8b5cf6' },
  ]

  // Loan balance over time
  const loanSchedule = useMemo(() => {
    const r = loanRate / 100 / 12
    let balance = loanPrincipal
    const rows: { year: number; balance: number }[] = [{ year: 0, balance }]
    for (let yr = 1; yr <= loanYears; yr++) {
      for (let m = 0; m < 12; m++) {
        const interest = balance * r
        balance = Math.max(0, balance + interest - monthlyPayment)
      }
      rows.push({ year: yr, balance })
    }
    return rows
  }, [loanPrincipal, loanRate, loanYears, monthlyPayment])

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-navy text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-2">{t('Free Tool', '免费工具', 'Herramienta Gratuita')}</p>
          <h1 className="text-4xl md:text-5xl font-black mb-3">{t('True Cost of College Calculator', '大学真实费用计算器', 'Calculadora del Costo Real de la Universidad')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {t('See the real cost of attendance, how aid reduces it, and what loan repayment actually looks like — before you sign anything.', '在签署任何协议前，了解真实的就读费用、助学金如何减少费用，以及贷款还款实际情况。', 'Conoce el costo real de asistencia, cómo la ayuda lo reduce y cómo funciona el pago de préstamos, antes de firmar nada.')}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── LEFT: INPUTS ─────────────────────────────────── */}
          <div>
            {/* School Preset */}
            <div className="mb-8">
              <h2 className="text-lg font-black text-navy mb-3 uppercase tracking-wide">1. {t('Pick a School Type', '选择学校类型', 'Elige el Tipo de Escuela')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(SCHOOL_PRESETS).map(([key, s]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className={`text-left px-3 py-2 text-sm border transition-all ${
                      preset === key
                        ? 'border-brand-orange bg-orange-50 text-brand-orange font-bold'
                        : 'border-gray-200 text-gray-600 hover:border-brand-orange'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Costs */}
            <div className="mb-8">
              <h2 className="text-lg font-black text-navy mb-3 uppercase tracking-wide">2. {t('Annual Costs', '年度费用', 'Costos Anuales')}</h2>
              <div className="space-y-3">
                {[
                  { label: t('Tuition & Fees', '学费', 'Matrícula y Cuotas'), val: tuition, set: setTuition, color: '#1a2e4a' },
                  { label: t('Room & Board', '住宿餐饮', 'Aloj. y Comida'), val: roomBoard, set: setRoomBoard, color: '#f97316' },
                  { label: t('Books & Supplies', '书本与用品', 'Libros y Material'), val: books, set: setBooks, color: '#3b82f6' },
                  { label: t('Personal Expenses', '个人支出', 'Gastos Personales'), val: personal, set: setPersonal, color: '#10b981' },
                  { label: t('Transportation', '交通费用', 'Transporte'), val: transport, set: setTransport, color: '#8b5cf6' },
                ].map(({ label, val, set, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-3 h-3 flex-shrink-0 rounded-sm" style={{ background: color }} />
                    <label className="w-40 text-sm text-gray-600 flex-shrink-0">{label}</label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        value={val}
                        onChange={e => { set(Number(e.target.value)); setPreset('custom') }}
                        className="w-full pl-7 pr-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-brand-orange"
                        min={0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aid */}
            <div className="mb-8">
              <h2 className="text-lg font-black text-navy mb-3 uppercase tracking-wide">3. {t('Financial Aid & Scholarships', '助学金与奖学金', 'Ayuda Financiera y Becas')}</h2>
              <div className="space-y-3">
                {[
                  { label: t('Grants (need-based)', '助学金（按需）', 'Becas (según necesidad)'), val: grants, set: setGrants },
                  { label: t('Scholarships (merit)', '奖学金（按绩效）', 'Becas (por mérito)'), val: scholarships, set: setScholarships },
                ].map(({ label, val, set }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-3 h-3 flex-shrink-0" />
                    <label className="w-40 text-sm text-gray-600 flex-shrink-0">{label}</label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        value={val}
                        onChange={e => set(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-brand-orange"
                        min={0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan */}
            <div className="mb-8">
              <h2 className="text-lg font-black text-navy mb-3 uppercase tracking-wide">4. {t('Loan Repayment', '贷款还款', 'Pago de Préstamos')}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="w-44 text-sm text-gray-600 flex-shrink-0">{t('Years in College', '在校年数', 'Años en la Universidad')}</label>
                  <select
                    value={years}
                    onChange={e => setYears(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-brand-orange"
                  >
                    {[2, 3, 4, 5].map(y => <option key={y} value={y}>{y} {t('years', '年', 'años')}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-44 text-sm text-gray-600 flex-shrink-0">{t('Repayment Period', '还款期限', 'Período de Pago')}</label>
                  <select
                    value={loanYears}
                    onChange={e => setLoanYears(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-brand-orange"
                  >
                    <option value={10}>{t('10 years (Standard)', '10年（标准）', '10 años (Estándar)')}</option>
                    <option value={20}>{t('20 years', '20年', '20 años')}</option>
                    <option value={25}>{t('25 years (IDR max)', '25年（IDR最长）', '25 años (máx. IDR)')}</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-44 text-sm text-gray-600 flex-shrink-0">{t('Interest Rate (%)', '利率（%）', 'Tasa de Interés (%)')}</label>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.1"
                      value={loanRate}
                      onChange={e => setLoanRate(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-brand-orange"
                      min={0}
                    />
                    <div className="mt-1 flex gap-2 flex-wrap">
                      {Object.entries(LOAN_RATES).map(([k, r]) => (
                        <button key={k} onClick={() => setLoanRate(r)}
                          className={`text-xs px-2 py-0.5 border transition-colors ${loanRate === r ? 'bg-navy text-white border-navy' : 'border-gray-300 text-gray-500 hover:border-navy'}`}>
                          {k.replace(/_/g, ' ')} {r}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: RESULTS ────────────────────────────────── */}
          <div>
            {/* Donut chart */}
            <div className="bg-gray-50 border border-gray-100 p-6 mb-6">
              <h2 className="text-base font-black text-navy uppercase tracking-wide mb-4">{t('Annual Cost Breakdown', '年度费用构成', 'Desglose de Costos Anuales')}</h2>
              <DonutChart sections={costSections} total={annualCost} />
              <div className="mt-4 space-y-1.5">
                {costSections.map(s => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: s.color }} />
                      <span className="text-gray-600">{s.label}</span>
                    </div>
                    <span className="font-bold text-navy">{formatDollar(s.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost summary */}
            <div className="bg-navy text-white p-6 mb-6">
              <h2 className="text-base font-black uppercase tracking-wide mb-4">
                {years}{t('-Year Cost Summary', '年费用汇总', '-Año Resumen de Costos')}
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('Annual cost of attendance', '年度就读费用', 'Costo anual de asistencia')}</span>
                  <span className="font-bold">{formatDollar(annualCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('Annual aid (grants + scholarships)', '年度助学金（助学金+奖学金）', 'Ayuda anual (becas + subvenciones)')}</span>
                  <span className="font-bold text-green-400">− {formatDollar(annualAid)}</span>
                </div>
                <div className="flex justify-between border-t border-white/20 pt-2">
                  <span className="text-gray-300">{t('Annual net cost (out-of-pocket)', '年度净费用（自付）', 'Costo neto anual (de tu bolsillo)')}</span>
                  <span className="font-black text-brand-orange text-lg">{formatDollar(annualNet)}</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">{t(`Total gross (${years} years)`, `总费用（${years}年）`)}</span>
                    <span>{formatDollar(totalGross)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">{t(`Total aid (${years} years)`, `总助学金（${years}年）`)}</span>
                    <span className="text-green-400">− {formatDollar(totalAid)}</span>
                  </div>
                  <div className="flex justify-between font-black text-lg">
                    <span>{t('Total you pay', '您的总自付费用', 'Total que pagas')}</span>
                    <span className="text-brand-orange">{formatDollar(totalNet)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan repayment */}
            <div className="bg-gray-50 border border-gray-100 p-6">
              <h2 className="text-base font-black text-navy uppercase tracking-wide mb-4">
                {t(`Loan Repayment (${loanYears}-Year Plan)`, `贷款还款（${loanYears}年计划）`)}
              </h2>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('Loan Total', '贷款总额', 'Total del Préstamo')}</div>
                  <div className="text-xl font-black text-navy">{formatDollar(loanPrincipal)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('Monthly Payment', '月还款额', 'Pago Mensual')}</div>
                  <div className="text-xl font-black text-brand-orange">{formatDollar(monthlyPayment)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('Total Interest', '总利息', 'Interés Total')}</div>
                  <div className="text-xl font-black text-red-500">{formatDollar(totalInterest)}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
                  <span className="w-14">{t('Year', '年份', 'Año')}</span>
                  <span className="flex-1">{t('Remaining Balance', '剩余余额', 'Saldo Restante')}</span>
                  <span className="w-24 text-right">{t('Balance', '余额', 'Saldo')}</span>
                </div>
                {loanSchedule.filter((_, i) => i % Math.ceil(loanYears / 10) === 0 || i === loanSchedule.length - 1).map(row => (
                  <LoanBar
                    key={row.year}
                    year={row.year}
                    balance={row.balance}
                    payment={monthlyPayment * 12}
                    maxBalance={loanPrincipal}
                  />
                ))}
              </div>

              <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                {t('* This calculator estimates costs using the figures you enter. Actual costs, aid, and loan terms vary. Always verify with your school\'s financial aid office and loan servicer.', '* 本计算器根据您输入的数字估算费用。实际费用、助学金和贷款条款因情况而异。请务必与学校财务援助办公室和贷款服务机构核实。', '* Esta calculadora estima costos según los datos que ingresas. Verifica siempre con la oficina de ayuda financiera de tu escuela.')}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gray-soft p-8 text-center">
          <h3 className="text-2xl font-black text-navy mb-2">{t('Need Help Understanding Your Financial Aid Offer?', '需要帮助理解您的助学金方案？', '¿Necesitas Ayuda para Entender tu Oferta de Ayuda Financiera?')}</h3>
          <p className="text-gray-500 mb-5">{t('Our advisors have navigated this process at the top 50 US universities — we can help you compare offers and make the smartest decision.', '我们的顾问曾在美国顶尖50所大学经历过这一过程，可以帮助您比较方案并做出最明智的决定。', 'Nuestros asesores han recorrido este proceso en las mejores 50 universidades de EE.UU. — podemos ayudarte a comparar ofertas y tomar la decisión más inteligente.')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/blog" className="btn-primary">{t('Explore Our Guides', '探索我们的指南', 'Explorar Nuestras Guías')}</Link>
            <Link href="/alumni" className="btn-outline">{t('Meet Our Alumni', '认识我们的校友', 'Conoce a Nuestros Alumni')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
