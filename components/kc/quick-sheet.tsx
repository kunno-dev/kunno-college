'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Clock, MapPin, MessageCircleQuestion, ShieldAlert, Sparkles, Tag, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { productReadiness } from '@/lib/engine'
import { getProduct } from '@/lib/data/products'
import { productCourseId } from '@/lib/data/courses'
import { BackLink, Card, Pill, btn } from './ui'

export function QuickSheet({ id }: { id: string }) {
  const s = useAppState()
  const p = getProduct(id)!
  const r = productReadiness(s, id)

  return (
    <div className="mx-auto max-w-4xl">
      <BackLink href={`/productos/${id}`} label={p.name} />
      <header className="flex flex-col gap-5 md:flex-row md:items-center">
        <Image src={p.image || '/placeholder.svg'} alt={p.name} width={160} height={120} className="h-28 w-full rounded-2xl object-cover md:w-40" />
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <Pill tone="ink">Ficha rápida</Pill>
            <Pill tone="warn">Datos DEMO</Pill>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{p.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {p.location}
          </p>
        </div>
        <Link href={`/aprender/${productCourseId(id)}?l=10`} className={cn(btn.brand, 'h-12 uppercase tracking-wide')}>
          <Clock className="size-4" /> Repasar en 5 min
        </Link>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Fact icon={Sparkles} label="¿Qué es?" value={p.kind} />
        <Fact icon={Tag} label="Precio desde" value={p.priceFrom} big />
        <Fact icon={Users} label="¿Para quién es?" value={p.forWhom} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <Label>Tipologías</Label>
          <ul className="flex flex-col divide-y divide-border">
            {p.typologies.map((t) => (
              <li key={t.name} className="flex justify-between gap-3 py-2.5 text-sm">
                <span className="font-medium text-ink">{t.name}</span>
                <span className="text-right text-muted-foreground">{t.detail}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <Label>Esquema de pago</Label>
          <ul className="flex flex-col gap-2 text-sm text-ink">
            {p.paymentScheme.map((x) => <li key={x}>{x}</li>)}
          </ul>
          <Label className="mt-5">Amenidades</Label>
          <div className="flex flex-wrap gap-1.5">
            {p.amenities.map((a) => (
              <span key={a} className="rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-ink">{a}</span>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Diferenciadores</Label>
            <ul className="flex flex-col gap-2 text-sm text-ink">
              {p.differentiators.map((d) => <li key={d} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />{d}</li>)}
            </ul>
          </div>
          <div>
            <Label>Perfil del comprador / inversionista</Label>
            <p className="text-sm text-ink">{p.buyerProfile}</p>
            <p className="mt-3 text-xs text-muted-foreground">{p.investment}</p>
          </div>
        </div>
      </Card>

      <div className="mt-4 rounded-3xl bg-ink p-6 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mint">Argumentos comerciales</p>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {p.arguments.map((a, i) => (
            <li key={a} className="rounded-2xl bg-white/5 p-4">
              <span className="font-display text-xs font-semibold text-mint tabular">0{i + 1}</span>
              <p className="mt-1 text-sm">{a}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Accordion icon={MessageCircleQuestion} title="Preguntas frecuentes" items={p.faqs} />
        <Accordion icon={ShieldAlert} title="Objeciones frecuentes" items={p.objections} />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center md:flex-row md:text-left">
        <div className="flex-1">
          <p className="font-display font-semibold text-ink">Tu Product Readiness: {r}%</p>
          <p className="text-sm text-muted-foreground">
            {r >= 100 ? 'Estás certificado para comercializar este desarrollo.' : 'Completa el Product Training para certificarte.'}
          </p>
        </div>
        <Link href={`/productos/${id}`} className={cn(btn.primary)}>
          {r >= 100 ? 'Ver academia' : 'Continuar training'}
        </Link>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground', className)}>{children}</p>
}

function Fact({ icon: Icon, label, value, big }: { icon: typeof Tag; label: string; value: string; big?: boolean }) {
  return (
    <Card className="p-5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="size-3.5 text-brand" /> {label}
      </p>
      <p className={cn('mt-2 text-ink', big ? 'font-display text-2xl font-semibold tabular' : 'text-sm')}>{value}</p>
    </Card>
  )
}

function Accordion({ icon: Icon, title, items }: { icon: typeof Tag; title: string; items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Card className="p-5">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="size-3.5 text-brand" /> {title}
      </p>
      <ul className="divide-y divide-border">
        {items.map((it, i) => (
          <li key={it.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-medium text-ink"
            >
              {it.q}
              <ChevronDown className={cn('size-4 shrink-0 text-muted-foreground transition', open === i && 'rotate-180')} />
            </button>
            {open === i && <p className="pb-3 text-sm text-muted-foreground">{it.a}</p>}
          </li>
        ))}
      </ul>
    </Card>
  )
}
