'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n'

const FAQS_EN = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'When should my student start the college planning process?',
        a: 'Ideally, college planning begins in 9th grade. This gives students time to build a strong academic record, pursue meaningful extracurriculars, and develop a clear sense of their interests. That said, it\'s never too late — even students who start junior year can put together a strong application with focused effort.',
      },
      {
        q: 'What does Top College Planning offer?',
        a: 'Top College Planning provides free educational resources including in-depth school profiles, alumni spotlights, college cost information, acceptance rate data, and expert articles on the admissions process. For personalized guidance, we also connect students with experienced admissions advisors.',
      },
      {
        q: 'Is Top College Planning affiliated with any university?',
        a: 'No. Top College Planning is an independent educational resource. We are not affiliated with, endorsed by, or officially connected to any college or university. All school information is compiled from publicly available sources.',
      },
    ],
  },
  {
    category: 'The Admissions Process',
    questions: [
      {
        q: 'What do top colleges look for in an applicant?',
        a: 'Selective colleges evaluate applicants holistically. Key factors include academic rigor (AP/IB courses, GPA), standardized test scores, extracurricular depth and impact, personal essays, letters of recommendation, and demonstrated interest in the school. Character, unique perspective, and potential to contribute to campus life also play a significant role.',
      },
      {
        q: 'What GPA and test scores do I need for Ivy League schools?',
        a: 'There is no fixed cutoff, but admitted students at Ivy League schools typically have unweighted GPAs above 3.9 and SAT scores in the 1500–1580 range (or ACT 34–36). However, academic stats alone don\'t guarantee admission — many students with perfect scores are not admitted, while others with slightly lower scores gain acceptance due to exceptional essays, leadership, or unique backgrounds.',
      },
      {
        q: 'Should I apply Early Decision or Early Action?',
        a: 'Applying Early Decision (ED) can meaningfully improve your odds at many schools — acceptance rates for ED applicants are often 2–3× higher than regular decision. However, ED is binding, so only apply ED if the school is your clear first choice and you\'ve reviewed the financial aid implications. Early Action (EA) offers a similar timeline boost without the binding commitment.',
      },
      {
        q: 'How many colleges should I apply to?',
        a: 'Most college counselors recommend applying to 8–12 schools across three tiers: 2–3 reach schools (where your stats are below median), 4–6 match schools (where you\'re in range), and 2–3 safety schools (where you\'re very likely to be admitted). Avoid applying to too many schools just to have options — quality applications take real time and attention.',
      },
      {
        q: 'Do college rankings really matter?',
        a: 'Rankings can be a useful starting point but should never be the only factor in your college search. The "best" school is the one that fits your academic interests, career goals, campus culture, financial situation, and personal preferences. Many students thrive at schools outside the top 20 and struggle at schools they chose purely for prestige.',
      },
    ],
  },
  {
    category: 'Essays & Applications',
    questions: [
      {
        q: 'How important is the college essay?',
        a: 'Extremely important, especially at highly selective schools where most applicants have strong grades and test scores. The essay is your opportunity to show admissions officers who you are beyond your transcript — your voice, values, growth, and perspective. A compelling personal essay can meaningfully differentiate you from other applicants.',
      },
      {
        q: 'What makes a great college essay?',
        a: 'The best essays are specific, honest, and personal. Avoid generic topics (winning the big game, a mission trip that "changed your life") and instead focus on a moment, relationship, or idea that genuinely shaped how you see the world. Admissions officers read thousands of essays — the ones that stick are the ones that feel authentic and distinctive.',
      },
      {
        q: 'How do I get strong letters of recommendation?',
        a: 'Choose teachers or mentors who know you well and can speak to your intellectual curiosity, growth, and character — not just your grade. Ask early (ideally spring of junior year), provide them with a resume or "brag sheet," and give them plenty of lead time before deadlines. A personalized, enthusiastic letter from a teacher who knows you beats a generic letter from a famous name.',
      },
    ],
  },
  {
    category: 'Financial Aid & Cost',
    questions: [
      {
        q: 'How does financial aid work at top colleges?',
        a: 'Most selective colleges meet 100% of demonstrated financial need for admitted students. Financial need is calculated based on your family\'s income, assets, and household size. Many Ivy League and elite schools have generous no-loan policies — they replace loans with grants that don\'t need to be repaid. Use each school\'s Net Price Calculator to get a personalized estimate.',
      },
      {
        q: 'Are Ivy League schools actually affordable?',
        a: 'For many families, elite schools with large endowments can be surprisingly affordable. Schools like Harvard, Princeton, and Yale offer grants covering full tuition for families earning under $75,000–$80,000/year, with significant aid for families earning up to $200,000. Always compare your actual net price (after aid) rather than the sticker price.',
      },
      {
        q: 'What is the FAFSA and when should I file it?',
        a: 'The Free Application for Federal Student Aid (FAFSA) is the primary form used to apply for federal grants, loans, and work-study funds. File as early as possible after October 1 of your senior year — many states and schools award aid on a first-come, first-served basis. Some schools also require the CSS Profile for institutional aid.',
      },
    ],
  },
  {
    category: 'Using This Site',
    questions: [
      {
        q: 'Is the information on Top College Planning accurate and up to date?',
        a: 'We work hard to keep our content accurate, but college data — acceptance rates, tuition costs, requirements — changes year to year. Always verify important information directly with the college\'s official website or admissions office before making decisions. See our Disclaimer page for full details.',
      },
      {
        q: 'Can I advertise or partner with Top College Planning?',
        a: 'Yes! We work with education brands, test prep companies, tutoring services, and universities to reach our audience of motivated students and families. Visit our Advertise page for information on available placements and packages, or email advertise@topcollegeplanning.com.',
      },
      {
        q: 'How do I contact Top College Planning?',
        a: 'You can reach us at info@topcollegeplanning.com for general inquiries. For advertising, contact advertise@topcollegeplanning.com. For careers, reach out to careers@topcollegeplanning.com. We aim to respond to all inquiries within 2 business days.',
      },
    ],
  },
]

