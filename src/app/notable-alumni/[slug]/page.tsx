import { notableAlumni, getAlumnusBySlug } from '@/data/notable-alumni-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import NotableAlumnusContent from './NotableAlumnusContent'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return notableAlumni.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const alumnus = getAlumnusBySlug(params.slug)
  if (!alumnus) return {}
  return {
    title: `${alumnus.name} — ${alumnus.knownFor} | Top College Planning`,
    description: alumnus.bio.slice(0, 160),
  }
}

export default function NotableAlumnusPage({ params }: Props) {
  const alumnus = getAlumnusBySlug(params.slug)
  if (!alumnus) notFound()
  return <NotableAlumnusContent alumnus={alumnus} />
}
