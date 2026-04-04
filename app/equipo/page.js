'use client'
import { useState } from 'react'

const EQUIPO = [
  {
    nombre: 'Jorge Polanco',
    cargo: 'Docente Facilitador · Coach TIC · Programador y Soporte Técnico',
    descripcion: 'Docente facilitador y coach en tecnologías de la información. Responsable del desarrollo, mantenimiento y soporte técnico de las plataformas digitales del programa Entre Pares Chiriquí.',
    especialidad: 'Facilitación TIC · Desarrollo Web · Soporte Técnico',
    enlace: 'https://jorgepolancorodriguez.pages.dev/',
    foto: '/images/yo_en.gif',
  },
  {
    nombre: 'Alba',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Eduardo',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Edwin',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Eloida',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Eliseo',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Floridali [Apellido]',
    cargo: 'Coordinadora',
    descripcion: 'Coordinadora del programa Entre Pares Chiriquí. Lidera el equipo de facilitadores de la Región Educativa de Chiriquí hacia la transformación educativa digital.',
    especialidad: 'Coordinación y Liderazgo Educativo',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Gerald',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Katherin',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Marcial',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Mixela',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Nico',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Rudy',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Sabby',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Vanessa',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
  {
    nombre: 'Walter',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    enlace: null,
    foto: null,
  },
]

function ModalMiembro({ miembro, onCerrar }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50
                 flex items-center justify-center p-4"
      onClick={onCerrar}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          borderRadius: '1.25rem',
          padding: '3px',
          background: 'linear-gradient(135deg,#003580,#0066CC,#00d4ff,#fff,#0066CC,#003580)',
          backgroundSize: '300% 300%',
          animation: 'gradiente-luz 3s ease infinite',
          boxShadow: '0 0 30px rgba(0,102,204,0.6),0 0 60px rgba(0,102,204,0.3),0 0 90px rgba(0,212,255,0.2)',
          maxWidth: '28rem',
          width: '100%',
        }}
      >
        {/* Marco de luz rotando */}
        <div style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '1.35rem',
          background: 'conic-gradient(from 0deg,transparent 0deg,#0066CC 60deg,#00d4ff 120deg,#fff 180deg,#0066CC 240deg,transparent 360deg)',
          animation: 'rotar-luz 3s linear infinite',
          zIndex: -1,
          filter: 'blur(8px)',
          opacity: 0.9,
        }} />

        <div style={{
          background: 'white',
          borderRadius: '1.1rem',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Header */}
          <div className="relative h-44 bg-gradient-to-br
                          from-azul-oscuro to-azul-claro
                          flex items-center justify-center overflow-hidden">
            {miembro.foto ? (
              <img src={miembro.foto} alt={miembro.nombre}
                   className="w-full h-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20
                              border-4 border-white/40 flex items-center
                              justify-center text-white font-display
                              font-bold text-5xl">
                {miembro.nombre.charAt(0)}
              </div>
            )}

            {/* Partículas flotantes */}
            {[...Array(8)].map((_, i) => (
              <div key={i}
                   className="absolute rounded-full bg-white/15"
                   style={{
                     width: `${8 + i * 5}px`,
                     height: `${8 + i * 5}px`,
                     left: `${8 + i * 11}%`,
                     top: `${10 + (i % 4) * 22}%`,
                     animation: `pulsar-luz ${1.5 + i * 0.25}s ease-in-out infinite`,
                     animationDelay: `${i * 0.15}s`,
                     filter: 'blur(3px)',
                   }} />
            ))}

            <button onClick={onCerrar}
                    className="absolute top-3 right-3 w-9 h-9
                               rounded-full bg-black/40 hover:bg-black/60
                               text-white flex items-center justify-center
                               transition-colors text-lg font-bold
                               backdrop-blur-sm">
              ✕
            </button>
          </div>

          {/* Info */}
          <div className="p-6">
            <h3 className="font-display font-bold text-azul-oscuro
                           text-xl mb-2">
              {miembro.nombre}
            </h3>
            <span className="inline-block bg-gradient-to-r
                             from-azul-claro to-azul-medio text-white
                             text-xs font-semibold px-4 py-1.5
                             rounded-full mb-4 shadow-md">
              {miembro.cargo}
            </span>
            <p className="text-ep-suave text-sm leading-relaxed mb-4">
              {miembro.descripcion}
            </p>
            {miembro.especialidad && (
              <div className="flex items-start gap-2 text-sm
                              bg-gris-claro rounded-xl px-4 py-3
                              text-azul-oscuro font-medium mb-4">
                <span className="text-lg flex-shrink-0">🎯</span>
                <span>{miembro.especialidad}</span>
              </div>
            )}
            {miembro.enlace && (
              <a href={miembro.enlace}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-sm
                            text-azul-claro font-semibold
                            hover:text-azul-medio transition-colors
                            border border-azul-claro/30 px-4 py-2
                            rounded-xl hover:bg-azul-claro/5">
                <span>🔗</span>
                <span>Ver página</span>
                <span>→</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EquipoPage() {
  const [seleccionado, setSeleccionado] = useState(null)

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-azul-oscuro
                     text-4xl mb-3">
        Nuestro Equipo
      </h1>
      <p className="text-ep-suave mb-10">
        Docentes facilitadores de la Región Educativa de Chiriquí — MEDUCA
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3
                      lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {EQUIPO.map((miembro, i) => (
          <div key={i}
               onClick={() => setSeleccionado(miembro)}
               className="bg-white rounded-2xl shadow-ep overflow-hidden
                          cursor-pointer group hover:-translate-y-2
                          hover:shadow-ep-lg transition-all duration-300">

            {/* Solo foto o avatar — sin cargo visible */}
            <div className="h-44 bg-gradient-to-br from-azul-oscuro
                            to-azul-claro flex items-center
                            justify-center relative overflow-hidden">
              {miembro.foto ? (
                <img src={miembro.foto} alt={miembro.nombre}
                     className="w-full h-full object-cover
                                group-hover:scale-110
                                transition-transform duration-700" />
              ) : (
                <div className="w-18 h-18 rounded-full bg-white/20
                                border-4 border-white/40 flex items-center
                                justify-center text-white font-display
                                font-bold text-3xl w-20 h-20">
                  {miembro.nombre.charAt(0)}
                </div>
              )}

              {/* Overlay hover */}
              <div className="absolute inset-0 bg-gradient-to-t
                              from-azul-oscuro/80 to-transparent
                              opacity-0 group-hover:opacity-100
                              transition-opacity duration-300
                              flex items-end justify-center pb-3">
                <span className="text-white text-xs font-semibold
                                 bg-white/20 px-3 py-1 rounded-full
                                 backdrop-blur-sm border border-white/30">
                  Ver info ✨
                </span>
              </div>
            </div>

            {/* Solo nombre — sin cargo */}
            <div className="p-3 text-center">
              <h3 className="font-display font-bold text-azul-oscuro
                             text-sm leading-tight line-clamp-2">
                {miembro.nombre}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {seleccionado && (
        <ModalMiembro
          miembro={seleccionado}
          onCerrar={() => setSeleccionado(null)}
        />
      )}
    </main>
  )
}
