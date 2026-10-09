import type { Category, Level, QuizQuestion, Role, SkillId, Lesson } from '@/lib/types'
import { course, kase, lesson, points, q, steps, text, tip, video } from './builder'

type Spec = {
  id: string
  title: string
  tagline: string
  category: Category
  level: Level
  roles: Role[]
  skill: SkillId
  skillGain: number
  xp: number
  learnings: string[]
  lessons: Lesson[]
  quiz: QuizQuestion[]
}

const lider = (s: Spec) => course({ ...s, academy: 'rol' })

export const LIDER_COURSES = [
  lider({
    id: 'liderazgo-comercial',
    title: 'Liderazgo comercial',
    tagline: 'De vender tú a que venda tu equipo.',
    category: 'Liderazgo',
    level: 'Intermedio',
    roles: ['gerente'],
    skill: 'liderazgo',
    skillGain: 5,
    xp: 150,
    learnings: ['Asumir el rol de líder comercial', 'Definir expectativas claras', 'Construir confianza con tu equipo'],
    lessons: [
      lesson('El cambio de rol', 6, 'Video', video('De asesor top a gerente', '3:05', 'Tu éxito ahora se mide por los resultados de tu equipo.'), text('El error más común de un nuevo gerente es seguir vendiendo en lugar de desarrollar a su equipo.')),
      lesson('Expectativas claras', 7, 'Checklist', points('Acuerda con cada asesor', ['Metas de actividad semanales', 'Uso de Kunno para registrar seguimiento', 'Reuniones 1:1 quincenales', 'Productos que debe dominar'])),
      lesson('Confianza', 7, 'Caso', kase('Un asesor senior cuestiona tus decisiones frente al equipo.', 'Antes las cosas funcionaban mejor sin tantas reglas.', '¿Cómo lo manejas?', [
        ['Lo confrontas frente a todos.', false, 'Confrontar en público erosiona la confianza del equipo.'],
        ['Agendas un 1:1, escuchas su perspectiva y explicas el porqué de los cambios.', true, 'Muy bien. Escuchar en privado y explicar el propósito construye compromiso.'],
        ['Lo ignoras.', false, 'Ignorar el tema puede escalar el conflicto.'],
      ])),
    ],
    quiz: [
      q('¿Cómo se mide el éxito de un gerente comercial?', ['Por sus ventas personales', 'Por los resultados y desarrollo de su equipo', 'Por las horas trabajadas', 'Por el número de juntas'], 1, 'El gerente logra resultados a través de su equipo.'),
      q('¿Dónde manejar un desacuerdo con un asesor?', ['Frente al equipo', 'En una conversación 1:1', 'Por chat grupal', 'No se maneja'], 1, 'Los temas sensibles se tratan en privado.'),
      q('¿Qué expectativa es clave en un equipo que usa Kunno?', ['Registrar el seguimiento en Kunno', 'Evitar la plataforma', 'Usar hojas personales', 'Reportar solo cierres'], 0, 'La información en Kunno permite medir y acompañar.'),
    ],
  }),
  lider({
    id: 'coaching-comercial',
    title: 'Coaching comercial',
    tagline: 'Desarrolla asesores, no solo metas.',
    category: 'Liderazgo',
    level: 'Intermedio',
    roles: ['gerente', 'subdirector'],
    skill: 'liderazgo',
    skillGain: 5,
    xp: 200,
    learnings: ['Estructurar sesiones de coaching', 'Dar retroalimentación efectiva', 'Usar datos para acompañar'],
    lessons: [
      lesson('El modelo GROW', 7, 'Infografía', steps('GROW en una sesión 1:1', [['Goal', '¿Qué quieres lograr este mes?'], ['Reality', '¿Dónde estás hoy?'], ['Options', '¿Qué podrías hacer distinto?'], ['Will', '¿Qué harás y cuándo?']])),
      lesson('Retroalimentación efectiva', 6, 'Lectura', text('La retroalimentación funciona cuando es específica, oportuna y centrada en conductas, no en personas.'), points('Fórmula SCI', ['Situación: cuándo y dónde', 'Comportamiento: qué observaste', 'Impacto: qué efecto tuvo'])),
      lesson('Coaching con datos', 7, 'Caso', kase('Un asesor tiene muchas citas pero pocos cierres.', 'Siento que hago todo bien y no cierro.', '¿Cuál es tu primer paso?', [
        ['Revisar juntos su embudo en Kunno y escuchar una de sus presentaciones.', true, 'Correcto. Los datos y la observación revelan dónde está el cuello de botella.'],
        ['Decirle que se esfuerce más.', false, 'No es específico ni accionable.'],
        ['Asignarle más prospectos.', false, 'Si el problema es el cierre, más prospectos no lo resuelven.'],
      ])),
    ],
    quiz: [
      q('¿Qué significa la "R" en GROW?', ['Resultado', 'Realidad', 'Ritmo', 'Riesgo'], 1, 'Reality: entender la situación actual.'),
      q('¿Qué caracteriza a la buena retroalimentación?', ['Es general', 'Es específica y centrada en conductas', 'Es anual', 'Es pública'], 1, 'Específica, oportuna y sobre conductas.'),
      q('Un asesor tiene citas pero no cierra. ¿Qué haces primero?', ['Más prospectos', 'Revisar su embudo y observarlo', 'Cambiarlo de producto', 'Nada'], 1, 'Diagnostica antes de actuar.'),
    ],
  }),
  lider({
    id: 'kpis-conversion',
    title: 'KPIs y conversión',
    tagline: 'Lo que se mide, se mejora.',
    category: 'Gestión Comercial',
    level: 'Intermedio',
    roles: ['gerente', 'subdirector'],
    skill: 'ventas',
    skillGain: 4,
    xp: 150,
    learnings: ['Elegir los KPIs correctos', 'Leer el embudo de conversión', 'Detectar cuellos de botella'],
    lessons: [
      lesson('KPIs que importan', 5, 'Lectura', points('KPIs comerciales clave', ['Leads atendidos', 'Citas agendadas', 'Visitas realizadas', 'Apartados', 'Conversión por etapa'])),
      lesson('El embudo', 5, 'Infografía', steps('Embudo comercial', [['Lead', '100%'], ['Cita', 'Ej. 35%'], ['Visita', 'Ej. 20%'], ['Apartado', 'Ej. 6%']]), tip('Ejemplos ilustrativos. Usa los datos reales de tu equipo en Kunno.')),
      lesson('Cuellos de botella', 5, 'Caso', kase('Tu equipo tiene muchas visitas y pocos apartados.', '¿Por qué no estamos cerrando?', '¿Dónde investigas primero?', [
        ['En la etapa visita → apartado: presentación, objeciones y seguimiento.', true, 'Correcto. El problema está donde cae la conversión.'],
        ['En la generación de leads.', false, 'Los leads no son el problema si hay muchas visitas.'],
        ['En el diseño del brochure.', false, 'Puede influir, pero no es lo primero que muestran los datos.'],
      ])),
    ],
    quiz: [
      q('¿Qué indica la conversión por etapa?', ['El porcentaje que avanza a la siguiente etapa', 'El total de ventas', 'Las horas trabajadas', 'El precio promedio'], 0, 'Muestra dónde se pierde la oportunidad.'),
      q('Muchas visitas y pocos apartados: ¿dónde está el problema?', ['Leads', 'Visita → apartado', 'Marketing', 'Ninguno'], 1, 'La caída en esa etapa señala el cuello de botella.'),
      q('¿Dónde consultar los datos reales del equipo?', ['En Kunno', 'En memoria', 'En redes sociales', 'En el brochure'], 0, 'Kunno concentra la actividad comercial.'),
    ],
  }),
  lider({
    id: 'forecast-pipeline',
    title: 'Forecast y pipeline',
    tagline: 'Anticipa resultados, no los adivines.',
    category: 'Gestión Comercial',
    level: 'Avanzado',
    roles: ['gerente', 'subdirector', 'director'],
    skill: 'ventas',
    skillGain: 4,
    xp: 200,
    learnings: ['Construir un pipeline confiable', 'Calcular un forecast ponderado', 'Revisar el pipeline semanalmente'],
    lessons: [
      lesson('Pipeline confiable', 7, 'Lectura', text('Un pipeline confiable tiene etapas claras, fechas reales y oportunidades actualizadas en Kunno.'), points('Reglas de higiene', ['Cada oportunidad tiene siguiente paso', 'Fechas de cierre realistas', 'Oportunidades estancadas se depuran'])),
      lesson('Forecast ponderado', 7, 'Infografía', steps('Probabilidad por etapa', [['Cita', '10%'], ['Visita', '25%'], ['Propuesta', '50%'], ['Apartado', '90%']]), tip('Forecast = Σ (valor de la oportunidad × probabilidad de su etapa).')),
      lesson('Revisión semanal', 6, 'Caso', kase('En la revisión, un asesor tiene 10 oportunidades "por cerrar este mes".', 'Todas están a punto de cerrar.', '¿Qué haces?', [
        ['Revisas evidencia de cada una: siguiente paso, fecha y señales de compra.', true, 'Correcto. El forecast se basa en evidencia, no en optimismo.'],
        ['Lo sumas todo al forecast.', false, 'Infla el pronóstico y genera sorpresas.'],
        ['Descartas todas.', false, 'Extremo opuesto: revisa caso por caso.'],
      ])),
    ],
    quiz: [
      q('¿Qué es un forecast ponderado?', ['Suma de todo el pipeline', 'Valor × probabilidad por etapa', 'Solo cierres del mes', 'Meta del año'], 1, 'Pondera cada oportunidad según su etapa.'),
      q('¿Qué debe tener cada oportunidad?', ['Siguiente paso y fecha', 'Solo nombre', 'Solo precio', 'Nada'], 0, 'Siguiente paso y fecha mantienen el pipeline vivo.'),
      q('¿En qué se basa un buen forecast?', ['Optimismo', 'Evidencia', 'Intuición', 'Metas'], 1, 'La evidencia reduce sorpresas.'),
    ],
  }),
  lider({
    id: 'kunno-gerentes',
    title: 'Kunno para gerentes',
    tagline: 'Tu equipo, en tiempo real.',
    category: 'Kunno',
    level: 'Intermedio',
    roles: ['gerente', 'subdirector'],
    skill: 'kunno',
    skillGain: 4,
    xp: 150,
    learnings: ['Usar tableros de equipo en Kunno', 'Detectar prospectos sin seguimiento', 'Preparar juntas con datos'],
    lessons: [
      lesson('Tableros de equipo', 5, 'Video', video('Recorrido por el tablero gerencial', '2:50', 'Actividad, embudo y oportunidades de cada asesor en una sola vista.')),
      lesson('Prospectos sin seguimiento', 5, 'Checklist', points('Rutina diaria de 10 minutos', ['Filtra prospectos sin actividad > 3 días', 'Asigna responsables', 'Revisa citas del día', 'Celebra avances'])),
      lesson('Juntas con datos', 5, 'Caso', kase('Preparas la junta semanal.', '¿Qué revisamos hoy?', '¿Qué agenda propones?', [
        ['Embudo del equipo, 3 oportunidades clave y un aprendizaje de la semana.', true, 'Muy bien. Una junta corta, enfocada y basada en datos.'],
        ['Revisar uno por uno todos los prospectos.', false, 'Consume demasiado tiempo y pierde foco.'],
        ['Hablar de motivación sin datos.', false, 'La motivación funciona mejor conectada a resultados.'],
      ])),
    ],
    quiz: [
      q('¿Qué rutina ayuda a evitar prospectos olvidados?', ['Filtrar prospectos sin actividad', 'Esperar al cierre de mes', 'Revisar solo cierres', 'Ninguna'], 0, 'Filtrar inactividad diariamente evita fugas.'),
      q('¿Qué debe incluir una junta semanal efectiva?', ['Datos del embudo y foco', 'Solo motivación', 'Revisión de todos los prospectos', 'Nada'], 0, 'Datos y foco hacen la junta útil.'),
      q('¿Para qué sirve el tablero gerencial?', ['Ver actividad y embudo del equipo', 'Editar precios', 'Diseñar brochures', 'Pagar comisiones'], 0, 'Da visibilidad del equipo en tiempo real.'),
    ],
  }),
  lider({
    id: 'inteligencia-comercial',
    title: 'Inteligencia comercial',
    tagline: 'Convierte datos en decisiones.',
    category: 'Gestión Comercial',
    level: 'Avanzado',
    roles: ['subdirector', 'director'],
    skill: 'ventas',
    skillGain: 4,
    xp: 200,
    learnings: ['Analizar datos comerciales', 'Segmentar el mercado', 'Detectar oportunidades'],
    lessons: [
      lesson('Datos que importan', 7, 'Lectura', points('Fuentes de inteligencia', ['Embudo por producto', 'Origen de leads', 'Tiempo de ciclo de venta', 'Motivos de pérdida'])),
      lesson('Segmentación', 7, 'Infografía', steps('Segmenta para enfocar', [['Por producto', '¿Qué vende mejor y por qué?'], ['Por canal', '¿Qué canal convierte más?'], ['Por perfil', '¿Quién compra?']])),
      lesson('De dato a decisión', 6, 'Caso', kase('El 60% de las pérdidas en un producto se debe a "precio".', '¿Bajamos el precio?', '¿Qué recomiendas?', [
        ['Analizar si es precio o valor percibido, revisar el argumento comercial y capacitar al equipo.', true, 'Correcto. Antes de mover precio, revisa cómo se comunica el valor.'],
        ['Bajar el precio de inmediato.', false, 'Puede afectar rentabilidad sin resolver la causa.'],
        ['Ignorar el dato.', false, 'Los motivos de pérdida son información valiosa.'],
      ])),
    ],
    quiz: [
      q('¿Qué dato revela por qué se pierden ventas?', ['Motivos de pérdida', 'Número de asesores', 'Horario', 'Color del logo'], 0, 'Los motivos de pérdida explican el porqué.'),
      q('Muchas pérdidas por "precio". ¿Primer paso?', ['Bajar precio', 'Analizar valor percibido', 'Ignorar', 'Cambiar de producto'], 1, 'Revisa primero cómo se comunica el valor.'),
      q('¿Para qué segmentar?', ['Para enfocar esfuerzos', 'Para complicar reportes', 'Para tener más juntas', 'No sirve'], 0, 'La segmentación enfoca recursos.'),
    ],
  }),
  lider({
    id: 'gestion-gerentes',
    title: 'Gestión de gerentes',
    tagline: 'Lidera a quienes lideran.',
    category: 'Liderazgo',
    level: 'Avanzado',
    roles: ['subdirector'],
    skill: 'liderazgo',
    skillGain: 5,
    xp: 200,
    learnings: ['Desarrollar gerentes', 'Alinear prioridades entre equipos', 'Delegar con seguimiento'],
    lessons: [
      lesson('Desarrollar gerentes', 7, 'Lectura', text('Un subdirector multiplica resultados cuando sus gerentes desarrollan a sus equipos con autonomía.')),
      lesson('Alineación', 7, 'Checklist', points('Ritual mensual con gerentes', ['Metas por equipo', 'Product readiness por producto', 'Skills con mayor oportunidad', 'Compromisos y fechas'])),
      lesson('Delegar con seguimiento', 6, 'Caso', kase('Un gerente no logra su meta por tercer mes.', 'Mi equipo no da más.', '¿Qué haces?', [
        ['Revisas con él datos de su equipo, skills y readiness, y acuerdan un plan de 30 días.', true, 'Correcto. Diagnóstico con datos y plan concreto.'],
        ['Tomas su equipo directamente.', false, 'Le quita autonomía y no lo desarrolla.'],
        ['Esperas al siguiente trimestre.', false, 'Retrasar la acción agrava el problema.'],
      ])),
    ],
    quiz: [
      q('¿Cómo multiplica resultados un subdirector?', ['Vendiendo más', 'Desarrollando gerentes autónomos', 'Haciendo más juntas', 'Controlando todo'], 1, 'Desarrollar gerentes escala el impacto.'),
      q('¿Qué revisar en el ritual mensual?', ['Metas, readiness y skills', 'Solo ventas', 'Solo gastos', 'Nada'], 0, 'Una visión completa del equipo.'),
      q('Gerente sin meta 3 meses: ¿qué haces?', ['Plan de 30 días con datos', 'Tomar su equipo', 'Esperar', 'Ignorar'], 0, 'Diagnóstico y plan concreto.'),
    ],
  }),
  lider({
    id: 'estrategia-comercial',
    title: 'Estrategia comercial',
    tagline: 'Elige dónde jugar y cómo ganar.',
    category: 'Gestión Comercial',
    level: 'Avanzado',
    roles: ['subdirector', 'director'],
    skill: 'ventas',
    skillGain: 4,
    xp: 200,
    learnings: ['Definir prioridades comerciales', 'Asignar recursos por producto', 'Planear lanzamientos'],
    lessons: [
      lesson('Dónde jugar', 7, 'Lectura', text('La estrategia comercial define qué productos priorizar, con qué equipo y en qué canales.')),
      lesson('Recursos por producto', 7, 'Infografía', steps('Matriz de prioridad', [['Alta demanda · alto margen', 'Prioriza'], ['Alta demanda · bajo margen', 'Optimiza'], ['Baja demanda · alto margen', 'Desarrolla'], ['Baja demanda · bajo margen', 'Revisa']])),
      lesson('Planear un lanzamiento', 6, 'Caso', kase('Las Nubes inicia comercialización en 30 días.', '¿Estamos listos?', '¿Qué priorizas?', [
        ['Product readiness del equipo, argumentos comerciales y metas de preventa.', true, 'Correcto. Un equipo preparado vende desde el día uno.'],
        ['Solo la campaña de marketing.', false, 'Sin equipo preparado, los leads se desperdician.'],
        ['Esperar a ver cómo responde el mercado.', false, 'Pierdes la ventana de lanzamiento.'],
      ])),
    ],
    quiz: [
      q('¿Qué define la estrategia comercial?', ['Prioridades, equipo y canales', 'Colores de marca', 'Horarios', 'Nada'], 0, 'Define dónde jugar y cómo ganar.'),
      q('Antes de un lanzamiento, ¿qué es clave?', ['Product readiness del equipo', 'Solo publicidad', 'Esperar', 'Bajar precio'], 0, 'Un equipo preparado aprovecha cada lead.'),
      q('Producto de alta demanda y alto margen:', ['Priorizar', 'Revisar', 'Abandonar', 'Ignorar'], 0, 'Es donde más valor se genera.'),
    ],
  }),
  lider({
    id: 'rentabilidad-performance',
    title: 'Rentabilidad y performance',
    tagline: 'Crece con margen, no solo con volumen.',
    category: 'Gestión Comercial',
    level: 'Avanzado',
    roles: ['subdirector', 'director'],
    skill: 'inversion',
    skillGain: 3,
    xp: 200,
    learnings: ['Leer indicadores de rentabilidad', 'Medir performance por equipo', 'Equilibrar volumen y margen'],
    lessons: [
      lesson('Indicadores de rentabilidad', 7, 'Lectura', points('Indicadores clave', ['Costo de adquisición por cliente', 'Margen por producto', 'Comisiones sobre venta', 'Ciclo de venta'])),
      lesson('Performance por equipo', 7, 'Infografía', steps('Tablero de performance', [['Resultado', 'Ventas vs meta'], ['Eficiencia', 'Conversión y ciclo'], ['Preparación', 'Skills y product readiness']])),
      lesson('Volumen vs margen', 6, 'Caso', kase('Un equipo vende mucho, pero con descuentos altos.', 'Estamos superando la meta.', '¿Cómo lo evalúas?', [
        ['Revisas margen y descuentos, y refuerzas manejo de objeciones de precio.', true, 'Correcto. El volumen sin margen puede afectar la rentabilidad.'],
        ['Felicitas y sigues igual.', false, 'Reconoce el esfuerzo, pero revisa la rentabilidad.'],
        ['Prohíbes todo descuento.', false, 'Demasiado rígido; mejor capacitar y definir políticas.'],
      ])),
    ],
    quiz: [
      q('¿Qué indicador mide eficiencia de marketing?', ['Costo de adquisición por cliente', 'Número de juntas', 'Antigüedad', 'Ninguno'], 0, 'El CAC indica cuánto cuesta conseguir un cliente.'),
      q('Mucho volumen con descuentos altos indica:', ['Posible problema de margen', 'Éxito total', 'Nada', 'Falta de leads'], 0, 'El margen también importa.'),
      q('¿Qué incluye "preparación" en el tablero?', ['Skills y product readiness', 'Gastos', 'Horarios', 'Nada'], 0, 'La preparación anticipa el desempeño.'),
    ],
  }),
  lider({
    id: 'direccion-objetivos',
    title: 'Dirección por objetivos',
    tagline: 'Del plan anual a la ejecución semanal.',
    category: 'Liderazgo',
    level: 'Avanzado',
    roles: ['director'],
    skill: 'liderazgo',
    skillGain: 5,
    xp: 200,
    learnings: ['Definir objetivos y resultados clave', 'Cascadear metas', 'Dar seguimiento ejecutivo'],
    lessons: [
      lesson('Objetivos y resultados clave', 7, 'Lectura', text('Un buen objetivo es inspirador; un buen resultado clave es medible.'), points('Ejemplo ilustrativo', ['Objetivo: liderar la preventa de Las Nubes', 'KR1: 90% del equipo certificado antes del lanzamiento', 'KR2: 40 apartados en el primer trimestre'])),
      lesson('Cascadeo de metas', 7, 'Infografía', steps('De la dirección al asesor', [['Dirección', 'Objetivos anuales'], ['Subdirección', 'Metas por región'], ['Gerencia', 'Metas por equipo'], ['Asesor', 'Actividad semanal']])),
      lesson('Seguimiento ejecutivo', 6, 'Caso', kase('A mitad de trimestre, un KR va al 30%.', '¿Ajustamos la meta?', '¿Qué decides?', [
        ['Analizas causas con datos, defines acciones correctivas y revisas en dos semanas.', true, 'Correcto. Se ajustan las acciones antes que las metas.'],
        ['Bajas la meta.', false, 'Solo si las condiciones cambiaron realmente.'],
        ['Esperas al cierre de trimestre.', false, 'Pierdes tiempo para corregir.'],
      ])),
    ],
    quiz: [
      q('¿Qué caracteriza a un resultado clave?', ['Es medible', 'Es inspirador', 'Es secreto', 'Es opcional'], 0, 'Los KRs se miden.'),
      q('KR al 30% a mitad de trimestre:', ['Acciones correctivas con datos', 'Bajar meta', 'Esperar', 'Ignorar'], 0, 'Corrige el rumbo a tiempo.'),
      q('¿Qué es cascadear metas?', ['Traducirlas a cada nivel', 'Eliminarlas', 'Duplicarlas', 'Ocultarlas'], 0, 'Cada nivel sabe cómo contribuye.'),
    ],
  }),
  lider({
    id: 'desarrollo-organizacional',
    title: 'Desarrollo organizacional',
    tagline: 'Construye la fuerza comercial del futuro.',
    category: 'Liderazgo',
    level: 'Avanzado',
    roles: ['director'],
    skill: 'liderazgo',
    skillGain: 4,
    xp: 200,
    learnings: ['Diseñar planes de carrera comercial', 'Identificar talento', 'Medir preparación del equipo'],
    lessons: [
      lesson('Planes de carrera', 7, 'Infografía', steps('Progresión comercial', [['Asesor', 'Domina venta y producto'], ['Gerente', 'Desarrolla equipos'], ['Subdirector', 'Gestiona gerentes'], ['Director', 'Define estrategia']])),
      lesson('Identificar talento', 7, 'Lectura', points('Señales de potencial', ['Aprende rápido y aplica', 'Ayuda a sus compañeros', 'Usa datos para decidir', 'Resultados consistentes'])),
      lesson('Preparación del equipo', 6, 'Caso', kase('Debes decidir quién será el próximo gerente.', '¿El mejor vendedor?', '¿Qué evalúas?', [
        ['Resultados, skills de liderazgo, coaching a pares y disposición a desarrollar a otros.', true, 'Correcto. El mejor vendedor no siempre es el mejor líder.'],
        ['Solo ventas del último año.', false, 'Vender bien no garantiza liderar bien.'],
        ['Antigüedad.', false, 'La antigüedad no mide potencial de liderazgo.'],
      ])),
    ],
    quiz: [
      q('¿El mejor vendedor siempre es el mejor gerente?', ['Sí', 'No necesariamente', 'Siempre', 'Nunca'], 1, 'Liderar requiere habilidades distintas.'),
      q('Una señal de potencial de liderazgo:', ['Ayuda a sus compañeros', 'Trabaja solo', 'Evita datos', 'Ninguna'], 0, 'Desarrollar a otros es clave.'),
      q('¿Para qué sirve un plan de carrera?', ['Dar dirección y retener talento', 'Complicar procesos', 'Nada', 'Reducir sueldos'], 0, 'Da claridad sobre cómo crecer.'),
    ],
  }),
  lider({
    id: 'decisiones-datos',
    title: 'Decisiones basadas en datos',
    tagline: 'Menos intuición, más evidencia.',
    category: 'Gestión Comercial',
    level: 'Avanzado',
    roles: ['director', 'subdirector'],
    skill: 'kunno',
    skillGain: 3,
    xp: 200,
    learnings: ['Formular preguntas de negocio', 'Leer tableros ejecutivos', 'Evitar sesgos comunes'],
    lessons: [
      lesson('Preguntas de negocio', 7, 'Lectura', points('Preguntas ejecutivas', ['¿Mi equipo está preparado para vender cada producto?', '¿Dónde se pierden oportunidades?', '¿Qué skill limita el crecimiento?'])),
      lesson('Tableros ejecutivos', 7, 'Video', video('Leer un tablero en 5 minutos', '4:10', 'Tendencias, anomalías y decisiones: un método simple para directores.')),
      lesson('Sesgos', 6, 'Caso', kase('Un producto vendió muy bien el último mes.', 'Hay que meter todo el equipo ahí.', '¿Qué consideras?', [
        ['Revisar si es tendencia o pico puntual, y el impacto en otros productos.', true, 'Correcto. Evitas el sesgo de lo reciente.'],
        ['Mover a todo el equipo de inmediato.', false, 'Decisión basada en un solo dato.'],
        ['Ignorar el dato.', false, 'Es información útil si se analiza bien.'],
      ])),
    ],
    quiz: [
      q('¿Qué es el sesgo de lo reciente?', ['Dar demasiado peso a datos recientes', 'Usar datos viejos', 'Ignorar datos', 'Ninguno'], 0, 'Un pico puntual no siempre es tendencia.'),
      q('Una pregunta ejecutiva clave:', ['¿Mi equipo está preparado para vender?', '¿Qué color usamos?', '¿Quién llegó tarde?', 'Ninguna'], 0, 'Conecta preparación con resultados.'),
      q('Antes de mover recursos, ¿qué revisas?', ['Si es tendencia o pico', 'Nada', 'Solo intuición', 'El clima'], 0, 'Valida con más datos.'),
    ],
  }),
]
