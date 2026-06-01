import { midwestSchools, getMidwestSchoolBySlug } from '@/data/midwest-schools-data'
import { notFound } from 'next/navigation'
import MidwestSchoolContent from './MidwestSchoolContent'

interface Props {
  params: { school: string }
}

export async function generateStaticParams() {
  return midwestSchools.map(s => ({ school: s.slug }))
}

export default function MidwestSchoolPage({ params }: Props) {
  const school = getMidwestSchoolBySlug(params.school)
  if (!school) notFound()
  return <MidwestSchoolContent school={school} />
}
