'use client'
import { posts, categories } from '@/lib/content'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

export default function BlogPage() {
  const { t } = useLanguage()

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t('Blog & Resources', '博客与资源', 'Blog y Recursos')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {t("Expert guides, insider tips, and real stories from alumni of the world's top universities.", '来自全球顶尖大学校友的专业指南、内部建议和真实故事。')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            {/* Categories */}
            <div className="bg-gray-soft p-6 mb-8">
              <h3 className="font-bold text-navy text-lg mb-5 border-b-2 border-brand-orange pb-2">{t('Categories', '分类', 'Categorías')}</h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.id} className="flex items-center justify-between">
                    <Link
                      href={`/blog/category/${cat.slug}`}
                      className="text-gray-700 hover:text-brand-orange transition-colors font-medium"
                    >
                      {cat.name}
                    </Link>
                    <span className="text-xs bg-navy text-white rounded-full px-2 py-0.5 font-bold">
                      {cat.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-navy text-white p-6">
              <h3 className="font-bold text-xl mb-3">{t('Get Insider Tips', '获取内部建议', 'Obtén Consejos Exclusivos')}</h3>
              <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                {t('Join thousands of students getting weekly admission tips from our expert alumni advisors.', '加入数千名学生的行列，每周获取来自专业校友顾问的申请秘诀。', 'Únete a miles de estudiantes que reciben consejos de admisión semanales de nuestros asesores alumni expertos.')}
              </p>
              <Link href="/shop" className="btn-primary block text-center text-sm py-3">
                {t('JOIN NOW — $79/yr', '立即加入 — $79/年', 'ÚNETE AHORA — $79/año')}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
