import { californiasSchools, getCalSchoolBySlug } from '@/data/californias-best-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import CalSchoolContent from './CalSchoolContent'

interface Props {
  params: { school: string }
}

export async function generateStaticParams() {
  return californiasSchools.map(s => ({ school: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = getCalSchoolBySlug(params.school)
  if (!school) return {}
  return {
    title: `${school.name} | California School Profile | Top College Planning`,
    description: school.description.slice(0, 160),
  }
}

export default function CalSchoolPage({ params }: Props) {
  const school = getCalSchoolBySlug(params.school)
  if (!school) notFound()
  return <CalSchoolContent school={school} />
}
