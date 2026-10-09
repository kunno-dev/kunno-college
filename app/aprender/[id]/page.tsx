import { notFound } from 'next/navigation'
import { getCourse } from '@/lib/data/courses'
import { Player } from '@/components/kc/player'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ l?: string; quiz?: string }>
}) {
  const { id } = await params
  const { l, quiz } = await searchParams
  const course = getCourse(id)
  if (!course) notFound()
  const start = Math.min(Math.max(0, Number(l) || 0), course.lessons.length - 1)
  return <Player key={`${id}-${l ?? ''}-${quiz ?? ''}`} id={id} startLesson={start} startQuiz={quiz === '1'} />
}
