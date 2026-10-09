'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Award, Check, FileText, Lock, Play, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { certScore, courseProgress, productReadiness } from '@/lib/engine'
import { getProduct } from '@/lib/data/products'
import { getCourse, productCourseId } from '@/lib/data/courses'
import { CERTIFICATIONS } from '@/lib/data/skills'
import { BackLink, Card, Pill, ProgressBar, SectionTitle, btn } from './ui'

const AREAS = ['Producto', 'Ubicación', 'Esquema comercial', 'Inversión', 'Objeciones']

export function ProductAcademy({ id }: { id: string }) {
  const s = useAppState()
  const p = getProduct(id)!
  const cid = productCourseId(id)
  const course = getCourse(cid)!
  const cp = s.courses[cid]
  const prog = courseProgress(s, cid)
  const r = productReadiness(s, id)
  const certified = r >= 100
  const cert = CERTIFICATIONS.find((c) => c.productId === id)
  const score = cert ? certScore(s, cert.id) : 0
  const lessonsDone = cp?.completedLessons.length ?? 0
  const allLessons = lessonsDone >= course.lessons.length || certified

  const startHref = certified
    ? `/aprender/${cid}`
    : allLessons
      ? `/aprender/${cid}?quiz=1`
      : `/aprender/${cid}?l=${prog.nextLesson}`

  return (
    <div>
      <BackLink href="/productos" label="Productos" />

      <section className="relative overflow-hidden rounded-3xl bg-ink text-white">
        <Image src={p.image || '/placeholder.svg'} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-10">
          <div className="max-w-lg">
            <div className="flex flex-wrap gap-2">
              <Pill tone="mint">Product Academy</Pill>
              <Pill tone="warn">Contenido DEMO</Pill>
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">{p.name}</h1>
            <p className="mt-2 text-white/70">{p.tagline}</p>
          </div>
          <div className="w-full rounded-2xl bg-white/10 p-5 backdrop-blur md:w-72">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mint">Product Training</p>
            <p className="mt-1 font-display text-3xl font-semibold tabular">{r}% completado</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${r}%` }} />
            </div>
            <Link href={startHref} className={cn(btn.brand, 'mt-4 w-full')}>
              <Play className="size-4 fill-current" />
              {certified ? 'Repasar training' : allLessons ? 'Ir a evaluación final' : r > 0 ? 'Continuar' : 'Comenzar'}
            </Link>
            <Link href={`/productos/${id}/ficha`} className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10">
              <FileText className="size-4" /> Ficha rápida
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionTitle eyebrow="12 módulos" title="Módulos del training" />
          <ol className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {course.lessons.map((l, i) => {
              const done = certified || cp?.completedLessons.includes(i)
              const next = !done && i === prog.nextLesson
              return (
                <li key={l.title}>
                  <Link
                    href={`/aprender/${cid}?l=${i}`}
                    className={cn('flex items-center gap-4 px-5 py-3.5 transition hover:bg-muted/50', next && 'bg-sage/60')}
                  >
                    <span className="w-6 font-display text-sm font-semibold text-muted-foreground tabular">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">{l.title}</span>
                      <span className="text-xs text-muted-foreground">{l.format} · {l.minutes} min</span>
                    </span>
                    {done ? (
                      <span className="flex size-6 items-center justify-center rounded-full bg-brand text-white"><Check className="size-3.5" /></span>
                    ) : next ? (
                      <span className={cn(btn.primary, 'h-8 px-3 text-xs')}>Continuar</span>
                    ) : (
                      <span className="size-6 rounded-full border border-border" />
                    )}
                  </Link>
                </li>
              )
            })}
            <li>
              {allLessons ? (
                <Link href={`/aprender/${cid}?quiz=1`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-muted/50">
                  <span className="w-6 font-display text-sm font-semibold text-brand tabular">12</span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-ink">Evaluación final</span>
                    <span className="text-xs text-muted-foreground">{course.quiz.length} preguntas · mínimo 80/100</span>
                  </span>
                  {certified ? (
                    <span className="font-display text-sm font-semibold text-brand tabular">{score}/100</span>
                  ) : (
                    <span className={cn(btn.brand, 'h-8 px-3 text-xs')}>Presentar</span>
                  )}
                </Link>
              ) : (
                <div className="flex items-center gap-4 px-5 py-4 text-muted-foreground">
                  <span className="w-6 font-display text-sm font-semibold tabular">12</span>
                  <span className="flex-1 text-sm">Evaluación final · se desbloquea al completar los módulos</span>
                  <Lock className="size-4" />
                </div>
              )}
            </li>
          </ol>
        </section>

        <aside className="flex flex-col gap-6">
          <Card className={cn('p-6', certified && 'border-brand')}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Certificación</p>
            <p className="mt-1 font-display text-lg font-semibold text-ink">{p.name}</p>
            {certified ? (
              <>
                <p className="mt-3 font-display text-4xl font-semibold text-ink tabular">{score} / 100</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {AREAS.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-ink">
                      <Check className="size-4 text-brand" /> {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-wide text-mint">
                  <ShieldCheck className="size-4" /> Certificado para comercializar
                </div>
                {cert && (
                  <Link href={`/certificado/${cert.id}`} className={cn(btn.outline, btn.sm, 'mt-3 w-full')}>
                    <Award className="size-4" /> Ver certificado
                  </Link>
                )}
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  Completa los 11 módulos y aprueba la evaluación final (80/100) para certificarte.
                </p>
                <ProgressBar value={r} className="mt-4" label="Progreso hacia certificación" />
                <ul className="mt-4 flex flex-col gap-2">
                  {AREAS.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="size-4 rounded-full border border-border" /> {a}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
          <Card className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Antes de tu cita</p>
            <p className="mt-1 font-display text-base font-semibold text-ink">¿Tienes 5 minutos?</p>
            <p className="mt-1 text-sm text-muted-foreground">Repasa los argumentos y objeciones clave en la ficha rápida.</p>
            <Link href={`/productos/${id}/ficha`} className={cn(btn.primary, btn.sm, 'mt-4 w-full')}>
              Repasar en 5 min
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  )
}
