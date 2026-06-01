import { getAlumniBySlug, alumni } from '@/lib/content'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AlumnusDetailContent from './AlumnusDetailContent'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return alumni.map(al => ({ slug: al.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const alumnus = getAlumniBySlug(params.slug)
  if (!alumnus) return {}
  return {
    title: `${alumnus.title} | Top College Planning Alumni`,
    description: alumnus.bio || alumnus.excerpt,
  }
}

export default function AlumnusPage({ params }: Props) {
  const alumnus = getAlumniBySlug(params.slug)
  if (!alumnus) notFound()

  const currentIndex = alumni.findIndex(al => al.slug === params.slug)
  const prevAlumnus = currentIndex > 0 ? alumni[currentIndex - 1] : null
  const nextAlumnus = currentIndex < alumni.length - 1 ? alumni[currentIndex + 1] : null

  return (
    <AlumnusDetailContent
      alumnus={alumnus}
      prevAlumnus={prevAlumnus}
      nextAlumnus={nextAlumnus}
    />
  )
}
