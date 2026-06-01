'use client'
import { proxyImage } from '@/lib/image-utils'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

// Types mirroring what getAlumniBySlug returns
interface AlumnusItem {
  slug: string
  title: string
  photo?: string
  university?: string
  degree?: string
  bio?: string
  content: string
  date: string
  excerpt?: string
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function AlumnusDetailContent({
  alumnus,
  prevAlumnus,
  nextAlumnus,
}: {
  alumnus: AlumnusItem
  prevAlumnus: AlumnusItem | null
  nextAlumnus: AlumnusItem | null
}) {
  const { t } = useLanguage()
  const a = alumnus

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO BANNER ──────────────────────────────────────── */}
      <div className="bg-navy relative overflow-hidden">
        {/* Background blurred photo */}
        {a.photo && (
          <div className="absolute inset-0 opacity-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proxyImage(a.photo)}
              alt=""
              className="w-full h-full object-cover object-top blur-sm scale-110"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/alumni"
            className="text-gray-400 hover:text-brand-orange text-sm mb-8 inline-flex items-center gap-1 transition-colors"
          >
            {t('← Back to Alumni Network', '← 返回校友网络', '← Volver a la Red de Alumni')}
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="relative w-40 h-40 md:w-52 md:h-52 overflow-hidden border-4 border-brand-orange shadow-2xl">
                {a.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={proxyImage(a.photo)}
                    alt={a.title}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-orange flex items-center justify-center">
                    <span className="text-white font-black text-6xl">
                      {a.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name & meta */}
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
                {a.title}
              </h1>
              <div className="flex flex-wrap gap-3 mb-4">
                {a.university && (
                  <span className="bg-brand-orange text-white text-sm font-bold uppercase tracking-wider px-3 py-1">
                    {a.university}
                  </span>
                )}
                {a.degree && (
                  <span className="bg-white/10 text-gray-200 text-sm font-medium px-3 py-1 border border-white/20">
                    {a.degree}
                  </span>
                )}
              </div>
              {a.bio && (
                <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                  {a.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Article body */}
          <div className="lg:col-span-2">
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: a.content }}
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Quick facts card */}
            <div className="bg-gray-50 border border-gray-100 p-6 mb-6">
              <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4">
                {t('Quick Facts', '基本信息', 'Datos Rápidos')}
              </h3>
              <dl className="space-y-3">
                {a.university && (
                  <div>
                    <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{t('University', '大学', 'Universidad')}</dt>
                    <dd className="text-sm text-navy font-medium">{a.university}</dd>
                  </div>
                )}
                {a.degree && (
                  <div>
                    <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{t('Degree', '学位', 'Título')}</dt>
                    <dd className="text-sm text-navy font-medium">{a.degree}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{t('Added', '添加时间', 'Añadido')}</dt>
                  <dd className="text-sm text-navy font-medium">{formatDate(a.date)}</dd>
                </div>
              </dl>
            </div>

            {/* CTA */}
            <div className="bg-navy text-white p-6">
              <h3 className="text-lg font-black mb-2">{t('Want to follow in their footsteps?', '想要追随他们的脚步？', '¿Quieres seguir sus pasos?')}</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {t("Our advisors have attended the very schools you're dreaming about. Let us guide you.", '我们的顾问曾就读于您梦想中的学校，让我们来指导您。', 'Nuestros asesores estudiaron en las escuelas con las que sueñas. Permítenos guiarte.')}
              </p>
              <Link
                href="/blog"
                className="block text-center bg-brand-orange hover:bg-brand-orange-dark text-white font-bold uppercase tracking-wide text-sm px-4 py-3 transition-colors"
              >
                {t('Explore Our Guides', '探索我们的指南', 'Explorar Nuestras Guías')}
              </Link>
            </div>
          </aside>
        </div>

        {/* ── PREV / NEXT NAV ───────────────────────────────── */}
        <div className="mt-14 pt-8 border-t border-gray-100 flex items-center justify-between gap-4">
          {prevAlumnus ? (
            <Link
              href={`/alumni/${prevAlumnus.slug}`}
              className="group flex items-center gap-3 text-left"
            >
              {prevAlumnus.photo && (
                <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden border-2 border-gray-200 group-hover:border-brand-orange transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={proxyImage(prevAlumnus.photo)} alt={prevAlumnus.title} className="w-full h-full object-cover object-top" />
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{t('← Previous', '← 上一位', '← Anterior')}</p>
                <p className="text-sm font-bold text-navy group-hover:text-brand-orange transition-colors">
                  {prevAlumnus.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextAlumnus ? (
            <Link
              href={`/alumni/${nextAlumnus.slug}`}
              className="group flex items-center gap-3 text-right"
            >
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{t('Next →', '下一位 →', 'Siguiente →')}</p>
                <p className="text-sm font-bold text-navy group-hover:text-brand-orange transition-colors">
                  {nextAlumnus.title}
                </p>
              </div>
              {nextAlumnus.photo && (
                <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden border-2 border-gray-200 group-hover:border-brand-orange transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={proxyImage(nextAlumnus.photo)} alt={nextAlumnus.title} className="w-full h-full object-cover object-top" />
                </div>
              )}
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
