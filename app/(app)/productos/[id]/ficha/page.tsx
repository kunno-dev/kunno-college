import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/data/products'
import { QuickSheet } from '@/components/kc/quick-sheet'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!getProduct(id)) notFound()
  return <QuickSheet id={id} />
}
