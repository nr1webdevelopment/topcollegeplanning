'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { proxyImageSrc } from '@/lib/image-utils'
import { useLanguage } from '@/lib/i18n'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type Plan = 'student-free' | 'student-paid' | 'parent' | 'contributor'
type Section = 'overview' | 'tracker' | 'checklist' | 'research' | 'insights' | 'kids' | 'family-costs' | 'evaluator' | 'settings'

interface User { name: string; email: string; plan: Plan; role: string }

interface School {
  id: string; name: string; location: string; type: string
  acceptRate: string; avgGPA: string; avgSAT: string
  tuition: string; status: 'researching' | 'applied' | 'interview' | 'accepted' | 'rejected' | 'waitlisted'
  deadline: string; notes: string
}

interface Child {
  id: string
  name: string
  grade: string
  schools: School[]
  checkedItems: string[]
}

interface FamilyCostChild {
  childId: string
  school: string
  customTuition: string
  roomBoard: string
  annualAid: string
  startYear: string
  years: string
}

interface StudentProfile {
  satScore: string
  actScore: string
  gpa: string
  classRank: string
  apCourses: string
  extracurriculars: 'exceptional' | 'strong' | 'average' | 'minimal' | ''
  legacy: 'yes' | 'no' | ''
  firstGen: 'yes' | 'no' | ''
  intendedMajor: string
}

const DEFAULT_PROFILE: StudentProfile = {
  satScore: '', actScore: '', gpa: '', classRank: '',
  apCourses: '', extracurriculars: '', legacy: '', firstGen: '', intendedMajor: '',
}

const STATUS_COLORS: Record<School['status'], string> = {
  researching: 'bg-gray-100 text-gray-600',
  applied:     'bg-blue-100 text-blue-700',
  interview:   'bg-purple-100 text-purple-700',
  accepted:    'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-600',
  waitlisted:  'bg-yellow-100 text-yellow-700',
}

const SCHOOL_OPTIONS = [
  { name: 'Harvard University',   location: 'Cambridge, MA',   type: 'Private', acceptRate: '3.4%',  avgGPA: '3.9',  avgSAT: '1580', tuition: '59950' },
  { name: 'Yale University',      location: 'New Haven, CT',   type: 'Private', acceptRate: '4.6%',  avgGPA: '3.95', avgSAT: '1570', tuition: '62250' },
  { name: 'Stanford University',  location: 'Palo Alto, CA',   type: 'Private', acceptRate: '3.9%',  avgGPA: '3.96', avgSAT: '1570', tuition: '65127' },
  { name: 'Princeton University', location: 'Princeton, NJ',   type: 'Private', acceptRate: '4.7%',  avgGPA: '3.9',  avgSAT: '1565', tuition: '59710' },
  { name: 'MIT',                  location: 'Cambridge, MA',   type: 'Private', acceptRate: '3.9%',  avgGPA: '3.96', avgSAT: '1575', tuition: '59750' },
  { name: 'UC Berkeley',          location: 'Berkeley, CA',    type: 'Public',  acceptRate: '11.4%', avgGPA: '3.89', avgSAT: '1430', tuition: '14312' },
  { name: 'UCLA',                 location: 'Los Angeles, CA', type: 'Public',  acceptRate: '8.6%',  avgGPA: '3.9',  avgSAT: '1415', tuition: '13804' },
  { name: 'USC',                  location: 'Los Angeles, CA', type: 'Private', acceptRate: '12.9%', avgGPA: '3.79', avgSAT: '1460', tuition: '66640' },
  { name: 'UC San Diego',         location: 'La Jolla, CA',    type: 'Public',  acceptRate: '23.2%', avgGPA: '3.86', avgSAT: '1395', tuition: '14312' },
  { name: 'UC Davis',             location: 'Davis, CA',       type: 'Public',  acceptRate: '37%',   avgGPA: '3.79', avgSAT: '1310', tuition: '14312' },
  { name: 'Pepperdine University',location: 'Malibu, CA',      type: 'Private', acceptRate: '36%',   avgGPA: '3.68', avgSAT: '1310', tuition: '63370' },
  { name: 'Columbia University',  location: 'New York, NY',    type: 'Private', acceptRate: '3.9%',  avgGPA: '3.91', avgSAT: '1560', tuition: '67400' },
  { name: 'Custom / Other',       location: '',                type: '',        acceptRate: '',       avgGPA: '',     avgSAT: '',     tuition: '0'     },
]

const SCHOOL_TUITION: Record<string, number> = Object.fromEntries(
  SCHOOL_OPTIONS.map(s => [s.name, parseInt(s.tuition)])
)

const CHECKLIST_ITEMS: { id: string; label: string; labelZh: string; category: string; dueHint: string }[] = [
  { id: 'fafsa',           label: 'Submit FAFSA',                            labelZh: '提交FAFSA助学金申请',         category: 'Financial Aid', dueHint: 'Oct 1 opens' },
  { id: 'commonapp',       label: 'Create Common App account',               labelZh: '创建Common App账号',          category: 'Applications',  dueHint: 'Aug 1 opens' },
  { id: 'essays',          label: 'Draft personal statement essays',         labelZh: '起草个人陈述文书',             category: 'Applications',  dueHint: '650 words' },
  { id: 'recs',            label: 'Request letters of recommendation',       labelZh: '申请推荐信',                   category: 'Applications',  dueHint: 'Ask 3 months early' },
  { id: 'transcript',      label: 'Order official transcripts',              labelZh: '申请官方成绩单',               category: 'Academics',     dueHint: 'Check school portal' },
  { id: 'testscores',      label: 'Send SAT/ACT scores',                    labelZh: '发送SAT/ACT成绩',              category: 'Academics',     dueHint: 'Via College Board / ACT' },
  { id: 'extracurriculars',label: 'Finalize extracurricular activity list',  labelZh: '整理课外活动清单',             category: 'Applications',  dueHint: '10 activities max' },
  { id: 'supplements',     label: 'Write school-specific supplement essays', labelZh: '撰写各学校补充文书',           category: 'Applications',  dueHint: 'Per school' },
  { id: 'visits',          label: 'Schedule campus visits / virtual tours',  labelZh: '安排校园参观/线上参观',        category: 'Research',      dueHint: 'Optional but helpful' },
  { id: 'interviews',      label: 'Prepare for alumni interviews',           labelZh: '准备校友面试',                 category: 'Applications',  dueHint: 'Practice 30 min' },
  { id: 'scholarships',    label: 'Apply for external scholarships',         labelZh: '申请外部奖学金',               category: 'Financial Aid', dueHint: 'Fastweb, Scholarships.com' },
  { id: 'css',             label: 'Submit CSS Profile (if required)',        labelZh: '提交CSS Profile（如需）',      category: 'Financial Aid', dueHint: 'Private schools' },
]

const EARNING_DATA = [
  { school: 'MIT',        major: 'CS / Engineering',  earlyCareer: '$105K', midCareer: '$168K', roi: '⭐⭐⭐⭐⭐' },
  { school: 'Stanford',   major: 'CS / Engineering',  earlyCareer: '$99K',  midCareer: '$162K', roi: '⭐⭐⭐⭐⭐' },
  { school: 'Harvard',    major: 'Business / Law',    earlyCareer: '$85K',  midCareer: '$145K', roi: '⭐⭐⭐⭐⭐' },
  { school: 'UC Berkeley',major: 'Engineering / CS',  earlyCareer: '$88K',  midCareer: '$142K', roi: '⭐⭐⭐⭐⭐' },
  { school: 'USC',        major: 'Film / Business',   earlyCareer: '$60K',  midCareer: '$110K', roi: '⭐⭐⭐⭐' },
  { school: 'UCLA',       major: 'Pre-Med / Law',     earlyCareer: '$56K',  midCareer: '$105K', roi: '⭐⭐⭐⭐' },
  { school: 'Pepperdine', major: 'Business / Law',    earlyCareer: '$55K',  midCareer: '$98K',  roi: '⭐⭐⭐' },
]

const CURRENT_YEAR = new Date().getFullYear()
const fmt = (n: number) => '$' + n.toLocaleString()

/* ── ACT → SAT conversion table ── */
function actToSat(act: number): number {
  const table: [number, number][] = [
    [36,1600],[35,1560],[34,1530],[33,1500],[32,1470],[31,1440],[30,1410],
    [29,1380],[28,1360],[27,1330],[26,1300],[25,1270],[24,1240],[23,1210],
    [22,1180],[21,1150],[20,1120],[19,1080],[18,1040],[17,1000],[16,960],
    [15,920],[14,880],[13,840],[12,780],
  ]
  const match = table.find(([a]) => a <= act)
  return match ? match[1] : 780
}

