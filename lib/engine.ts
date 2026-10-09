import type { Role, SkillId } from '@/lib/types'
import { ALL_COURSES, LEARNING_COURSES, ROLE_TRACKS, getCourse, productCourseId } from '@/lib/data/courses'
import { PRODUCTS, getProduct } from '@/lib/data/products'
import { BADGES, CERTIFICATIONS, ROLE_SKILLS, skillLabel } from '@/lib/data/skills'

export type CourseProgress = {
  completedLessons: number[]
  lastLesson: number
  completed: boolean
  score?: number
  completedAt?: string
}

export type Assignment = {
  id: string
  memberIds: string[]
  kind: 'producto' | 'ruta' | 'curso'
  targetId: string
  targetLabel: string
  due: string
  createdAt: string
}

export type AppState = {
  version: 2
  auth: { loggedIn: boolean; email: string }
  user: { name: string; role: Role; goals: string[]; onboarded: boolean; team: string }
  xp: number
  streak: number
  lastActiveDate: string
  minutes: number
  skills: Record<SkillId, number>
  skillBaseline: Record<SkillId, number>
  courses: Record<string, CourseProgress>
  badges: string[]
  assignments: Assignment[]
  settings: { dailyGoal: number; notifyFlow: boolean; notifyStreak: boolean; notifyTeam: boolean }
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

export function createInitialState(today: string): AppState {
  const done = (id: string, score: number): CourseProgress => {
    const c = getCourse(id)!
    return { completedLessons: range(c.lessons.length), lastLesson: 0, completed: true, score, completedAt: today }
  }
  const partial = (id: string, n: number): CourseProgress => ({
    completedLessons: range(n),
    lastLesson: n,
    completed: false,
  })
  const base: AppState = {
    version: 2,
    auth: { loggedIn: false, email: '' },
    user: { name: 'Alex Rivera', role: 'asesor', goals: [], onboarded: false, team: 'Equipo Mérida Norte' },
    xp: 1240,
    streak: 7,
    lastActiveDate: today,
    minutes: 384,
    skills: { ventas: 78, prospeccion: 82, cierre: 65, realestate: 62, inversion: 45, kunno: 76, liderazgo: 35 },
    skillBaseline: { ventas: 74, prospeccion: 77, cierre: 61, realestate: 58, inversion: 38, kunno: 70, liderazgo: 35 },
    courses: {
      'fundamentos-inmobiliarios': done('fundamentos-inmobiliarios', 100),
      prospeccion: done('prospeccion', 100),
      'manejo-objeciones': partial('manejo-objeciones', 2),
      'domina-kunno': done('domina-kunno', 100),
      'marca-personal': done('marca-personal', 67),
      'que-es-real-estate': done('que-es-real-estate', 100),
      'prod-wuayakin': done('prod-wuayakin', 92),
      'prod-pitahaya': partial('prod-pitahaya', 10),
      'prod-telchac': partial('prod-telchac', 5),
    },
    badges: [],
    assignments: [],
    settings: { dailyGoal: 10, notifyFlow: true, notifyStreak: true, notifyTeam: true },
  }
  return { ...base, badges: evaluateBadges(base) }
}

// Levels
const LEVEL_THRESHOLDS = [0, 100, 250, 450, 650, 900, 1150, 1500, 1900, 2350, 2850, 3400, 4000]

export function getLevel(xp: number) {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1
  const next = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 700
  return { level, next, toNext: Math.max(0, next - xp), pct: Math.min(100, Math.round((xp / next) * 100)) }
}

// Courses
export function courseProgress(s: AppState, courseId: string) {
  const c = getCourse(courseId)
  const p = s.courses[courseId]
  if (!c) return { pct: 0, status: 'new' as const, remaining: 0, nextLesson: 0 }
  if (p?.completed) return { pct: 100, status: 'done' as const, remaining: 0, nextLesson: 0 }
  const completed = p?.completedLessons ?? []
  const pct = Math.round((completed.length / c.lessons.length) * 100)
  const remaining = c.lessons.reduce((sum, l, i) => (completed.includes(i) ? sum : sum + l.minutes), 0)
  const nextLesson = c.lessons.findIndex((_, i) => !completed.includes(i))
  return {
    pct,
    status: completed.length > 0 ? ('progress' as const) : ('new' as const),
    remaining,
    nextLesson: nextLesson === -1 ? c.lessons.length : nextLesson,
  }
}

export const isCompleted = (s: AppState, id: string) => !!s.courses[id]?.completed

export function completedCourseCount(s: AppState) {
  return Object.values(s.courses).filter((c) => c.completed).length
}

// Product readiness: 11 modules + final evaluation = 12 steps
export function productReadiness(s: AppState, productId: string) {
  const c = getCourse(productCourseId(productId))
  const p = s.courses[productCourseId(productId)]
  if (!c || !p) return 0
  if (p.completed) return 100
  return Math.round((p.completedLessons.length / (c.lessons.length + 1)) * 100)
}

export function readinessStatus(pct: number) {
  if (pct >= 100) return 'Certificado'
  if (pct >= 70) return 'Casi listo'
  if (pct > 0) return 'En preparación'
  return 'Sin iniciar'
}

// Certifications
export function certProgress(s: AppState, certId: string) {
  const cert = CERTIFICATIONS.find((c) => c.id === certId)
  if (!cert) return 0
  if (cert.kind === 'producto' && cert.productId) return productReadiness(s, cert.productId)
  const ids = cert.courseIds ?? []
  const total = ids.reduce((sum, id) => sum + courseProgress(s, id).pct, 0)
  return Math.round(total / Math.max(1, ids.length))
}

export function certScore(s: AppState, certId: string) {
  const cert = CERTIFICATIONS.find((c) => c.id === certId)
  if (!cert) return 0
  const ids = cert.kind === 'producto' && cert.productId ? [productCourseId(cert.productId)] : (cert.courseIds ?? [])
  const scores = ids.map((id) => s.courses[id]?.score ?? 0)
  return Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length))
}

