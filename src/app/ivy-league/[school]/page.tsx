import { ivyLeagueSchools, getSchoolBySlug } from '@/data/ivy-league-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import IvySchoolContent from './IvySchoolContent'

interface Props {
  params: { school: string }
}

export async function generateStaticParams() {
  return ivyLeagueSchools.map(s => ({ school: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = getSchoolBySlug(params.school)
  if (!school) return {}
  return {
    title: `${school.name} | Ivy League Profile | Top College Planning`,
    description: school.description,
  }
}

export default function IvySchoolPage({ params }: Props) {
  const school = getSchoolBySlug(params.school)
  if (!school) notFound()
  return <IvySchoolContent school={school} />
}
