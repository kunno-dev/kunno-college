'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react'
import type { Category, Level, Role, SkillId } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { courseProgress } from '@/lib/engine'
import { LEARNING_COURSES, SKILL_TOPICS, STAGES } from '@/lib/data/courses'
import { ROLE_LABEL, SKILLS } from '@/lib/data/skills'
import { CourseCard } from './blocks'
import { Card, PageHeader, SectionTitle } from './ui'

const CATEGORIES: Category[] = ['Ventas', 'Real Estate', 'Inversión', 'Liderazgo', 'Kunno', 'Gestión Comercial', 'Herramientas']
const LEVELS: Level[] = ['Básico', 'Intermedio', 'Avanzado']
const DURATIONS = [
  { id: 'short', label: 'Hasta 10 min', test: (m: number) => m <= 10 },
  { id: 'mid', label: '10–20 min', test: (m: number) => m > 10 && m <= 20 },
  { id: 'long', label: 'Más de 20 min', test: (m: number) => m > 20 },
]

const ACADEMIES = [
  { n: '01', title: 'Mi rol', desc: 'Asesor → Gerente → Subdirector → Director', href: '/ruta' },
  { n: '02', title: 'Productos inmobiliarios', desc: 'Conoce lo que vendes. Domina cómo venderlo.', href: '/productos' },
  { n: '03', title: 'Real Estate & Inversión', desc: 'Foundations → Investor → Analyst → Expert', href: '#realestate' },
  { n: '04', title: 'Habilidades & Herramientas', desc: 'IA, Excel, comunicación, marca personal y Kunno', href: '#habilidades' },
]

