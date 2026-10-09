'use client'

import Link from 'next/link'
import { ArrowRight, Flame, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/store'
import { certProgress, completedCourseCount, earnedCertifications, getLevel, recommendationForSkill, weakestSkill } from '@/lib/engine'
import { BADGES, CERTIFICATIONS, ROLE_LABEL, ROLE_SKILLS, SKILLS, skillLabel } from '@/lib/data/skills'
import { PRODUCTS } from '@/lib/data/products'
import { ROLE_TRACKS } from '@/lib/data/courses'
import { BadgeTile, CertRow, ReadinessRow, SkillBars } from './blocks'
import { Card, PageHeader, ProgressBar, SectionTitle, Stat, btn } from './ui'

export function ProgressView() {
  const s = useAppState()
  const lvl = getLevel(s.xp)
  const weak = weakestSkill(s)
  const rec = recommendationForSkill(s, weak)
  const ids = ROLE_SKILLS[s.user.role]
  const growth = SKILLS.filter((sk) => ids.includes(sk.id))
    .map((sk) => ({ ...sk, delta: s.skills[sk.id] - s.skillBaseline[sk.id] }))
    .sort((a, b) => b.delta - a.delta)[0]

  return (
    <div>
      <PageHeader eyebrow={`${ROLE_TRACKS[s.user.role].milestone} · ${ROLE_LABEL[s.user.role]}`} title="Tu crecimiento" subtitle="Skills, productos y certificaciones: lo que realmente mide tu preparación." />

      <Card className="grid grid-cols-2 gap-6 p-6 md:grid-cols-5 md:p-8">
        <Stat label="Nivel" value={lvl.level} />
        <Stat label="XP total" value={s.xp.toLocaleString('es-MX')} />
        <Stat label="Cursos completados" value={completedCourseCount(s)} />
        <Stat label="Horas de aprendizaje" value={(s.minutes / 60).toFixed(1)} />
        <Stat label="Certificaciones" value={earnedCertifications(s).length} />
        <div className="col-span-2 md:col-span-5">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Nivel {lvl.level}</span>
            <span className="tabular">{lvl.toNext} XP para nivel {lvl.level + 1}</span>
          </div>
          <ProgressBar value={lvl.pct} label="Progreso de nivel" />
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink">
            <Flame className="size-3.5 text-brand" /> Racha de {s.streak} días
          </p>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <SectionTitle eyebrow="Skill Score" title="Skill map" />
          <SkillBars skills={s.skills} baseline={s.skillBaseline} ids={ids} />
          {growth && growth.delta > 0 && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-sage p-4">
              <TrendingUp className="size-5 text-brand" />
              <p className="text-sm text-ink">
                <span className="font-semibold uppercase">{growth.label}</span>{' '}
                <span className="tabular">{s.skillBaseline[growth.id]} → {s.skills[growth.id]}</span>
                <span className="ml-2 font-semibold text-brand">+{growth.delta} este mes</span>
              </p>
            </div>
          )}
        </Card>
        <Card className="p-6">
          <SectionTitle eyebrow="Métrica clave" title="Product Readiness" action={<Link href="/productos" className="text-sm font-medium text-brand">Ver productos</Link>} />
          <div className="flex flex-col gap-2">
            {PRODUCTS.map((p) => (
              <ReadinessRow key={p.id} product={p} state={s} />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <SectionTitle title="Certificaciones" />
          <div className="flex flex-col gap-1">
            {CERTIFICATIONS.map((c) => (
              <CertRow key={c.id} name={c.name} pct={certProgress(s, c.id)} href={`/certificado/${c.id}`} />
            ))}
          </div>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <SectionTitle title="Logros" action={<span className="text-sm text-muted-foreground tabular">{s.badges.length} / {BADGES.length}</span>} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BADGES.map((b) => (
              <BadgeTile key={b.id} badge={b} earned={s.badges.includes(b.id)} />
            ))}
          </div>
        </Card>
      </div>

      <section className="mt-6 flex flex-col gap-4 rounded-3xl bg-ink p-6 text-white md:flex-row md:items-center md:p-8">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mint">Tu siguiente oportunidad</p>
          <p className="mt-2 font-display text-xl font-semibold text-balance">
            Fortalecer {skillLabel(weak).toLowerCase()} podría ayudarte a convertirte en un {s.user.role === 'asesor' ? 'asesor' : 'líder'} más completo.
          </p>
          <p className="mt-1 text-sm text-white/60">Tu skill actual: {s.skills[weak]} · {rec ? `Siguiente: ${rec.title}` : 'Explora la academia'}</p>
        </div>
        <Link href={weak === 'inversion' || weak === 'realestate' ? '/explorar?academia=realestate' : rec ? `/curso/${rec.id}` : '/explorar'} className={cn(btn.brand, 'h-12 uppercase tracking-wide')}>
          Ver ruta recomendada <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  )
}
