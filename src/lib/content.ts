import contentData from '@/data/content.json'

export interface Post {
  id: number
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  categories: string[]
  featured_media: number
  hero_image?: string
}

export interface Alumni {
  id: number
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  photo: string
  bio: string
  university: string
  degree: string
  category?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  count: number
}

export const posts: Post[] = contentData.posts as Post[]
export const alumni: Alumni[] = contentData.alumni as Alumni[]
export const categories: Category[] = contentData.categories as Category[]
export const mediaMap: Record<number, string> = contentData.media_map as Record<number, string>

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug)
}

export function getPostsByCategory(categoryName: string): Post[] {
  return posts.filter(p => p.categories.includes(categoryName))
}

export function getAlumniBySlug(slug: string): Alumni | undefined {
  return alumni.find(a => a.slug === slug)
}

export function getFeaturedImage(mediaId: number): string {
  return mediaMap[mediaId] || '/images/students-campus-background.jpg'
}

/** Returns the best available image for a blog post: local hero > media map > default */
export function getPostImage(post: Post): string {
  if (post.hero_image) return post.hero_image
  return getFeaturedImage(post.featured_media)
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
