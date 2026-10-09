'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Clock, Route, Zap } from 'lucide-react'
import type { Role } from '@/lib/types'
import { cn } from '@/lib/utils'
import { completeOnboarding, useAppState, useHydrated } from '@/lib/store'
import { ROLE_TRACKS, getCourse } from '@/lib/data/courses'
import { KunnoMark } from './blocks'
import { btn } from './ui'

const ROLES: { id: Role; label: string; desc: string }[] = [
  { id: 'asesor', label: 'Asesor', desc: 'Vendo y acompaño a mis clientes' },
  { id: 'gerente', label: 'Gerente', desc: 'Lidero un equipo de asesores' },
  { id: 'subdirector', label: 'Subdirector', desc: 'Gestiono varios equipos' },
  { id: 'director', label: 'Director', desc: 'Defino la estrategia comercial' },
]

const GOALS = [
  'Vender mejor',
  'Prospectar mejor',
  'Cerrar más operaciones',
  'Dominar Kunno',
  'Liderar equipos',
  'Entender Real Estate',
  'Aprender sobre inversión',
  'Dominar los productos que comercializo',
]

const fmt = (min: number) => (min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`)

export function Onboarding() {
  const router = useRouter()
  const s = useAppState()
  const hydrated = useHydrated()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState<Role>('asesor')
  const [goals, setGoals] = useState<string[]>(['Vender mejor', 'Cerrar más operaciones'])

  useEffect(() => {
    if (hydrated && !s.auth.loggedIn) router.replace('/')
  }, [hydrated, s.auth.loggedIn, router])

  const track = ROLE_TRACKS[role]
  const courses = track.courseIds.map((id) => getCourse(id)!)
  const minutes = courses.reduce((a, c) => a + c.minutes, 0)
  const xp = courses.reduce((a, c) => a + c.xp, 0)

  const toggle = (g: string) => setGoals((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]))

  const finish = () => {
    completeOnboarding(role, goals)
    router.push('/ruta')
  }

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <KunnoMark />
        <span className="text-xs font-medium text-muted-foreground tabular">Paso {step + 1} de 3</span>
      </header>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pb-10">
        <div className="mb-10 grid grid-cols-3 gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn('h-1 rounded-full transition', i <= step ? 'bg-brand' : 'bg-sage')} />
          ))}
        </div>

        {step === 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Construyamos tu ruta</p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">¿Cuál es tu rol?</h1>
            <div className="mt-8 grid gap-3" role="radiogroup" aria-label="Rol">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  role="radio"
                  aria-checked={role === r.id}
                  onClick={() => setRole(r.id)}
                  className={cn(
                    'flex items-center gap-4 rounded-2xl border p-4 text-left transition',
                    role === r.id ? 'border-brand bg-sage ring-1 ring-brand' : 'border-border bg-card hover:border-mint',
                  )}
                >
                  <span className={cn('flex size-5 items-center justify-center rounded-full border', role === r.id ? 'border-brand bg-brand' : 'border-input')}>
                    {role === r.id && <Check className="size-3 text-white" />}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-display font-semibold text-ink">{r.label}</span>
                    <span className="text-sm text-muted-foreground">{r.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Tus objetivos</p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">¿Qué quieres mejorar?</h1>
            <p className="mt-2 text-sm text-muted-foreground">Elige todos los que apliquen.</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {GOALS.map((g) => {
                const on = goals.includes(g)
                return (
                  <button
                    key={g}
                    aria-pressed={on}
                    onClick={() => toggle(g)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition',
                      on ? 'border-ink bg-ink text-white' : 'border-border bg-card text-ink hover:border-mint',
                    )}
                  >
                    {on && <Check className="size-3.5 text-mint" />}
                    {g}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Listo</p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">Tu ruta está lista</h1>
            <div className="mt-8 overflow-hidden rounded-3xl bg-ink p-6 text-white">
              <div className="flex items-center gap-2 text-mint">
                <Route className="size-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">{track.title}</span>
              </div>
              <p className="mt-3 font-display text-xl font-semibold text-balance">{track.objective}</p>
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
                <div>
                  <p className="font-display text-2xl font-semibold tabular">{courses.length}</p>
                  <p className="text-xs text-white/60">cursos</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-display text-2xl font-semibold tabular">
                    <Clock className="size-4 text-mint" />
                    {fmt(minutes)}
                  </p>
                  <p className="text-xs text-white/60">total</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-display text-2xl font-semibold tabular">
                    <Zap className="size-4 text-mint" />+{xp}
                  </p>
                  <p className="text-xs text-white/60">XP</p>
                </div>
              </div>
            </div>
            <ol className="mt-6 flex flex-col gap-2">
              {courses.map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                  <span className="font-display text-xs font-semibold text-muted-foreground tabular">0{i + 1}</span>
                  <span className="flex-1 font-medium text-ink">{c.title}</span>
                  <span className="text-xs text-muted-foreground">{c.minutes} min</span>
                </li>
              ))}
            </ol>
            {goals.length > 0 && (
              <p className="mt-4 text-xs text-muted-foreground">
                Ajustamos tus recomendaciones para: {goals.join(', ').toLowerCase()}.
              </p>
            )}
          </section>
        )}

        <div className="mt-auto flex items-center gap-3 pt-10">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className={btn.outline} aria-label="Atrás">
              <ArrowLeft className="size-4" />
            </button>
          )}
          {step < 2 ? (
            <button onClick={() => setStep(step + 1)} disabled={step === 1 && goals.length === 0} className={cn(btn.primary, 'h-12 flex-1')}>
              Continuar <ArrowRight className="size-4" />
            </button>
          ) : (
            <button onClick={finish} className={cn(btn.brand, 'h-12 flex-1 uppercase tracking-wide')}>
              Comenzar mi ruta <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
