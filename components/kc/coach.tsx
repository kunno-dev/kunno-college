'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { ArrowUp, BookOpen, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from './ui'

type Msg = {
  from: 'user' | 'coach'
  text: string
  practice?: { label: string; href: string }
  lesson?: { title: string; meta: string; href: string }
}

const QUICK = [
  'Practicar una venta',
  'Practicar una objeción',
  'Explícame un concepto',
  'Ayúdame con Kunno',
  'Ayúdame con un producto',
]

function respond(input: string): Msg {
  const t = input.toLowerCase()
  if (t.includes('roi') || t.includes('concepto')) {
    return {
      from: 'coach',
      text: 'Podrías explicarlo así:\n\n"El ROI te ayuda a estimar cuánto retorno genera una inversión respecto al capital invertido." Usa un escenario ilustrativo y aclara que no es una promesa de rendimiento.\n\n¿Quieres practicar cómo explicárselo a un prospecto?',
      practice: { label: 'Practicar', href: '/aprender/roi-inmobiliario?l=2' },
      lesson: { title: 'ROI inmobiliario', meta: 'Microlección · 3 min', href: '/aprender/roi-inmobiliario' },
    }
  }
  if (t.includes('objeci') || t.includes('caro') || t.includes('pensar')) {
    return {
      from: 'coach',
      text: 'Vamos con una de las más frecuentes: "Está muy caro." Recuerda: valida, entiende contra qué compara y lleva la conversación de precio a valor.\n\nTe preparé un caso práctico de 4 minutos.',
      practice: { label: 'Practicar objeción', href: '/aprender/manejo-objeciones?l=2' },
      lesson: { title: 'Manejo de objeciones', meta: 'Curso · 15 min', href: '/curso/manejo-objeciones' },
    }
  }
  if (t.includes('venta') || t.includes('cierre') || t.includes('cerrar')) {
    return {
      from: 'coach',
      text: 'Practiquemos un cierre consultivo: detecta señales de compra y propone un siguiente paso concreto. Te llevo a una simulación con un cliente que pregunta por el apartado.',
      practice: { label: 'Practicar venta', href: '/aprender/cierre?l=2' },
      lesson: { title: 'Cierre de operaciones', meta: 'Curso · 20 min', href: '/curso/cierre' },
    }
  }
  if (t.includes('kunno') || t.includes('seguimiento') || t.includes('prospecto')) {
    return {
      from: 'coach',
      text: 'En Kunno, filtra tus prospectos sin actividad en los últimos 3 días y agenda una tarea de seguimiento con fecha. Lo que no se registra, se olvida.',
      lesson: { title: 'Seguimiento efectivo', meta: 'Microlección · 6 min', href: '/curso/seguimiento-efectivo' },
    }
  }
  if (t.includes('producto') || t.includes('pitahaya') || t.includes('wuayakin') || t.includes('telchac') || t.includes('nubes')) {
    return {
      from: 'coach',
      text: 'Antes de hablar con un prospecto, repasa la Ficha rápida: qué es, para quién es, esquema de pago y objeciones frecuentes. En 5 minutos llegas preparado.',
      practice: { label: 'Abrir ficha de Pitahaya', href: '/productos/pitahaya/ficha' },
      lesson: { title: 'Mis productos', meta: 'Product Readiness', href: '/productos' },
    }
  }
  return {
    from: 'coach',
    text: 'Buena pregunta. Te sugiero empezar por tu siguiente etapa de ruta; está pensada para tu rol y tus skills actuales. También puedes pedirme practicar una objeción o explicarte un concepto como ROI.',
    lesson: { title: 'Mi ruta', meta: 'Tu siguiente paso', href: '/ruta' },
  }
}

export function KunnoCoach() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const endRef = useRef<HTMLDivElement>(null)

  const send = (text: string) => {
    const v = text.trim()
    if (!v) return
    setMsgs((m) => [...m, { from: 'user', text: v }, respond(v)])
    setInput('')
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-ink py-3 pl-3.5 pr-4 text-sm font-semibold text-white shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 lg:bottom-8 lg:right-8"
      >
        <Sparkles className="size-4 text-mint" />
        Kunno Coach
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Kunno Coach" side>
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 px-5 py-5">
            <div className="rounded-2xl rounded-tl-sm bg-sage p-4 text-sm text-ink">
              Hola 👋 ¿Qué quieres resolver?
            </div>
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink transition hover:border-mint hover:bg-sage"
                  >
                    {q}
                  </button>
                ))}
                <button
                  onClick={() => send('¿Cómo explico el ROI a un cliente?')}
                  className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-mint"
                >
                  {'"¿Cómo explico el ROI a un cliente?"'}
                </button>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={cn('flex flex-col gap-2', m.from === 'user' && 'items-end')}>
                <div
                  className={cn(
                    'max-w-[90%] whitespace-pre-line rounded-2xl p-4 text-sm leading-relaxed',
                    m.from === 'user' ? 'rounded-tr-sm bg-ink text-white' : 'rounded-tl-sm bg-sage text-ink',
                  )}
                >
                  {m.text}
                </div>
                {m.practice && (
                  <Link
                    href={m.practice.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand/90"
                  >
                    {m.practice.label}
                  </Link>
                )}
                {m.lesson && (
                  <Link
                    href={m.lesson.href}
                    onClick={() => setOpen(false)}
                    className="flex w-full max-w-[90%] items-center gap-3 rounded-xl border border-border p-3 transition hover:border-mint"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-sage text-brand">
                      <BookOpen className="size-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">Recomendado</span>
                      <span className="text-sm font-medium text-ink">{m.lesson.title}</span>
                      <span className="text-xs text-muted-foreground">{m.lesson.meta}</span>
                    </span>
                  </Link>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-card p-4"
          >
            <label htmlFor="coach-input" className="sr-only">
              Escribe tu pregunta
            </label>
            <input
              id="coach-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a tu coach..."
              className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-mint focus:ring-3 focus:ring-mint/30"
            />
            <button
              type="submit"
              aria-label="Enviar"
              disabled={!input.trim()}
              className="flex size-11 items-center justify-center rounded-xl bg-ink text-white transition disabled:opacity-30"
            >
              <ArrowUp className="size-4" />
            </button>
          </form>
          <p className="px-5 pb-4 text-[11px] text-muted-foreground">Respuestas DEMO. No constituyen asesoría financiera.</p>
        </div>
      </Modal>
    </>
  )
}
