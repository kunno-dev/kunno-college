'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Award, LogOut, Settings } from 'lucide-react'
import type { Role } from '@/lib/types'
import { cn } from '@/lib/utils'
import { logout, setRole, useAppState } from '@/lib/store'
import { earnedCertifications, getLevel } from '@/lib/engine'
import { BADGES, ROLE_LABEL } from '@/lib/data/skills'
import { ROLE_TRACKS } from '@/lib/data/courses'
import { BadgeTile } from './blocks'
import { Avatar, Card, ProgressBar, SectionTitle, btn } from './ui'

const ROLES: Role[] = ['asesor', 'gerente', 'subdirector', 'director']

export function ProfileView() {
  const s = useAppState()
  const router = useRouter()
  const lvl = getLevel(s.xp)
  const initials = s.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  const certs = earnedCertifications(s)

  return (
    <div className="mx-auto max-w-3xl">
      <header className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Avatar initials={initials} className="size-20 text-xl" />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{s.user.name}</h1>
          <p className="text-muted-foreground">
            {ROLE_LABEL[s.user.role]} · {s.user.team}
          </p>
          <p className="text-sm text-muted-foreground">{s.auth.email}</p>
        </div>
        <Link href="/configuracion" className={cn(btn.outline, btn.sm)}>
          <Settings className="size-4" /> Configuración
        </Link>
      </header>

      <Card className="mt-8 p-6">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-2xl font-semibold text-ink">Nivel {lvl.level}</p>
          <p className="font-display text-sm font-semibold tabular text-ink">{s.xp.toLocaleString('es-MX')} XP</p>
        </div>
        <ProgressBar value={lvl.pct} className="mt-3" label="Progreso de nivel" />
        <p className="mt-2 text-xs text-muted-foreground">{lvl.toNext} XP para nivel {lvl.level + 1}</p>
      </Card>

      <Card className="mt-6 p-6">
        <SectionTitle eyebrow="Academia 01 · Mi rol" title="Tu rol actual" />
        <p className="mb-4 text-sm text-muted-foreground">La experiencia, tu ruta y los skills se adaptan al rol que elijas.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              aria-pressed={s.user.role === r}
              className={cn(
                'rounded-xl border p-3 text-left transition',
                s.user.role === r ? 'border-ink bg-ink text-white' : 'border-border hover:border-mint',
              )}
            >
              <span className="block text-sm font-semibold">{ROLE_LABEL[r]}</span>
              <span className={cn('text-[11px]', s.user.role === r ? 'text-white/60' : 'text-muted-foreground')}>
                {ROLE_TRACKS[r].milestone}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink">
          <span className="text-muted-foreground">Objetivo: </span>
          {ROLE_TRACKS[s.user.role].objective}
        </p>
      </Card>

      <Card className="mt-6 p-6">
        <SectionTitle title="Certificaciones" />
        {certs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no tienes certificaciones.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {certs.map((c) => (
              <li key={c.id}>
                <Link href={`/certificado/${c.id}`} className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">
                  <Award className="size-3.5 text-mint" /> {c.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="mt-6 p-6">
        <SectionTitle title="Badges" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BADGES.map((b) => (
            <BadgeTile key={b.id} badge={b} earned={s.badges.includes(b.id)} />
          ))}
        </div>
      </Card>

      <button
        onClick={() => {
          logout()
          router.push('/')
        }}
        className={cn(btn.ghost, 'mt-6 w-full text-destructive')}
      >
        <LogOut className="size-4" /> Cerrar sesión
      </button>
    </div>
  )
}
