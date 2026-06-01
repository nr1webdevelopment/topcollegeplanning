'use client'
import Link from 'next/link'
import type { Post } from '@/lib/content'
import { formatDate, getPostImage } from '@/lib/content'
import { useLanguage } from '@/lib/i18n'

interface Props {
  post: Post
  featured?: boolean
}

export default function PostCard({ post, featured = false }: Props) {
  const { t } = useLanguage()
  const imageUrl = getPostImage(post)

  return (
    <article className={`group bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 ${featured ? 'md:flex-row' : ''}`}>
      {/* Image */}
      {imageUrl && (
        <div className={`overflow-hidden bg-gray-soft ${featured ? 'md:w-1/2 flex-shrink-0' : 'aspect-video'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      {!imageUrl && (
        <div className={`bg-navy flex items-center justify-center ${featured ? 'md:w-1/2 flex-shrink-0 min-h-48' : 'aspect-video'}`}>
          <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Category tags */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map(cat => (
              <span key={cat} className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2 py-1">
                {cat}
              </span>
            ))}
          </div>
        )}

        <h2 className={`font-bold text-navy group-hover:text-brand-orange transition-colors leading-snug mb-3 ${featured ? 'text-2xl' : 'text-lg'}`}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {post.excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <time className="text-xs text-gray-400 font-medium">{formatDate(post.date)}</time>
          <Link
            href={`/blog/${post.slug}`}
            className="text-brand-orange hover:text-brand-orange-dark font-bold text-sm uppercase tracking-wide transition-colors"
          >
            {t('Read More →', '阅读更多 →', 'Leer Más →')}
          </Link>
        </div>
      </div>
    </article>
  )
}
