'use client'

import Link from 'next/link'
import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 h-11 text-sm font-semibold text-white transition hover:bg-ink/90 active:translate-y-px disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-mint/60',
  brand:
    'inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 h-11 text-sm font-semibold text-white transition hover:bg-brand/90 active:translate-y-px disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-mint/60',
  outline:
    'inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 h-11 text-sm font-semibold text-ink transition hover:bg-muted active:translate-y-px disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-mint/60',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-xl px-3 h-10 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-mint/60',
  sm: 'h-9 px-3 text-[13px] rounded-lg',
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-2xl border border-border bg-card', className)}>{children}</div>
}

export function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">{eyebrow}</p>
        )}
        <h2 className="text-lg font-semibold tracking-tight text-ink text-balance">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-ink text-balance md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-pretty text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}

export function ProgressBar({
  value,
  className,
  tone = 'brand',
  label,
}: {
  value: number
  className?: string
  tone?: 'brand' | 'mint' | 'ink'
  label?: string
}) {
  const color = tone === 'mint' ? 'bg-mint' : tone === 'ink' ? 'bg-ink' : 'bg-brand'
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-sage', className)}
    >
      <div className={cn('h-full rounded-full transition-[width] duration-700', color)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

export function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  children,
  dark,
}: {
  value: number
  size?: number
  stroke?: number
  children?: ReactNode
  dark?: boolean
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" className={dark ? 'stroke-white/10' : 'stroke-sage'} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (Math.min(100, value) / 100) * c}
          className={cn('transition-[stroke-dashoffset] duration-700', dark ? 'stroke-mint' : 'stroke-brand')}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

export function Pill({
  children,
  tone = 'sage',
  className,
}: {
  children: ReactNode
  tone?: 'sage' | 'ink' | 'mint' | 'outline' | 'warn'
  className?: string
}) {
  const tones = {
    sage: 'bg-sage text-brand',
    ink: 'bg-ink text-white',
    mint: 'bg-mint/25 text-ink',
    outline: 'border border-border text-muted-foreground',
    warn: 'bg-amber-50 text-amber-800 border border-amber-200',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', tones[tone], className)}>
      {children}
    </span>
  )
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-2xl font-semibold tracking-tight text-ink tabular md:text-3xl">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
      {hint && <span className="text-[11px] font-medium text-brand">{hint}</span>}
    </div>
  )
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-sage font-display text-xs font-semibold text-brand', className)}
    >
      {initials}
    </span>
  )
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-ink">
      <span aria-hidden="true">←</span> {label}
    </Link>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
  side,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  side?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60]">
      <button aria-label="Cerrar" className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-in fade-in" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'absolute flex flex-col bg-card shadow-xl',
          side
            ? 'inset-y-0 right-0 w-full max-w-md animate-in slide-in-from-right duration-300'
            : 'inset-x-0 bottom-0 max-h-[90dvh] rounded-t-3xl animate-in slide-in-from-bottom duration-300 md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:slide-in-from-bottom-4',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-ink" aria-label="Cerrar">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
