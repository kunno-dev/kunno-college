'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resetDemo, updateSettings, useAppState } from '@/lib/store'
import { Card, Modal, PageHeader, SectionTitle, btn } from './ui'

const GOALS = [5, 10, 15, 20]

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition', checked ? 'bg-brand' : 'bg-input')}
      >
        <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </label>
  )
}

export function SettingsView() {
  const s = useAppState()
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configuración" subtitle="Ajusta tu experiencia de aprendizaje." />

      <Card className="p-6">
        <SectionTitle title="Meta diaria" />
        <p className="mb-4 text-sm text-muted-foreground">Sesiones cortas, todos los días. ¿Cuántos minutos quieres dedicar?</p>
        <div className="grid grid-cols-4 gap-2">
          {GOALS.map((g) => (
            <button
              key={g}
              onClick={() => updateSettings({ dailyGoal: g })}
              aria-pressed={s.settings.dailyGoal === g}
              className={cn('h-12 rounded-xl border font-display font-semibold tabular', s.settings.dailyGoal === g ? 'border-ink bg-ink text-white' : 'border-border text-ink hover:border-mint')}
            >
              {g} min
            </button>
          ))}
        </div>
      </Card>

      <Card className="mt-6 px-6 py-2">
        <div className="divide-y divide-border">
          <Toggle checked={s.settings.notifyFlow} onChange={(v) => updateSettings({ notifyFlow: v })} label="Aprendizaje en Kunno" hint="Sugerencias de College dentro de tu flujo de trabajo en Kunno." />
          <Toggle checked={s.settings.notifyStreak} onChange={(v) => updateSettings({ notifyStreak: v })} label="Recordatorio de racha" hint="Un aviso si aún no aprendes hoy." />
          <Toggle checked={s.settings.notifyTeam} onChange={(v) => updateSettings({ notifyTeam: v })} label="Asignaciones del equipo" hint="Cuando tu gerente te asigne una capacitación." />
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <SectionTitle title="Demo" />
        <p className="mb-4 text-sm text-muted-foreground">Restablece el progreso para volver a presentar la experiencia desde el onboarding.</p>
        <button onClick={() => setConfirm(true)} className={cn(btn.outline)}>
          <RotateCcw className="size-4" /> Reiniciar demo
        </button>
      </Card>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="¿Reiniciar la demo?">
        <p className="text-sm text-muted-foreground">Se restablecerá el progreso, XP y asignaciones a los valores iniciales.</p>
        <div className="mt-6 flex gap-2">
          <button onClick={() => setConfirm(false)} className={cn(btn.outline, 'flex-1')}>Cancelar</button>
          <button
            onClick={() => {
              resetDemo()
              router.push('/onboarding')
            }}
            className={cn(btn.primary, 'flex-1')}
          >
            Reiniciar
          </button>
        </div>
      </Modal>
    </div>
  )
}
