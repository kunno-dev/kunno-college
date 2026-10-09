export type SkillId =
  | 'ventas'
  | 'prospeccion'
  | 'cierre'
  | 'realestate'
  | 'inversion'
  | 'kunno'
  | 'liderazgo'

export type Role = 'asesor' | 'gerente' | 'subdirector' | 'director'
export type Academy = 'rol' | 'productos' | 'realestate' | 'habilidades'
export type Category =
  | 'Ventas'
  | 'Real Estate'
  | 'Inversión'
  | 'Liderazgo'
  | 'Kunno'
  | 'Gestión Comercial'
  | 'Herramientas'
export type Level = 'Básico' | 'Intermedio' | 'Avanzado'
export type Stage = 'Foundations' | 'Investor' | 'Analyst' | 'Expert'

export type CaseOption = { text: string; correct: boolean; feedback: string }

export type LessonBlock =
  | { type: 'text'; title?: string; body: string }
  | { type: 'objection'; quote: string; body: string }
  | { type: 'keypoints'; title: string; items: string[] }
  | { type: 'steps'; title: string; items: { label: string; detail: string }[] }
  | { type: 'video'; title: string; duration: string; caption: string }
  | { type: 'case'; context: string; quote: string; question: string; options: CaseOption[] }
  | { type: 'tip'; body: string }
  | { type: 'formula'; label: string; formula: string; example: string }
  | { type: 'facts'; title: string; items: { label: string; value: string }[] }

export type LessonFormat =
  | 'Lectura'
  | 'Video'
  | 'Caso'
  | 'Simulación'
  | 'Infografía'
  | 'Checklist'

export type Lesson = {
  title: string
  minutes: number
  format: LessonFormat
  blocks: LessonBlock[]
}

export type QuizQuestion = {
  q: string
  options: string[]
  answer: number
  explanation: string
  area?: string
}

export type Course = {
  id: string
  title: string
  tagline: string
  academy: Academy
  category: Category
  level: Level
  roles: Role[]
  skill: SkillId
  skillGain: number
  minutes: number
  xp: number
  learnings: string[]
  lessons: Lesson[]
  quiz: QuizQuestion[]
  productId?: string
  stage?: Stage
}

export type Product = {
  id: string
  name: string
  short: string
  tagline: string
  image: string
  location: string
  kind: string
  priceFrom: string
  forWhom: string
  concept: string
  context: string
  typologies: { name: string; detail: string }[]
  amenities: string[]
  paymentScheme: string[]
  differentiators: string[]
  buyerProfile: string
  investment: string
  arguments: string[]
  faqs: { q: string; a: string }[]
  objections: { q: string; a: string }[]
  status: 'En comercialización' | 'Próximo lanzamiento'
}

export type TeamMember = {
  id: string
  name: string
  role: string
  initials: string
  level: number
  xp: number
  courses: number
  hours: number
  certifications: number
  streak: number
  lastActive: string
  skills: Record<SkillId, number>
  readiness: Record<string, number>
  insight: string
  recommendedTrack: { kind: 'producto' | 'ruta' | 'curso'; targetId: string; label: string }
}

export type Badge = {
  id: string
  name: string
  description: string
  icon: 'sparkles' | 'flame' | 'target' | 'handshake' | 'compass' | 'cpu' | 'award' | 'gem'
}

export type Certification = {
  id: string
  name: string
  description: string
  kind: 'ruta' | 'producto'
  courseIds?: string[]
  productId?: string
}
