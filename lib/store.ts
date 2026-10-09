'use client'

import { useSyncExternalStore } from 'react'
import type { Role, SkillId } from '@/lib/types'
import { getCourse, productCourseId } from '@/lib/data/courses'
import { BADGES, CERTIFICATIONS } from '@/lib/data/skills'
import {
  type AppState,
  type Assignment,
  certProgress,
  createInitialState,
  evaluateBadges,
  getLevel,
  productReadiness,
} from '@/lib/engine'

const STORAGE_KEY = 'kunno-college-state-v2'

export function todayKey(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const SERVER_SNAPSHOT = createInitialState('2026-10-08')
let state: AppState | null = null
const listeners = new Set<() => void>()

function load(): AppState {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed.version === 2) return parsed
    }
  } catch {
    // Corrupted storage falls back to a fresh demo state
  }
  return createInitialState(todayKey())
}

export function getState(): AppState {
  if (!state) state = load()
  return state
}

export function setState(updater: (s: AppState) => AppState) {
  state = updater(getState())
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be unavailable (private mode); state still lives in memory
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAppState() {
  return useSyncExternalStore(subscribe, getState, () => SERVER_SNAPSHOT)
}

const noopSubscribe = () => () => {}
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

// ---------- Actions ----------

function touchStreak(s: AppState): AppState {
  const today = todayKey()
  if (s.lastActiveDate === today) return s
  const yesterday = todayKey(new Date(Date.now() - 86400000))
  return { ...s, streak: s.lastActiveDate === yesterday ? s.streak + 1 : 1, lastActiveDate: today }
}

export function login(email: string, profile: 'asesor' | 'gerente') {
  setState((s) => {
    if (profile === 'gerente') {
      return {
        ...s,
        auth: { loggedIn: true, email },
        user: { ...s.user, name: 'Mónica Salinas', role: 'gerente', onboarded: true, goals: ['Liderar equipos', 'Dominar Kunno'] },
      }
    }
    const switching = s.user.name !== 'Alex Rivera'
    return {
      ...s,
      auth: { loggedIn: true, email },
      user: {
        ...s.user,
        name: 'Alex Rivera',
        role: switching ? 'asesor' : s.user.role,
        onboarded: switching ? false : s.user.onboarded,
      },
    }
  })
}

export function logout() {
  setState((s) => ({ ...s, auth: { loggedIn: false, email: '' } }))
}

export function completeOnboarding(role: Role, goals: string[]) {
  setState((s) => ({ ...s, user: { ...s.user, role, goals, onboarded: true } }))
}

export function setRole(role: Role) {
  setState((s) => ({ ...s, user: { ...s.user, role } }))
}

export function updateSettings(patch: Partial<AppState['settings']>) {
  setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
}

export function resetDemo() {
  setState((s) => {
    const fresh = createInitialState(todayKey())
    return { ...fresh, auth: s.auth, user: { ...fresh.user, onboarded: false } }
  })
}

export function completeLesson(courseId: string, lessonIdx: number) {
  const course = getCourse(courseId)
  if (!course) return
  setState((prev) => {
    const s = touchStreak(prev)
    const cp = s.courses[courseId] ?? { completedLessons: [], lastLesson: 0, completed: false }
    const already = cp.completedLessons.includes(lessonIdx)
    return {
      ...s,
      minutes: s.minutes + (already ? 0 : course.lessons[lessonIdx].minutes),
      courses: {
        ...s.courses,
        [courseId]: {
          ...cp,
          completedLessons: already ? cp.completedLessons : [...cp.completedLessons, lessonIdx],
          lastLesson: Math.min(lessonIdx + 1, course.lessons.length - 1),
        },
      },
    }
  })
}

export type CompletionResult = {
  passed: boolean
  scorePct: number
  firstCompletion: boolean
  xpGained: number
  levelBefore: number
  levelAfter: number
  skill: { id: SkillId; before: number; after: number }
  newBadges: typeof BADGES
  readiness?: { productId: string; before: number; after: number }
  newCertifications: typeof CERTIFICATIONS
}

export function completeCourse(courseId: string, correct: number, total: number): CompletionResult {
  const course = getCourse(courseId)!
  const before = getState()
  const scorePct = Math.round((correct / total) * 100)
  const threshold = course.productId ? 80 : 60
  const passed = scorePct >= threshold
  const firstCompletion = !before.courses[courseId]?.completed
  const skillBefore = before.skills[course.skill]
  const certsBefore = new Set(CERTIFICATIONS.filter((c) => certProgress(before, c.id) >= 100).map((c) => c.id))
  const readinessBefore = course.productId ? productReadiness(before, course.productId) : undefined

  if (!passed) {
    return {
      passed,
      scorePct,
      firstCompletion,
      xpGained: 0,
      levelBefore: getLevel(before.xp).level,
      levelAfter: getLevel(before.xp).level,
      skill: { id: course.skill, before: skillBefore, after: skillBefore },
      newBadges: [],
      readiness: course.productId
        ? { productId: course.productId, before: readinessBefore!, after: readinessBefore! }
        : undefined,
      newCertifications: [],
    }
  }

  const xpGained = firstCompletion ? course.xp : 0
  const gain = firstCompletion ? course.skillGain : 0
  setState((prev) => {
    const s = touchStreak(prev)
    const cp = s.courses[courseId] ?? { completedLessons: [], lastLesson: 0, completed: false }
    const next: AppState = {
      ...s,
      xp: s.xp + xpGained,
      skills: { ...s.skills, [course.skill]: Math.min(100, s.skills[course.skill] + gain) },
      courses: {
        ...s.courses,
        [courseId]: {
          ...cp,
          completedLessons: course.lessons.map((_, i) => i),
          completed: true,
          lastLesson: 0,
          score: Math.max(cp.score ?? 0, scorePct),
          completedAt: todayKey(),
        },
      },
    }
    return { ...next, badges: evaluateBadges(next) }
  })
  const after = getState()
  return {
    passed,
    scorePct,
    firstCompletion,
    xpGained,
    levelBefore: getLevel(before.xp).level,
    levelAfter: getLevel(after.xp).level,
    skill: { id: course.skill, before: skillBefore, after: after.skills[course.skill] },
    newBadges: BADGES.filter((b) => after.badges.includes(b.id) && !before.badges.includes(b.id)),
    readiness: course.productId
      ? { productId: course.productId, before: readinessBefore!, after: productReadiness(after, course.productId) }
      : undefined,
    newCertifications: CERTIFICATIONS.filter((c) => certProgress(after, c.id) >= 100 && !certsBefore.has(c.id)),
  }
}

export function addAssignment(a: Omit<Assignment, 'id' | 'createdAt'>) {
  setState((s) => ({
    ...s,
    assignments: [{ ...a, id: `as-${Date.now()}`, createdAt: todayKey() }, ...s.assignments],
  }))
}

export { productCourseId }
