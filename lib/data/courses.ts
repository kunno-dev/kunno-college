import type { Course, Role, Stage } from '@/lib/types'
import { ASESOR_COURSES } from './courses-asesor'
import { LIDER_COURSES } from './courses-lider'
import { RE_COURSES } from './courses-re'
import { SKILL_COURSES } from './courses-skills'
import { PRODUCT_COURSES } from './courses-products'

export const LEARNING_COURSES: Course[] = [
  ...ASESOR_COURSES,
  ...LIDER_COURSES,
  ...RE_COURSES,
  ...SKILL_COURSES,
]

export const ALL_COURSES: Course[] = [...LEARNING_COURSES, ...PRODUCT_COURSES]

const byId = new Map(ALL_COURSES.map((c) => [c.id, c]))
export const getCourse = (id: string) => byId.get(id)
export const productCourseId = (productId: string) => `prod-${productId}`

export type RoleTrack = {
  role: Role
  title: string
  objective: string
  milestone: string
  courseIds: string[]
  contents: string[]
}

export const ROLE_TRACKS: Record<Role, RoleTrack> = {
  asesor: {
    role: 'asesor',
    title: 'Ruta Asesor Inmobiliario',
    objective: 'Convertirte en un asesor inmobiliario profesional y productivo.',
    milestone: 'Asesor Profesional',
    courseIds: ['fundamentos-inmobiliarios', 'prospeccion', 'manejo-objeciones', 'cierre', 'fundamentos-inversion'],
    contents: ['Onboarding', 'Fundamentos inmobiliarios', 'Marca personal', 'Prospección', 'Calificación de prospectos', 'Seguimiento comercial', 'Presentación de desarrollos', 'Manejo de objeciones', 'Negociación', 'Cierre', 'Uso de Kunno', 'Fundamentos de inversión'],
  },
  gerente: {
    role: 'gerente',
    title: 'Ruta Gerente Comercial',
    objective: 'Pasar de vender individualmente a desarrollar un equipo comercial.',
    milestone: 'Gerente de Alto Desempeño',
    courseIds: ['liderazgo-comercial', 'coaching-comercial', 'kpis-conversion', 'forecast-pipeline', 'kunno-gerentes'],
    contents: ['Liderazgo', 'Gestión de asesores', 'Onboarding', 'Coaching comercial', 'KPIs', 'Conversión', 'Forecast', 'Pipeline', 'Productividad', 'Kunno para gerentes'],
  },
  subdirector: {
    role: 'subdirector',
    title: 'Ruta Subdirector Comercial',
    objective: 'Desarrollar capacidad estratégica y gestión de múltiples equipos.',
    milestone: 'Subdirector Estratégico',
    courseIds: ['inteligencia-comercial', 'gestion-gerentes', 'forecast-pipeline', 'estrategia-comercial', 'rentabilidad-performance'],
    contents: ['Inteligencia comercial', 'Análisis de datos', 'Forecast', 'Estrategia comercial', 'Gestión de gerentes', 'Procesos', 'Planeación', 'Rentabilidad', 'Performance'],
  },
  director: {
    role: 'director',
    title: 'Ruta Director Comercial',
    objective: 'Desarrollar competencias de dirección y toma de decisiones.',
    milestone: 'Director Comercial',
    courseIds: ['direccion-objetivos', 'estrategia-comercial', 'desarrollo-organizacional', 'decisiones-datos', 'rentabilidad-performance'],
    contents: ['Dirección por objetivos', 'Estrategia comercial', 'Planeación', 'Revenue', 'Forecast', 'Rentabilidad', 'Desarrollo organizacional', 'Inteligencia inmobiliaria', 'Análisis ejecutivo', 'Decisiones basadas en datos'],
  },
}

export const STAGES: { id: Stage; title: string; topics: string[] }[] = [
  { id: 'Foundations', title: 'Foundations', topics: ['¿Qué es Real Estate?', 'Plusvalía', 'Preventa', 'Rendimiento', 'ROI', 'Flujo de efectivo'] },
  { id: 'Investor', title: 'Investor', topics: ['Perfil de inversionista', 'Riesgo', 'Diversificación', 'Horizonte de inversión', 'Liquidez', 'Financiamiento'] },
  { id: 'Analyst', title: 'Analyst', topics: ['Evaluación de proyectos', 'ROI', 'Cap Rate', 'Cash Flow', 'Comparación de oportunidades', 'Análisis financiero básico'] },
  { id: 'Expert', title: 'Expert', topics: ['Estrategias inmobiliarias', 'Portafolios', 'Modelos de inversión', 'Inteligencia de mercado', 'Análisis avanzado'] },
]

export const SKILL_TOPICS: { name: string; courseId?: string }[] = [
  { name: 'Inteligencia Artificial', courseId: 'ia-asesores' },
  { name: 'Excel', courseId: 'excel-comercial' },
  { name: 'Canva' },
  { name: 'Comunicación', courseId: 'hablar-publico' },
  { name: 'Hablar en público', courseId: 'hablar-publico' },
  { name: 'Marca personal', courseId: 'marca-personal' },
  { name: 'Productividad', courseId: 'seguimiento-efectivo' },
  { name: 'Tecnología' },
  { name: 'Emprendimiento' },
  { name: 'Finanzas personales' },
  { name: 'Kunno', courseId: 'domina-kunno' },
]