/* ── Admissions chance evaluator ── */
function evaluateChance(
  profile: StudentProfile,
  school: { avgSAT: string; avgGPA: string; acceptRate: string }
): { chance: number; label: string; color: string; barColor: string } {
  const acceptRatePct = parseFloat(school.acceptRate.replace('%', '')) || 20
  const schoolAvgSat  = parseInt(school.avgSAT) || 0
  const schoolAvgGpa  = parseFloat(school.avgGPA) || 0

  // Resolve test score (SAT preferred, else convert ACT)
  let sat = parseInt(profile.satScore) || 0
  if (!sat && profile.actScore) sat = actToSat(parseInt(profile.actScore) || 0)
  const gpa = parseFloat(profile.gpa) || 0

  // Normalize to 0–100
  const sn  = sat > 0 ? Math.max(0, Math.min(100, (sat - 400) / 12)) : -1
  const ss  = schoolAvgSat > 0 ? Math.max(0, Math.min(100, (schoolAvgSat - 400) / 12)) : -1
  const gn  = gpa > 0 ? Math.max(0, Math.min(100, (gpa / 4.0) * 100)) : -1
  const gs  = schoolAvgGpa > 0 ? Math.max(0, Math.min(100, (schoolAvgGpa / 4.0) * 100)) : -1

  // Weighted comparison (SAT 60%, GPA 40%)
  let studentScore = 0, schoolScore = 0, totalW = 0
  if (sn >= 0 && ss >= 0) { studentScore += sn * 60; schoolScore += ss * 60; totalW += 60 }
  if (gn >= 0 && gs >= 0) { studentScore += gn * 40; schoolScore += gs * 40; totalW += 40 }

  // No academic data → use raw accept rate
  if (totalW === 0) {
    const label = acceptRatePct >= 60 ? 'Safety' : acceptRatePct >= 28 ? 'Match' : acceptRatePct >= 10 ? 'Reach' : 'Long Shot'
    const color = label === 'Safety' ? 'text-green-700 bg-green-50 border-green-200' : label === 'Match' ? 'text-blue-700 bg-blue-50 border-blue-200' : label === 'Reach' ? 'text-orange-700 bg-orange-50 border-orange-200' : 'text-red-700 bg-red-50 border-red-200'
    const barColor = label === 'Safety' ? '#16a34a' : label === 'Match' ? '#2563eb' : label === 'Reach' ? '#ea580c' : '#dc2626'
    return { chance: Math.round(acceptRatePct * 10) / 10, label, color, barColor }
  }

  let ratio = schoolScore > 0 ? studentScore / schoolScore : 1

  // Class rank modifier
  if (profile.classRank) {
    const r = parseInt(profile.classRank)
    if (r <= 5) ratio *= 1.09
    else if (r <= 10) ratio *= 1.05
    else if (r <= 25) ratio *= 1.02
    else if (r > 50) ratio *= 0.95
  }
  // AP/IB courses modifier
  if (profile.apCourses) {
    const ap = parseInt(profile.apCourses)
    if (ap >= 10) ratio *= 1.07
    else if (ap >= 6) ratio *= 1.04
    else if (ap >= 3) ratio *= 1.01
  }

  // Multiplier
  const multiplier =
    ratio >= 1.15 ? 4.5 :
    ratio >= 1.08 ? 3.0 :
    ratio >= 1.02 ? 2.0 :
    ratio >= 0.95 ? 1.3 :
    ratio >= 0.88 ? 0.8 :
    ratio >= 0.80 ? 0.4 : 0.15

  // Bonus points
  let bonus = 0
  if (profile.legacy === 'yes') bonus += 10
  if (profile.firstGen === 'yes') bonus += 4
  const ecBonus: Record<string, number> = { exceptional: 12, strong: 6, average: 0, minimal: -8 }
  bonus += ecBonus[profile.extracurriculars] ?? 0

  let chance = Math.max(0.5, Math.min(Math.min(90, acceptRatePct * 5), acceptRatePct * multiplier + bonus))

  const label = chance >= 60 ? 'Safety' : chance >= 28 ? 'Match' : chance >= 10 ? 'Reach' : 'Long Shot'
  const color =
    label === 'Safety'   ? 'text-green-700 bg-green-50 border-green-200' :
    label === 'Match'    ? 'text-blue-700 bg-blue-50 border-blue-200' :
    label === 'Reach'    ? 'text-orange-700 bg-orange-50 border-orange-200' :
                           'text-red-700 bg-red-50 border-red-200'
  const barColor = label === 'Safety' ? '#16a34a' : label === 'Match' ? '#2563eb' : label === 'Reach' ? '#ea580c' : '#dc2626'
  return { chance: Math.round(chance * 10) / 10, label, color, barColor }
}

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
export default function Dashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser]               = useState<User | null>(null)
  const [section, setSection]         = useState<Section>('overview')
  const [schools, setSchools]         = useState<School[]>([])
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [addingSchool, setAddingSchool] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState(SCHOOL_OPTIONS[0])
  const [mobileNavOpen, setMobileNavOpen]   = useState(false)

  // Kids state (parent only)
  const [children, setChildren]       = useState<Child[]>([])
  const [activeChildId, setActiveChildId] = useState<string | null>(null)
  const [addingChild, setAddingChild] = useState(false)
  const [newChildName, setNewChildName] = useState('')
  const [newChildGrade, setNewChildGrade] = useState('11th')

  // Family cost state
  const [familyCosts, setFamilyCosts] = useState<FamilyCostChild[]>([])

  // Student profile (admissions evaluator)
  const [studentProfile, setStudentProfileState] = useState<StudentProfile>(DEFAULT_PROFILE)
  function saveStudentProfile(p: StudentProfile) {
    setStudentProfileState(p)
    localStorage.setItem('tcp_student_profile', JSON.stringify(p))
  }

  useEffect(() => {
    const raw = localStorage.getItem('tcp_user')
    if (!raw) { router.push('/login'); return }
    const u: User = JSON.parse(raw)
    setUser(u)
    const savedSchools   = localStorage.getItem('tcp_schools')
    const savedChecks    = localStorage.getItem('tcp_checks')
    const savedChildren  = localStorage.getItem('tcp_children')
    const savedFamilyCosts = localStorage.getItem('tcp_family_costs')
    if (savedSchools)   setSchools(JSON.parse(savedSchools))
    if (savedChecks)    setCheckedItems(new Set(JSON.parse(savedChecks)))
    if (savedChildren)  { const kids: Child[] = JSON.parse(savedChildren); setChildren(kids); if (kids.length) setActiveChildId(kids[0].id) }
    if (savedFamilyCosts) setFamilyCosts(JSON.parse(savedFamilyCosts))
    const savedProfile = localStorage.getItem('tcp_student_profile')
    if (savedProfile) setStudentProfileState(JSON.parse(savedProfile))
  }, [router])

  /* ── persistence helpers ── */
  function saveSchools(s: School[]) { setSchools(s); localStorage.setItem('tcp_schools', JSON.stringify(s)) }
  function toggleCheck(id: string) {
    const next = new Set(checkedItems)
    next.has(id) ? next.delete(id) : next.add(id)
    setCheckedItems(next); localStorage.setItem('tcp_checks', JSON.stringify([...next]))
  }
  function saveChildren(kids: Child[]) { setChildren(kids); localStorage.setItem('tcp_children', JSON.stringify(kids)) }
  function saveFamilyCosts(fc: FamilyCostChild[]) { setFamilyCosts(fc); localStorage.setItem('tcp_family_costs', JSON.stringify(fc)) }

  function updateChildSchools(childId: string, schools: School[]) {
    const updated = children.map(c => c.id === childId ? { ...c, schools } : c)
    saveChildren(updated)
  }
  function updateChildChecks(childId: string, checks: string[]) {
    const updated = children.map(c => c.id === childId ? { ...c, checkedItems: checks } : c)
    saveChildren(updated)
  }

  function logout() { localStorage.removeItem('tcp_user'); router.push('/login') }

  if (!user) return <div className="min-h-screen bg-gray-soft flex items-center justify-center"><div className="text-navy font-bold">{t('Loading...', '加载中...')}</div></div>

  const isPaid    = user.plan !== 'student-free'
  const isParent  = user.plan === 'parent'
  const maxSchools = user.plan === 'student-free' ? 4 : 20
  const planLabel  = {
    'student-free': t('Student Free', '学生免费版'),
    'student-paid': t('Student Pro', '学生专业版'),
    parent: t('Parent Plan', '家长方案'),
    contributor: t('Contributor', '内容贡献者'),
  }[user.plan]

  const activeChild = children.find(c => c.id === activeChildId) ?? null

  const navItems: { id: Section; label: string; icon: string; locked?: boolean; parentOnly?: boolean }[] = [
    { id: 'overview',      label: t('Overview', '概览'),              icon: '🏠' },
    { id: 'tracker',       label: t('College Tracker', '学校追踪器'), icon: '📋' },
    { id: 'checklist',     label: t('Checklist', '申请清单'),         icon: '✅' },
    { id: 'evaluator',     label: t('My Chances', '录取概率评估'),    icon: '🎯' },
    { id: 'research',      label: t('School Research', '学校调研'),   icon: '🔍',  locked: !isPaid },
    { id: 'insights',      label: t('Earning Insights', '薪资洞察'),  icon: '💰',  locked: !isParent },
    { id: 'kids',          label: t('My Kids', '我的孩子'),           icon: '👨‍👩‍👧', parentOnly: true },
    { id: 'family-costs',  label: t('Family Costs', '家庭费用'),      icon: '💳',  parentOnly: true },
    { id: 'settings',      label: t('Settings', '设置'),              icon: '⚙️' },
  ]

  const visibleNav = navItems.filter(n => !n.parentOnly || isParent)

  return (
    <div className="min-h-screen bg-gray-soft flex flex-col">

      {/* ── TOP BAR ─────────────────────────────── */}
      <header className="bg-navy h-16 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-50">
        <Link href="/"><Image src="/images/tcp-logo-horizontal-cropped.png" alt="Top College Planning" width={180} height={50} className="h-10 w-auto object-contain brightness-0 invert" unoptimized /></Link>
        <div className="flex-1" />
        <span className={`hidden sm:inline-block text-xs font-bold px-3 py-1 uppercase tracking-wider ${isParent ? 'bg-white text-navy' : isPaid ? 'bg-brand-orange text-white' : 'bg-white/10 text-white/70'}`}>{planLabel}</span>
        <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white font-black text-sm flex-shrink-0">{user.name.charAt(0).toUpperCase()}</div>
        <button onClick={logout} className="text-white/50 hover:text-white text-xs font-semibold transition-colors hidden sm:block">{t('Log out', '退出登录')}</button>
        <button className="sm:hidden text-white" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </header>

      <div className="flex flex-1">

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className={`bg-white border-r border-gray-100 w-64 flex-shrink-0 flex flex-col fixed lg:static top-16 bottom-0 z-40 transition-transform ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-5 border-b border-gray-100">
            <p className="font-black text-navy text-sm">{user.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {visibleNav.map(item => (
              <button key={item.id} onClick={() => { if (!item.locked) { setSection(item.id); setMobileNavOpen(false) } }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all text-left ${section === item.id ? 'bg-brand-orange text-white' : item.locked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-soft hover:text-navy'}`}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.locked && <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 font-bold">{t('UPGRADE', '升级')}</span>}
              </button>
            ))}
          </nav>
          {!isPaid && (
            <div className="m-3 p-4 bg-navy text-white">
              <p className="text-xs font-black uppercase tracking-wider mb-1">{t('Student Pro', '学生专业版')}</p>
              <p className="text-xs text-white/60 mb-3 leading-relaxed">{t('Track 20 schools, unlock all insights.', '追踪20所学校，解锁全部洞察。')}</p>
              <button className="w-full bg-brand-orange text-white text-xs font-bold py-2">{t('Upgrade — $49/mo', '升级 — $49/月')}</button>
            </div>
          )}
          {isPaid && !isParent && (
            <div className="m-3 p-4 bg-navy text-white">
              <p className="text-xs font-black uppercase tracking-wider mb-1">{t('Parent Plan', '家长方案')}</p>
              <p className="text-xs text-white/60 mb-3 leading-relaxed">{t("Manage all your kids' plans + family cost calculator.", '管理所有孩子的申请计划 + 家庭费用计算器。')}</p>
              <button className="w-full bg-brand-orange text-white text-xs font-bold py-2">{t('Upgrade — $79/mo', '升级 — $79/月')}</button>
            </div>
          )}
        </aside>

        {/* ── MAIN ─────────────────────────────────── */}
        <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-x-hidden">

          {/* OVERVIEW */}
          {section === 'overview' && (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-black text-navy mb-1">{t(`Welcome back, ${user.name.split(' ')[0]} 👋`, `欢迎回来，${user.name.split(' ')[0]} 👋`)}</h1>
              <p className="text-gray-400 text-sm mb-8">{t("Here's a snapshot of your college planning progress.", '这是您大学申请进度的概览。')}</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: t('Schools Tracked', '已追踪学校'), value: `${schools.length} / ${maxSchools}`, icon: '🏫' },
                  { label: t('Applied', '已申请'), value: schools.filter(s => s.status === 'applied').length.toString(), icon: '📨' },
                  { label: t('Checklist', '申请清单'), value: `${checkedItems.size} / ${CHECKLIST_ITEMS.length}`, icon: '✅' },
                  isParent
                    ? { label: t('Kids Tracked', '已追踪孩子'), value: children.length.toString(), icon: '👨‍👩‍👧' }
                    : { label: t('Plan', '当前方案'), value: planLabel, icon: '⭐' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white border border-gray-100 p-5">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-xl font-black text-navy">{stat.value}</div>
                    <div className="text-xs text-gray-400 font-semibold mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
              <h2 className="text-sm font-black text-navy uppercase tracking-wider mb-4">{t('Quick Actions', '快捷操作')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { label: t('Add a School', '添加学校'), desc: t('Add to your tracker', '添加到追踪器'), icon: '➕', action: () => setSection('tracker') },
                  { label: t('View Checklist', '查看申请清单'), desc: `${CHECKLIST_ITEMS.length - checkedItems.size} ${t('tasks remaining', '项待完成')}`, icon: '📋', action: () => setSection('checklist') },
                  isParent
                    ? { label: t('Manage Kids', '管理孩子'), desc: `${children.length} ${t('child(ren) added', '位孩子已添加')}`, icon: '👨‍👩‍👧', action: () => setSection('kids') }
                    : { label: t('My Chances', '录取概率评估'), desc: t('See your admission odds', '查看录取概率'), icon: '🎯', action: () => setSection('evaluator') },
                ].map(a => (
                  <button key={a.label} onClick={a.action} className="bg-white border border-gray-100 p-5 text-left hover:border-brand-orange hover:shadow-sm transition-all group">
                    <div className="text-2xl mb-3">{a.icon}</div>
                    <div className="font-bold text-navy text-sm group-hover:text-brand-orange transition-colors">{a.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{a.desc}</div>
                  </button>
                ))}
              </div>
              {/* Kids summary strip (parent only) */}
              {isParent && children.length > 0 && (
                <>
                  <h2 className="text-sm font-black text-navy uppercase tracking-wider mb-4">{t("Kids' Progress", '孩子们的进度')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {children.map(child => {
                      const pct = child.checkedItems.length / CHECKLIST_ITEMS.length
                      return (
                        <button key={child.id} onClick={() => { setActiveChildId(child.id); setSection('kids') }}
                          className="bg-white border border-gray-100 p-5 text-left hover:border-brand-orange transition-all group">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-black text-sm">{child.name.charAt(0)}</div>
                            <div>
                              <div className="font-black text-navy text-sm group-hover:text-brand-orange transition-colors">{child.name}</div>
                              <div className="text-xs text-gray-400">{t('Grade', '年级')} {child.grade}</div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{child.schools.length} {t('schools', '所学校')}</span>
                            <span>{child.checkedItems.length}/{CHECKLIST_ITEMS.length} {t('tasks', '项')}</span>
                          </div>
                          <div className="bg-gray-100 h-1.5"><div className="bg-brand-orange h-1.5 transition-all" style={{ width: `${Math.round(pct * 100)}%` }} /></div>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
              {schools.length > 0 && (
                <>
                  <h2 className="text-sm font-black text-navy uppercase tracking-wider mb-4">{t('Your Schools', '您的学校')}</h2>
                  <div className="bg-white border border-gray-100 overflow-hidden">
                    {schools.slice(0, 4).map((s, i) => (
                      <div key={s.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < schools.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <div className="w-8 h-8 bg-navy text-white flex items-center justify-center font-black text-xs flex-shrink-0">{s.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0"><div className="font-bold text-sm text-navy truncate">{s.name}</div><div className="text-xs text-gray-400">{s.location}</div></div>
                        <span className={`text-xs font-bold px-2 py-1 capitalize ${STATUS_COLORS[s.status]}`}>
                          {t(s.status, { researching: '调研中', applied: '已申请', interview: '面试', accepted: '已录取', rejected: '已拒绝', waitlisted: '候补' }[s.status] ?? s.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TRACKER */}
          {section === 'tracker' && (
            <TrackerSection schools={schools} setSchools={saveSchools} isPaid={isPaid} maxSchools={maxSchools} />
          )}

          {/* CHECKLIST */}
          {section === 'checklist' && (
            <ChecklistSection checkedItems={checkedItems} toggleCheck={toggleCheck} />
          )}

          {/* EVALUATOR */}
          {section === 'evaluator' && (
            <EvaluatorSection
              plan={user.plan}
              trackedSchools={schools}
              studentProfile={studentProfile}
              setStudentProfile={saveStudentProfile}
            />
          )}

          {/* RESEARCH */}
          {section === 'research' && (
            <div className="max-w-5xl">
              {!isPaid ? <LockedSection title={t('School Research', '学校调研')} desc={t('Get detailed stats, acceptance rate trends, GPA & SAT ranges, and side-by-side comparisons for every school.', '获取每所学校的详细统计数据、录取率趋势、GPA与SAT范围以及横向比较。')} plan={t('Student Pro — $49/mo', '学生专业版 — $49/月')} /> : (
                <>
                  <h1 className="text-2xl font-black text-navy mb-1">{t('School Research', '学校调研')}</h1>
                  <p className="text-gray-400 text-sm mb-6">{t('Full admissions data for top schools.', '顶尖学校完整录取数据。')}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-100 text-sm">
                      <thead><tr className="bg-navy text-white">{[t('School','学校'),t('Type','类型'),t('Accept Rate','录取率'),t('Avg GPA','平均GPA'),t('Avg SAT','平均SAT'),t('Tuition','学费')].map(h => <th key={h} className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
                      <tbody>
                        {SCHOOL_OPTIONS.filter(s => s.name !== 'Custom / Other').map((s, i) => (
                          <tr key={s.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-soft'}>
                            <td className="px-4 py-3 font-bold text-navy">{s.name}</td>
                            <td className="px-4 py-3 text-gray-500">{s.type}</td>
                            <td className="px-4 py-3 font-semibold text-brand-orange">{s.acceptRate}</td>
                            <td className="px-4 py-3">{s.avgGPA}</td>
                            <td className="px-4 py-3">{s.avgSAT}</td>
                            <td className="px-4 py-3 font-semibold text-navy">{fmt(parseInt(s.tuition))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* INSIGHTS */}
          {section === 'insights' && (
            <div className="max-w-5xl">
              {!isParent ? <LockedSection title={t('Earning Potential & ROI', '薪资潜力与投资回报')} desc={t('See early-career and mid-career earnings by school and major, return-on-investment rankings, and data-driven guidance on which schools deliver the best outcomes.', '按学校和专业查看早期职业和中期职业薪资、投资回报率排名，以及哪所学校产出最佳结果的数据驱动指导。')} plan={t('Parent Plan — $79/mo', '家长方案 — $79/月')} /> : (
                <>
                  <h1 className="text-2xl font-black text-navy mb-1">{t('Earning Potential & ROI', '薪资潜力与投资回报')}</h1>
                  <p className="text-gray-400 text-sm mb-6">{t('Median earnings by school and major — 2024 data.', '按学校和专业划分的中位薪资 — 2024年数据。')}</p>
                  <div className="overflow-x-auto mb-8">
                    <table className="w-full bg-white border border-gray-100 text-sm">
                      <thead><tr className="bg-navy text-white">{[t('School','学校'),t('Top Major','热门专业'),t('Early Career','早期职业薪资'),t('Mid Career','中期职业薪资'),t('ROI Rating','ROI评级')].map(h => <th key={h} className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
                      <tbody>
                        {EARNING_DATA.map((row, i) => (
                          <tr key={row.school} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-soft'}>
                            <td className="px-4 py-3 font-bold text-navy">{row.school}</td>
                            <td className="px-4 py-3 text-gray-500">{row.major}</td>
                            <td className="px-4 py-3 font-semibold text-green-600">{row.earlyCareer}</td>
                            <td className="px-4 py-3 font-bold text-green-700">{row.midCareer}</td>
                            <td className="px-4 py-3">{row.roi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <h2 className="text-sm font-black text-navy uppercase tracking-wider mb-4">{t('Key Insights', '核心洞察')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: '📈', title: t('Highest ROI', '最高投资回报'), body: t('MIT and UC Berkeley deliver the highest return for STEM majors.', 'MIT和加州大学伯克利分校为STEM专业提供最高回报。') },
                      { icon: '🎯', title: t('Best Value Public', '最高性价比公立学校'), body: t('UC Berkeley at $14K/yr tuition with $142K mid-career median is exceptional value.', '加州大学伯克利分校年学费约$14K，中期中位薪资$142K，性价比极高。') },
                      { icon: '💡', title: t('Major Matters', '专业很重要'), body: t('CS grads earn 2.4× more than liberal arts grads at the same school within 10 years.', '计算机科学毕业生在同一所学校10年内的收入是文科生的2.4倍。') },
                    ].map(c => (
                      <div key={c.title} className="bg-white border border-gray-100 p-5">
                        <div className="text-3xl mb-3">{c.icon}</div>
                        <div className="font-bold text-navy text-sm mb-2">{c.title}</div>
                        <div className="text-xs text-gray-500 leading-relaxed">{c.body}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* MY KIDS */}
          {section === 'kids' && isParent && (
            <KidsSection
              children={children}
              activeChildId={activeChildId}
              setActiveChildId={setActiveChildId}
              addingChild={addingChild}
              setAddingChild={setAddingChild}
              newChildName={newChildName}
              setNewChildName={setNewChildName}
              newChildGrade={newChildGrade}
              setNewChildGrade={setNewChildGrade}
              onAddChild={() => {
                if (!newChildName.trim()) return
                const child: Child = { id: Date.now().toString(), name: newChildName.trim(), grade: newChildGrade, schools: [], checkedItems: [] }
                const updated = [...children, child]
                saveChildren(updated)
                setActiveChildId(child.id)
                setAddingChild(false)
                setNewChildName('')
              }}
              onRemoveChild={(id: string) => {
                const updated = children.filter(c => c.id !== id)
                saveChildren(updated)
                setActiveChildId(updated[0]?.id ?? null)
              }}
              updateChildSchools={updateChildSchools}
              updateChildChecks={updateChildChecks}
            />
          )}

          {/* FAMILY COSTS */}
          {section === 'family-costs' && isParent && (
            <FamilyCostsSection
              children={children}
              familyCosts={familyCosts}
              saveFamilyCosts={saveFamilyCosts}
            />
          )}

          {/* SETTINGS */}
          {section === 'settings' && (
            <div className="max-w-md">
              <h1 className="text-2xl font-black text-navy mb-6">{t('Settings', '设置')}</h1>
              <div className="bg-white border border-gray-100 p-6 space-y-5">
                <div><label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">{t('Name', '姓名')}</label><input defaultValue={user.name} className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange"/></div>
                <div><label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">{t('Email', '电子邮箱')}</label><input defaultValue={user.email} className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange"/></div>
                <div>
                  <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">{t('Current Plan', '当前方案')}</label>
                  <div className="flex items-center gap-3"><span className="font-bold text-navy text-sm">{planLabel}</span>{!isParent && <button className="text-xs text-brand-orange font-bold hover:underline">{t('Upgrade →', '升级 →')}</button>}</div>
                </div>
                <button className="w-full bg-navy text-white font-bold py-3 text-sm">{t('Save Changes', '保存更改')}</button>
                <button onClick={logout} className="w-full border border-red-200 text-red-500 font-bold py-3 text-sm hover:bg-red-50 transition-colors">{t('Log Out', '退出登录')}</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   TRACKER SECTION
═══════════════════════════════════════════ */
function TrackerSection({ schools, setSchools, isPaid, maxSchools, title }: {
  schools: School[]; setSchools: (s: School[]) => void
  isPaid: boolean; maxSchools: number; title?: string
}) {
  const { t } = useLanguage()
  const [addingSchool, setAddingSchool] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState(SCHOOL_OPTIONS[0])

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-navy">{title ?? t('College Tracker', '学校追踪器')}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{schools.length} {t('of', '/')} {maxSchools} {t('schools', '所学校')}</p>
        </div>
        {schools.length < maxSchools
          ? <button onClick={() => setAddingSchool(true)} className="bg-brand-orange text-white font-bold px-5 py-2.5 text-sm hover:bg-brand-orange-dark transition-colors">+ {t('Add School', '添加学校')}</button>
          : !isPaid && <button className="bg-navy text-white text-xs font-bold px-4 py-2">{t('Upgrade for 20 schools', '升级可追踪20所学校')}</button>
        }
      </div>
      {!isPaid && (
        <div className="bg-orange-50 border border-brand-orange/30 p-4 mb-6 flex items-center gap-4">
          <span className="text-2xl">🔒</span>
          <div><p className="text-sm font-bold text-navy">{t('Free plan: up to 4 schools', '免费版：最多4所学校')}</p><p className="text-xs text-gray-500 mt-0.5">{t('Upgrade to Student Pro to track up to 20 schools.', '升级至学生专业版可追踪最多20所学校。')}</p></div>
          <button className="ml-auto flex-shrink-0 bg-brand-orange text-white text-xs font-bold px-4 py-2">{t('Upgrade', '升级')}</button>
        </div>
      )}
      {addingSchool && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6">
            <h2 className="text-lg font-black text-navy mb-4">{t('Add a School', '添加学校')}</h2>
            <div className="mb-4">
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">{t('Choose School', '选择学校')}</label>
              <select className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange"
                value={selectedSchool.name}
                onChange={e => setSelectedSchool(SCHOOL_OPTIONS.find(s => s.name === e.target.value) || SCHOOL_OPTIONS[0])}>
                {SCHOOL_OPTIONS.filter(s => !schools.find(ex => ex.name === s.name)).map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAddingSchool(false)} className="flex-1 border border-gray-200 text-gray-500 font-bold py-2.5 text-sm">{t('Cancel', '取消')}</button>
              <button onClick={() => {
                setSchools([...schools, { id: Date.now().toString(), ...selectedSchool, tuition: '$' + parseInt(selectedSchool.tuition).toLocaleString(), status: 'researching', deadline: '', notes: '' }])
                setAddingSchool(false)
              }} className="flex-1 bg-brand-orange text-white font-bold py-2.5 text-sm">{t('Add School', '添加学校')}</button>
            </div>
          </div>
        </div>
      )}
      {schools.length === 0 ? (
        <div className="bg-white border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">🏫</div>
          <p className="font-bold text-navy mb-2">{t('No schools yet', '暂无学校')}</p>
          <p className="text-gray-400 text-sm mb-6">{t('Start building your list.', '开始建立您的学校列表。')}</p>
          <button onClick={() => setAddingSchool(true)} className="bg-brand-orange text-white font-bold px-6 py-3 text-sm">+ {t('Add First School', '添加第一所学校')}</button>
        </div>
      ) : (
        <div className="space-y-3">
          {schools.map(school => (
            <div key={school.id} className="bg-white border border-gray-100 p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-navy text-white flex items-center justify-center font-black text-sm flex-shrink-0">{school.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-black text-navy text-sm">{school.name}</span>
                    <span className="text-xs text-gray-400">{school.location}</span>
                    {school.type && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 font-semibold">{school.type}</span>}
                  </div>
                  <div className={`flex gap-6 mt-2 flex-wrap ${!isPaid ? 'select-none' : ''}`}>
                    {[
                      { label: t('Accept Rate', '录取率'), value: school.acceptRate },
                      { label: t('Avg GPA', '平均GPA'),   value: school.avgGPA },
                      { label: t('Avg SAT', '平均SAT'),   value: school.avgSAT },
                      { label: t('Tuition', '学费', 'Matrícula'),       value: school.tuition },
                    ].map((stat, i) => (
                      <div key={stat.label}>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{stat.label}</div>
                        <div className={`text-sm font-bold text-navy ${!isPaid && i > 1 ? 'blur-sm' : ''}`}>{stat.value || '—'}</div>
                      </div>
                    ))}
                    {!isPaid && <div className="flex items-end"><span className="text-xs text-brand-orange font-bold">🔒 {t('Upgrade to see full data', '升级查看完整数据')}</span></div>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <select value={school.status}
                    onChange={e => setSchools(schools.map(s => s.id === school.id ? { ...s, status: e.target.value as School['status'] } : s))}
                    className={`text-xs font-bold px-2 py-1 border-none focus:outline-none cursor-pointer ${STATUS_COLORS[school.status]}`}>
                    {([ ['researching', t('Researching','调研中')], ['applied', t('Applied','已申请')], ['interview', t('Interview','面试')], ['accepted', t('Accepted','已录取')], ['rejected', t('Rejected','已拒绝')], ['waitlisted', t('Waitlisted','候补')] ] as [string,string][]).map(([val,label]) => <option key={val} value={val}>{label}</option>)}
                  </select>
                  <button onClick={() => setSchools(schools.filter(s => s.id !== school.id))} className="text-xs text-red-400 hover:text-red-600 font-semibold">{t('Remove', '移除')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   CHECKLIST SECTION
═══════════════════════════════════════════ */
function ChecklistSection({ checkedItems, toggleCheck, title }: { checkedItems: Set<string>; toggleCheck: (id: string) => void; title?: string }) {
  const { t } = useLanguage()
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-navy mb-1">{title ?? t('Application Checklist', '申请清单')}</h1>
      <p className="text-gray-400 text-sm mb-6">{checkedItems.size} {t('of', '/')} {CHECKLIST_ITEMS.length} {t('tasks complete', '项已完成')}</p>
      <div className="bg-gray-100 h-2 mb-8"><div className="bg-brand-orange h-2 transition-all duration-500" style={{ width: `${Math.round((checkedItems.size / CHECKLIST_ITEMS.length) * 100)}%` }} /></div>
      {([
        ['Applications', t('Applications', '申请材料')],
        ['Academics',    t('Academics',    '学术成绩')],
        ['Financial Aid',t('Financial Aid','助学金')],
        ['Research',     t('Research',     '学校调研')],
      ] as [string, string][]).map(([cat, catLabel]) => {
        const items = CHECKLIST_ITEMS.filter(i => i.category === cat)
        return (
          <div key={cat} className="mb-6">
            <h2 className="text-xs font-black text-navy uppercase tracking-widest mb-3">{catLabel}</h2>
            <div className="bg-white border border-gray-100 overflow-hidden">
              {items.map((item, i) => (
                <label key={item.id} className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-soft transition-colors ${i < items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <input type="checkbox" checked={checkedItems.has(item.id)} onChange={() => toggleCheck(item.id)} className="accent-brand-orange w-4 h-4 flex-shrink-0" />
                  <div className="flex-1">
                    <span className={`text-sm font-semibold ${checkedItems.has(item.id) ? 'line-through text-gray-300' : 'text-navy'}`}>
                      {t(item.label, item.labelZh ?? item.label)}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">{item.dueHint}</span>
                  </div>
                  {checkedItems.has(item.id) && <span className="text-green-500 text-sm">✓</span>}
                </label>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════
   MY KIDS SECTION
═══════════════════════════════════════════ */
function KidsSection({ children, activeChildId, setActiveChildId, addingChild, setAddingChild, newChildName, setNewChildName, newChildGrade, setNewChildGrade, onAddChild, onRemoveChild, updateChildSchools, updateChildChecks }: {
  children: Child[]; activeChildId: string | null; setActiveChildId: (id: string) => void
  addingChild: boolean; setAddingChild: (v: boolean) => void
  newChildName: string; setNewChildName: (v: string) => void
  newChildGrade: string; setNewChildGrade: (v: string) => void
  onAddChild: () => void; onRemoveChild: (id: string) => void
  updateChildSchools: (id: string, schools: School[]) => void
  updateChildChecks: (id: string, checks: string[]) => void
}) {
  const { t } = useLanguage()
  const [view, setView] = useState<'tracker' | 'checklist'>('tracker')
  const activeChild = children.find(c => c.id === activeChildId) ?? null

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-navy">{t('My Kids', '我的孩子')}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{t("Track each child's college application progress", '追踪每个孩子的大学申请进度')}</p>
        </div>
        <button onClick={() => setAddingChild(true)} className="bg-brand-orange text-white font-bold px-5 py-2.5 text-sm hover:bg-brand-orange-dark transition-colors">
          + {t('Add Child', '添加孩子')}
        </button>
      </div>

      {/* Add child modal */}
      {addingChild && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm p-6">
            <h2 className="text-lg font-black text-navy mb-5">{t('Add a Child', '添加孩子')}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">{t("Child's Name", '孩子姓名')}</label>
                <input value={newChildName} onChange={e => setNewChildName(e.target.value)} placeholder={t('e.g. Emma', '例如：小明')} className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
              </div>
              <div>
                <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">{t('Current Grade', '当前年级')}</label>
                <select value={newChildGrade} onChange={e => setNewChildGrade(e.target.value)} className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange">
                  {['8th','9th','10th','11th','12th','Gap Year','College Year 1','College Year 2','College Year 3','College Year 4'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setAddingChild(false); setNewChildName('') }} className="flex-1 border border-gray-200 text-gray-500 font-bold py-2.5 text-sm">{t('Cancel', '取消')}</button>
              <button onClick={onAddChild} className="flex-1 bg-brand-orange text-white font-bold py-2.5 text-sm">{t('Add Child', '添加孩子')}</button>
            </div>
          </div>
        </div>
      )}

      {children.length === 0 ? (
        <div className="bg-white border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">👨‍👩‍👧</div>
          <p className="font-bold text-navy mb-2">{t('No children added yet', '暂未添加孩子')}</p>
          <p className="text-gray-400 text-sm mb-6">{t('Add your children to track their college applications and progress.', '添加您的孩子以追踪他们的大学申请进度。')}</p>
          <button onClick={() => setAddingChild(true)} className="bg-brand-orange text-white font-bold px-6 py-3 text-sm">+ {t('Add Your First Child', '添加第一个孩子')}</button>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Kids list sidebar */}
          <div className="w-56 flex-shrink-0 space-y-2">
            {children.map(child => {
              const pct = child.checkedItems.length / CHECKLIST_ITEMS.length
              return (
                <button key={child.id} onClick={() => setActiveChildId(child.id)}
                  className={`w-full p-4 text-left border-2 transition-all ${activeChildId === child.id ? 'border-brand-orange bg-orange-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-black text-xs">{child.name.charAt(0)}</div>
                    <div>
                      <div className="font-black text-navy text-sm leading-tight">{child.name}</div>
                      <div className="text-[10px] text-gray-400">{t('Grade', '年级')} {child.grade}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 flex justify-between mb-1">
                    <span>{child.schools.length} {t('schools', '所学校')}</span>
                    <span>{Math.round(pct * 100)}%</span>
                  </div>
                  <div className="bg-gray-100 h-1"><div className="bg-brand-orange h-1" style={{ width: `${Math.round(pct * 100)}%` }} /></div>
                  <button onClick={e => { e.stopPropagation(); onRemoveChild(child.id) }} className="mt-2 text-[10px] text-red-400 hover:text-red-600 font-semibold">{t('Remove', '移除')}</button>
                </button>
              )
            })}
          </div>

          {/* Active child detail */}
          {activeChild && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-black text-lg">{activeChild.name.charAt(0)}</div>
                <div>
                  <h2 className="text-xl font-black text-navy">{activeChild.name}</h2>
                  <p className="text-sm text-gray-400">{t('Grade', '年级')} {activeChild.grade}</p>
                </div>
                {/* Tab switcher */}
                <div className="ml-auto flex bg-white border border-gray-200 p-0.5">
                  {(['tracker','checklist'] as const).map(v => (
                    <button key={v} onClick={() => setView(v)}
                      className={`px-4 py-1.5 text-xs font-bold capitalize transition-all ${view === v ? 'bg-navy text-white' : 'text-gray-400 hover:text-navy'}`}>
                      {v === 'tracker' ? t('tracker', '追踪器') : t('checklist', '清单')}
                    </button>
                  ))}
                </div>
              </div>

              {view === 'tracker' && (
                <TrackerSection
                  title={t(`${activeChild.name}'s Schools`, `${activeChild.name}的学校`)}
                  schools={activeChild.schools}
                  setSchools={s => updateChildSchools(activeChild.id, s)}
                  isPaid={true}
                  maxSchools={20}
                />
              )}

              {view === 'checklist' && (
                <ChecklistSection
                  title={t(`${activeChild.name}'s Checklist`, `${activeChild.name}的申请清单`)}
                  checkedItems={new Set(activeChild.checkedItems)}
                  toggleCheck={id => {
                    const current = new Set(activeChild.checkedItems)
                    current.has(id) ? current.delete(id) : current.add(id)
                    updateChildChecks(activeChild.id, [...current])
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   FAMILY COSTS SECTION
═══════════════════════════════════════════ */
function FamilyCostsSection({ children, familyCosts, saveFamilyCosts }: {
  children: Child[]; familyCosts: FamilyCostChild[]; saveFamilyCosts: (fc: FamilyCostChild[]) => void
}) {
  const { t } = useLanguage()
  // Initialize cost rows when children change
  useEffect(() => {
    if (children.length === 0) return
    const updated: FamilyCostChild[] = children.map(child => {
      const existing = familyCosts.find(fc => fc.childId === child.id)
      if (existing) return existing
      const topSchool = child.schools[0]
      return {
        childId: child.id,
        school: topSchool?.name || SCHOOL_OPTIONS[5].name,
        customTuition: topSchool ? '' : '14312',
        roomBoard: '21000',
        annualAid: '0',
        startYear: String(CURRENT_YEAR + 1),
        years: '4',
      }
    })
    saveFamilyCosts(updated)
  }, [children.length])

  function updateRow(childId: string, field: keyof FamilyCostChild, value: string) {
    saveFamilyCosts(familyCosts.map(fc => fc.childId === childId ? { ...fc, [field]: value } : fc))
  }

  // Build year-by-year breakdown
  const breakdown = useMemo(() => {
    if (familyCosts.length === 0) return []
    const rows: { year: number; entries: { name: string; gross: number; aid: number; net: number }[]; total: number; totalNet: number }[] = []
    const minYear = Math.min(...familyCosts.map(fc => parseInt(fc.startYear) || CURRENT_YEAR + 1))
    const maxYear = Math.max(...familyCosts.map(fc => (parseInt(fc.startYear) || CURRENT_YEAR + 1) + (parseInt(fc.years) || 4) - 1))
    for (let yr = minYear; yr <= maxYear; yr++) {
      const entries: { name: string; gross: number; aid: number; net: number }[] = []
      familyCosts.forEach(fc => {
        const child = children.find(c => c.id === fc.childId)
        if (!child) return
        const start = parseInt(fc.startYear) || CURRENT_YEAR + 1
        const dur = parseInt(fc.years) || 4
        if (yr < start || yr >= start + dur) return
        const tuition = fc.school === 'Custom / Other'
          ? (parseInt(fc.customTuition) || 0)
          : (SCHOOL_TUITION[fc.school] || 0)
        const rb = parseInt(fc.roomBoard) || 0
        const gross = tuition + rb
        const aid = parseInt(fc.annualAid) || 0
        entries.push({ name: child.name, gross, aid, net: Math.max(0, gross - aid) })
      })
      if (entries.length > 0) {
        rows.push({ year: yr, entries, total: entries.reduce((s, e) => s + e.gross, 0), totalNet: entries.reduce((s, e) => s + e.net, 0) })
      }
    }
    return rows
  }, [familyCosts, children])

  const grandTotal    = breakdown.reduce((s, r) => s + r.total, 0)
  const grandNet      = breakdown.reduce((s, r) => s + r.totalNet, 0)
  const grandAid      = grandTotal - grandNet

  if (children.length === 0) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="text-5xl mb-4">💳</div>
      <h2 className="text-xl font-black text-navy mb-3">{t('Family Cost Calculator', '家庭费用计算器')}</h2>
      <p className="text-gray-400 text-sm mb-6">{t('Add children under "My Kids" first, then come back here to calculate your total family college investment.', '请先在"我的孩子"中添加孩子，然后返回此处计算家庭大学总投资。')}</p>
    </div>
  )

  const childRows = children.map(child => familyCosts.find(fc => fc.childId === child.id) || null).filter(Boolean) as FamilyCostChild[]

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-black text-navy mb-1">{t('Family Cost Calculator', '家庭费用计算器')}</h1>
      <p className="text-gray-400 text-sm mb-8">{t('Estimate your total college investment across all your children, year by year.', '逐年估算您所有孩子的大学总投资。')}</p>

      {/* Per-child inputs */}
      <div className="space-y-4 mb-10">
        {childRows.map(fc => {
          const child = children.find(c => c.id === fc.childId)!
          const isCustom = fc.school === 'Custom / Other'
          const tuition = isCustom ? (parseInt(fc.customTuition) || 0) : (SCHOOL_TUITION[fc.school] || 0)
          const rb = parseInt(fc.roomBoard) || 0
          const aid = parseInt(fc.annualAid) || 0
          const net = Math.max(0, tuition + rb - aid)
          return (
            <div key={fc.childId} className="bg-white border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center font-black text-sm">{child.name.charAt(0)}</div>
                <div>
                  <p className="font-black text-navy text-sm">{child.name}</p>
                  <p className="text-xs text-gray-400">{t('Grade', '年级')} {child.grade}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-gray-400 font-semibold">{t('Annual net cost', '年度净费用')}</div>
                  <div className="text-xl font-black text-navy">{fmt(net)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block mb-1.5">{t('Target School', '目标学校')}</label>
                  <select value={fc.school} onChange={e => updateRow(fc.childId, 'school', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-orange">
                    {/* Prioritise child's tracked schools */}
                    {child.schools.length > 0 && (
                      <optgroup label={t('Tracked Schools', '已追踪学校')}>
                        {child.schools.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      </optgroup>
                    )}
                    <optgroup label={t('All Schools', '所有学校')}>
                      {SCHOOL_OPTIONS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </optgroup>
                  </select>
                </div>
                {isCustom && (
                  <div>
                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider block mb-1.5">{t('Annual Tuition ($)', '年学费（$）')}</label>
                    <input type="number" value={fc.customTuition} onChange={e => updateRow(fc.childId, 'customTuition', e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-orange" placeholder="e.g. 50000" />
                  </div>
                )}
                {!isCustom && (
                  <div>
                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider block mb-1.5">{t('Tuition (from data)', '学费（来自数据）')}</label>
                    <div className="border border-gray-100 bg-gray-soft px-3 py-2 text-xs text-gray-500 font-semibold">{fmt(tuition)} / {t('yr', '年')}</div>
                  </div>
                )}
                <div>
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block mb-1.5">{t('Room & Board ($)', '住宿餐饮（$）')}</label>
                  <input type="number" value={fc.roomBoard} onChange={e => updateRow(fc.childId, 'roomBoard', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-orange" placeholder="21000" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block mb-1.5">{t('Annual Aid / Grants ($)', '年度助学金（$）')}</label>
                  <input type="number" value={fc.annualAid} onChange={e => updateRow(fc.childId, 'annualAid', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-orange" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block mb-1.5">{t('Start Year', '入学年份')}</label>
                  <select value={fc.startYear} onChange={e => updateRow(fc.childId, 'startYear', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-orange">
                    {Array.from({ length: 10 }, (_, i) => CURRENT_YEAR + i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block mb-1.5">{t('Years in College', '在校年数')}</label>
                  <select value={fc.years} onChange={e => updateRow(fc.childId, 'years', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-orange">
                    {['2','3','4','5','6'].map(y => <option key={y} value={y}>{y} {t('years', '年')}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Year-by-year breakdown */}
      {breakdown.length > 0 && (
        <>
          <h2 className="text-sm font-black text-navy uppercase tracking-wider mb-4">{t('Year-by-Year Breakdown', '逐年明细')}</h2>
          <div className="bg-white border border-gray-100 overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">{t('Year', '年份')}</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">{t('Children in College', '在读孩子')}</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider">{t('Gross Cost', '总费用')}</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider">{t('Aid', '助学金')}</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider">{t('Net Cost', '净费用')}</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((row, i) => (
                  <tr key={row.year} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-soft'} ${row.entries.length > 1 ? 'font-semibold' : ''}`}>
                    <td className="px-4 py-3 font-bold text-navy">{row.year}–{row.year + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {row.entries.map(e => (
                          <span key={e.name} className="inline-flex items-center gap-1 bg-navy/10 text-navy text-[10px] font-bold px-2 py-0.5">
                            {e.name}
                            {row.entries.length > 1 && <span className="text-gray-400">· {fmt(e.net)}</span>}
                          </span>
                        ))}
                        {row.entries.length > 1 && (
                          <span className="inline-block bg-brand-orange/10 text-brand-orange text-[10px] font-bold px-2 py-0.5">{t('Overlap year', '重叠年份')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(row.total)}</td>
                    <td className="px-4 py-3 text-right text-green-600">–{fmt(row.total - row.totalNet)}</td>
                    <td className={`px-4 py-3 text-right font-black ${row.entries.length > 1 ? 'text-brand-orange' : 'text-navy'}`}>{fmt(row.totalNet)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary cards */}
          <h2 className="text-sm font-black text-navy uppercase tracking-wider mb-4">{t('Total Family Investment', '家庭总投资')}</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t('Total Gross Cost', '总费用'), value: fmt(grandTotal), sub: t('Tuition + room & board', '学费 + 住宿餐饮'), color: 'text-navy' },
              { label: t('Total Aid & Grants', '总助学金'), value: fmt(grandAid), sub: t('Scholarships & financial aid', '奖学金及助学金'), color: 'text-green-600' },
              { label: t('Total Net Cost', '家庭净费用'), value: fmt(grandNet), sub: t("Your family's out-of-pocket", '您的家庭自付费用'), color: 'text-brand-orange' },
            ].map(card => (
              <div key={card.label} className="bg-white border border-gray-100 p-6 text-center">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{card.label}</div>
                <div className={`text-2xl font-black ${card.color} mb-1`}>{card.value}</div>
                <div className="text-xs text-gray-400">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Per-child subtotals */}
          <div className="mt-6 bg-white border border-gray-100 p-5">
            <h3 className="text-xs font-black text-navy uppercase tracking-wider mb-4">{t('Per Child Subtotals', '各孩子小计')}</h3>
            <div className="space-y-3">
              {childRows.map(fc => {
                const child = children.find(c => c.id === fc.childId)!
                const tuition = fc.school === 'Custom / Other' ? (parseInt(fc.customTuition) || 0) : (SCHOOL_TUITION[fc.school] || 0)
                const rb = parseInt(fc.roomBoard) || 0
                const aid = parseInt(fc.annualAid) || 0
                const yrs = parseInt(fc.years) || 4
                const totalGross = (tuition + rb) * yrs
                const totalAid = aid * yrs
                const totalNet = Math.max(0, totalGross - totalAid)
                return (
                  <div key={fc.childId} className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center font-black text-xs">{child.name.charAt(0)}</div>
                    <div className="flex-1">
                      <span className="font-bold text-navy text-sm">{child.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{fc.school} · {yrs} {t('yrs', '年')}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-navy text-sm">{fmt(totalNet)} {t('net', '净额')}</div>
                      <div className="text-xs text-gray-400">{fmt(totalAid)} {t('in aid', '助学金')}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   ADMISSIONS EVALUATOR SECTION
═══════════════════════════════════════════ */
function EvaluatorSection({ plan, trackedSchools, studentProfile, setStudentProfile }: {
  plan: Plan
  trackedSchools: School[]
  studentProfile: StudentProfile
  setStudentProfile: (p: StudentProfile) => void
}) {
  const { t } = useLanguage()
  const isPaid = plan !== 'student-free'

  const hasInputs = !!(studentProfile.gpa || studentProfile.satScore || studentProfile.actScore)

  const evaluated = useMemo(() => {
    return SCHOOL_OPTIONS
      .filter(s => s.name !== 'Custom / Other' && s.avgSAT && s.avgGPA && s.acceptRate)
      .map(school => ({
        school,
        ...evaluateChance(studentProfile, school),
        isTracked: trackedSchools.some(ts => ts.name === school.name),
      }))
      .sort((a, b) => b.chance - a.chance)
  }, [studentProfile, trackedSchools])

  const byLabel = (lbl: string) => evaluated.filter(e => e.label === lbl)

  function fieldClass() {
    return 'w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange'
  }
  function labelClass() {
    return 'text-[10px] font-bold text-navy uppercase tracking-wider block mb-1.5'
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-black text-navy mb-1">{t('My Admission Chances', '录取概率评估')} 🎯</h1>
      <p className="text-gray-400 text-sm mb-8">{t('Enter your academic profile and see your estimated odds at each school.', '输入您的学业档案，查看每所学校的预估录取概率。')}</p>

      {/* ── Profile Form ─────────────────────── */}
      <div className="bg-white border border-gray-100 p-6 mb-8">
        <h2 className="text-xs font-black text-navy uppercase tracking-wider mb-5">{t('Your Academic Profile', '您的学业档案')}</h2>

        {/* Row 1: Test Scores + GPA + Rank */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className={labelClass()}>{t('SAT Score (400–1600)', 'SAT成绩 (400–1600)')}</label>
            <input type="number" min={400} max={1600} placeholder="e.g. 1450"
              value={studentProfile.satScore}
              onChange={e => setStudentProfile({ ...studentProfile, satScore: e.target.value })}
              className={fieldClass()} />
          </div>
          <div>
            <label className={labelClass()}>{t('ACT Score (1–36)', 'ACT成绩 (1–36)')}</label>
            <input type="number" min={1} max={36} placeholder="e.g. 32"
              value={studentProfile.actScore}
              onChange={e => setStudentProfile({ ...studentProfile, actScore: e.target.value })}
              className={fieldClass()} />
            <p className="text-[10px] text-gray-400 mt-1">{t('Used if no SAT provided', '未填SAT时自动换算')}</p>
          </div>
          <div>
            <label className={labelClass()}>{t('Unweighted GPA (0–4.0)', '未加权GPA (0–4.0)')}</label>
            <input type="number" min={0} max={4} step={0.01} placeholder="e.g. 3.85"
              value={studentProfile.gpa}
              onChange={e => setStudentProfile({ ...studentProfile, gpa: e.target.value })}
              className={fieldClass()} />
          </div>
          <div>
            <label className={labelClass()}>{t('Class Rank (top X%)', '班级排名 (前X%)')}</label>
            <input type="number" min={1} max={100} placeholder="e.g. 5"
              value={studentProfile.classRank}
              onChange={e => setStudentProfile({ ...studentProfile, classRank: e.target.value })}
              className={fieldClass()} />
            <p className="text-[10px] text-gray-400 mt-1">{t('Optional — top 5% = enter 5', '选填 — 前5%填入5')}</p>
          </div>
        </div>

        {/* Row 2: Non-academic factors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass()}>{t('AP / IB Courses', 'AP/IB课程数量')}</label>
            <input type="number" min={0} max={20} placeholder="e.g. 6"
              value={studentProfile.apCourses}
              onChange={e => setStudentProfile({ ...studentProfile, apCourses: e.target.value })}
              className={fieldClass()} />
          </div>
          <div>
            <label className={labelClass()}>{t('Extracurriculars', '课外活动')}</label>
            <select value={studentProfile.extracurriculars}
              onChange={e => setStudentProfile({ ...studentProfile, extracurriculars: e.target.value as StudentProfile['extracurriculars'] })}
              className={fieldClass()}>
              <option value="">{t('Select…', '请选择…')}</option>
              <option value="exceptional">{t('Exceptional (national/intl)', '卓越（全国/国际级别）')}</option>
              <option value="strong">{t('Strong (regional awards)', '优秀（地区奖项）')}</option>
              <option value="average">{t('Average (clubs, sports)', '一般（社团、运动）')}</option>
              <option value="minimal">{t('Minimal', '较少')}</option>
            </select>
          </div>
          <div>
            <label className={labelClass()}>{t('Legacy Applicant?', '是否校友子女？')}</label>
            <select value={studentProfile.legacy}
              onChange={e => setStudentProfile({ ...studentProfile, legacy: e.target.value as StudentProfile['legacy'] })}
              className={fieldClass()}>
              <option value="">{t('Select…', '请选择…')}</option>
              <option value="yes">{t('Yes', '是')}</option>
              <option value="no">{t('No', '否')}</option>
            </select>
          </div>
          <div>
            <label className={labelClass()}>{t('First-Generation Student?', '是否第一代大学生？')}</label>
            <select value={studentProfile.firstGen}
              onChange={e => setStudentProfile({ ...studentProfile, firstGen: e.target.value as StudentProfile['firstGen'] })}
              className={fieldClass()}>
              <option value="">{t('Select…', '请选择…')}</option>
              <option value="yes">{t('Yes', '是')}</option>
              <option value="no">{t('No', '否')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Results ──────────────────────────── */}
      {!hasInputs ? (
        <div className="bg-white border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <p className="font-bold text-navy mb-2">{t('Fill in your profile above', '请先填写您的学业档案')}</p>
          <p className="text-gray-400 text-sm">{t('Enter at least your GPA or test scores to see admission estimates.', '至少填写GPA或考试成绩以查看录取预估。')}</p>
        </div>
      ) : (
        <>
          {/* Summary counts */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {([
              ['Safety',    byLabel('Safety').length,    'text-green-700',  'bg-green-50',  'border-green-200'],
              ['Match',     byLabel('Match').length,     'text-blue-700',   'bg-blue-50',   'border-blue-200'],
              ['Reach',     byLabel('Reach').length,     'text-orange-700', 'bg-orange-50', 'border-orange-200'],
              ['Long Shot', byLabel('Long Shot').length,  'text-red-700',    'bg-red-50',    'border-red-200'],
            ] as [string, number, string, string, string][]).map(([lbl, count, tc, bg, bc]) => (
              <div key={lbl} className={`${bg} border ${bc} p-4 text-center`}>
                <div className={`text-2xl font-black ${tc}`}>{count}</div>
                <div className="text-xs font-bold text-gray-500 mt-1">{t(lbl, { Safety: '安全校', Match: '匹配校', Reach: '冲刺校', 'Long Shot': '梦想校' }[lbl] ?? lbl)}</div>
              </div>
            ))}
          </div>

          {/* School result cards */}
          <div className="space-y-3">
            {evaluated.map((result, idx) => {
              const isLocked = !isPaid && idx >= 6
              return (
                <div key={result.school.name}
                  className={`bg-white border p-5 transition-all ${result.isTracked ? 'border-brand-orange' : 'border-gray-100'} ${isLocked ? 'relative overflow-hidden' : ''}`}>
                  {isLocked && (
                    <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <div className="text-center px-4">
                        <div className="text-lg font-black text-navy mb-2">🔒 {t('Upgrade to see all schools', '升级以查看所有学校')}</div>
                        <p className="text-xs text-gray-500 mb-3">{t('Student Pro unlocks all evaluations + 20-school tracker.', '学生专业版解锁全部评估及20所学校追踪。')}</p>
                        <button className="bg-brand-orange text-white text-xs font-bold px-5 py-2">{t('Upgrade — $49/mo', '升级 — $49/月')}</button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-navy text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                      {result.school.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-navy text-sm">{result.school.name}</span>
                        {result.isTracked && (
                          <span className="text-[10px] bg-brand-orange text-white px-1.5 py-0.5 font-bold uppercase tracking-wider">{t('Tracked', '已追踪')}</span>
                        )}
                        <span className="text-xs text-gray-400">{result.school.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-gray-400 mb-2">
                        <span>{t('Accept Rate', '录取率')}: <strong className="text-navy">{result.school.acceptRate}</strong></span>
                        <span>{t('Avg GPA', '平均GPA')}: <strong className="text-navy">{result.school.avgGPA}</strong></span>
                        <span>{t('Avg SAT', '平均SAT')}: <strong className="text-navy">{result.school.avgSAT}</strong></span>
                      </div>
                      {/* Probability bar */}
                      <div className="bg-gray-100 h-2">
                        <div className="h-2 transition-all duration-700"
                          style={{ width: `${Math.min(100, result.chance)}%`, backgroundColor: result.barColor }} />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                      <div className="text-2xl font-black text-navy">{result.chance}%</div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 border ${result.color}`}>
                        {t(result.label, { Safety: '安全校', Match: '匹配校', Reach: '冲刺校', 'Long Shot': '梦想校' }[result.label] ?? result.label)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Upgrade banner (free only) */}
          {!isPaid && (
            <div className="mt-6 bg-navy text-white p-6 text-center">
              <p className="font-black text-sm mb-1">{t(`See all ${evaluated.length} school evaluations`, `查看全部${evaluated.length}所学校的评估`)}</p>
              <p className="text-white/60 text-xs mb-4">{t('Upgrade to Student Pro to unlock all results + 20-school tracker.', '升级至学生专业版，解锁全部评估结果及20所学校追踪器。')}</p>
              <button className="bg-brand-orange text-white font-bold px-8 py-3 text-sm">{t('Upgrade to Student Pro — $49/mo', '升级至学生专业版 — $49/月')}</button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 bg-gray-soft border border-gray-200 p-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-navy">{t('Disclaimer:', '免责声明：')}</strong>{' '}
              {t(
                'These estimates are based on statistical averages and publicly available admissions data. Actual decisions depend on holistic factors including essays, recommendations, demonstrated interest, and institutional priorities. Use as a directional guide only.',
                '这些估算基于统计平均值和公开的录取数据。实际录取决定取决于多种综合因素，包括文书、推荐信、展现的兴趣及院校政策。仅供参考。'
              )}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

/* ── Locked section ── */
function LockedSection({ title, desc, plan }: { title: string; desc: string; plan: string }) {
  const { t } = useLanguage()
  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="text-5xl mb-6">🔒</div>
      <h2 className="text-2xl font-black text-navy mb-3">{title}</h2>
      <p className="text-gray-400 text-sm leading-relaxed mb-8">{desc}</p>
      <div className="bg-white border border-gray-100 p-6 mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">{t('Unlock with', '解锁方案')}</p>
        <p className="font-black text-navy text-lg">{plan}</p>
      </div>
      <button className="bg-brand-orange text-white font-bold px-8 py-3 hover:bg-brand-orange-dark transition-colors">{t('Upgrade Now →', '立即升级 →')}</button>
    </div>
  )
}
