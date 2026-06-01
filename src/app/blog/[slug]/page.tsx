import { getPostBySlug, posts, getPostImage } from '@/lib/content'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BlogPostContent from './BlogPostContent'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const imageUrl = getPostImage(post) || null
  const related = posts
    .filter(p => p.id !== post.id && p.categories.some((c: string) => post.categories.includes(c)))
    .slice(0, 3)

  return <BlogPostContent post={post} imageUrl={imageUrl} related={related} />
}
