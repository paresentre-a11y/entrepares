'use client'
import { useState, useEffect } from 'react'
import GSAPReveal from '@/components/GSAPReveal'
import { motion, AnimatePresence } from 'framer-motion'

const IMAGENES = [
  { src: '/images/20260223_115620.webp',  alt: 'Actividad Entre Pares 1'  },
  { src: '/images/20260223_115623.webp',  alt: 'Actividad Entre Pares 2'  },
  { src: '/images/20260223_115642.webp',  alt: 'Actividad Entre Pares 3'  },
  { src: '/images/20260223_145149.webp',  alt: 'Actividad Entre Pares 4'  },
  { src: '/images/20260223_145152.webp',  alt: 'Actividad Entre Pares 5'  },
  { src: '/images/20260223_145206.webp',  alt: 'Actividad Entre Pares 6'  },
  { src: '/images/20260224_094334.webp',  alt: 'Actividad Entre Pares 7'  },
  { src: '/images/20260224_134549.webp',  alt: 'Actividad Entre Pares 8'  },
  { src: '/images/20260224_134600.webp',  alt: 'Actividad Entre Pares 9'  },
  { src: '/images/20260224_153223.webp',  alt: 'Actividad Entre Pares 10' },
  { src: '/images/20260224_153231.webp',  alt: 'Actividad Entre Pares 11' },
  { src: '/images/20260224_153247.webp',  alt: 'Actividad Entre Pares 12' },
  { src: '/images/20260224_153256.webp',  alt: 'Actividad Entre Pares 13' },
  { src: '/images/20260224_153605.webp',  alt: 'Actividad Entre Pares 14' },
  { src: '/images/20260224_153707.webp',  alt: 'Actividad Entre Pares 15' },
  { src: '/images/20260224_153711.webp',  alt: 'Actividad Entre Pares 16' },
  { src: '/images/20260225_104339.webp',  alt: 'Actividad Entre Pares 17' },
  { src: '/images/20260225_104406.webp',  alt: 'Actividad Entre Pares 18' },
  { src: '/images/20260225_133039.webp',  alt: 'Actividad Entre Pares 19' },
  { src: '/images/IMG_20260223_092300.webp', alt: 'Actividad Entre Pares 20' },
  { src: '/images/IMG_20260224_064144.webp', alt: 'Actividad Entre Pares 21' },
]

export default function GaleriaPage() {
  const [imagenActiva, setImagenActiva] = useState(null)
  const [indiceActivo, setIndiceActivo] = useState(0)

  const abrirLightbox = (imagen, indice) => {
    setImagenActiva(imagen)
    setIndiceActivo(indice)
    document.body.style.overflow = 'hidden'
  }

  const cerrarLightbox = () => {
    setImagenActiva(null)
    document.body.style.overflow = ''
  }

  const anterior = () => {
    const nuevoIndice =
      (indiceActivo - 1 + IMAGENES.length) % IMAGENES.length
    setIndiceActivo(nuevoIndice)
    setImagenActiva(IMAGENES[nuevoIndice])
  }

  const siguiente = () => {
    const nuevoIndice = (indiceActivo + 1) % IMAGENES.length
    setIndiceActivo(nuevoIndice)
    setImagenActiva(IMAGENES[nuevoIndice])
  }

  useEffect(() => {
    const handler = e => {
      if (!imagenActiva) return
      if (e.key === 'ArrowLeft')  anterior()
      if (e.key === 'ArrowRight') siguiente()
      if (e.key === 'Escape')     cerrarLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [imagenActiva, indiceActivo])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      {/* Título */}
      <GSAPReveal animacion="fade-down">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-azul-oscuro
                         text-4xl md:text-5xl mb-4">
            Galería
          </h1>
          <p className="text-ep-suave text-lg max-w-xl mx-auto">
            Momentos y actividades del programa Entre Pares Chiriquí
          </p>
          <div className="w-16 h-1 bg-azul-claro rounded-full
                          mx-auto mt-6" />
        </div>
      </GSAPReveal>

      {/* Grid de imágenes — masonry */}
      <GSAPReveal
        animacion="fade-up"
        stagger
        staggerSelector=".foto-item"
      >
        <div className="columns-2 sm:columns-3 lg:columns-4
                        gap-3 space-y-3">
          {IMAGENES.map((imagen, i) => (
            <div
              key={i}
              className="foto-item break-inside-avoid relative
                         overflow-hidden rounded-xl cursor-pointer
                         group"
              onClick={() => abrirLightbox(imagen, i)}
            >
              <div className="relative w-full">
                <img
                  src={imagen.src}
                  alt={imagen.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover
                             transition-transform duration-500
                             group-hover:scale-105"
                />

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-azul-oscuro/50
                                opacity-0 group-hover:opacity-100
                                transition-opacity duration-300
                                flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20
                                  backdrop-blur-sm border-2 border-white/60
                                  flex items-center justify-center
                                  text-white text-2xl">
                    🔍
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GSAPReveal>

      {/* Lightbox */}
      <AnimatePresence>
        {imagenActiva && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50
                       flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarLightbox}
          >
            <motion.div
              className="relative max-w-5xl w-full max-h-[90vh]
                         flex items-center justify-center"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{ scale: 0.85,    opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={imagenActiva.src}
                alt={imagenActiva.alt}
                className="max-w-full max-h-[85vh] object-contain
                           rounded-xl shadow-2xl"
              />

              {/* Contador */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2
                              bg-black/50 backdrop-blur-sm text-white
                              text-sm px-4 py-1.5 rounded-full
                              font-display font-medium">
                {indiceActivo + 1} / {IMAGENES.length}
              </div>

              {/* Botón cerrar */}
              <motion.button
                onClick={cerrarLightbox}
                className="absolute top-4 right-4 w-10 h-10
                           rounded-full bg-white/15 hover:bg-white/30
                           text-white flex items-center justify-center
                           text-xl transition-colors backdrop-blur-sm"
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              {/* Flecha anterior */}
              <motion.button
                onClick={anterior}
                className="absolute left-2 md:-left-16 top-1/2
                           -translate-y-1/2 w-12 h-12 rounded-full
                           bg-white/15 hover:bg-white/30 text-white
                           flex items-center justify-center text-2xl
                           transition-colors backdrop-blur-sm"
                whileTap={{ scale: 0.9 }}
              >
                ‹
              </motion.button>

              {/* Flecha siguiente */}
              <motion.button
                onClick={siguiente}
                className="absolute right-2 md:-right-16 top-1/2
                           -translate-y-1/2 w-12 h-12 rounded-full
                           bg-white/15 hover:bg-white/30 text-white
                           flex items-center justify-center text-2xl
                           transition-colors backdrop-blur-sm"
                whileTap={{ scale: 0.9 }}
              >
                ›
              </motion.button>
            </motion.div>

            {/* Miniaturas */}
            <div className="absolute bottom-4 left-0 right-0
                            flex justify-center gap-1.5 px-4
                            overflow-x-auto">
              {IMAGENES.map((img, i) => (
                <motion.div
                  key={i}
                  onClick={e => {
                    e.stopPropagation()
                    setIndiceActivo(i)
                    setImagenActiva(img)
                  }}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg
                               overflow-hidden cursor-pointer
                               transition-all duration-200
                               ${i === indiceActivo
                                 ? 'ring-2 ring-white scale-110'
                                 : 'opacity-50 hover:opacity-80'}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img.src} alt={img.alt}
                       className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
