'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Briefcase, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getState, login } from '@/lib/store'
import { KunnoMark } from './blocks'
import { btn } from './ui'

const PROFILES = [
  { id: 'asesor' as const, name: 'Alex Rivera', role: 'Asesor inmobiliario', email: 'alex.rivera@kunno.demo', icon: UserRound },
  { id: 'gerente' as const, name: 'Mónica Salinas', role: 'Gerente comercial', email: 'monica.salinas@kunno.demo', icon: Briefcase },
]

export function LoginScreen() {
  const router = useRouter()
  const [profile, setProfile] = useState<'asesor' | 'gerente'>('asesor')
  const [email, setEmail] = useState(PROFILES[0].email)
  const [password, setPassword] = useState('demo1234')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, profile)
    const s = getState()
    router.push(!s.user.onboarded ? '/onboarding' : profile === 'gerente' ? '/equipo' : '/inicio')
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-ink lg:block">
        <Image src="/brand/login.png" alt="" fill priority className="object-cover opacity-60" sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <KunnoMark light />
          <div className="max-w-md">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-mint">kunno.erp · kunno.wallet · kunno.college</p>
            <p className="font-display text-4xl font-semibold leading-tight text-white text-balance">
              Kunno te ayuda a hacer tu trabajo. College te ayuda a hacerlo mejor.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center px-6 py-12 md:px-16">
        <div className="mx-auto w-full max-w-sm">
          <KunnoMark className="mb-10 lg:hidden" />
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Bienvenido de vuelta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Entra con tu cuenta de Kunno para continuar aprendiendo.</p>

          <fieldset className="mt-8">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Perfil demo</legend>
            <div className="grid grid-cols-2 gap-3">
              {PROFILES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={profile === p.id}
                  onClick={() => {
                    setProfile(p.id)
                    setEmail(p.email)
                  }}
                  className={cn(
                    'flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition',
                    profile === p.id ? 'border-brand bg-sage ring-1 ring-brand' : 'border-border bg-card hover:border-mint',
                  )}
                >
                  <p.icon className="size-5 text-brand" />
                  <span className="text-sm font-semibold text-ink">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.role}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ink">Correo</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-mint focus:ring-3 focus:ring-mint/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-ink">Contraseña</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-mint focus:ring-3 focus:ring-mint/30"
              />
            </div>
            <button type="submit" className={cn(btn.primary, 'mt-2 h-12')}>
              Entrar <ArrowRight className="size-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            MVP demo · Acceso simulado, tu progreso se guarda en este dispositivo.
          </p>
        </div>
      </section>
    </main>
  )
}
