'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Bell, Building2, Clock, GraduationCap, Phone, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { productReadiness } from '@/lib/engine'
import { Card, PageHeader, Pill, btn } from './ui'

const LEADS = [
  { name: 'Ricardo Peña', product: 'Pitahaya Investments', stage: 'Nuevo', days: 6 },
  { name: 'Lucía Fernández', product: 'Hacienda Wuayakin', stage: 'Contactado', days: 4 },
  { name: 'Grupo Medina', product: 'Pitahaya Investments', stage: 'Visita agendada', days: 1 },
  { name: 'Óscar Villalobos', product: 'Las Villas Telchac', stage: 'Nuevo', days: 9 },
  { name: 'Paola Ruiz', product: 'Hacienda Wuayakin', stage: 'Negociación', days: 2 },
]

export function KunnoFlow() {
  const s = useAppState()
  const [hidden, setHidden] = useState<string[]>([])
  const pitahaya = productReadiness(s, 'pitahaya')
  const stale = LEADS.filter((l) => l.days >= 4).length
  const dismiss = (id: string) => setHidden((h) => [...h, id])

  return (
    <div>
      <PageHeader
        eyebrow="Simulación · kunno.erp"
        title="Learning in the flow of work"
        subtitle="Así se ve Kunno College dentro de tu día a día en Kunno."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
            <p className="font-display text-sm font-semibold text-ink">Pipeline · Mis prospectos</p>
            <Pill tone="outline">kunno.erp</Pill>
          </div>
          <ul className="divide-y divide-border">
            {LEADS.map((l) => (
              <li key={l.name} className="flex items-center gap-4 px-5 py-3.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-muted">
                  <Phone className="size-4 text-muted-foreground" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">{l.name}</span>
                  <span className="text-xs text-muted-foreground">{l.product}</span>
                </span>
                <span className="hidden text-xs text-muted-foreground sm:block">{l.stage}</span>
                <span className={cn('text-xs font-semibold tabular', l.days >= 4 ? 'text-destructive' : 'text-muted-foreground')}>
                  {l.days} d sin seguimiento
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-4">
          {!hidden.includes('follow') && (
            <Nudge
              onDismiss={() => dismiss('follow')}
              icon={Clock}
              title={`¿${stale} prospectos sin seguimiento?`}
              body="Aprende una técnica para priorizarlos."
              meta="Seguimiento efectivo · 6 min"
              href="/curso/seguimiento-efectivo"
              cta="Aprender ahora"
            />
          )}
          {!hidden.includes('pitahaya') && (
            <Nudge
              onDismiss={() => dismiss('pitahaya')}
              icon={Building2}
              title="Nueva oportunidad asignada: Pitahaya Investments."
              body={`Tu Product Readiness es ${pitahaya}%.`}
              meta={pitahaya >= 100 ? 'Certificado · repasa la ficha' : 'Product Training'}
              href={pitahaya >= 100 ? '/productos/pitahaya/ficha' : '/productos/pitahaya'}
              cta="Repasar producto"
            />
          )}
          {!hidden.includes('visit') && (
            <Nudge
              onDismiss={() => dismiss('visit')}
              icon={Bell}
              title="Visita con Grupo Medina mañana."
              body="Repasa las objeciones frecuentes antes de tu cita."
              meta="Ficha rápida · 5 min"
              href="/productos/pitahaya/ficha"
              cta="Repasar en 5 min"
            />
          )}
          {hidden.length === 3 && (
            <Card className="p-5 text-center text-sm text-muted-foreground">
              Sin sugerencias pendientes.{' '}
              <button onClick={() => setHidden([])} className="font-medium text-brand">Restablecer</button>
            </Card>
          )}
        </div>
      </div>

      <p className="mt-10 text-center font-display text-lg font-semibold text-ink text-balance">
        Kunno te ayuda a hacer tu trabajo. Kunno College te ayuda a hacerlo mejor.
      </p>
    </div>
  )
}

function Nudge({
  icon: Icon,
  title,
  body,
  meta,
  href,
  cta,
  onDismiss,
}: {
  icon: typeof Clock
  title: string
  body: string
  meta: string
  href: string
  cta: string
  onDismiss: () => void
}) {
  return (
    <div className="relative rounded-2xl border border-mint/60 bg-card p-5 animate-in fade-in slide-in-from-right-2 duration-300">
      <button onClick={onDismiss} aria-label="Descartar" className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted">
        <X className="size-4" />
      </button>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
        <GraduationCap className="size-3.5" /> Kunno College
      </p>
      <p className="mt-2 pr-6 font-display font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-ink">
        <Icon className="size-3.5 text-brand" /> {meta}
      </p>
      <Link href={href} className={cn(btn.primary, btn.sm, 'mt-4 w-full')}>
        {cta} <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}
