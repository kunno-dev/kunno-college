'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Award, Check, RotateCcw, TrendingUp, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { completeCourse, completeLesson, useAppState, useHydrated, type CompletionResult } from '@/lib/store'
import { getCourse } from '@/lib/data/courses'
import { CERTIFICATIONS, skillLabel } from '@/lib/data/skills'
import { getRecommendations } from '@/lib/engine'
import { LessonBlockView } from './lesson-blocks'
import { ProgressBar, btn } from './ui'

type Phase = 'lesson' | 'quiz' | 'result'

export function Player({ id, startLesson, startQuiz }: { id: string; startLesson: number; startQuiz: boolean }) {
  const router = useRouter()
  const s = useAppState()
  const hydrated = useHydrated()
  const course = getCourse(id)!
  const [phase, setPhase] = useState<Phase>(startQuiz ? 'quiz' : 'lesson')
  const [lessonIdx, setLessonIdx] = useState(startLesson)
  const [qIdx, setQIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [result, setResult] = useState<CompletionResult | null>(null)

  useEffect(() => {
    if (hydrated && !s.auth.loggedIn) router.replace('/')
  }, [hydrated, s.auth.loggedIn, router])

  const lesson = course.lessons[lessonIdx]
  const totalSteps = course.lessons.length + 1
  const step = phase === 'lesson' ? lessonIdx + 1 : totalSteps
  const pct =
    phase === 'result'
      ? 100
      : phase === 'quiz'
        ? Math.round(((course.lessons.length + qIdx / course.quiz.length) / totalSteps) * 100)
        : Math.round((lessonIdx / totalSteps) * 100)

  const nextLesson = () => {
    completeLesson(id, lessonIdx)
    if (lessonIdx < course.lessons.length - 1) {
      setLessonIdx(lessonIdx + 1)
    } else {
      setPhase('quiz')
    }
    window.scrollTo({ top: 0 })
  }

  const question = course.quiz[qIdx]
  const check = () => {
    if (picked === null) return
    setChecked(true)
    if (picked === question.answer) setCorrect((c) => c + 1)
  }
  const nextQuestion = () => {
    if (qIdx < course.quiz.length - 1) {
      setQIdx(qIdx + 1)
      setPicked(null)
      setChecked(false)
    } else {
      setResult(completeCourse(id, correct, course.quiz.length))
      setPhase('result')
    }
    window.scrollTo({ top: 0 })
  }
  const retry = () => {
    setQIdx(0)
    setPicked(null)
    setChecked(false)
    setCorrect(0)
    setResult(null)
    setPhase('quiz')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 md:px-6">
          <Link
            href={course.productId ? `/productos/${course.productId}` : `/curso/${id}`}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl hover:bg-muted"
            aria-label="Salir del curso"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{course.title}</p>
            <p className="text-xs text-muted-foreground tabular">
              {phase === 'lesson'
                ? `Lección ${step} de ${course.lessons.length}`
                : phase === 'quiz'
                  ? `Evaluación · Pregunta ${qIdx + 1} de ${course.quiz.length}`
                  : 'Resultado'}
            </p>
          </div>
          <span className="font-display text-sm font-semibold text-ink tabular">{pct}%</span>
        </div>
        <ProgressBar value={pct} className="h-1 rounded-none" label="Progreso del curso" />
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        {phase === 'lesson' && (
          <article key={lessonIdx} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              {lesson.format} · {lesson.minutes} min
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink text-balance md:text-3xl">{lesson.title}</h1>
            <div className="mt-8 flex flex-col gap-6">
              {lesson.blocks.map((b, i) => (
                <LessonBlockView key={i} block={b} />
              ))}
            </div>
          </article>
        )}

        {phase === 'quiz' && question && (
          <section key={qIdx} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Pregunta {qIdx + 1} de {course.quiz.length}
              {question.area && ` · ${question.area}`}
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink text-balance">{question.q}</h1>
            <div className="mt-8 flex flex-col gap-2" role="radiogroup" aria-label="Opciones">
              {question.options.map((o, i) => {
                const isPicked = picked === i
                const isAnswer = i === question.answer
                return (
                  <button
                    key={o}
                    role="radio"
                    aria-checked={isPicked}
                    disabled={checked}
                    onClick={() => setPicked(i)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border bg-card p-4 text-left text-sm transition',
                      !checked && (isPicked ? 'border-ink ring-1 ring-ink' : 'border-border hover:border-mint'),
                      checked && isAnswer && 'border-brand ring-1 ring-brand',
                      checked && isPicked && !isAnswer && 'border-destructive/60',
                      checked && !isPicked && !isAnswer && 'opacity-50',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                        checked && isAnswer
                          ? 'border-brand bg-brand text-white'
                          : checked && isPicked
                            ? 'border-destructive bg-destructive text-white'
                            : isPicked
                              ? 'border-ink bg-ink text-white'
                              : 'border-input text-muted-foreground',
                      )}
                    >
                      {checked && isAnswer ? <Check className="size-3.5" /> : checked && isPicked ? <X className="size-3.5" /> : String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-ink">{o}</span>
                  </button>
                )
              })}
            </div>
            {checked && (
              <div
                role="status"
                className={cn(
                  'mt-4 animate-in fade-in rounded-2xl p-4 text-sm duration-300',
                  picked === question.answer ? 'bg-sage text-ink' : 'bg-card text-ink ring-1 ring-border',
                )}
              >
                <p className="font-display font-semibold">{picked === question.answer ? 'Correcto' : 'No exactamente'}</p>
                <p className="mt-1 text-muted-foreground">{question.explanation}</p>
              </div>
            )}
          </section>
        )}

        {phase === 'result' && result && <ResultView courseId={id} result={result} total={course.quiz.length} correct={correct} onRetry={retry} />}
      </main>

      {phase !== 'result' && (
        <footer className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-6">
            {phase === 'lesson' ? (
              <>
                <button
                  onClick={() => setLessonIdx(Math.max(0, lessonIdx - 1))}
                  disabled={lessonIdx === 0}
                  className={cn(btn.ghost)}
                >
                  Anterior
                </button>
                <button onClick={nextLesson} className={cn(btn.primary, 'h-12 px-6 uppercase tracking-wide')}>
                  {lessonIdx < course.lessons.length - 1 ? 'Siguiente' : 'Ir a la evaluación'} <ArrowRight className="size-4" />
                </button>
              </>
            ) : (
              <>
                <span className="text-xs text-muted-foreground">{course.productId ? 'Mínimo 80/100 para certificarte' : 'Una pregunta por pantalla'}</span>
                {checked ? (
                  <button onClick={nextQuestion} className={cn(btn.primary, 'h-12 px-6 uppercase tracking-wide')}>
                    {qIdx < course.quiz.length - 1 ? 'Siguiente' : 'Ver resultado'} <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button onClick={check} disabled={picked === null} className={cn(btn.primary, 'h-12 px-6 uppercase tracking-wide')}>
                    Comprobar
                  </button>
                )}
              </>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}

function ResultView({
  courseId,
  result,
  total,
  correct,
  onRetry,
}: {
  courseId: string
  result: CompletionResult
  total: number
  correct: number
  onRetry: () => void
}) {
  const s = useAppState()
  const course = getCourse(courseId)!
  const productCert = course.productId ? CERTIFICATIONS.find((c) => c.productId === course.productId) : undefined
  const nextRec = getRecommendations(s).find((r) => r.href !== `/curso/${courseId}`)

  if (!result.passed) {
    return (
      <section className="animate-in fade-in text-center duration-300">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
          <RotateCcw className="size-7 text-ink" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">Casi lo logras</h1>
        <p className="mt-2 font-display text-5xl font-semibold text-ink tabular">
          {correct} / {total}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
          Necesitas {course.productId ? '80' : '60'}% para aprobar. Repasa las lecciones y vuelve a intentarlo.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <button onClick={onRetry} className={cn(btn.primary, 'h-12')}>Reintentar evaluación</button>
          <Link href={`/curso/${courseId}`} className={cn(btn.outline, 'h-12')}>Repasar lecciones</Link>
        </div>
      </section>
    )
  }

  const certified = course.productId && result.readiness && result.readiness.after >= 100

  return (
    <section className="animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center">
        <div className="relative mx-auto flex size-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-mint/30 [animation-iteration-count:2]" />
          <span className="relative flex size-20 items-center justify-center rounded-full bg-brand text-white">
            {certified ? <Award className="size-9" /> : <Check className="size-9" />}
          </span>
        </div>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
          {certified ? 'Certificación obtenida' : '¡Curso completado!'}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink text-balance">{course.title}</h1>
        <p className="mt-4 font-display text-5xl font-semibold text-ink tabular">
          {course.productId ? `${result.scorePct} / 100` : `${correct} / ${total}`}
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Zap className="size-3.5 text-brand" /> Experiencia
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink tabular">+{result.xpGained} XP</p>
          <p className="text-xs text-muted-foreground">
            {result.xpGained === 0
              ? 'Ya habías obtenido el XP de este curso.'
              : result.levelAfter > result.levelBefore
                ? `Subiste a nivel ${result.levelAfter}`
                : `Nivel ${result.levelAfter}`}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <TrendingUp className="size-3.5 text-brand" /> Habilidad mejorada
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-ink">{skillLabel(result.skill.id)}</p>
          <p className="font-display text-3xl font-semibold text-ink tabular">
            {result.skill.before} <span className="text-muted-foreground">→</span>{' '}
            <span className="text-brand">{result.skill.after}</span>
          </p>
        </div>
      </div>

      {result.readiness && (
        <div className="mt-3 rounded-2xl bg-ink p-5 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mint">Product Readiness</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="font-display text-lg font-semibold">{course.title.replace(' · Product Training', '')}</p>
            <p className="font-display text-2xl font-semibold tabular">
              {result.readiness.before}% → <span className="text-mint">{result.readiness.after}%</span>
            </p>
          </div>
          {certified && (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-mint">
              <Check className="size-4" /> Certificado para comercializar
            </p>
          )}
        </div>
      )}

      {(result.newBadges.length > 0 || result.newCertifications.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {result.newBadges.map((b) => (
            <span key={b.id} className="flex items-center gap-1.5 rounded-full bg-sage px-3 py-1.5 text-xs font-semibold text-ink">
              <Award className="size-3.5 text-brand" /> Badge: {b.name}
            </span>
          ))}
          {result.newCertifications.map((c) => (
            <Link key={c.id} href={`/certificado/${c.id}`} className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">
              <Award className="size-3.5 text-mint" /> {c.name}
            </Link>
          ))}
        </div>
      )}

      {nextRec && (
        <Link href={nextRec.href} className="mt-6 flex items-center gap-4 rounded-2xl border border-mint/60 bg-sage/60 p-4 transition hover:border-brand">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Siguiente recomendación</p>
            <p className="mt-1 font-semibold text-ink">{nextRec.title}</p>
            <p className="text-xs text-muted-foreground">{nextRec.reason}</p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-brand" />
        </Link>
      )}

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        {certified && productCert ? (
          <Link href={`/certificado/${productCert.id}`} className={cn(btn.brand, 'h-12 flex-1 uppercase tracking-wide')}>
            Ver certificado <Award className="size-4" />
          </Link>
        ) : (
          <Link href="/ruta" className={cn(btn.primary, 'h-12 flex-1 uppercase tracking-wide')}>
            Continuar mi ruta <ArrowRight className="size-4" />
          </Link>
        )}
        <Link href="/progreso" className={cn(btn.outline, 'h-12 flex-1')}>Ver mi progreso</Link>
      </div>
    </section>
  )
}
