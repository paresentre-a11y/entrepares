'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section style={{background:'linear-gradient(145deg,#002060,#003580 50%,#004cb3)'}}
               className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/logo.png')] bg-center bg-no-repeat bg-contain opacity-5" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <Image src="/images/logo.png" alt="Entre Pares" width={200} height={200}
                 className="h-48 w-auto mx-auto mb-8 object-contain" />
          <h1 className="font-display font-bold text-white text-5xl mb-4">
            Entre Pares Chiriquí
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-8 font-light">
            Formando docentes para la educación del siglo XXI
          </p>
          <div className="flex gap-4 justify-center flex-wrap px-4">
            <Link href="/nosotros" className="btn-primary">Conocer el Programa</Link>
            <Link href="/blog"
                  className="btn-outline inline-flex items-center px-6 py-3
                             rounded-ep font-display font-semibold text-sm">
              Ver Recursos
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de bienvenida */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-azul-oscuro text-3xl mb-4">
                Transformando la educación panameña
              </h2>
              <p className="text-ep-suave leading-relaxed mb-6">
                Entre Pares Chiriquí es un programa del MEDUCA dedicado al desarrollo
                profesional docente mediante comunidades de aprendizaje colaborativo.
              </p>
              <p className="text-ep-suave leading-relaxed mb-8">
                Nuestra misión es fortalecer las capacidades pedagógicas de los docentes
                de la región de Chiriquí, promoviendo prácticas innovadoras y el intercambio
                de experiencias exitosas.
              </p>
              <Link href="/equipo" className="btn-primary">
                Conocer al Equipo
              </Link>
            </div>
            <div className="bg-gris-claro rounded-ep-lg p-8 shadow-ep">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-ep shadow-ep">
                  <p className="text-4xl mb-2">👩‍🏫</p>
                  <p className="font-display font-bold text-2xl text-azul-oscuro">17</p>
                  <p className="text-ep-suave text-sm">Facilitadores</p>
                </div>
                <div className="text-center p-4 bg-white rounded-ep shadow-ep">
                  <p className="text-4xl mb-2">🗺️</p>
                  <p className="font-display font-bold text-2xl text-azul-oscuro">1</p>
                  <p className="text-ep-suave text-sm">Región Educativa</p>
                </div>
                <div className="text-center p-4 bg-white rounded-ep shadow-ep">
                  <p className="text-4xl mb-2">📚</p>
                  <p className="font-display font-bold text-2xl text-azul-oscuro">100+</p>
                  <p className="text-ep-suave text-sm">Recursos</p>
                </div>
                <div className="text-center p-4 bg-white rounded-ep shadow-ep">
                  <p className="text-4xl mb-2">🏆</p>
                  <p className="font-display font-bold text-2xl text-azul-oscuro">100%</p>
                  <p className="text-ep-suave text-sm">Compromiso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de características */}
      <section className="py-16 bg-gris-claro">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display font-bold text-azul-oscuro text-3xl text-center mb-12">
            ¿Por qué Entre Pares?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤝',
                title: 'Aprendizaje Colaborativo',
                desc: 'Docentes aprendiendo de docentes, compartiendo experiencias y estrategias efectivas.'
              },
              {
                icon: '💡',
                title: 'Innovación Pedagógica',
                desc: 'Metodologías modernas adaptadas al contexto educativo panameño.'
              },
              {
                icon: '📈',
                title: 'Desarrollo Continuo',
                desc: 'Formación permanente para mantener la excelencia educativa.'
              }
            ].map(item => (
              <div key={item.title} className="bg-white rounded-ep-lg p-8 shadow-ep
                                               hover:-translate-y-1 hover:shadow-ep-lg
                                               transition-all duration-300">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-azul-oscuro text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-ep-suave leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-azul-oscuro text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display font-bold text-3xl mb-4">
            Únete a la comunidad de Entre Pares Chiriquí
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Accede a recursos exclusivos, participa en comunidades de aprendizaje
            y fortalece tu práctica docente.
          </p>
          <Link href="/login" className="btn-primary bg-white text-azul-claro
                                          hover:bg-gris-claro">
            Acceder al Portal
          </Link>
        </div>
      </section>
    </>
  )
}
