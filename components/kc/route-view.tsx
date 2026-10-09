'use client'

import Link from 'next/link'
import { Award, Check, ChevronRight, Clock, Lock, Play, Zap } from 'lucide-react'
import type { Role } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { routeStages } from '@/lib/engine'
import { ROLE_TRACKS } from '@/lib/data/courses'
import { ROLE_LABEL } from '@/lib/data/skills'
import { Card, PageHeader, ProgressBar, SectionTitle, btn } from './ui'

const ORDER: Role[] = ['asesor', 'gerente', 'subdirector', 'director']

export function RouteView() {
  const s = useAppState()
  const r = routeStages(s)
  const pct = Math.round((r.doneCount / r.stages.length) * 100)

  return (
    <div>
      <PageHeader eyebrow="Mi ruta" title={r.track.title} subtitle={r.track.objective} />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <Card className="p-6 md:p-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-display text-3xl font-semibold text-ink tabular">
                  {r.doneCount} de {r.total} etapas
                </p>
                <p className="text-sm text-muted-foreground">Siguiente milestone: {r.track.milestone}</p>
              </div>
              <div className="w-full md:w-48">
                <ProgressBar value={pct} label="Progreso de ruta" />
              </div>
            </div>

            <ol className="relative flex flex-col">
              {r.stages.map((st, i) => {
                const done = st.status === 'done'
                const current = st.status === 'current'
                return (
                  <li key={st.course.id} className="relative flex gap-4 pb-6">
                    <span
                      aria-hidden="true"
                      className={cn('absolute left-[17px] top-9 bottom-0 w-px', done ? 'bg-brand' : 'bg-border')}
                    />
                    <span
                      className={cn(
                        'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2',
                        done && 'border-brand bg-brand text-white',
                        current && 'border-brand bg-card text-brand ring-4 ring-sage',
                        st.status === 'locked' && 'border-border bg-card text-muted-foreground',
                      )}
                    >
                      {done ? <Check className="size-4" /> : current ? <span className="size-2.5 rounded-full bg-brand" /> : <span className="text-xs font-semibold tabular">{i + 1}</span>}
                    </span>
                    <Link
                      href={`/curso/${st.course.id}`}
                      className={cn(
                        'group flex flex-1 items-center gap-4 rounded-2xl border p-4 transition',
                        current ? 'border-mint bg-sage/60' : 'border-transparent hover:border-border hover:bg-muted/50',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className={cn('font-medium', st.status === 'locked' ? 'text-muted-foreground' : 'text-ink')}>{st.course.title}</p>
                        <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="size-3" /> {st.course.minutes} min</span>
                          <span className="flex items-center gap-1"><Zap className="size-3" /> +{st.course.xp} XP</span>
                          {done && <span className="font-semibold text-brand">Completado</span>}
                        </p>
                        {current && st.progress.pct > 0 && <ProgressBar value={st.progress.pct} className="mt-3 max-w-xs" label="Progreso" />}
                      </div>
                      {current ? (
                        <span className={cn(btn.brand, btn.sm)}>
                          <Play className="size-3.5 fill-current" /> {st.progress.pct > 0 ? 'Continuar' : 'Comenzar'}
                        </span>
                      ) : (
                        <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" />
                      )}
                    </Link>
                  </li>
                )
              })}
              <li className="flex gap-4">
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full',
                    r.milestoneUnlocked ? 'bg-ink text-mint' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {r.milestoneUnlocked ? <Award className="size-4" /> : <Lock className="size-4" />}
                </span>
                <div className={cn('flex-1 rounded-2xl p-4', r.milestoneUnlocked ? 'bg-ink text-white' : 'border border-dashed border-border')}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Milestone</p>
                  <p className={cn('font-display text-lg font-semibold', r.milestoneUnlocked ? 'text-white' : 'text-ink')}>{r.track.milestone}</p>
                  <p className={cn('text-xs', r.milestoneUnlocked ? 'text-white/60' : 'text-muted-foreground')}>
                    {r.milestoneUnlocked ? 'Desbloqueado. Tu certificación está lista.' : 'Completa todas las etapas para desbloquearlo.'}
                  </p>
                  {r.milestoneUnlocked && (
                    <Link href="/certificado/kunno-advisor" className={cn(btn.brand, btn.sm, 'mt-3')}>
                      Ver certificado
                    </Link>
                  )}
                </div>
              </li>
            </ol>
          </Card>
        </section>

        <aside className="flex flex-col gap-6">
          <Card className="p-6">
            <SectionTitle eyebrow="Academia · Mi rol" title="Progresión profesional" />
            <ol className="flex flex-col gap-2">
              {ORDER.map((role) => {
                const active = role === s.user.role
                return (
                  <li
                    key={role}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-4 py-3 text-sm',
                      active ? 'bg-ink text-white' : 'bg-muted/60 text-muted-foreground',
                    )}
                  >
                    <span className="font-medium">{ROLE_LABEL[role]}</span>
                    {active && <span className="text-[11px] font-semibold text-mint">Tu rol actual</span>}
                  </li>
                )
              })}
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">
              Tu experiencia se adapta a tu rol actual. No necesitas completar todos los niveles.
            </p>
          </Card>
          <Card className="p-6">
            <SectionTitle eyebrow="Lo que cubre tu rol" title="Contenidos" />
            <div className="flex flex-wrap gap-2">
              {ROLE_TRACKS[s.user.role].contents.map((c) => (
                <span key={c} className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-ink">{c}</span>
              ))}
            </div>
            <Link href="/explorar" className={cn(btn.outline, btn.sm, 'mt-5 w-full')}>Explorar más cursos</Link>
          </Card>
        </aside>
      </div>
    </div>
  )
}
