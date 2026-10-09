'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, FileText, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { productReadiness, readinessStatus } from '@/lib/engine'
import { PRODUCTS } from '@/lib/data/products'
import { Card, PageHeader, Pill, ProgressBar, ProgressRing, btn } from './ui'

export function ProductsView() {
  const s = useAppState()
  const rows = PRODUCTS.map((p) => ({ p, r: productReadiness(s, p.id) }))
  const avg = Math.round(rows.reduce((a, x) => a + x.r, 0) / rows.length)
  const certified = rows.filter((x) => x.r >= 100).length

  return (
    <div>
      <PageHeader eyebrow="Academia 02 · Productos" title="Productos" subtitle="Conoce lo que vendes. Domina cómo venderlo." />

      <Card className="mb-8 grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
        <div className="flex items-center gap-5">
          <ProgressRing value={avg} size={96} stroke={8}>
            <span className="font-display text-xl font-semibold tabular">{avg}%</span>
          </ProgressRing>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Product Readiness</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">
              {certified} de {rows.length} certificados
            </p>
            <p className="text-sm text-muted-foreground">¿Estás listo para vender cada desarrollo?</p>
          </div>
        </div>
        <ul className="grid gap-3 md:border-l md:border-border md:pl-8">
          {rows.map(({ p, r }) => (
            <li key={p.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 text-sm">
              <span className="font-medium text-ink">{p.name}</span>
              <span className={cn('font-display font-semibold tabular', r >= 100 ? 'text-brand' : 'text-ink')}>
                {r >= 100 ? (
                  <span className="flex items-center gap-1">
                    100% <Check className="size-4" />
                  </span>
                ) : (
                  `${r}%`
                )}
              </span>
              <ProgressBar value={r} className="col-span-2" tone={r >= 100 ? 'brand' : 'mint'} label={`${p.name} ${r}%`} />
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {rows.map(({ p, r }) => (
          <article key={p.id} className="group overflow-hidden rounded-3xl border border-border bg-card">
            <Link href={`/productos/${p.id}`} className="relative block aspect-[16/9] overflow-hidden">
              <Image src={p.image || '/placeholder.svg'} alt={p.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              <div className="absolute left-4 top-4 flex gap-2">
                <Pill tone={p.status === 'En comercialización' ? 'ink' : 'warn'}>{p.status}</Pill>
                {r >= 100 && (
                  <Pill tone="mint">
                    <Check className="size-3" /> Certificado
                  </Pill>
                )}
              </div>
            </Link>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-semibold text-ink">{p.name}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {p.location}
                  </p>
                </div>
                <ProgressRing value={r} size={52} stroke={5}>
                  <span className="text-[11px] font-semibold tabular">{r}%</span>
                </ProgressRing>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.tagline}</p>
              <p className="mt-3 text-xs font-medium text-ink">
                Product Training · {readinessStatus(r)}
              </p>
              <div className="mt-5 flex gap-2">
                <Link href={`/productos/${p.id}`} className={cn(btn.primary, btn.sm, 'flex-1')}>
                  {r >= 100 ? 'Ver academia' : r > 0 ? 'Continuar training' : 'Comenzar training'} <ArrowRight className="size-3.5" />
                </Link>
                <Link href={`/productos/${p.id}/ficha`} className={cn(btn.outline, btn.sm)}>
                  <FileText className="size-3.5" /> Ficha rápida
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Toda la información comercial de los desarrollos es contenido DEMO para el MVP.
      </p>
    </div>
  )
}
