'use client'

import { useState } from 'react'
import { Check, Flame, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { getMember } from '@/lib/data/team'
import { PRODUCTS } from '@/lib/data/products'
import { SkillBars } from './blocks'
import { AssignDialog } from './assign-dialog'
import { Avatar, BackLink, Card, ProgressBar, SectionTitle, Stat, btn } from './ui'

export function MemberView({ id }: { id: string }) {
  const s = useAppState()
  const m = getMember(id)!
  const [open, setOpen] = useState(false)
  const assigned = s.assignments.filter((a) => a.memberIds.includes(id))
  const rt = m.recommendedTrack
  const kind = rt.kind === 'producto' ? 'producto' : 'ruta'

  return (
    <div>
      <BackLink href="/equipo" label="Equipo" />
      <header className="flex flex-col gap-5 md:flex-row md:items-center">
        <Avatar initials={m.initials} className="size-16 text-lg" />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{m.name}</h1>
          <p className="text-muted-foreground">
            {m.role} · Nivel {m.level} · <span className="tabular">{m.xp.toLocaleString('es-MX')} XP</span>
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-sm text-ink">
          <Flame className="size-4 text-brand" /> {m.streak} días · Activo: {m.lastActive}
        </span>
      </header>

      <Card className="mt-6 grid grid-cols-3 gap-6 p-6">
        <Stat label="Cursos" value={m.courses} />
        <Stat label="Horas" value={m.hours} />
        <Stat label="Certificaciones" value={m.certifications} />
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <SectionTitle eyebrow="Skill Score" title="Skills" />
          <SkillBars skills={m.skills} ids={['ventas', 'prospeccion', 'cierre', 'realestate', 'inversion', 'kunno']} />
        </Card>
        <Card className="p-6">
          <SectionTitle title="Product Readiness" />
          <ul className="flex flex-col gap-4">
            {PRODUCTS.map((p) => {
              const r = m.readiness[p.id] ?? 0
              return (
                <li key={p.id}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-ink">{p.name}</span>
                    {r >= 100 ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-brand"><Check className="size-3.5" /> Certificado</span>
                    ) : (
                      <span className="font-display font-semibold tabular">{r === 0 ? '—' : `${r}%`}</span>
                    )}
                  </div>
                  <ProgressBar value={r} tone={r >= 100 ? 'brand' : 'mint'} label={`${p.name} ${r}%`} />
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <section className="mt-6 flex flex-col gap-4 rounded-3xl bg-ink p-6 text-white md:flex-row md:items-center md:p-8">
        <Lightbulb className="size-6 shrink-0 text-mint" />
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mint">Recomendación</p>
          <p className="mt-2 font-display text-lg font-semibold text-balance">{m.insight}</p>
        </div>
        <button onClick={() => setOpen(true)} className={cn(btn.brand, 'h-12 uppercase tracking-wide')}>
          Asignar {rt.label.toLowerCase().startsWith('ruta') ? rt.label.replace('Ruta', 'ruta') : rt.label}
        </button>
      </section>

      {assigned.length > 0 && (
        <Card className="mt-6 p-6">
          <SectionTitle title="Capacitaciones asignadas" />
          <ul className="divide-y divide-border">
            {assigned.map((a) => (
              <li key={a.id} className="flex justify-between py-3 text-sm">
                <span className="font-medium text-ink">{a.targetLabel}</span>
                <span className="text-muted-foreground">Vence {a.due}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <AssignDialog open={open} onClose={() => setOpen(false)} preset={{ kind, targetId: rt.targetId, memberIds: [id] }} />
    </div>
  )
}
