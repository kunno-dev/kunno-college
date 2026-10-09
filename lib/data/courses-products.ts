import type { Course, Product, QuizQuestion } from '@/lib/types'
import { PRODUCTS } from './products'
import { course, facts, kase, lesson, points, steps, text, tip } from './builder'

export const PRODUCT_MODULES = [
  'Conoce el desarrollo',
  'Ubicación y contexto',
  'Concepto del proyecto',
  'Producto y tipologías',
  'Amenidades',
  'Esquema comercial',
  'Perfil del comprador',
  'Inversión y oportunidad',
  'Preguntas frecuentes',
  'Manejo de objeciones',
  'Cómo presentar el proyecto',
  'Evaluación final',
]

const DEMO = 'Información DEMO para el MVP. Confirma siempre las condiciones vigentes antes de comunicarlas a un prospecto.'

function question(
  p: Product,
  idx: number,
  area: string,
  prompt: string,
  pick: (x: Product) => string,
  explanation: string,
): QuizQuestion {
  const others = PRODUCTS.filter((o) => o.id !== p.id).map(pick)
  const correct = pick(p)
  const options = [...others]
  const answer = (idx + PRODUCTS.indexOf(p)) % (others.length + 1)
  options.splice(answer, 0, correct)
  return { q: prompt, options, answer, explanation, area }
}

function buildProductCourse(p: Product): Course {
  return course({
    id: `prod-${p.id}`,
    productId: p.id,
    title: `${p.name} · Product Training`,
    tagline: 'Conoce lo que vendes. Domina cómo venderlo.',
    academy: 'productos',
    category: 'Ventas',
    level: 'Intermedio',
    roles: ['asesor', 'gerente', 'subdirector', 'director'],
    skill: 'ventas',
    skillGain: 3,
    xp: 250,
    learnings: [
      `Presentar ${p.name} con seguridad`,
      'Conectar el producto con el perfil correcto',
      'Explicar el esquema comercial con claridad',
      'Responder las objeciones más frecuentes',
    ],
    lessons: [
      lesson(PRODUCT_MODULES[0], 2, 'Lectura', text(`${p.name} es un desarrollo de tipo ${p.kind.toLowerCase()}. ${p.tagline}`), facts('En una mirada', [['Tipo', p.kind], ['Ubicación', p.location], ['Precio desde', `${p.priceFrom} · DEMO`], ['Estatus', p.status]]), tip(DEMO)),
      lesson(PRODUCT_MODULES[1], 2, 'Lectura', text(p.context), points('Al hablar de ubicación', ['Usa tiempos reales de traslado', 'Menciona servicios cercanos', 'Conecta la zona con el estilo de vida del cliente'])),
      lesson(PRODUCT_MODULES[2], 2, 'Lectura', text(p.concept), points('Diferenciadores', p.differentiators)),
      lesson(PRODUCT_MODULES[3], 3, 'Infografía', steps('Tipologías · DEMO', p.typologies.map((t) => [t.name, t.detail]))),
      lesson(PRODUCT_MODULES[4], 2, 'Checklist', points('Amenidades', p.amenities), tip('Presenta las amenidades como experiencias, no como una lista.')),
      lesson(PRODUCT_MODULES[5], 3, 'Infografía', steps('Esquema comercial · DEMO', p.paymentScheme.map((s, i) => [`Opción ${i + 1}`, s])), tip(DEMO)),
      lesson(PRODUCT_MODULES[6], 2, 'Lectura', text(p.buyerProfile, 'Perfil del comprador'), text(p.forWhom, '¿Para quién es?')),
      lesson(PRODUCT_MODULES[7], 3, 'Lectura', text(p.investment), tip('Contenido educativo. No constituye asesoría financiera personalizada.')),
      lesson(PRODUCT_MODULES[8], 3, 'Checklist', ...p.faqs.map((f) => text(f.a, f.q))),
      lesson(
        PRODUCT_MODULES[9],
        3,
        'Caso',
        ...p.objections.map((o) => text(o.a, o.q)),
        kase(
          `Presentas ${p.name} a un prospecto calificado.`,
          p.objections[0].q.replace(/"/g, ''),
          '¿Cuál es tu mejor respuesta?',
          [
            ['Validas la preocupación y respondes con información concreta del proyecto.', true, `Buena respuesta. ${p.objections[0].a}`],
            ['Cambias de tema para no perder la venta.', false, 'Evitar la objeción genera desconfianza.'],
            ['Ofreces un descuento de inmediato.', false, 'Devalúa el producto antes de entender la duda.'],
          ],
        ),
      ),
      lesson(PRODUCT_MODULES[10], 3, 'Checklist', steps('Presenta en 5 pasos', [['Conecta', 'Pregunta qué busca el prospecto.'], ['Contexto', 'Ubicación y concepto.'], ['Producto', 'Tipología que encaja con su necesidad.'], ['Valor', 'Diferenciadores y amenidades.'], ['Siguiente paso', 'Visita, propuesta o apartado.']]), points('Argumentos comerciales', p.arguments)),
    ],
    quiz: [
      question(p, 0, 'Producto', `¿Qué tipo de producto es ${p.name}?`, (x) => x.kind, `${p.name} es ${p.kind.toLowerCase()}.`),
      question(p, 1, 'Ubicación', `¿Dónde se ubica ${p.name}?`, (x) => x.location, `Ubicación: ${p.location}.`),
      question(p, 2, 'Esquema comercial', `¿Cuál es el precio desde (DEMO) de ${p.name}?`, (x) => x.priceFrom, `Precio desde ${p.priceFrom} · DEMO.`),
      question(p, 3, 'Inversión', `¿Para quién es ${p.name}?`, (x) => x.forWhom, 'Conectar producto y perfil es clave para vender.'),
      question(p, 4, 'Objeciones', `¿Qué objeción es frecuente en ${p.name}?`, (x) => x.objections[0].q, `Respuesta sugerida: ${p.objections[0].a}`),
    ],
  })
}

export const PRODUCT_COURSES = PRODUCTS.map(buildProductCourse)
