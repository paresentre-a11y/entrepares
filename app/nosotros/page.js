'use client'
import Image from 'next/image'

export default function NosotrosPage() {
  return (
    <div className="bg-gris-claro min-h-screen">
      {/* Header */}
      <section className="bg-azul-oscuro py-16 text-center text-white">
        <h1 className="font-display font-bold text-4xl mb-4">Sobre Entre Pares Chiriquí</h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Conoce nuestra misión, visión y el impacto que generamos en la educación panameña
        </p>
      </section>

      {/* Misión y Visión */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-ep-lg shadow-ep p-8">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="font-display font-bold text-azul-oscuro text-2xl mb-4">
                Nuestra Misión
              </h2>
              <p className="text-ep-suave leading-relaxed">
                Fortalecer las capacidades pedagógicas de los docentes de la Región
                Educativa de Chiriquí mediante comunidades de aprendizaje colaborativo,
                promoviendo prácticas innovadoras que mejoren la calidad educativa
                y el desarrollo integral de los estudiantes panameños.
              </p>
            </div>
            <div className="bg-white rounded-ep-lg shadow-ep p-8">
              <div className="text-5xl mb-4">👁️</div>
              <h2 className="font-display font-bold text-azul-oscuro text-2xl mb-4">
                Nuestra Visión
              </h2>
              <p className="text-ep-suave leading-relaxed">
                Ser reconocidos como el programa líder de desarrollo profesional docente
                en Panamá, transformando la educación aula por aula mediante el trabajo
                colaborativo, la innovación pedagógica y el compromiso con la excelencia
                educativa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display font-bold text-azul-oscuro text-3xl text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🤝', valor: 'Colaboración', desc: 'Trabajamos juntos para lograr objetivos comunes' },
              { icon: '💡', valor: 'Innovación', desc: 'Buscamos constantemente nuevas formas de enseñar' },
              { icon: '⭐', valor: 'Excelencia', desc: 'Nos esforzamos por la más alta calidad educativa' },
              { icon: '❤️', valor: 'Compromiso', desc: 'Dedicamos nuestro esfuerzo a transformar vidas' },
            ].map(item => (
              <div key={item.valor}
                   className="text-center p-6 bg-gris-claro rounded-ep-lg
                              hover:-translate-y-1 transition-all duration-300">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-azul-oscuro text-lg mb-2">
                  {item.valor}
                </h3>
                <p className="text-ep-suave text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre el programa */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-azul-oscuro text-3xl mb-6">
                El Programa Entre Pares
              </h2>
              <p className="text-ep-suave leading-relaxed mb-4">
                Entre Pares es un programa del Ministerio de Educación (MEDUCA) diseñado
                para fortalecer las capacidades de los docentes mediante el aprendizaje
                entre colegas.
              </p>
              <p className="text-ep-suave leading-relaxed mb-4">
                En la Región Educativa de Chiriquí, contamos con 17 docentes facilitadores
                que trabajan directamente con las instituciones educativas, brindando
                acompañamiento, recursos y formación continua.
              </p>
              <p className="text-ep-suave leading-relaxed">
                Nuestro enfoque se basa en la premisa de que los mejores maestros para
                otros maestros son sus propios colegas, quienes comprenden los desafíos
                diarios del aula y pueden compartir estrategias probadas en contextos
                similares.
              </p>
            </div>
            <div className="bg-gradient-to-br from-azul-claro to-azul-medio rounded-ep-lg
                            p-8 text-white text-center shadow-ep-lg">
              <Image src="/images/logo.png" alt="Entre Pares" width={180} height={180}
                     className="h-36 w-auto mx-auto mb-6 object-contain brightness-0 invert" />
              <p className="font-display font-bold text-2xl mb-2">
                Entre Pares Chiriquí
              </p>
              <p className="text-white/70 text-sm mb-6">
                Región Educativa de Chiriquí — MEDUCA
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-ep p-4">
                  <p className="font-display font-bold text-3xl">17</p>
                  <p className="text-white/60 text-xs">Facilitadores</p>
                </div>
                <div className="bg-white/10 rounded-ep p-4">
                  <p className="font-display font-bold text-3xl">1</p>
                  <p className="text-white/60 text-xs">Región</p>
                </div>
                <div className="bg-white/10 rounded-ep p-4">
                  <p className="font-display font-bold text-3xl">100%</p>
                  <p className="text-white/60 text-xs">Compromiso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 bg-azul-oscuro text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display font-bold text-3xl mb-4">
            Contáctanos
          </h2>
          <p className="text-white/70 mb-8">
            ¿Tienes preguntas sobre el programa? Escríbenos.
          </p>
          <a href="mailto:entrepares.chiriqui@meduca.gob.pa"
             className="inline-flex items-center gap-2 text-white border-2 border-white/55
                        px-6 py-3 rounded-full text-sm font-display font-semibold
                        hover:bg-white hover:text-azul-claro transition-all duration-200">
            ✉️ entrepares.chiriqui@meduca.gob.pa
          </a>
        </div>
      </section>
    </div>
  )
}
