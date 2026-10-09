import { notFound } from 'next/navigation'
import { CERTIFICATIONS } from '@/lib/data/skills'
import { CertificateView } from '@/components/kc/certificate-view'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!CERTIFICATIONS.some((c) => c.id === id)) notFound()
  return <CertificateView id={id} />
}
