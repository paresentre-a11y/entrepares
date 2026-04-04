'use client'
import { useState } from 'react'

const EQUIPO = [
  {
    nombre: 'Jorge Polanco',
    cargo: 'Programador y Soporte Técnico',
    descripcion: 'Responsable de la infraestructura tecnológica del programa. Desarrolla y mantiene las plataformas digitales que apoyan la gestión educativa.',
    especialidad: 'Desarrollo Web y Soporte TIC',
    foto: '/images/yo_en.gif',
    web: 'https://jorgepolancorodriguez.pages.dev',
  },
  {
    nombre: 'Alba',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Eduardo',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Edwin',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Eloida',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Eliseo',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Floridali [completar apellido]',
    cargo: 'Coordinadora',
    descripcion: 'Coordinadora del programa Entre Pares Chiriquí. Lidera el equipo de facilitadores de la Región Educativa de Chiriquí hacia la transformación educativa digital.',
    especialidad: 'Coordinación y Liderazgo Educativo',
    foto: null,
  },
  {
    nombre: 'Gerald',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Katherin',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Marcial',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Mixela',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Nico',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Rudy',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Sabby',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Vanessa',
    cargo: 'Docente Facilitadora',
    descripcion: 'Docente facilitadora de la Región Educativa de Chiriquí, comprometida con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
    foto: null,
  },
  {
    nombre: 'Walter',
    cargo: 'Docente Facilitador',
    descripcion: 'Docente facilitador de la Región Educativa de Chiriquí, comprometido con la transformación educativa digital.',
    especialidad: 'Facilitación Educativa',
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
          background: 'linear-gradient(135deg, #003580, #0066CC, #00d4ff, #ffffff, #0066CC, #003580)',
          backgroundSize: '300% 300%',
          animation: 'gradiente-luz 3s ease infinite',
          boxShadow: '0 0 30px rgba(0,102,204,0.6), 0 0 60px rgba(0,102,204,0.3), 0 0 90px rgba(0,212,255,0.2)',
          maxWidth: '28rem',
          width: '100%',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '1.35rem',
          background: 'conic-gradient(from 0deg, transparent 0deg, #0066CC 60deg, #00d4ff 120deg, #ffffff 180deg, #0066CC 240deg, transparent 360deg)',
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
          <div className="relative h-48 bg-gradient-to-br
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

            {[...Array(8)].map((_, i) => (
              <div key={i}
                   className="absolute rounded-full bg-white/20"
                   style={{
                     width: `${8 + i * 4}px`,
                     height: `${8 + i * 4}px`,
                     left: `${10 + i * 11}%`,
                     top: `${15 + (i % 4) * 20}%`,
                     animation: `pulsar-luz ${1.5 + i * 0.25}s ease-in-out infinite`,
                     animationDelay: `${i * 0.15}s`,
                     filter: 'blur(2px)',
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

          <div className="p-6">
            <h3 className="font-display font-bold text-azul-oscuro
                           text-xl mb-2">
              {miembro.nombre}
            </h3>
            <span className="inline-block bg-gradient-to-r
                             from-azul-claro to-azul-medio
                             text-white text-xs font-semibold
                             px-4 py-1.5 rounded-full mb-4
                             shadow-md">
              {miembro.cargo}
            </span>
            <p className="text-ep-suave text-sm leading-relaxed mb-4">
              {miembro.descripcion}
            </p>
            {miembro.especialidad && (
              <div className="flex items-center gap-2 text-sm
                              bg-gris-claro rounded-xl px-4 py-3
                              text-azul-oscuro font-medium">
                <span className="text-lg">🎯</span>
                <span>{miembro.especialidad}</span>
              </div>
            )}
            {miembro.web && (
              <a href={miembro.web}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 text-sm
                            bg-gradient-to-r from-azul-claro to-azul-medio
                            text-white rounded-xl px-4 py-3
                            font-medium hover:opacity-90
                            transition-opacity mt-3">
                <span className="text-lg">🔗</span>
                <span>Visitar sitio web</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2
                      lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {EQUIPO.map((miembro, i) => (
          <div key={i}
               onClick={() => setSeleccionado(miembro)}
               className="bg-white rounded-2xl shadow-ep overflow-hidden
                          cursor-pointer group hover:-translate-y-2
                          hover:shadow-ep-lg transition-all duration-300">

            <div className="h-52 bg-gradient-to-br from-azul-oscuro
                            to-azul-claro flex items-center
                            justify-center relative overflow-hidden">
              {miembro.foto ? (
                <img src={miembro.foto} alt={miembro.nombre}
                     className="w-full h-full object-cover
                                group-hover:scale-110
                                transition-transform duration-700" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20
                                border-4 border-white/40 flex items-center
                                justify-center text-white font-display
                                font-bold text-3xl">
                  {miembro.nombre.charAt(0)}
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t
                              from-azul-oscuro/70 to-transparent
                              opacity-0 group-hover:opacity-100
                              transition-opacity duration-300
                              flex items-end justify-center pb-4">
                <span className="text-white text-xs font-semibold
                                 bg-white/20 px-4 py-1.5 rounded-full
                                 backdrop-blur-sm border border-white/30">
                  Ver perfil ✨
                </span>
              </div>

              <div className="absolute -top-10 -right-10 w-24 h-24
                              rounded-full bg-white/10
                              group-hover:scale-150 group-hover:opacity-50
                              transition-all duration-700 opacity-0" />
            </div>

            <div className="p-4 text-center">
              <h3 className="font-display font-bold text-azul-oscuro
                             text-base mb-1 line-clamp-1">
                {miembro.nombre}
              </h3>
              <span className="text-azul-claro text-xs font-semibold">
                {miembro.cargo}
              </span>
              {miembro.web && (
                <a href={miembro.web}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="block mt-2 text-xs text-azul-medio
                              hover:underline font-medium">
                  🔗 Visitar sitio web
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {seleccionado && (
        <ModalMiembro
          miembro={seleccionado}
          onCerrar={() => setSeleccionado(null)}
        />
      )}
    </main>
  )
}
