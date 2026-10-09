import { notFound } from 'next/navigation'
import { getCourse } from '@/lib/data/courses'
import { CourseDetail } from '@/components/kc/course-detail'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!getCourse(id)) notFound()
  return <CourseDetail id={id} />
}
