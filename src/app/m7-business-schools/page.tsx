'use client'
import { posts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { m7Schools } from '@/data/m7-data'
import { useLanguage } from '@/lib/i18n'

export default function M7BusinessSchoolsPage() {
  const { t } = useLanguage()
  const mbaPost = posts.find(p => p.slug === 'what-is-an-mba')
  const boothPost = posts.find(p => p.slug === 'm7-business-school-chicago-booth')
  const relatedPosts = [mbaPost, boothPost].filter(Boolean).concat(posts.slice(0, 4)) as typeof posts

  return (
    <div className="bg-white min-h-screen">
      <div className="relative text-white py-20 overflow-hidden">
        {/* Background photo — Harvard Business School */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1800&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Navy overlay */}
        <div className="absolute inset-0 bg-navy opacity-80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-3">{t('Elite MBA Programs', '顶尖MBA项目', 'Programas MBA de Élite')}</p>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">{t('M7 Business Schools', 'M7商学院', 'Escuelas de Negocios M7')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed mb-8">
            {t(
              'The Magnificent 7 — the most prestigious MBA programs in the world. Explore each school\'s salary outcomes, GMAT targets, and career placement data.',
              '华丽七杰——全球最负盛名的MBA项目。探索各院校的薪资成果、GMAT目标分数和职业发展数据。',
              'Los Magníficos 7 — los programas MBA más prestigiosos del mundo. Explora salarios, objetivos GMAT y datos de colocación laboral.'
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#schools" className="btn-primary">
              {t('Explore M7 Schools', '探索M7院校', 'Explorar Escuelas M7')}
            </a>
            <Link href="/m7-business-schools/cost-calculator" className="btn-outline border-white text-white hover:bg-white hover:text-navy">
              {t('Cost Calculator', '费用计算器', 'Calculadora de Costos')}
            </Link>
          </div>
        </div>
      </div>

      <div id="schools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {m7Schools.map((school, i) => (
            <Link
              key={school.slug}
              href={`/m7-business-schools/${school.slug}`}
              className="group bg-gray-soft border-l-4 hover:shadow-md transition-all block"
              style={{ borderColor: school.color }}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={school.logoUrl} alt={school.shortName} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: school.color }}>
                      #{i + 1} M7
                    </p>
                    <h3 className="font-bold text-navy text-lg mb-1 group-hover:text-brand-orange transition-colors">{school.name}</h3>
                    <p className="text-sm text-gray-500">{school.location.city}, {school.location.state}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">GMAT</p>
                    <p className="font-black text-navy">{school.gmatMedian}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{t('Avg Salary', '平均薪资', 'Salario Prom.')}</p>
                    <p className="font-black text-navy">{school.avgBaseSalary}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{t('Acceptance', '录取率', 'Admisión')}</p>
                    <p className="font-black text-navy">{school.acceptanceRate}</p>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider group-hover:underline">
                    {t('View Profile →', '查看详情 →', 'Ver Perfil →')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Notable MBA Graduates */}
        <div className="mb-16">
          <h2 className="section-title mb-2">{t('Notable MBA Graduates', '知名MBA校友', 'Egresados MBA Destacados')}</h2>
          <p className="text-gray-500 mb-8">{t('Celebrated leaders and innovators who earned their MBA from an M7 school.', '从M7商学院获得MBA学位的杰出领袖与创新者。', 'Líderes e innovadores destacados que obtuvieron su MBA en una escuela M7.')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {m7Schools.map((school) => (
              <div key={school.slug} className="bg-gray-soft rounded-xl p-5 border-t-4" style={{ borderColor: school.color }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={school.logoUrl} alt={school.shortName} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm leading-tight">{school.shortName}</p>
                    <p className="text-xs text-gray-400">{school.location.city}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {school.notableAlumni.map((alumnus, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-orange" />
                      {alumnus}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <h2 className="section-title mb-8">{t('MBA Guides & Articles', 'MBA指南与文章', 'Guías y Artículos de MBA')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.slice(0, 6).map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
