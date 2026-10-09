'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AlertTriangle, ArrowRight, Check, ChevronRight, Rocket, Sparkles } from 'lucide-react'
import type { SkillId } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { PRODUCTS } from '@/lib/data/products'
import { TEAM, TEAM_SUMMARY } from '@/lib/data/team'
import { skillLabel } from '@/lib/data/skills'
import { SkillBars } from './blocks'
import { AssignDialog, type AssignPreset } from './assign-dialog'
import { Avatar, Card, PageHeader, SectionTitle, Stat, btn } from './ui'

const TEAM_SKILLS: SkillId[] = ['ventas', 'prospeccion', 'cierre', 'kunno', 'realestate', 'inversion']

function ReadinessCell({ v, assigned }: { v: number; assigned: boolean }) {
  if (v >= 100)
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-brand text-white" aria-label="Certificado">
        <Check className="size-4" />
      </span>
    )
  if (v === 0)
    return assigned ? (
      <span className="text-[11px] font-semibold text-brand">Asignado</span>
    ) : (
      <span className="text-muted-foreground" aria-label="Sin iniciar">—</span>
    )
  return (
    <span className="flex flex-col items-center">
      <span className={cn('font-display text-sm font-semibold tabular', v < 50 ? 'text-destructive' : 'text-ink')}>{v}%</span>
      {assigned && <span className="text-[10px] font-semibold text-brand">Asignado</span>}
    </span>
  )
}

export function TeamView() {
  const s = useAppState()
  const [preset, setPreset] = useState<AssignPreset | null>(null)

  const weakest = TEAM_SKILLS.reduce((a, b) => (TEAM_SUMMARY.skills[a] <= TEAM_SUMMARY.skills[b] ? a : b))
  const pitahayaPending = TEAM.filter((m) => m.readiness.pitahaya < 100)
  const launch = PRODUCTS.find((p) => p.status === 'Próximo lanzamiento')!
  const isAssigned = (memberId: string, productId: string) =>
    s.assignments.some((a) => a.kind === 'producto' && a.targetId === productId && a.memberIds.includes(memberId))
  const invPending = TEAM.filter((m) => m.skills.inversion < 50).map((m) => m.id)

  return (
    <div>
      <PageHeader
        eyebrow={TEAM_SUMMARY.name}
        title="Desarrollo del equipo"
        subtitle="¿Tu equipo está realmente preparado para vender?"
        action={
          <button onClick={() => setPreset({ kind: 'producto', targetId: 'pitahaya', memberIds: [] })} className={cn(btn.primary)}>
            Asignar capacitación
          </button>
        }
      />

      <Card className="grid grid-cols-2 gap-6 p-6 md:grid-cols-5 md:p-8">
        <Stat label="Personas" value={TEAM_SUMMARY.people} />
        <Stat label="Progreso promedio" value={`${TEAM_SUMMARY.avgProgress}%`} />
        <Stat label="Cursos completados" value={TEAM_SUMMARY.coursesCompleted} />
        <Stat label="Certificaciones" value={TEAM_SUMMARY.certifications} />
        <Stat label="Skill Score promedio" value={TEAM_SUMMARY.avgSkill} />
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <SectionTitle eyebrow="Skill gaps" title="Skills del equipo" />
          <SkillBars skills={TEAM_SUMMARY.skills} ids={TEAM_SKILLS} />
        </Card>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="flex flex-1 flex-col rounded-3xl bg-ink p-6 text-white">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-mint">
              <Sparkles className="size-3.5" /> Oportunidad de desarrollo
            </p>
            <p className="mt-3 font-display text-xl font-semibold text-balance">
              {skillLabel(weakest)} es actualmente la habilidad con mayor oportunidad de desarrollo.
            </p>
            <p className="mt-2 text-sm text-white/60">
              Promedio del equipo: {TEAM_SUMMARY.skills[weakest]} · {invPending.length} personas por debajo de 50.
            </p>
            <button
              onClick={() => setPreset({ kind: 'ruta', targetId: 'inversion', memberIds: invPending })}
              className={cn(btn.brand, 'mt-auto w-full uppercase tracking-wide')}
            >
              Asignar ruta
            </button>
          </section>
          <Card className="p-5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
              <Rocket className="size-3.5" /> Próximo lanzamiento
            </p>
            <p className="mt-2 text-sm text-ink">
              Tu equipo comenzará a comercializar <strong>{launch.name}</strong>. Prepara a tus asesores antes del lanzamiento.
            </p>
            <button
              onClick={() => setPreset({ kind: 'producto', targetId: launch.id, memberIds: TEAM.filter((m) => m.readiness[launch.id] < 100).map((m) => m.id) })}
              className={cn(btn.outline, btn.sm, 'mt-4 w-full')}
            >
              Preparar equipo
            </button>
          </Card>
        </div>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="p-6 pb-4">
          <SectionTitle eyebrow="Métrica clave" title="Product Readiness del equipo" />
          <div className="flex flex-col gap-3 rounded-2xl bg-sage/70 p-4 sm:flex-row sm:items-center">
            <AlertTriangle className="size-5 shrink-0 text-brand" />
            <p className="flex-1 text-sm text-ink">
              <strong>{pitahayaPending.length} asesores</strong> necesitan completar la capacitación de Pitahaya.
            </p>
            <button
              onClick={() => setPreset({ kind: 'producto', targetId: 'pitahaya', memberIds: pitahayaPending.map((m) => m.id) })}
              className={cn(btn.primary, btn.sm)}
            >
              Asignar capacitación
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-y border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-6 py-3 text-left font-semibold">Colaborador</th>
                {PRODUCTS.map((p) => (
                  <th key={p.id} scope="col" className="px-3 py-3 text-center font-semibold">{p.short}</th>
                ))}
                <th scope="col" className="px-3 py-3"><span className="sr-only">Ver perfil</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TEAM.map((m) => (
                <tr key={m.id} className="transition hover:bg-muted/30">
                  <th scope="row" className="px-6 py-3 text-left font-normal">
                    <Link href={`/equipo/${m.id}`} className="flex items-center gap-3">
                      <Avatar initials={m.initials} />
                      <span>
                        <span className="block font-medium text-ink">{m.name}</span>
                        <span className="text-xs text-muted-foreground">{m.role} · Nivel {m.level}</span>
                      </span>
                    </Link>
                  </th>
                  {PRODUCTS.map((p) => (
                    <td key={p.id} className="px-3 py-3 text-center">
                      <ReadinessCell v={m.readiness[p.id] ?? 0} assigned={isAssigned(m.id, p.id)} />
                    </td>
                  ))}
                  <td className="px-3 py-3 text-right">
                    <Link href={`/equipo/${m.id}`} aria-label={`Ver perfil de ${m.name}`} className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted">
                      <ChevronRight className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {s.assignments.length > 0 && (
        <Card className="mt-6 p-6">
          <SectionTitle title="Capacitaciones asignadas" />
          <ul className="divide-y divide-border">
            {s.assignments.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="font-medium text-ink">{a.targetLabel}</span>
                <span className="text-muted-foreground">
                  {a.memberIds.length} personas · vence {a.due}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Link href="/equipo/mariana-lopez" className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm transition hover:border-mint">
        <span className="text-ink">Explora el perfil de un colaborador para detectar oportunidades individuales</span>
        <ArrowRight className="size-4 text-brand" />
      </Link>

      <AssignDialog open={!!preset} onClose={() => setPreset(null)} preset={preset ?? { kind: 'producto', targetId: 'pitahaya', memberIds: [] }} />
    </div>
  )
}
