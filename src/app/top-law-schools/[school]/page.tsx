import { lawSchools, getLawSchoolBySlug } from '@/data/law-schools-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import LawSchoolContent from './LawSchoolContent'

interface Props {
  params: { school: string }
}

export async function generateStaticParams() {
  return lawSchools.map(s => ({ school: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = getLawSchoolBySlug(params.school)
  if (!school) return {}
  return {
    title: `${school.name} | Law School Profile | Top College Planning`,
    description: school.description,
  }
}

export default function LawSchoolPage({ params }: Props) {
  const school = getLawSchoolBySlug(params.school)
  if (!school) notFound()
  return <LawSchoolContent school={school} />
}
