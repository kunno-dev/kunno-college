import type { Badge, Certification, Role, SkillId } from '@/lib/types'

export const SKILLS: { id: SkillId; label: string }[] = [
  { id: 'ventas', label: 'Ventas' },
  { id: 'prospeccion', label: 'Prospección' },
  { id: 'cierre', label: 'Cierre' },
  { id: 'realestate', label: 'Real Estate' },
  { id: 'inversion', label: 'Inversión' },
  { id: 'kunno', label: 'Kunno' },
  { id: 'liderazgo', label: 'Liderazgo' },
]

export const skillLabel = (id: SkillId) => SKILLS.find((s) => s.id === id)?.label ?? id

export const ROLE_LABEL: Record<Role, string> = {
  asesor: 'Asesor',
  gerente: 'Gerente',
  subdirector: 'Subdirector',
  director: 'Director',
}

export const ROLE_SKILLS: Record<Role, SkillId[]> = {
  asesor: ['ventas', 'prospeccion', 'cierre', 'realestate', 'inversion', 'kunno'],
  gerente: ['ventas', 'prospeccion', 'cierre', 'realestate', 'inversion', 'kunno', 'liderazgo'],
  subdirector: ['ventas', 'cierre', 'realestate', 'inversion', 'kunno', 'liderazgo'],
  director: ['ventas', 'realestate', 'inversion', 'kunno', 'liderazgo'],
}

export const BADGES: Badge[] = [
  { id: 'primer-curso', name: 'Primer curso', description: 'Completaste tu primer curso.', icon: 'sparkles' },
  { id: 'racha-7', name: '7 días aprendiendo', description: 'Mantuviste una racha de 7 días.', icon: 'flame' },
  { id: 'prospector', name: 'Prospector', description: 'Dominaste la prospección comercial.', icon: 'target' },
  { id: 'closer', name: 'Closer', description: 'Completaste Cierre de operaciones.', icon: 'handshake' },
  { id: 're-explorer', name: 'Real Estate Explorer', description: 'Completaste 2 cursos de Real Estate & Inversión.', icon: 'compass' },
  { id: 'kunno-expert', name: 'Kunno Expert', description: 'Alcanzaste 80 en tu skill Kunno.', icon: 'cpu' },
  { id: 'wuayakin-certified', name: 'Wuayakin Certified', description: 'Certificado para comercializar Hacienda Wuayakin.', icon: 'award' },
  { id: 'pitahaya-certified', name: 'Pitahaya Certified', description: 'Certificado para comercializar Pitahaya Investments.', icon: 'gem' },
]

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'kunno-advisor',
    name: 'Kunno Certified Advisor',
    description: 'Completa la ruta de Asesor Inmobiliario.',
    kind: 'ruta',
    courseIds: ['fundamentos-inmobiliarios', 'prospeccion', 'manejo-objeciones', 'cierre', 'fundamentos-inversion'],
  },
  {
    id: 're-foundations',
    name: 'Real Estate Foundations',
    description: 'Domina los fundamentos de Real Estate e inversión.',
    kind: 'ruta',
    courseIds: ['que-es-real-estate', 'roi-inmobiliario'],
  },
  {
    id: 'kunno-erp',
    name: 'Kunno ERP Essentials',
    description: 'Usa Kunno para gestionar y dar seguimiento a tu pipeline.',
    kind: 'ruta',
    courseIds: ['domina-kunno', 'seguimiento-efectivo'],
  },
  {
    id: 'cert-wuayakin',
    name: 'Hacienda Wuayakin Certified',
    description: 'Certificación de producto para comercializar Hacienda Wuayakin.',
    kind: 'producto',
    productId: 'wuayakin',
  },
  {
    id: 'cert-pitahaya',
    name: 'Pitahaya Product Specialist',
    description: 'Certificación de producto para comercializar Pitahaya Investments.',
    kind: 'producto',
    productId: 'pitahaya',
  },
  {
    id: 'cert-telchac',
    name: 'Las Villas Telchac Certified',
    description: 'Certificación de producto para comercializar Las Villas Telchac.',
    kind: 'producto',
    productId: 'telchac',
  },
]
