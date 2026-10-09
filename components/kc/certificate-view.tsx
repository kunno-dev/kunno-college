'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Award, Check, Link2, Printer, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { certProgress, certScore } from '@/lib/engine'
import { CERTIFICATIONS } from '@/lib/data/skills'
import { getCourse, productCourseId } from '@/lib/data/courses'
import { getProduct } from '@/lib/data/products'
import { KunnoMark } from './blocks'
import { BackLink, Card, ProgressBar, btn } from './ui'

export function CertificateView({ id }: { id: string }) {
  const s = useAppState()
  const [copied, setCopied] = useState(false)
  const cert = CERTIFICATIONS.find((c) => c.id === id)!
  const pct = certProgress(s, id)
  const score = certScore(s, id)
  const product = cert.productId ? getProduct(cert.productId) : undefined
  const courseIds = product ? [productCourseId(product.id)] : (cert.courseIds ?? [])
  const done = pct >= 100
  const date = s.courses[courseIds[courseIds.length - 1]]?.completedAt ?? ''
  const folio = `KC-${id.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6)}-${(s.user.name.length * 1373) % 9000 + 1000}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${location.origin}/certificado/${id}`)
    } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!done) {
    return (
      <div className="mx-auto max-w-xl">
        <BackLink href="/progreso" label="Mi progreso" />
        <Card className="p-8 text-center">
          <Award className="mx-auto size-10 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">{cert.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{cert.description}</p>
          <ProgressBar value={pct} className="mt-6" label="Progreso" />
          <p className="mt-2 text-sm font-semibold text-ink tabular">{pct}% completado</p>
          <ul className="mt-6 flex flex-col gap-2 text-left">
            {courseIds.map((cid) => {
              const c = getCourse(cid)!
              const ok = s.courses[cid]?.completed
              return (
                <li key={cid}>
                  <Link href={product ? `/productos/${product.id}` : `/curso/${cid}`} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm hover:border-mint">
                    <span className={cn('flex size-5 items-center justify-center rounded-full', ok ? 'bg-brand text-white' : 'border border-border')}>
                      {ok && <Check className="size-3" />}
                    </span>
                    <span className="flex-1 font-medium text-ink">{c.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={product ? `/productos/${product.id}` : '/progreso'} label={product ? product.name : 'Mi progreso'} />
      <article className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-14 print:border-0">
        <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full border-[28px] border-sage" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <KunnoMark />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Certificado digital · DEMO</span>
          </div>
          <p className="mt-14 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            {product ? 'Product Certification' : 'Certificación'}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink text-balance md:text-5xl">{cert.name}</h1>
          <p className="mt-8 text-sm text-muted-foreground">Otorgado a</p>
          <p className="font-display text-2xl font-semibold text-ink">{s.user.name}</p>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">{cert.description}</p>

          {product && (
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {['Producto', 'Ubicación', 'Esquema comercial', 'Inversión', 'Objeciones'].map((a) => (
                <span key={a} className="flex items-center gap-1.5 text-sm text-ink">
                  <Check className="size-4 text-brand" /> {a}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 md:grid-cols-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Puntaje</p>
              <p className="font-display text-xl font-semibold text-ink tabular">{score} / 100</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Fecha</p>
              <p className="font-display text-xl font-semibold text-ink tabular">{date}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Folio</p>
              <p className="font-display text-xl font-semibold text-ink tabular">{folio}</p>
            </div>
          </div>

          {product && (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-wider text-mint">
              <ShieldCheck className="size-4" /> {product.short} Certified · Certificado para comercializar
            </div>
          )}
        </div>
      </article>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row print:hidden">
        <button onClick={() => window.print()} className={cn(btn.primary, 'flex-1')}>
          <Printer className="size-4" /> Descargar / imprimir
        </button>
        <button onClick={copy} className={cn(btn.outline, 'flex-1')} aria-live="polite">
          <Link2 className="size-4" /> {copied ? 'Enlace copiado' : 'Copiar enlace'}
        </button>
        <Link href="/inicio" className={cn(btn.outline, 'flex-1')}>Ver siguiente recomendación</Link>
      </div>
    </div>
  )
}
