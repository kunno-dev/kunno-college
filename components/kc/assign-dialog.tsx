'use client'

import { useState } from 'react'
import { Check, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { addAssignment } from '@/lib/store'
import { PRODUCTS } from '@/lib/data/products'
import { ASSIGNABLE_ROUTES, TEAM } from '@/lib/data/team'
import { Avatar, Modal, btn } from './ui'

type Kind = 'producto' | 'ruta'

export type AssignPreset = { kind: Kind; targetId: string; memberIds: string[] }

const DUE = [
  { id: '7', label: '7 días' },
  { id: '14', label: '14 días' },
  { id: '30', label: '30 días' },
]

function dueDate(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function AssignDialog({ open, onClose, preset }: { open: boolean; onClose: () => void; preset: AssignPreset }) {
  return (
    <Modal open={open} onClose={onClose} title="Asignar capacitación">
      {open && <AssignForm key={JSON.stringify(preset)} preset={preset} onClose={onClose} />}
    </Modal>
  )
}

function AssignForm({ preset, onClose }: { preset: AssignPreset; onClose: () => void }) {
  const [kind, setKind] = useState<Kind>(preset.kind)
  const [target, setTarget] = useState(preset.targetId)
  const [members, setMembers] = useState<string[]>(preset.memberIds)
  const [due, setDue] = useState('14')
  const [done, setDone] = useState(false)

  const options = kind === 'producto' ? PRODUCTS.map((p) => ({ id: p.id, label: `${p.name} · Product Training` })) : ASSIGNABLE_ROUTES
  const targetLabel = options.find((o) => o.id === target)?.label ?? ''
  const toggle = (id: string) => setMembers((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))
  const pending = kind === 'producto' ? TEAM.filter((m) => (m.readiness[target] ?? 0) < 100).map((m) => m.id) : []

  const submit = () => {
    if (!target || members.length === 0) return
    addAssignment({ memberIds: members, kind, targetId: target, targetLabel, due: dueDate(Number(due)) })
    setDone(true)
  }

  if (done) {
    return (
      <div className="px-5 py-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-brand" />
        <p className="mt-4 font-display text-xl font-semibold text-ink">Capacitación asignada</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {targetLabel} · {members.length} {members.length === 1 ? 'persona' : 'personas'} · vence en {due} días
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Recibirán la recomendación en su Inicio de Kunno College.</p>
        <button onClick={onClose} className={cn(btn.primary, 'mt-6 w-full')}>Listo</button>
      </div>
    )
  }

  return (
      <div className="flex flex-col gap-5 p-5">
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</legend>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
          {(['producto', 'ruta'] as Kind[]).map((k) => (
            <button
              key={k}
              onClick={() => {
                setKind(k)
                setTarget(k === 'producto' ? PRODUCTS[1].id : ASSIGNABLE_ROUTES[2].id)
              }}
              className={cn('h-9 rounded-lg text-sm font-medium transition', kind === k ? 'bg-card text-ink shadow-sm' : 'text-muted-foreground')}
            >
              {k === 'producto' ? 'Producto' : 'Ruta'}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{kind === 'producto' ? 'Producto' : 'Ruta'}</span>
        <select value={target} onChange={(e) => setTarget(e.target.value)} className="h-11 rounded-xl border border-input bg-card px-3 text-sm text-ink">
          {options.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </label>

      <fieldset>
        <div className="mb-2 flex items-center justify-between">
          <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Personas ({members.length})</legend>
          <div className="flex gap-3 text-xs font-medium">
            {pending.length > 0 && (
              <button onClick={() => setMembers(pending)} className="text-brand">Sin certificar ({pending.length})</button>
            )}
            <button onClick={() => setMembers(members.length === TEAM.length ? [] : TEAM.map((m) => m.id))} className="text-muted-foreground hover:text-ink">
              {members.length === TEAM.length ? 'Ninguna' : 'Todas'}
            </button>
          </div>
        </div>
        <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto">
          {TEAM.map((m) => {
            const on = members.includes(m.id)
            const r = kind === 'producto' ? m.readiness[target] ?? 0 : undefined
            return (
              <li key={m.id}>
                <button
                  onClick={() => toggle(m.id)}
                  aria-pressed={on}
                  className={cn('flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition', on ? 'border-brand bg-sage/50' : 'border-transparent hover:bg-muted')}
                >
                  <Avatar initials={m.initials} className="size-8" />
                  <span className="flex-1 text-sm font-medium text-ink">{m.name}</span>
                  {r !== undefined && <span className="text-xs text-muted-foreground tabular">{r >= 100 ? 'Certificado' : `${r}%`}</span>}
                  <span className={cn('flex size-5 items-center justify-center rounded-md border', on ? 'border-brand bg-brand text-white' : 'border-input')}>
                    {on && <Check className="size-3" />}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha límite</legend>
        <div className="flex gap-2">
          {DUE.map((d) => (
            <button
              key={d.id}
              onClick={() => setDue(d.id)}
              className={cn('h-9 flex-1 rounded-lg border text-sm font-medium', due === d.id ? 'border-ink bg-ink text-white' : 'border-border text-ink')}
            >
              {d.label}
            </button>
          ))}
        </div>
      </fieldset>

      <button onClick={submit} disabled={members.length === 0} className={cn(btn.brand, 'h-12 uppercase tracking-wide')}>
        Asignar a {members.length} {members.length === 1 ? 'persona' : 'personas'}
      </button>
    </div>
  )
}
