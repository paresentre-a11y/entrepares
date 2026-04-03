'use client'
import Image from 'next/image'

const equipoMiembros = [
  { nombre: 'Jorge Polanco', rol: 'Soporte Técnico & Programador Senior', destacado: true, imagen: '/images/yo_en.gif' },
  { nombre: 'Rudy', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Alba', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Eduardo', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Edwin', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Eloida', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Eliseo', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Floridalia', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Gerald', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Katherin', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Marcial', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Mixela', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Nico', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Sabby', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Vanessa', rol: 'Región Educativa de Chiriquí' },
  { nombre: 'Walter', rol: 'Región Educativa de Chiriquí' },
]

export default function EquipoPage() {
  return (
    <div className="bg-gris-claro min-h-screen">
      {/* Header */}
      <section className="bg-azul-oscuro py-16 text-center text-white">
        <h1 className="font-display font-bold text-4xl mb-4">Equipo de Docentes Facilitadores</h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Conoce a los docentes que lideran la transformación educativa en Chiriquí
        </p>
      </section>

      {/* Contenido */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-azul-oscuro text-3xl mb-4">
              Docentes Facilitadores
            </h2>
            <p className="text-ep-suave max-w-3xl mx-auto">
              Un equipo comprometido de 17 docentes facilitadores trabaja incansablemente
              para fortalecer las capacidades pedagógicas de toda la región educativa.
            </p>
          </div>

          {/* Grid de miembros - Jorge primero destacado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {equipoMiembros.map((miembro, idx) => (
              <div key={idx}
                   className={`bg-white rounded-ep-lg shadow-ep overflow-hidden
                              hover:-translate-y-1 hover:shadow-ep-lg
                              transition-all duration-300 text-center p-6
                              ${miembro.destacado ? 'border-2 border-azul-claro ring-4 ring-azul-claro/20' : ''}`}>
                {miembro.destacado && (
                  <div className="bg-azul-claro text-white text-xs font-bold py-1 px-3
                                  inline-block rounded-full mb-3">
                    ★ Coordinador
                  </div>
                )}
                <div className="flex items-center justify-center mb-4">
                  {miembro.imagen ? (
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-azul-claro
                                    shadow-lg flex-shrink-0">
                      <Image src={miembro.imagen} alt={miembro.nombre} width={112} height={112}
                             className="w-full h-full object-cover" priority={miembro.destacado} />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-azul-oscuro to-azul-claro
                                    flex items-center justify-center text-4xl font-bold text-white
                                    flex-shrink-0">
                      {miembro.nombre.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-display font-bold text-azul-oscuro text-lg mb-1">
                  {miembro.nombre}
                </h3>
                <p className="text-ep-suave text-sm">{miembro.rol}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 bg-white rounded-ep-lg shadow-ep p-8 text-center">
            <p className="text-ep-suave mb-6">
              Nuestro equipo está conformado por 17 docentes facilitadores distribuidos
              en diferentes áreas educativas.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <p className="font-display font-bold text-4xl text-azul-oscuro">17</p>
                <p className="text-ep-suave text-sm">Facilitadores</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-4xl text-azul-oscuro">1</p>
                <p className="text-ep-suave text-sm">Región Educativa</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-4xl text-azul-oscuro">100%</p>
                <p className="text-ep-suave text-sm">Compromiso</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
