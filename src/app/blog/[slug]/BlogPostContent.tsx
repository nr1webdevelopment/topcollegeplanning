'use client'
import { proxyImage } from '@/lib/image-utils'
import Link from 'next/link'
import PostCard from '@/components/PostCard'
import { useLanguage } from '@/lib/i18n'
import type { Post } from '@/lib/content'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPostContent({
  post,
  imageUrl,
  related,
}: {
  post: Post
  imageUrl: string | null
  related: Post[]
}) {
  const { t } = useLanguage()

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-navy text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.categories.length > 0 && (
            <div className="flex gap-2 mb-4">
              {post.categories.map(cat => (
                <Link
                  key={cat}
                  href={`/blog/category/${cat.toLowerCase()}`}
                  className="text-xs font-bold uppercase tracking-widest text-brand-orange bg-white/10 px-3 py-1 hover:bg-brand-orange hover:text-white transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <time>{formatDate(post.date)}</time>
            <span>·</span>
            <span>Top College Planning</span>
          </div>
        </div>
      </div>

      {/* Featured image */}
      {imageUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Article */}
          <article className="flex-1 min-w-0">
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {post.categories.map(cat => (
                  <Link
                    key={cat}
                    href={`/blog/category/${cat.toLowerCase()}`}
                    className="text-xs font-bold uppercase tracking-wider text-brand-orange border border-brand-orange px-3 py-1 hover:bg-brand-orange hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-navy text-white p-6 mb-6">
                <h3 className="font-bold text-lg mb-3">{t('Get Expert Help', '获取专业帮助', 'Obtener Ayuda Experta')}</h3>
                <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                  {t('Join our membership and get weekly insider tips from alumni of the top schools.', '加入我们的会员，每周获取来自顶尖学校校友的内部建议。', 'Únete a nuestra membresía y recibe consejos exclusivos semanales de alumni de las mejores escuelas.')}
                </p>
                <Link href="/shop" className="btn-primary block text-center text-sm py-3">
                  {t('JOIN — $79/yr', '立即加入 — $79/年', 'ÚNETE — $79/año')}
                </Link>
              </div>
              <div className="bg-gray-soft p-6">
                <h3 className="font-bold text-navy mb-4">{t('Share This Article', '分享这篇文章', 'Compartir Este Artículo')}</h3>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent('https://topcollegeplanning.com/blog/' + post.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#1DA1F2] text-white text-center py-2 text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://topcollegeplanning.com/blog/' + post.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#0A66C2] text-white text-center py-2 text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-navy mb-8">{t('Related Articles', '相关文章', 'Artículos Relacionados')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(rp => (
                <PostCard key={rp.id} post={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
