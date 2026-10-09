'use client'

import Link from 'next/link'
import { Check, CheckCircle2, Clock, FileText, Layers, ListChecks, MessagesSquare, Play, PlayCircle, RotateCcw, Zap } from 'lucide-react'
import type { LessonFormat } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { courseProgress } from '@/lib/engine'
import { getCourse } from '@/lib/data/courses'
import { getProduct } from '@/lib/data/products'
import { skillLabel } from '@/lib/data/skills'
import { BackLink, Card, Pill, ProgressBar, SectionTitle, btn } from './ui'

const FORMAT_ICON: Record<LessonFormat, typeof FileText> = {
  Lectura: FileText,
  Video: PlayCircle,
  Caso: MessagesSquare,
  Simulación: MessagesSquare,
  Infografía: Layers,
  Checklist: ListChecks,
}

export function CourseDetail({ id }: { id: string }) {
  const s = useAppState()
  const c = getCourse(id)!
  const p = courseProgress(s, id)
  const product = c.productId ? getProduct(c.productId) : undefined
  const cp = s.courses[id]
  const back = product ? { href: `/productos/${product.id}`, label: product.name } : { href: '/ruta', label: 'Mi ruta' }

  const cta =
    p.status === 'done'
      ? { label: 'Repasar curso', href: `/aprender/${id}`, icon: RotateCcw }
      : p.status === 'progress'
        ? { label: 'Continuar curso', href: `/aprender/${id}?l=${p.nextLesson}`, icon: Play }
        : { label: 'Comenzar curso', href: `/aprender/${id}`, icon: Play }

  return (
    <div>
      <BackLink {...back} />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            <Pill>{c.category}</Pill>
            <Pill tone="outline">Skill: {skillLabel(c.skill)}</Pill>
            {product && <Pill tone="warn">Contenido DEMO</Pill>}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink text-balance md:text-4xl">{c.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground text-pretty">{c.tagline}</p>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-1.5"><Clock className="size-4 text-brand" /><dt className="sr-only">Duración</dt><dd>{c.minutes} min</dd></div>
            <div className="flex items-center gap-1.5"><Layers className="size-4 text-brand" /><dt className="sr-only">Lecciones</dt><dd>{c.lessons.length} lecciones</dd></div>
            <div><dt className="sr-only">Nivel</dt><dd>{c.level}</dd></div>
            <div className="flex items-center gap-1.5 font-semibold"><Zap className="size-4 text-brand" /><dt className="sr-only">XP</dt><dd>+{c.xp} XP</dd></div>
          </dl>

          <Card className="mt-8 p-6">
            <SectionTitle title="Aprenderás" />
            <ul className="grid gap-3 sm:grid-cols-2">
              {c.learnings.map((l) => (
                <li key={l} className="flex gap-2.5 text-sm text-ink">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" /> {l}
                </li>
              ))}
            </ul>
          </Card>

          <section className="mt-8">
            <SectionTitle title="Contenido" />
            <ol className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {c.lessons.map((l, i) => {
                const done = cp?.completedLessons.includes(i) || p.status === 'done'
                const Icon = FORMAT_ICON[l.format]
                return (
                  <li key={l.title}>
                    <Link href={`/aprender/${id}?l=${i}`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-muted/50">
                      <span className="w-6 font-display text-sm font-semibold text-muted-foreground tabular">{String(i + 1).padStart(2, '0')}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-ink">{l.title}</span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon className="size-3" /> {l.format} · {l.minutes} min
                        </span>
                      </span>
                      {done ? (
                        <span className="flex size-6 items-center justify-center rounded-full bg-brand text-white"><Check className="size-3.5" /></span>
                      ) : (
                        <span className="size-6 rounded-full border border-border" />
                      )}
                    </Link>
                  </li>
                )
              })}
              <li className="flex items-center gap-4 bg-sage/50 px-5 py-4">
                <span className="w-6 font-display text-sm font-semibold text-brand tabular">{String(c.lessons.length + 1).padStart(2, '0')}</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{product ? 'Evaluación final de certificación' : 'Evaluación'}</span>
                  <span className="text-xs text-muted-foreground">{c.quiz.length} preguntas · {product ? 'mínimo 80/100' : 'una pregunta por pantalla'}</span>
                </span>
                {p.status === 'done' && cp?.score !== undefined && <span className="font-display text-sm font-semibold text-brand tabular">{cp.score}/100</span>}
              </li>
            </ol>
          </section>
        </div>

        <aside className="lg:sticky lg:top-10 lg:self-start">
          <Card className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Modelo</p>
            <p className="mt-2 font-display text-base font-semibold text-ink">Aprende → Practica → Demuestra → Aplica</p>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Tu progreso</span>
                <span className="font-display font-semibold tabular">{p.pct}%</span>
              </div>
              <ProgressBar value={p.pct} label="Progreso del curso" />
            </div>
            {p.status === 'progress' && <p className="mt-2 text-xs text-muted-foreground">{p.remaining} min restantes</p>}
            <Link href={cta.href} className={cn(btn.brand, 'mt-6 h-12 w-full uppercase tracking-wide')}>
              <cta.icon className="size-4" /> {cta.label}
            </Link>
            {p.status === 'done' && (
              <Link href={`/aprender/${id}?quiz=1`} className={cn(btn.outline, 'mt-2 w-full')}>
                Repetir evaluación
              </Link>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Al completarlo mejoras tu skill de {skillLabel(c.skill)} (+{c.skillGain}).
            </p>
          </Card>
        </aside>
      </div>
    </div>
  )
}
