import type { Course, Lesson, LessonBlock, LessonFormat, QuizQuestion } from '@/lib/types'

export function course(c: Omit<Course, 'minutes'>): Course {
  return { ...c, minutes: c.lessons.reduce((sum, l) => sum + l.minutes, 0) }
}

export function lesson(
  title: string,
  minutes: number,
  format: LessonFormat,
  ...blocks: LessonBlock[]
): Lesson {
  return { title, minutes, format, blocks }
}

export const text = (body: string, title?: string): LessonBlock => ({ type: 'text', body, title })
export const points = (title: string, items: string[]): LessonBlock => ({
  type: 'keypoints',
  title,
  items,
})
export const steps = (title: string, items: [string, string][]): LessonBlock => ({
  type: 'steps',
  title,
  items: items.map(([label, detail]) => ({ label, detail })),
})
export const video = (title: string, duration: string, caption: string): LessonBlock => ({
  type: 'video',
  title,
  duration,
  caption,
})
export const tip = (body: string): LessonBlock => ({ type: 'tip', body })
export const formula = (label: string, f: string, example: string): LessonBlock => ({
  type: 'formula',
  label,
  formula: f,
  example,
})
export const objection = (quote: string, body: string): LessonBlock => ({
  type: 'objection',
  quote,
  body,
})
export const facts = (title: string, items: [string, string][]): LessonBlock => ({
  type: 'facts',
  title,
  items: items.map(([label, value]) => ({ label, value })),
})
export const kase = (
  context: string,
  quote: string,
  question: string,
  options: [string, boolean, string][],
): LessonBlock => ({
  type: 'case',
  context,
  quote,
  question,
  options: options.map(([t, correct, feedback]) => ({ text: t, correct, feedback })),
})
export const q = (
  question: string,
  options: string[],
  answer: number,
  explanation: string,
  area?: string,
): QuizQuestion => ({ q: question, options, answer, explanation, area })