export const earnedCertifications = (s: AppState) =>
  CERTIFICATIONS.filter((c) => certProgress(s, c.id) >= 100)

// Badges
export function evaluateBadges(s: AppState): string[] {
  const reCompleted = LEARNING_COURSES.filter((c) => c.academy === 'realestate' && isCompleted(s, c.id)).length
  const rules: Record<string, boolean> = {
    'primer-curso': completedCourseCount(s) >= 1,
    'racha-7': s.streak >= 7,
    prospector: isCompleted(s, 'prospeccion'),
    closer: isCompleted(s, 'cierre'),
    're-explorer': reCompleted >= 2,
    'kunno-expert': s.skills.kunno >= 80,
    'wuayakin-certified': productReadiness(s, 'wuayakin') >= 100,
    'pitahaya-certified': productReadiness(s, 'pitahaya') >= 100,
  }
  const earned = BADGES.filter((b) => rules[b.id]).map((b) => b.id)
  return Array.from(new Set([...(s.badges ?? []), ...earned]))
}

// Route
export function routeStages(s: AppState) {
  const track = ROLE_TRACKS[s.user.role]
  const currentIdx = track.courseIds.findIndex((id) => !isCompleted(s, id))
  const stages = track.courseIds.map((id, i) => ({
    course: getCourse(id)!,
    status:
      isCompleted(s, id) ? ('done' as const) : i === currentIdx ? ('current' as const) : ('locked' as const),
    progress: courseProgress(s, id),
  }))
  const doneCount = stages.filter((st) => st.status === 'done').length
  const allDone = doneCount === stages.length
  return {
    track,
    stages,
    doneCount,
    total: stages.length + 1,
    currentStep: allDone ? stages.length + 1 : doneCount + 1,
    milestoneUnlocked: allDone,
    current: currentIdx === -1 ? null : stages[currentIdx],
    totalMinutes: stages.reduce((sum, st) => sum + st.course.minutes, 0),
    totalXp: stages.reduce((sum, st) => sum + st.course.xp, 0),
  }
}

// Recommendations
export type Recommendation = {
  id: string
  kind: 'route' | 'skill' | 'product' | 'launch'
  title: string
  reason: string
  href: string
  cta: string
  minutes?: number
  xp?: number
}

export function weakestSkill(s: AppState) {
  const skills = ROLE_SKILLS[s.user.role]
  return [...skills].sort((a, b) => s.skills[a] - s.skills[b])[0]
}

export function recommendationForSkill(s: AppState, skill: SkillId) {
  const routeIds = new Set(ROLE_TRACKS[s.user.role].courseIds)
  const candidates = LEARNING_COURSES.filter(
    (c) => c.skill === skill && !isCompleted(s, c.id) && c.roles.includes(s.user.role),
  ).sort((a, b) => Number(routeIds.has(a.id)) - Number(routeIds.has(b.id)) || a.minutes - b.minutes)
  return candidates[0]
}

export function getRecommendations(s: AppState): Recommendation[] {
  const recs: Recommendation[] = []
  const route = routeStages(s)
  if (route.current) {
    const c = route.current.course
    recs.push({
      id: `route-${c.id}`,
      kind: 'route',
      title: c.title,
      reason: `Es tu siguiente etapa hacia ${route.track.milestone}.`,
      href: `/curso/${c.id}`,
      cta: 'Continuar',
      minutes: route.current.progress.remaining || c.minutes,
      xp: c.xp,
    })
  }
  const weak = weakestSkill(s)
  const skillCourse = recommendationForSkill(s, weak)
  if (skillCourse) {
    recs.push({
      id: `skill-${skillCourse.id}`,
      kind: 'skill',
      title: skillCourse.title,
      reason: `Tu skill de ${skillLabel(weak)} es ${s.skills[weak]}. ${skillCourse.tagline}`,
      href: `/curso/${skillCourse.id}`,
      cta: 'Comenzar',
      minutes: skillCourse.minutes,
      xp: skillCourse.xp,
    })
  }
  const selling = PRODUCTS.filter((p) => p.status === 'En comercialización')
    .map((p) => ({ p, r: productReadiness(s, p.id) }))
    .filter((x) => x.r < 100)
    .sort((a, b) => b.r - a.r)[0]
  if (selling) {
    recs.push({
      id: `product-${selling.p.id}`,
      kind: 'product',
      title: `${selling.p.name} · Product Training`,
      reason: `Estás comercializando ${selling.p.short}. Tu Product Readiness es ${selling.r}%. Complétalo para certificarte.`,
      href: `/productos/${selling.p.id}`,
      cta: 'Repasar producto',
    })
  }
  const launch = PRODUCTS.find((p) => p.status === 'Próximo lanzamiento')
  if (launch && productReadiness(s, launch.id) < 100) {
    const leader = s.user.role !== 'asesor'
    recs.push({
      id: `launch-${launch.id}`,
      kind: 'launch',
      title: `Lanzamiento: ${launch.name}`,
      reason: leader
        ? `Tu equipo comenzará a comercializar ${launch.name}. Prepara a tus asesores antes del lanzamiento.`
        : `${launch.name} inicia comercialización pronto. Prepárate antes del lanzamiento.`,
      href: leader ? '/equipo' : `/productos/${launch.id}`,
      cta: leader ? 'Preparar equipo' : 'Prepararme',
    })
  }
  return recs
}

export function totalCourseCount() {
  return ALL_COURSES.length
}

export function productName(id: string) {
  return getProduct(id)?.name ?? id
}
