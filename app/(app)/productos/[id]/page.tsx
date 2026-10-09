import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/data/products'
import { ProductAcademy } from '@/components/kc/product-academy'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!getProduct(id)) notFound()
  return <ProductAcademy id={id} />
}
