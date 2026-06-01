'use client'
import Link from 'next/link'
import AlumnusPhoto from '@/components/AlumnusPhoto'
import { useLanguage } from '@/lib/i18n'
import type { NotableAlumnus } from '@/data/notable-alumni-data'

const categoryColors: Record<string, string> = {
  Tech: '#3B82F6',
  Politics: '#EF4444',
  Entertainment: '#F59E0B',
  Science: '#10B981',
  Business: '#8B5CF6',
  Sports: '#F97316',
  Media: '#EC4899',
  Law: '#6B7280',
  Literature: '#84CC16',
}

const categoryIcons: Record<string, string> = {
  Tech: '💻',
  Politics: '🏛️',
  Entertainment: '🎬',
  Science: '🔬',
  Business: '💼',
  Sports: '🏆',
  Media: '📺',
  Law: '⚖️',
  Literature: '📖',
}

const categoryLabelsZh: Record<string, string> = {
  Tech: '科技',
  Politics: '政治',
  Entertainment: '娱乐',
  Science: '科学',
  Business: '商业',
  Sports: '体育',
  Media: '媒体',
  Law: '法律',
  Literature: '文学',
}

const categoryLabelsEs: Record<string, string> = {
  Tech: 'Tecnología',
  Politics: 'Política',
  Entertainment: 'Entretenimiento',
  Science: 'Ciencia',
  Business: 'Negocios',
  Sports: 'Deportes',
  Media: 'Medios',
  Law: 'Derecho',
  Literature: 'Literatura',
}

export default function NotableAlumnusContent({ alumnus }: { alumnus: NotableAlumnus }) {
  const { t, lang } = useLanguage()

  const catColor = categoryColors[alumnus.category] ?? '#1a2e5a'
  const catIcon = categoryIcons[alumnus.category] ?? '⭐'
  const catLabel = lang === 'zh'
    ? (categoryLabelsZh[alumnus.category] ?? alumnus.category)
    : lang === 'es'
      ? (categoryLabelsEs[alumnus.category] ?? alumnus.category)
      : alumnus.category

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="bg-navy text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
          >
            {t('← Back to Home', '← 返回首页', '← Volver al Inicio')}
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-700 border-4 border-white/20 shadow-xl">
                <AlumnusPhoto src={alumnus.photoUrl} name={alumnus.name} />
              </div>
            </div>

            {/* Name + meta */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: catColor }}
                >
                  {catIcon} {catLabel}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2">
                {alumnus.name}
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                {lang === 'zh' ? (alumnus.knownForZh ?? alumnus.knownFor) : lang === 'es' ? (alumnus.knownForEs ?? alumnus.knownFor) : alumnus.knownFor}
              </p>

              {/* Schools attended badges */}
              <div className="flex flex-wrap gap-2">
                {alumnus.schools.map((s, i) => (
                  <span
                    key={i}
                    className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── MAIN COLUMN ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Bio */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <span style={{ color: catColor }}>▌</span> {t('Biography', '传记', 'Biografía')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {lang === 'zh' ? (alumnus.bioZh ?? alumnus.bio) : lang === 'es' ? (alumnus.bioEs ?? alumnus.bio) : alumnus.bio}
              </p>
            </section>

            {/* Achievements */}
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black text-navy uppercase tracking-wider mb-6 flex items-center gap-2">
                <span style={{ color: catColor }}>▌</span> {t('Key Achievements', '主要成就', 'Logros Principales')}
              </h2>
              <ul className="space-y-4">
                {(lang === 'zh' ? (alumnus.achievementsZh ?? alumnus.achievements) : lang === 'es' ? (alumnus.achievementsEs ?? alumnus.achievements) : alumnus.achievements).map((achievement, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black mt-0.5"
                      style={{ backgroundColor: catColor }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{achievement}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Education */}
            <div className="bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider mb-4">
                🎓 {t('Education', '教育经历', 'Educación')}
              </h3>
              <div className="space-y-4">
                {alumnus.schools.map((school, i) => (
                  <div key={i} className="border-l-2 pl-4" style={{ borderColor: catColor }}>
                    <p className="font-bold text-navy text-sm leading-snug">{school.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{school.degree}</p>
                    {school.years && (
                      <p className="text-xs text-gray-400 mt-0.5">{school.years}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Category */}
            <div
              className="p-6 text-white shadow-sm"
              style={{ backgroundColor: catColor }}
            >
              <div className="text-4xl mb-2">{catIcon}</div>
              <h3 className="font-black text-lg">{catLabel}</h3>
              <p className="text-white/80 text-sm mt-1">
                {lang === 'zh' ? (alumnus.knownForZh ?? alumnus.knownFor) : lang === 'es' ? (alumnus.knownForEs ?? alumnus.knownFor) : alumnus.knownFor}
              </p>
            </div>

            {/* CTA */}
            <div className="bg-gray-soft p-6 text-center">
              <h3 className="font-black text-navy mb-2">
                {t(`Inspired by ${alumnus.name.split(' ')[0]}?`, `受到${alumnus.name}的启发？`, `¿Inspirado por ${alumnus.name.split(' ')[0]}?`)}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {t('Our advisors can help you build a college path toward your goals.', '我们的顾问可以帮您规划通往目标的大学申请路径。', 'Nuestros asesores pueden ayudarte a construir un camino universitario hacia tus metas.')}
              </p>
              <Link href="/shop" className="btn-primary text-sm">
                {t('Get Expert Guidance', '获取专业指导', 'Obtener Orientación Experta')}
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
