import { m7Schools, getM7SchoolBySlug } from '@/data/m7-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import M7SchoolContent from './M7SchoolContent'

interface Props {
  params: { school: string }
}

export async function generateStaticParams() {
  return m7Schools.map(s => ({ school: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = getM7SchoolBySlug(params.school)
  if (!school) return {}
  return {
    title: `${school.name} MBA | M7 Business School Profile | Top College Planning`,
    description: school.description,
  }
}

export default function M7SchoolPage({ params }: Props) {
  const school = getM7SchoolBySlug(params.school)
  if (!school) notFound()
  return <M7SchoolContent school={school} />
}
