'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { proxyImageSrc } from '@/lib/image-utils'
import { useLanguage } from '@/lib/i18n'

type Role = 'student' | 'parent' | 'contributor'
type Plan = 'student-free' | 'student-paid' | 'parent' | 'contributor'
type Tab = 'login' | 'signup'

const plans = {
  'student-free': { label: 'Student — Free', price: '$0', color: 'border-gray-200' },
  'student-paid': { label: 'Student — Pro', price: '$49/mo', color: 'border-brand-orange' },
  parent: { label: 'Parent Plan', price: '$79/mo', color: 'border-navy' },
  contributor: { label: 'Contributor', price: 'Apply', color: 'border-purple-400' },
}

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [tab, setTab] = useState<Tab>('login')
  const [role, setRole] = useState<Role>('student')
  const [plan, setPlan] = useState<Plan>('student-free')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleRoleChange(r: Role) {
    setRole(r)
    if (r === 'student') setPlan('student-free')
    if (r === 'parent') setPlan('parent')
    if (r === 'contributor') setPlan('contributor')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError(t('Please fill in all fields.', '请填写所有字段。', 'Por favor completa todos los campos.')); return }
    if (tab === 'signup' && !name) { setError(t('Please enter your name.', '请输入您的姓名。', 'Por favor ingresa tu nombre.')); return }

    setLoading(true)
    setTimeout(() => {
      const user = {
        name: tab === 'signup' ? name : email.split('@')[0],
        email,
        plan: tab === 'login' ? 'student-free' : plan, // demo: login defaults to student-free
        role: tab === 'login' ? 'student' : role,
      }
      localStorage.setItem('tcp_user', JSON.stringify(user))
      router.push('/dashboard')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gray-soft flex">

      {/* ── LEFT PANEL — branding ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] bg-navy flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute border border-white rounded-full"
              style={{ width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>

        {/* Quote */}
        <div className="relative">
          <div className="text-brand-orange text-6xl font-black leading-none mb-4">"</div>
          <p className="text-white text-xl font-light leading-relaxed mb-8 max-w-sm">
            {t('The right guidance at the right time makes all the difference between a rejection and a full-ride.', '在正确的时间获得正确的指导，是被拒录和获全额奖学金之间的关键差距。', 'La orientación correcta en el momento correcto marca toda la diferencia entre un rechazo y una beca completa.')}
          </p>
          <div className="flex gap-4 mb-12">
            {['🎓 Harvard', '🏛️ Yale', '⚡ Stanford', '🌴 USC'].map(s => (
              <span key={s} className="text-xs text-white/50 font-semibold uppercase tracking-wider">{s}</span>
            ))}
          </div>

          {/* Plan highlights */}
          <div className="space-y-3">
            {[
              { icon: '📊', text: t('Full earning potential data for every school', '每所学校的完整薪资潜力数据', 'Datos completos de potencial salarial por escuela') },
              { icon: '✅', text: t('College application tracker & checklists', '大学申请跟踪器与核查清单', 'Rastreador y listas de verificación de solicitudes') },
              { icon: '🔓', text: t('Exclusive insider tips from real alumni', '真实校友的独家内部建议', 'Consejos exclusivos de alumni reales') },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-white/70 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/25 text-xs">© 2026 TopCollegePlanning.com</p>
      </div>

      {/* ── RIGHT PANEL — form ────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Link href="/">
              <Image
                src={"/images/tcp-logo-horizontal-cropped.png"}
                alt="Top College Planning"
                width={180} height={56}
                className="h-12 w-auto object-contain"
                unoptimized
              />
            </Link>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-white border border-gray-200 p-1 mb-8">
            {(['login', 'signup'] as Tab[]).map(tabOption => (
              <button
                key={tabOption}
                onClick={() => setTab(tabOption)}
                className={`flex-1 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${
                  tab === tabOption ? 'bg-navy text-white' : 'text-gray-400 hover:text-navy'
                }`}
              >
                {tabOption === 'login' ? t('Log In', '登录', 'Iniciar Sesión') : t('Create Account', '创建账号', 'Crear Cuenta')}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* SIGN UP EXTRAS */}
            {tab === 'signup' && (
              <>
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">{t('Your Name', '您的姓名', 'Tu Nombre')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="First Last"
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>

                {/* Role selector */}
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">{t('I am a...', '我是...', 'Soy un...')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['student', 'parent', 'contributor'] as Role[]).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleChange(r)}
                        className={`py-3 text-sm font-bold border-2 transition-all capitalize ${
                          role === r
                            ? 'border-brand-orange bg-brand-orange text-white'
                            : 'border-gray-200 text-gray-500 hover:border-brand-orange hover:text-brand-orange'
                        }`}
                      >
                        {r === 'student' ? `🎓 ${t('Student', '学生', 'Estudiante')}` : r === 'parent' ? `👨‍👩‍👧 ${t('Parent', '家长', 'Padre/Madre')}` : `✍️ ${t('Contributor', '内容贡献者', 'Colaborador')}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan selector — only for student/parent */}
                {role !== 'contributor' && (
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">{t('Choose Your Plan', '选择您的方案', 'Elige Tu Plan')}</label>
                    <div className="space-y-2">
                      {role === 'student' && (
                        <>
                          <PlanCard
                            id="student-free"
                            active={plan === 'student-free'}
                            onClick={() => setPlan('student-free')}
                            badge={t('FREE', '免费', 'GRATIS')}
                            badgeColor="bg-gray-100 text-gray-500"
                            title={t('Student Free', '学生免费版', 'Estudiante Gratuito')}
                            price="$0"
                            features={[t('Track up to 4 schools', '跟踪最多4所学校', 'Seguimiento de hasta 4 escuelas'), t('Basic application checklist', '基础申请核查清单', 'Lista de verificación básica'), t('Limited school data preview', '有限的学校数据预览', 'Vista previa limitada de datos')]}
                          />
                          <PlanCard
                            id="student-paid"
                            active={plan === 'student-paid'}
                            onClick={() => setPlan('student-paid')}
                            badge={t('PRO', '专业版', 'PRO')}
                            badgeColor="bg-brand-orange text-white"
                            title={t('Student Pro', '学生专业版', 'Estudiante Pro')}
                            price="$49/mo"
                            features={[t('Track up to 20 schools', '跟踪最多20所学校', 'Seguimiento de hasta 20 escuelas'), t('Full checklist & deadline alerts', '完整清单与截止日期提醒', 'Lista completa y alertas de plazos'), t('Unlocked school insights', '解锁学校深度分析', 'Análisis escolares desbloqueados')]}
                          />
                        </>
                      )}
                      {role === 'parent' && (
                        <PlanCard
                          id="parent"
                          active={plan === 'parent'}
                          onClick={() => setPlan('parent')}
                          badge={t('FULL ACCESS', '完整权限', 'ACCESO COMPLETO')}
                          badgeColor="bg-navy text-white"
                          title={t('Parent Plan', '家长方案', 'Plan para Padres')}
                          price="$79/mo"
                          features={[t('All student features included', '包含所有学生版功能', 'Todas las funciones para estudiantes incluidas'), t('Earning potential by school & major', '按学校和专业查看薪资潜力', 'Potencial de ingresos por escuela y carrera'), t('Full admission insights & analytics', '完整录取分析与数据报告', 'Análisis completo de admisiones')]}
                        />
                      )}
                    </div>
                  </div>
                )}

                {role === 'contributor' && (
                  <div className="bg-purple-50 border border-purple-200 p-4 text-sm text-purple-700 leading-relaxed">
                    {t('Contributor accounts are reviewed manually. After signing up, our team will reach out within 48 hours.', '内容贡献者账户需人工审核。注册后，我们的团队将在48小时内与您联系。', 'Las cuentas de colaborador se revisan manualmente. Después de registrarte, nuestro equipo te contactará en 48 horas.')}
                  </div>
                )}
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">{t('Email Address', '电子邮箱', 'Correo Electrónico')}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-navy uppercase tracking-wider">{t('Password', '密码', 'Contraseña')}</label>
                {tab === 'login' && (
                  <a href="#" className="text-xs text-brand-orange font-semibold hover:underline">{t('Forgot password?', '忘记密码？', '¿Olvidaste tu contraseña?')}</a>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold uppercase tracking-wider py-4 text-sm transition-colors disabled:opacity-60"
            >
              {loading ? t('Please wait...', '请稍候...', 'Por favor espera...') : tab === 'login' ? t('Log In →', '登录 →', 'Iniciar Sesión →') : t('Create My Account →', '创建我的账号 →', 'Crear Mi Cuenta →')}
            </button>

            {/* Demo shortcuts */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 text-center mb-3 font-semibold uppercase tracking-wider">{t('Demo — Jump straight in as:', '演示 — 直接以以下身份登录：', 'Demo — Ingresa directamente como:')}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t('Student Free', '学生免费版', 'Estudiante Gratuito'), plan: 'student-free' as Plan, role: 'student' as Role },
                  { label: t('Student Pro', '学生专业版', 'Estudiante Pro'), plan: 'student-paid' as Plan, role: 'student' as Role },
                  { label: t('Parent', '家长', 'Padre/Madre'), plan: 'parent' as Plan, role: 'parent' as Role },
                ].map(d => (
                  <button
                    key={d.plan}
                    type="button"
                    onClick={() => {
                      localStorage.setItem('tcp_user', JSON.stringify({ name: 'Demo User', email: 'demo@tcp.com', plan: d.plan, role: d.role }))
                      router.push('/dashboard')
                    }}
                    className="py-2 text-xs font-bold border border-gray-200 text-gray-500 hover:border-navy hover:text-navy transition-colors"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ── Plan card sub-component ── */
function PlanCard({
  id, active, onClick, badge, badgeColor, title, price, features
}: {
  id: string, active: boolean, onClick: () => void,
  badge: string, badgeColor: string, title: string, price: string, features: string[]
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border-2 p-4 transition-all ${
        active ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${active ? 'border-brand-orange' : 'border-gray-300'}`}>
            {active && <div className="w-2 h-2 rounded-full bg-brand-orange" />}
          </div>
          <span className="font-bold text-sm text-navy">{title}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 ${badgeColor}`}>{badge}</span>
        </div>
        <span className="font-black text-navy text-sm">{price}</span>
      </div>
      <ul className="space-y-1 ml-6">
        {features.map(f => (
          <li key={f} className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="text-brand-orange">✓</span> {f}
          </li>
        ))}
      </ul>
    </button>
  )
}
