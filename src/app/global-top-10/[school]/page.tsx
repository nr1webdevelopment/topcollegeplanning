import { globalUniversities, honorableMentions, getGlobalUniversityBySlug } from '@/data/global-universities-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import GlobalSchoolContent from './GlobalSchoolContent'

interface Props {
  params: { school: string }
}

export async function generateStaticParams() {
  return [...globalUniversities, ...honorableMentions].map(u => ({ school: u.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = getGlobalUniversityBySlug(params.school)
  if (!school) return {}
  return {
    title: `${school.name} | Global University Profile | Top College Planning`,
    description: school.description.slice(0, 160),
  }
}

export default function GlobalUniversityPage({ params }: Props) {
  const school = getGlobalUniversityBySlug(params.school)
  if (!school) notFound()
  return <GlobalSchoolContent school={school} />
}