const FAQS_ES = [
  {
    category: 'Primeros Pasos',
    questions: [
      {
        q: '¿Cuándo debería mi hijo comenzar el proceso de planificación universitaria?',
        a: 'Lo ideal es comenzar en 9° grado. Esto da tiempo para construir un historial académico sólido, participar en actividades extracurriculares significativas y desarrollar una idea clara de sus intereses. Dicho esto, nunca es demasiado tarde — incluso los estudiantes que comienzan en su tercer año pueden armar una solicitud sólida con esfuerzo enfocado.',
      },
      {
        q: '¿Qué ofrece Top College Planning?',
        a: 'Top College Planning ofrece recursos educativos gratuitos, incluyendo perfiles detallados de escuelas, destacados de alumni, información sobre costos universitarios, datos de tasas de aceptación y artículos expertos sobre el proceso de admisión. Para orientación personalizada, también conectamos estudiantes con asesores de admisión experimentados.',
      },
      {
        q: '¿Top College Planning está afiliado a alguna universidad?',
        a: 'No. Top College Planning es un recurso educativo independiente. No estamos afiliados, respaldados ni conectados oficialmente con ninguna universidad. Toda la información escolar se recopila de fuentes públicamente disponibles.',
      },
    ],
  },
  {
    category: 'El Proceso de Admisión',
    questions: [
      {
        q: '¿Qué buscan las mejores universidades en un solicitante?',
        a: 'Las universidades selectivas evalúan a los solicitantes de manera integral. Los factores clave incluyen el rigor académico (cursos AP/IB, GPA), puntajes de exámenes estandarizados, profundidad e impacto en actividades extracurriculares, ensayos personales, cartas de recomendación e interés demostrado en la escuela. El carácter, la perspectiva única y el potencial de contribuir a la vida del campus también juegan un papel importante.',
      },
      {
        q: '¿Qué GPA y puntajes de exámenes necesito para las universidades de la Liga Ivy?',
        a: 'No hay un mínimo fijo, pero los estudiantes admitidos en la Liga Ivy generalmente tienen GPA sin ponderación superiores a 3.9 y puntajes SAT en el rango 1500–1580 (o ACT 34–36). Sin embargo, las estadísticas académicas solas no garantizan la admisión — muchos estudiantes con puntajes perfectos no son admitidos, mientras que otros con puntajes ligeramente más bajos son aceptados gracias a ensayos excepcionales, liderazgo o antecedentes únicos.',
      },
      {
        q: '¿Debo aplicar en Decisión Anticipada o Acción Anticipada?',
        a: 'Aplicar en Decisión Anticipada (ED) puede mejorar significativamente tus probabilidades en muchas escuelas — las tasas de aceptación para solicitantes ED suelen ser 2–3 veces más altas que en decisión regular. Sin embargo, la ED es vinculante, así que aplica solo si esa es claramente tu primera opción y has revisado las implicaciones de ayuda financiera. La Acción Anticipada (EA) ofrece un impulso similar sin el compromiso vinculante.',
      },
      {
        q: '¿A cuántas universidades debo aplicar?',
        a: 'La mayoría de los consejeros recomiendan aplicar a 8–12 escuelas en tres niveles: 2–3 escuelas aspiracionales, 4–6 escuelas en las que eres competitivo y 2–3 escuelas seguras. Evita aplicar a demasiadas escuelas solo para tener opciones — las solicitudes de calidad requieren tiempo y atención real.',
      },
      {
        q: '¿Realmente importan los rankings universitarios?',
        a: 'Los rankings pueden ser un punto de partida útil, pero nunca deben ser el único factor en tu búsqueda. La "mejor" escuela es la que se adapta a tus intereses académicos, objetivos profesionales, cultura del campus, situación financiera y preferencias personales. Muchos estudiantes prosperan en escuelas fuera del top 20 y tienen dificultades en escuelas elegidas solo por prestigio.',
      },
    ],
  },
  {
    category: 'Ensayos y Solicitudes',
    questions: [
      {
        q: '¿Qué tan importante es el ensayo universitario?',
        a: 'Extremadamente importante, especialmente en escuelas muy selectivas donde la mayoría de los solicitantes tienen buenas notas y puntajes. El ensayo es tu oportunidad de mostrar a los oficiales de admisión quién eres más allá de tu expediente — tu voz, valores, crecimiento y perspectiva. Un ensayo personal convincente puede diferenciarte significativamente de otros solicitantes.',
      },
      {
        q: '¿Qué hace que un ensayo universitario sea excelente?',
        a: 'Los mejores ensayos son específicos, honestos y personales. Evita temas genéricos y enfócate en un momento, relación o idea que genuinamente haya moldeado tu visión del mundo. Los oficiales de admisión leen miles de ensayos — los que perduran son los que se sienten auténticos y distintivos.',
      },
      {
        q: '¿Cómo obtengo cartas de recomendación sólidas?',
        a: 'Elige maestros o mentores que te conozcan bien y puedan hablar de tu curiosidad intelectual, crecimiento y carácter. Pídelas con anticipación, proporciona un currículum o "brag sheet" y dales tiempo suficiente antes de los plazos. Una carta personalizada y entusiasta de un maestro que te conoce supera a una carta genérica de un nombre famoso.',
      },
    ],
  },
  {
    category: 'Ayuda Financiera y Costos',
    questions: [
      {
        q: '¿Cómo funciona la ayuda financiera en las mejores universidades?',
        a: 'La mayoría de las universidades selectivas cubren el 100% de la necesidad financiera demostrada para los estudiantes admitidos. La necesidad financiera se calcula en base a los ingresos, activos y tamaño del hogar de tu familia. Muchas universidades de la Liga Ivy y escuelas de élite tienen generosas políticas sin préstamos. Usa la Calculadora de Precio Neto de cada escuela para obtener una estimación personalizada.',
      },
      {
        q: '¿Son realmente accesibles las universidades de la Liga Ivy?',
        a: 'Para muchas familias, las escuelas de élite con grandes dotaciones pueden ser sorprendentemente accesibles. Escuelas como Harvard, Princeton y Yale ofrecen becas que cubren la matrícula completa para familias con ingresos inferiores a $75,000–$80,000 al año, con ayuda significativa para familias con ingresos de hasta $200,000. Siempre compara tu precio neto real (después de la ayuda) en lugar del precio de lista.',
      },
      {
        q: '¿Qué es el FAFSA y cuándo debo presentarlo?',
        a: 'La Free Application for Federal Student Aid (FAFSA) es el formulario principal para solicitar becas federales, préstamos y fondos de trabajo-estudio. Presenta lo antes posible después del 1 de octubre de tu último año — muchos estados y escuelas otorgan ayuda por orden de llegada. Algunas escuelas también requieren el CSS Profile para ayuda institucional.',
      },
    ],
  },
  {
    category: 'Usando Este Sitio',
    questions: [
      {
        q: '¿Es la información de Top College Planning precisa y actualizada?',
        a: 'Trabajamos para mantener nuestro contenido preciso, pero los datos universitarios — tasas de aceptación, costos de matrícula, requisitos — cambian año a año. Siempre verifica la información importante directamente con el sitio web oficial de la universidad o la oficina de admisión antes de tomar decisiones. Consulta nuestra página de Aviso Legal para más detalles.',
      },
      {
        q: '¿Puedo anunciarme o asociarme con Top College Planning?',
        a: '¡Sí! Trabajamos con marcas educativas, empresas de preparación para exámenes, servicios de tutoría y universidades. Visita nuestra página de Publicidad para información sobre colocaciones disponibles, o envía un correo a advertise@topcollegeplanning.com.',
      },
      {
        q: '¿Cómo contacto a Top College Planning?',
        a: 'Puedes comunicarte con info@topcollegeplanning.com para consultas generales. Para publicidad, contacta advertise@topcollegeplanning.com. Para empleo, escribe a careers@topcollegeplanning.com. Respondemos a todas las consultas en un plazo de 2 días hábiles.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})
  const { lang } = useLanguage()

  const FAQS = lang === 'es' ? FAQS_ES : FAQS_EN

  const toggle = (key: string) => {
    setOpenMap(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const heroTitle = lang === 'es' ? 'Preguntas Frecuentes' : lang === 'zh' ? '常见问题' : 'Frequently Asked Questions'
  const heroSub = lang === 'es' ? 'Todo lo que los estudiantes y familias necesitan saber sobre la planificación universitaria.' : lang === 'zh' ? '学生和家长了解大学规划所需的一切。' : 'Everything students and families need to know about college planning, the admissions process, and how to use Top College Planning.'
  const heroTag = lang === 'es' ? 'Centro de Ayuda' : lang === 'zh' ? '帮助中心' : 'Help Center'
  const ctaTitle = lang === 'es' ? '¿Aún tienes preguntas?' : lang === 'zh' ? '仍有疑问？' : 'Still Have Questions?'
  const ctaSub = lang === 'es' ? 'Nuestro equipo está aquí para ayudarte. Te responderemos en un plazo de 2 días hábiles.' : lang === 'zh' ? '我们的团队很乐意提供帮助。我们将在2个工作日内回复您。' : "Our team is happy to help. Reach out and we'll get back to you within 2 business days."
  const ctaBtn = lang === 'es' ? 'Contáctanos →' : lang === 'zh' ? '联系我们 →' : 'Contact Us →'

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-3">{heroTag}</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6">{heroTitle}</h1>
          <p className="text-gray-300 text-lg max-w-2xl">{heroSub}</p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {FAQS.map((section) => (
          <div key={section.category} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-black text-navy">{section.category}</h2>
              <div className="flex-1 h-0.5 bg-brand-orange opacity-30" />
            </div>

            <div className="space-y-3">
              {section.questions.map((item, i) => {
                const key = `${section.category}-${i}`
                const isOpen = !!openMap[key]
                return (
                  <div
                    key={key}
                    className={`border-2 transition-colors ${isOpen ? 'border-brand-orange' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between p-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-navy pr-4 leading-snug">{item.q}</span>
                      <span
                        className={`text-brand-orange font-black text-2xl shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Still have questions CTA */}
        <div className="bg-navy text-white p-10 text-center mt-4">
          <h3 className="text-2xl font-black mb-3">{ctaTitle}</h3>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">{ctaSub}</p>
          <a
            href="mailto:info@topcollegeplanning.com"
            className="inline-block bg-brand-orange text-white font-black px-8 py-3 uppercase tracking-wide hover:bg-orange-600 transition-colors"
          >
            {ctaBtn}
          </a>
        </div>
      </div>
    </div>
  )
}