export function ExploreView() {
  const s = useAppState()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<Category | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [duration, setDuration] = useState<string | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [skill, setSkill] = useState<SkillId | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LEARNING_COURSES.filter((c) => {
      if (cat && c.category !== cat) return false
      if (level && c.level !== level) return false
      if (role && !c.roles.includes(role)) return false
      if (skill && c.skill !== skill) return false
      if (duration && !DURATIONS.find((d) => d.id === duration)!.test(c.minutes)) return false
      if (q && !`${c.title} ${c.tagline} ${c.category} ${c.learnings.join(' ')}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, cat, level, role, skill, duration])

  const activeFilters = [level, duration, role, skill].filter(Boolean).length
  const filtering = !!(query || cat || activeFilters)
  const clear = () => {
    setQuery('')
    setCat(null)
    setLevel(null)
    setDuration(null)
    setRole(null)
    setSkill(null)
  }

  const reCourses = LEARNING_COURSES.filter((c) => c.academy === 'realestate')
  const skillCourses = LEARNING_COURSES.filter((c) => c.academy === 'habilidades')

  return (
    <div>
      <PageHeader eyebrow="Explorar" title="Explora nuevas habilidades" />

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <label htmlFor="search" className="sr-only">Buscar cursos</label>
        <input
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué quieres aprender?"
          className="h-14 w-full rounded-2xl border border-input bg-card pl-12 pr-32 text-base outline-none focus:border-mint focus:ring-3 focus:ring-mint/30"
        />
        <button
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          className="absolute right-2 top-1/2 flex h-10 -translate-y-1/2 items-center gap-2 rounded-xl px-3 text-sm font-medium text-ink hover:bg-muted"
        >
          <SlidersHorizontal className="size-4" /> Filtros
          {activeFilters > 0 && <span className="rounded-full bg-brand px-1.5 text-[11px] text-white">{activeFilters}</span>}
        </button>
      </div>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Categorías">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            aria-pressed={cat === c}
            onClick={() => setCat(cat === c ? null : c)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition',
              cat === c ? 'border-ink bg-ink text-white' : 'border-border bg-card text-ink hover:border-mint',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {showFilters && (
        <Card className="mt-4 grid gap-5 p-5 md:grid-cols-4">
          <FilterGroup label="Nivel" options={LEVELS.map((l) => ({ id: l, label: l }))} value={level} onChange={(v) => setLevel(v as Level | null)} />
          <FilterGroup label="Duración" options={DURATIONS} value={duration} onChange={setDuration} />
          <FilterGroup
            label="Rol"
            options={(Object.keys(ROLE_LABEL) as Role[]).map((r) => ({ id: r, label: ROLE_LABEL[r] }))}
            value={role}
            onChange={(v) => setRole(v as Role | null)}
          />
          <FilterGroup label="Skill" options={SKILLS} value={skill} onChange={(v) => setSkill(v as SkillId | null)} />
        </Card>
      )}

      {filtering ? (
        <section className="mt-8" aria-live="polite">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
            </p>
            <button onClick={clear} className="flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              <X className="size-3.5" /> Limpiar
            </button>
          </div>
          {results.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((c) => (
                <CourseCard key={c.id} course={c} state={s} />
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center">
              <p className="font-display text-lg font-semibold text-ink">Sin resultados</p>
              <p className="mt-1 text-sm text-muted-foreground">Prueba con otra palabra o quita algún filtro.</p>
            </Card>
          )}
        </section>
      ) : (
        <div className="mt-10 flex flex-col gap-12">
          <section>
            <SectionTitle eyebrow="Kunno College" title="Cuatro academias" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ACADEMIES.map((a) => (
                <Link key={a.n} href={a.href} className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-mint">
                  <span className="font-display text-sm font-semibold text-brand tabular">{a.n}</span>
                  <span className="mt-6 font-display text-lg font-semibold text-ink">{a.title}</span>
                  <span className="mt-1 text-sm text-muted-foreground">{a.desc}</span>
                  <ArrowRight className="mt-4 size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-brand" />
                </Link>
              ))}
            </div>
          </section>

          <section id="realestate" className="scroll-mt-24">
            <SectionTitle eyebrow="03 · Real Estate & Investment Academy" title="De vendedor a asesor con conocimientos de inversión" />
            <div className="mb-6 overflow-hidden rounded-3xl bg-ink p-6 text-white md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                {['Vendedor', 'Consultor inmobiliario', 'Asesor con conocimientos de inversión'].map((t, i) => (
                  <div key={t} className="flex items-center gap-3 md:flex-1">
                    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold', i === 2 ? 'bg-mint text-ink' : 'bg-white/10 text-white')}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{t}</span>
                    {i < 2 && <ArrowRight className="hidden size-4 text-white/30 md:block" />}
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                {STAGES.map((st) => {
                  const cs = reCourses.filter((c) => c.stage === st.id)
                  const done = cs.filter((c) => courseProgress(s, c.id).status === 'done').length
                  return (
                    <div key={st.id} className="rounded-2xl bg-white/5 p-4">
                      <p className="font-display font-semibold text-mint">{st.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/60">{st.topics.join(' · ')}</p>
                      <p className="mt-3 text-[11px] font-semibold text-white/80 tabular">
                        {done}/{cs.length} cursos
                      </p>
                    </div>
                  )
                })}
              </div>
              <p className="mt-5 text-[11px] text-white/50">
                Contenido educativo. No constituye asesoría financiera personalizada.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reCourses.map((c) => (
                <CourseCard key={c.id} course={c} state={s} />
              ))}
            </div>
          </section>

          <section id="habilidades" className="scroll-mt-24">
            <SectionTitle eyebrow="04 · Habilidades & Herramientas" title="Habilidades transversales" />
            <div className="mb-6 flex flex-wrap gap-2">
              {SKILL_TOPICS.map((t) =>
                t.courseId ? (
                  <Link key={t.name} href={`/curso/${t.courseId}`} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-ink transition hover:border-mint">
                    {t.name}
                  </Link>
                ) : (
                  <span key={t.name} className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground">
                    {t.name} · Próximamente
                  </span>
                ),
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skillCourses.map((c) => (
                <CourseCard key={c.id} course={c} state={s} />
              ))}
            </div>
          </section>

          <section>
            <SectionTitle eyebrow="Todos los cursos" title={`${LEARNING_COURSES.length} cursos disponibles`} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LEARNING_COURSES.filter((c) => c.academy === 'rol').map((c) => (
                <CourseCard key={c.id} course={c} state={s} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: string; label: string }[]
  value: string | null
  onChange: (v: string | null) => void
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            aria-pressed={value === o.id}
            onClick={() => onChange(value === o.id ? null : o.id)}
            className={cn(
              'rounded-lg border px-2.5 py-1 text-xs font-medium transition',
              value === o.id ? 'border-brand bg-sage text-brand' : 'border-border text-ink hover:border-mint',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
