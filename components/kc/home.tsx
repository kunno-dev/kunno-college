'use client'

import Link from 'next/link'
import { ArrowRight, Bell, Clock, Flame, LayoutGrid, Lightbulb, Play, Rocket, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import {
  courseProgress,
  getLevel,
  getRecommendations,
  productReadiness,
  routeStages,
} from '@/lib/engine'
import { PRODUCTS } from '@/lib/data/products'
import { ROLE_SKILLS } from '@/lib/data/skills'
import { TEAM, TEAM_SUMMARY } from '@/lib/data/team'
import { ReadinessRow, SkillBars } from './blocks'
import { Card, ProgressBar, ProgressRing, SectionTitle, btn } from './ui'

const ROLE_TITLE = {
  asesor: 'Asesor Profesional',
  gerente: 'Gerente Comercial',
  subdirector: 'Subdirector Comercial',
  director: 'Director Comercial',
}

export function HomeView() {
  const s = useAppState()
  const route = routeStages(s)
  const lvl = getLevel(s.xp)
  const recs = getRecommendations(s)
  const skillRec = recs.find((r) => r.kind === 'skill')
  const otherRecs = recs.filter((r) => r.kind !== 'route' && r.kind !== 'skill')
  const leader = s.user.role !== 'asesor'
  const firstName = s.user.name.split(' ')[0]
  const current = route.current
  const selling = PRODUCTS.filter((p) => p.status === 'En comercialización')
  const pitahaya = productReadiness(s, 'pitahaya')

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Tu siguiente paso para crecer</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">Hola, {firstName} 👋</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="continua" className="lg:col-span-2">
          {current ? (
            <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white md:p-8">
              <p id="continua" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mint">
                Continúa tu ruta
              </p>
              <div className="mt-4 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-semibold text-balance md:text-3xl">{current.course.title}</h2>
                  <p className="mt-1 text-sm text-white/60">{current.course.tagline}</p>
                </div>
                <ProgressRing value={current.progress.pct} size={72} stroke={6} dark>
                  <span className="font-display text-sm font-semibold tabular">{current.progress.pct}%</span>
                </ProgressRing>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={`/aprender/${current.course.id}`} className={cn(btn.brand, 'h-12 px-6')}>
                  <Play className="size-4 fill-current" />
                  {current.progress.pct > 0 ? 'Continuar' : 'Comenzar'}
                </Link>
                <span className="flex items-center gap-1.5 text-sm text-white/70">
                  <Clock className="size-4" /> {current.progress.remaining || current.course.minutes} min restantes
                </span>
                <span className="text-sm text-white/40">
                  Etapa {route.currentStep} de {route.total}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-ink p-8 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mint">Ruta completada</p>
              <h2 className="mt-3 font-display text-2xl font-semibold">Desbloqueaste {route.track.milestone}</h2>
              <Link href="/progreso" className={cn(btn.brand, 'mt-6')}>
                Ver mi progreso <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </section>

        <Card className="flex flex-col p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Tu desarrollo</p>
          <h2 className="mt-2 font-display text-lg font-semibold text-ink">{ROLE_TITLE[s.user.role]}</h2>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-display text-3xl font-semibold text-ink tabular">Nivel {lvl.level}</span>
            <span className="text-sm text-muted-foreground tabular">{s.xp.toLocaleString('es-MX')} XP</span>
          </div>
          <ProgressBar value={lvl.pct} className="mt-3" label="Progreso de nivel" />
          <p className="mt-2 text-xs text-muted-foreground tabular">
            {lvl.toNext} XP para nivel {lvl.level + 1}
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-sage px-3 py-2 text-sm text-ink">
            <Flame className="size-4 text-brand" />
            <span className="font-semibold tabular">{s.streak} días</span>
            <span className="text-muted-foreground">de racha</span>
          </div>
        </Card>
      </div>

      {leader && <TeamSnapshot />}

      <section aria-label="Learning in the flow of work" className="grid gap-4 md:grid-cols-2">
        <FlowCard
          icon={<Bell className="size-4" />}
          title="¿Muchos prospectos sin seguimiento?"
          body="Kunno detectó 6 prospectos sin actividad en 3 días. Aprende una técnica para priorizarlos."
          meta="Seguimiento efectivo · 6 min"
          href="/aprender/seguimiento-efectivo"
          cta="Aprender ahora"
        />
        <FlowCard
          icon={<LayoutGrid className="size-4" />}
          title="Nueva oportunidad asignada: Pitahaya Investments"
          body={`Tu Product Readiness es ${pitahaya}%. Repasa antes de tu cita.`}
          meta="Ficha rápida · 5 min"
          href="/productos/pitahaya/ficha"
          cta="Repasar producto"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <SectionTitle
            eyebrow="Product Readiness"
            title="Productos que comercializas"
          />
          <div className="flex flex-col gap-3">
            {selling.map((p) => (
              <ReadinessRow key={p.id} product={p} state={s} />
            ))}
          </div>
          <Link href="/productos" className={cn(btn.outline, btn.sm, 'mt-5 w-full')}>
            Ver mis productos
          </Link>
        </Card>

        <Card className="p-6">
          <SectionTitle
            eyebrow="Skill Score"
            title="Tus habilidades"
            action={
              <Link href="/progreso" className="text-xs font-semibold text-brand hover:underline">
                Ver mapa
              </Link>
            }
          />
          <SkillBars skills={s.skills} ids={ROLE_SKILLS[s.user.role]} compact />
        </Card>

        {skillRec && (
          <div className="flex flex-col rounded-2xl border border-mint/60 bg-sage p-6">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              <Lightbulb className="size-3.5" /> Recomendado para ti
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink text-balance">{skillRec.title}</h3>
            <p className="mt-2 text-sm text-ink/70">{skillRec.reason}</p>
            <div className="mt-auto flex items-center gap-4 pt-6 text-sm text-ink/70">
              <span className="flex items-center gap-1">
                <Clock className="size-4" /> {skillRec.minutes} min
              </span>
              <span className="flex items-center gap-1 font-semibold text-ink">
                <Zap className="size-4 text-brand" /> +{skillRec.xp} XP
              </span>
            </div>
            <Link href={skillRec.href} className={cn(btn.primary, 'mt-4')}>
              Comenzar
            </Link>
          </div>
        )}
      </div>

      {otherRecs.length > 0 && (
        <section>
          <SectionTitle eyebrow="Motor de recomendaciones" title="Basado en tu rol, skills y productos" />
          <div className="grid gap-3 md:grid-cols-2">
            {otherRecs.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-mint"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sage text-brand">
                  {r.kind === 'launch' ? <Rocket className="size-4" /> : <LayoutGrid className="size-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{r.title}</span>
                  <span className="block text-xs text-muted-foreground">{r.reason}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {s.assignments.length > 0 && !leader && <AssignedToMe />}
    </div>
  )
}

function FlowCard({
  icon,
  title,
  body,
  meta,
  href,
  cta,
}: {
  icon: React.ReactNode
  title: string
  body: string
  meta: string
  href: string
  cta: string
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <span className="flex size-6 items-center justify-center rounded-md bg-ink text-mint">{icon}</span>
        Kunno College · en tu flujo
      </div>
      <h3 className="mt-3 font-display text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{meta}</span>
        <Link href={href} className={cn(btn.primary, btn.sm)}>
          {cta}
        </Link>
      </div>
    </div>
  )
}

function TeamSnapshot() {
  const s = useAppState()
  const needPitahaya = TEAM.filter((m) => (m.readiness.pitahaya ?? 0) < 100).length
  return (
    <Card className="p-6">
      <SectionTitle
        eyebrow="Desarrollo del equipo"
        title={TEAM_SUMMARY.name}
        action={
          <Link href="/equipo" className={cn(btn.primary, btn.sm)}>
            <Users className="size-4" /> Ver equipo
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-semibold text-ink tabular">{TEAM_SUMMARY.people}</p>
          <p className="text-xs text-muted-foreground">personas</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-ink tabular">{TEAM_SUMMARY.avgProgress}%</p>
          <p className="text-xs text-muted-foreground">progreso promedio</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-ink tabular">{TEAM_SUMMARY.avgSkill}</p>
          <p className="text-xs text-muted-foreground">Skill Score promedio</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-ink tabular">{s.assignments.length}</p>
          <p className="text-xs text-muted-foreground">asignaciones activas</p>
        </div>
      </div>
      <p className="mt-5 rounded-xl bg-sage px-4 py-3 text-sm text-ink">
        {needPitahaya} asesores necesitan completar la capacitación de Pitahaya.
      </p>
    </Card>
  )
}

function AssignedToMe() {
  const s = useAppState()
  return (
    <section>
      <SectionTitle eyebrow="Asignado por tu gerente" title="Capacitaciones asignadas" />
      <div className="flex flex-col gap-2">
        {s.assignments.slice(0, 3).map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm">
            <span className="font-medium text-ink">{a.targetLabel}</span>
            <span className="text-xs text-muted-foreground">Fecha límite {a.due}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export { courseProgress }
