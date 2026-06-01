import { posts, categories } from '@/lib/content'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return categories.map(cat => ({ slug: cat.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = categories.find(c => c.slug === params.slug)
  if (!cat) return {}
  return {
    title: `${cat.name} — Blog | Top College Planning`,
    description: `Browse all ${cat.name} articles from Top College Planning — expert guides for students applying to top universities.`,
  }
}

export default function CategoryPage({ params }: Props) {
  const cat = categories.find(c => c.slug === params.slug)
  if (!cat) notFound()

  const filtered = posts.filter(p =>
    p.categories.some((c: string) => c.toLowerCase() === cat.name.toLowerCase())
  )

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-3">Blog & Resources</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{cat.name}</h1>
          <p className="text-gray-300 text-lg">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} in this category
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">📭</p>
                <p className="text-gray-400 text-lg font-medium">No articles in this category yet.</p>
                <Link href="/blog" className="mt-4 inline-block text-brand-orange font-bold text-sm uppercase tracking-wide hover:underline">
                  ← Back to all articles
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            {/* All categories */}
            <div className="bg-gray-50 p-6 mb-8">
              <h3 className="font-bold text-navy text-lg mb-5 border-b-2 border-brand-orange pb-2">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-700 hover:text-brand-orange transition-colors font-medium flex items-center justify-between"
                  >
                    <span>All Articles</span>
                    <span className="text-xs bg-navy text-white rounded-full px-2 py-0.5 font-bold">{posts.length}</span>
                  </Link>
                </li>
                {categories.map(c => (
                  <li key={c.id}>
                    <Link
                      href={`/blog/category/${c.slug}`}
                      className={`flex items-center justify-between transition-colors font-medium ${
                        c.slug === params.slug
                          ? 'text-brand-orange font-bold'
                          : 'text-gray-700 hover:text-brand-orange'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-xs bg-navy text-white rounded-full px-2 py-0.5 font-bold">{c.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-navy text-white p-6">
              <h3 className="font-bold text-xl mb-3">Get Insider Tips</h3>
              <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                Join thousands of students getting weekly admission tips from our expert alumni advisors.
              </p>
              <Link href="/shop" className="bg-brand-orange text-white font-black px-6 py-3 uppercase tracking-wide hover:bg-orange-600 transition-colors block text-center text-sm">
                JOIN NOW — $79/yr
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
