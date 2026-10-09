import { notFound } from 'next/navigation'
import { getMember } from '@/lib/data/team'
import { MemberView } from '@/components/kc/member-view'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!getMember(id)) notFound()
  return <MemberView id={id} />
}
