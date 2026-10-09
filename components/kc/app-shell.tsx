'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import {
  BarChart3,
  Building2,
  Compass,
  Flame,
  GraduationCap,
  Home,
  LayoutGrid,
  LogOut,
  Route,
  Settings,
  User,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout, setRole, useAppState, useHydrated } from '@/lib/store'
import { getLevel } from '@/lib/engine'
import { ROLE_LABEL } from '@/lib/data/skills'
import { KunnoMark } from './blocks'
import { KunnoCoach } from './coach'

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`)

export function AppShell({ children }: { children: ReactNode }) {
  const s = useAppState()
  const hydrated = useHydrated()
  const router = useRouter()
  const path = usePathname()
  const leader = s.user.role !== 'asesor'

  useEffect(() => {
    if (!hydrated) return
    if (!s.auth.loggedIn) router.replace('/')
    else if (!s.user.onboarded) router.replace('/onboarding')
  }, [hydrated, s.auth.loggedIn, s.user.onboarded, router])

  if (!hydrated || !s.auth.loggedIn || !s.user.onboarded) {
    return <div className="min-h-dvh bg-background" aria-busy="true" />
  }

  const lvl = getLevel(s.xp)
  const nav = [
    { href: '/inicio', label: 'Inicio', icon: Home },
    { href: '/ruta', label: 'Mi Ruta', icon: Route },
    { href: '/explorar', label: 'Explorar', icon: Compass },
    { href: '/productos', label: 'Productos', icon: Building2 },
    { href: '/progreso', label: 'Progreso', icon: BarChart3 },
    ...(leader ? [{ href: '/equipo', label: 'Equipo', icon: Users }] : []),
  ]
  const mobileNav = [
    { href: '/inicio', label: 'Inicio', icon: Home },
    leader
      ? { href: '/equipo', label: 'Equipo', icon: Users }
      : { href: '/ruta', label: 'Aprender', icon: GraduationCap },
    { href: '/productos', label: 'Productos', icon: Building2 },
    { href: '/progreso', label: 'Progreso', icon: BarChart3 },
    { href: '/perfil', label: 'Perfil', icon: User },
  ]

  const switchView = () => {
    const next = leader ? 'asesor' : 'gerente'
    setRole(next)
    router.push(next === 'gerente' ? '/equipo' : '/inicio')
  }

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="px-6 pb-6 pt-7">
          <KunnoMark light />
        </div>
        <nav aria-label="Principal" className="flex flex-1 flex-col gap-1 px-3">
          {nav.map((item) => {
            const active = isActive(path, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  active ? 'bg-sidebar-accent text-white' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white',
                )}
              >
                <item.icon className={cn('size-[18px]', active && 'text-mint')} />
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/kunno"
            className={cn(
              'mt-6 flex items-center gap-3 rounded-xl border border-sidebar-border px-3 py-2.5 text-sm font-medium transition',
              isActive(path, '/kunno') ? 'bg-sidebar-accent text-white' : 'text-sidebar-foreground/70 hover:text-white',
            )}
          >
            <LayoutGrid className="size-[18px]" />
            <span className="flex-1">Abrir kunno.erp</span>
            <span className="rounded bg-mint/15 px-1.5 py-px text-[10px] font-semibold text-mint">DEMO</span>
          </Link>
        </nav>

        <div className="flex flex-col gap-1 border-t border-sidebar-border px-3 py-4">
          <div className="mb-3 rounded-xl bg-sidebar-accent p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sidebar-foreground/70">Vista demo</span>
              <span className="font-semibold text-white">{ROLE_LABEL[s.user.role]}</span>
            </div>
            <button
              onClick={switchView}
              className="mt-2 w-full rounded-lg bg-white/5 py-1.5 text-xs font-semibold text-mint transition hover:bg-white/10"
            >
              Cambiar a vista {leader ? 'Asesor' : 'Gerente'}
            </button>
          </div>
          {[
            { href: '/perfil', label: 'Perfil', icon: User },
            { href: '/configuracion', label: 'Configuración', icon: Settings },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(path, item.href) ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                isActive(path, item.href) ? 'bg-sidebar-accent text-white' : 'text-sidebar-foreground/70 hover:text-white',
              )}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => {
              logout()
              router.replace('/')
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-sidebar-foreground/70 transition hover:text-white"
          >
            <LogOut className="size-[18px]" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <KunnoMark />
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-ink ring-1 ring-border">
            <Flame className="size-3.5 text-brand" /> {s.streak}
          </span>
          <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-mint">Nv {lvl.level}</span>
          <button onClick={switchView} className="rounded-full px-2.5 py-1 text-xs font-semibold text-brand ring-1 ring-border">
            {leader ? 'Asesor' : 'Gerente'}
          </button>
        </div>
      </header>

      <main className="pb-28 lg:pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 md:px-8 md:pt-10">{children}</div>
      </main>

      <nav
        aria-label="Navegación móvil"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {mobileNav.map((item) => {
            const active = isActive(path, item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium', active ? 'text-brand' : 'text-muted-foreground')}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <KunnoCoach />
    </div>
  )
}
