'use client'

import { useState } from 'react'
import { Check, Lightbulb, Pause, Play, Quote, X } from 'lucide-react'
import type { LessonBlock } from '@/lib/types'
import { cn } from '@/lib/utils'

export function LessonBlockView({ block, onCaseAnswered }: { block: LessonBlock; onCaseAnswered?: () => void }) {
  switch (block.type) {
    case 'text':
      return (
        <div>
          {block.title && <h3 className="mb-2 font-display text-lg font-semibold text-ink">{block.title}</h3>}
          <p className="text-base leading-relaxed text-ink/80 text-pretty">{block.body}</p>
        </div>
      )
    case 'objection':
      return (
        <div className="rounded-3xl bg-ink p-6 text-white md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mint">Objeción</p>
          <p className="mt-3 font-display text-2xl font-semibold md:text-3xl">&ldquo;{block.quote}&rdquo;</p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{block.body}</p>
        </div>
      )
    case 'keypoints':
      return (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 font-display text-base font-semibold text-ink">{block.title}</h3>
          <ul className="flex flex-col gap-2.5">
            {block.items.map((it) => (
              <li key={it} className="flex gap-2.5 text-sm text-ink/80">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-sage">
                  <Check className="size-2.5 text-brand" />
                </span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      )
    case 'steps':
      return (
        <div>
          <h3 className="mb-3 font-display text-base font-semibold text-ink">{block.title}</h3>
          <ol className="grid gap-3 sm:grid-cols-2">
            {block.items.map((it, i) => (
              <li key={it.label} className="rounded-2xl border border-border bg-card p-4">
                <span className="font-display text-xs font-semibold text-brand tabular">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-1 font-semibold text-ink">{it.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{it.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      )
    case 'video':
      return <VideoBlock title={block.title} duration={block.duration} caption={block.caption} />
    case 'tip':
      return (
        <div className="flex gap-3 rounded-2xl bg-sage p-4 text-sm text-ink">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-brand" />
          <p className="leading-relaxed">{block.body}</p>
        </div>
      )
    case 'formula':
      return (
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{block.label}</p>
          <p className="mt-2 font-display text-xl font-semibold text-ink md:text-2xl">{block.formula}</p>
          <p className="mt-3 rounded-xl bg-muted/60 px-4 py-3 text-sm text-ink/80">{block.example}</p>
        </div>
      )
    case 'facts':
      return (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-ink">{block.title}</h3>
          </div>
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {block.items.map((it) => (
              <div key={it.label} className="border-t border-border pt-3">
                <dt className="text-xs text-muted-foreground">{it.label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink">{it.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )
    case 'case':
      return <CaseBlock block={block} onAnswered={onCaseAnswered} />
  }
}

function VideoBlock({ title, duration, caption }: { title: string; duration: string; caption: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <figure>
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(127,203,151,0.18),transparent_60%)]" />
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pausar video' : 'Reproducir video'}
          className="relative flex size-16 items-center justify-center rounded-full bg-white text-ink transition hover:scale-105"
        >
          {playing ? <Pause className="size-6" /> : <Play className="ml-1 size-6 fill-current" />}
        </button>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-white">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-white/60 tabular">{duration}</span>
        </div>
        {playing && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <div className="h-full w-1/3 animate-pulse bg-mint" />
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        {caption} <span className="text-xs">(Video demo)</span>
      </figcaption>
    </figure>
  )
}

function CaseBlock({ block, onAnswered }: { block: Extract<LessonBlock, { type: 'case' }>; onAnswered?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null)
  const chosen = picked !== null ? block.options[picked] : null
  return (
    <div className="rounded-3xl border border-mint/60 bg-sage/50 p-5 md:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Caso práctico</p>
      <p className="mt-2 text-sm text-ink/70">{block.context}</p>
      <div className="mt-4 flex gap-3 rounded-2xl bg-card p-4">
        <Quote className="size-5 shrink-0 text-brand" />
        <p className="text-base font-medium text-ink">
          <span className="text-muted-foreground">Cliente: </span>&ldquo;{block.quote}&rdquo;
        </p>
      </div>
      <p className="mt-5 font-display text-lg font-semibold text-ink">{block.question}</p>
      <div className="mt-3 flex flex-col gap-2" role="radiogroup">
        {block.options.map((o, i) => {
          const isPicked = picked === i
          const reveal = picked !== null
          return (
            <button
              key={o.text}
              role="radio"
              aria-checked={isPicked}
              disabled={reveal}
              onClick={() => {
                setPicked(i)
                onAnswered?.()
              }}
              className={cn(
                'flex items-start gap-3 rounded-2xl border bg-card p-4 text-left text-sm transition',
                !reveal && 'border-border hover:border-mint',
                reveal && o.correct && 'border-brand ring-1 ring-brand',
                reveal && isPicked && !o.correct && 'border-destructive/60',
                reveal && !isPicked && !o.correct && 'opacity-50',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                  reveal && o.correct ? 'border-brand bg-brand text-white' : reveal && isPicked ? 'border-destructive bg-destructive text-white' : 'border-input text-muted-foreground',
                )}
              >
                {reveal && o.correct ? <Check className="size-3.5" /> : reveal && isPicked ? <X className="size-3.5" /> : String.fromCharCode(65 + i)}
              </span>
              <span className="text-ink">{o.text}</span>
            </button>
          )
        })}
      </div>
      {chosen && (
        <div
          role="status"
          className={cn(
            'mt-4 animate-in fade-in slide-in-from-bottom-1 rounded-2xl p-4 text-sm duration-300',
            chosen.correct ? 'bg-brand text-white' : 'bg-card text-ink ring-1 ring-border',
          )}
        >
          <p className="font-display font-semibold">{chosen.correct ? 'Buena respuesta' : 'Puedes hacerlo mejor'}</p>
          <p className={cn('mt-1', chosen.correct ? 'text-white/85' : 'text-muted-foreground')}>{chosen.feedback}</p>
        </div>
      )}
    </div>
  )
}
