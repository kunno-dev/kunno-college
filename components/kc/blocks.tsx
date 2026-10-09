'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Award,
  Check,
  Clock,
  Compass,
  Cpu,
  Flame,
  Gem,
  Handshake,
  Lock,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'
import type { Badge, Course, Product, SkillId } from '@/lib/types'
import { SKILLS } from '@/lib/data/skills'
import { type AppState, courseProgress, productReadiness, readinessStatus } from '@/lib/engine'
import { cn } from '@/lib/utils'
import { ProgressBar, ProgressRing } from './ui'

export function KunnoMark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className={cn('flex size-8 items-center justify-center rounded-lg font-display text-sm font-bold', light ? 'bg-mint text-ink' : 'bg-ink text-mint')}>
        k
      </span>
      <span className={cn('font-display text-[15px] font-semibold tracking-tight', light ? 'text-white' : 'text-ink')}>
        kunno<span className={light ? 'text-mint' : 'text-brand'}>.college</span>
      </span>
    </span>
  )
}

export function SkillBars({
  skills,
  ids,
  baseline,
  compact,
}: {
  skills: Record<SkillId, number>
  ids?: SkillId[]
  baseline?: Record<SkillId, number>
  compact?: boolean
}) {
  const list = SKILLS.filter((s) => !ids || ids.includes(s.id))
  const min = Math.min(...list.map((s) => skills[s.id]))
  return (
    <ul className={cn('flex flex-col', compact ? 'gap-3' : 'gap-4')}>
      {list.map((s) => {
        const v = skills[s.id]
        const delta = baseline ? v - baseline[s.id] : 0
        const weakest = v === min
        return (
          <li key={s.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-ink">
                {s.label}
                {weakest && !compact && (
                  <span className="rounded-full bg-amber-50 px-2 py-px text-[10px] font-semibold text-amber-800">Oportunidad</span>
                )}
              </span>
              <span className="flex items-center gap-2">
                {delta > 0 && <span className="text-[11px] font-semibold text-brand">+{delta}</span>}
                <span className="font-display font-semibold tabular text-ink">{v}</span>
              </span>
            </div>
            <ProgressBar value={v} tone={weakest ? 'mint' : 'brand'} label={`${s.label}: ${v}`} />
          </li>
        )
      })}
    </ul>
  )
}

export function CourseCard({ course, state, compact }: { course: Course; state: AppState; compact?: boolean }) {
  const p = courseProgress(state, course.id)
  return (
    <Link
      href={`/curso/${course.id}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-mint"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">{course.category}</span>
        {p.status === 'done' ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-brand">
            <Check className="size-3.5" /> Completado
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">{course.level}</span>
        )}
      </div>
      <h3 className="font-display text-base font-semibold leading-snug text-ink text-balance">{course.title}</h3>
      {!compact && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.tagline}</p>}
      <div className="mt-auto pt-4">
        {p.status === 'progress' && <ProgressBar value={p.pct} className="mb-3" label={`Progreso ${p.pct}%`} />}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {course.minutes} min
          </span>
          <span>{course.lessons.length} lecciones</span>
          <span className="ml-auto flex items-center gap-1 font-semibold text-ink">
            <Zap className="size-3.5 text-brand" /> +{course.xp} XP
          </span>
        </div>
      </div>
    </Link>
  )
}

export function ReadinessRow({ product, state, href }: { product: Product; state: AppState; href?: string }) {
  const r = productReadiness(state, product.id)
  return (
    <Link href={href ?? `/productos/${product.id}`} className="group flex items-center gap-3 rounded-xl p-2 -mx-2 transition hover:bg-muted">
      <Image src={product.image || '/placeholder.svg'} alt="" width={44} height={44} className="size-11 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-ink">{product.name}</span>
          {r >= 100 ? (
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand">
              <Check className="size-3.5" /> Certificado
            </span>
          ) : (
            <span className="shrink-0 font-display text-sm font-semibold tabular text-ink">{r}%</span>
          )}
        </div>
        <ProgressBar value={r} className="mt-1.5" tone={r >= 100 ? 'brand' : 'mint'} label={`${product.name} readiness ${r}%`} />
        <span className="mt-1 block text-[11px] text-muted-foreground">{readinessStatus(r)}</span>
      </div>
    </Link>
  )
}

const BADGE_ICONS = {
  sparkles: Sparkles,
  flame: Flame,
  target: Target,
  handshake: Handshake,
  compass: Compass,
  cpu: Cpu,
  award: Award,
  gem: Gem,
}

export function BadgeTile({ badge, earned }: { badge: Badge; earned: boolean }) {
  const Icon = BADGE_ICONS[badge.icon]
  return (
    <div className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 text-center', earned ? 'border-border bg-card' : 'border-dashed border-border bg-transparent')}>
      <span className={cn('flex size-12 items-center justify-center rounded-full', earned ? 'bg-ink text-mint' : 'bg-muted text-muted-foreground')}>
        {earned ? <Icon className="size-5" /> : <Lock className="size-4" />}
      </span>
      <span className={cn('text-xs font-semibold', earned ? 'text-ink' : 'text-muted-foreground')}>{badge.name}</span>
      <span className="text-[11px] leading-snug text-muted-foreground">{badge.description}</span>
    </div>
  )
}

export function CertRow({ name, pct, href }: { name: string; pct: number; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 rounded-xl p-2 -mx-2 transition hover:bg-muted">
      <ProgressRing value={pct} size={44} stroke={4}>
        {pct >= 100 ? <Award className="size-4 text-brand" /> : <span className="text-[10px] font-semibold tabular">{pct}%</span>}
      </ProgressRing>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{name}</p>
        <p className="text-xs text-muted-foreground">{pct >= 100 ? 'Ver certificado' : `${pct}% completado`}</p>
      </div>
    </Link>
  )
}
