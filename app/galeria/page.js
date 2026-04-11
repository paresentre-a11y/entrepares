'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'

// ── Datos de la galería ──
const CATEGORIAS = [
  { id: 'todas', label: 'Todas', emoji: '📸' },
  { id: 'eventos', label: 'Eventos', emoji: '🎉' },
  { id: 'talleres', label: 'Talleres', emoji: '🛠️' },
  { id: 'capacitaciones', label: 'Capacitaciones', emoji: '🎓' },
]

const GALERIA = [
  {
    id: 1,
    titulo: 'Inauguración del Programa 2026',
    descripcion: 'Ceremonia de apertura del año escolar con todos los facilitadores',
    categoria: 'eventos',
    imagen: '/images/20260223_115620.jpg',
  },
  {
    id: 2,
    titulo: 'Taller de Metodologías Activas',
    descripcion: 'Docentes aprendiendo estrategias pedagógicas innovadoras',
    categoria: 'talleres',
    imagen: '/images/20260223_115623.jpg',
  },
  {
    id: 3,
    titulo: 'Capacitación en Evaluación Formativa',
    descripcion: 'Sesión de formación sobre nuevas técnicas de evaluación',
    categoria: 'capacitaciones',
    imagen: '/images/20260223_115642.jpg',
  },
  {
    id: 4,
    titulo: 'Encuentro Regional de Docentes',
    descripcion: 'Reunión de facilitadores de toda la región de Chiriquí',
    categoria: 'eventos',
    imagen: '/images/20260223_145149.jpg',
  },
  {
    id: 5,
    titulo: 'Taller de Tecnología Educativa',
    descripcion: 'Implementación de herramientas digitales en el aula',
    categoria: 'talleres',
    imagen: '/images/20260223_145152.jpg',
  },
  {
    id: 6,
    titulo: 'Formación en Aprendizaje Colaborativo',
    descripcion: 'Estrategias para fomentar el trabajo entre pares',
    categoria: 'capacitaciones',
    imagen: '/images/20260223_145206.jpg',
  },
  {
    id: 7,
    titulo: 'Celebración del Día del Maestro',
    descripcion: 'Reconocimiento a la labor docente en la región',
    categoria: 'eventos',
    imagen: '/images/20260224_094334.jpg',
  },
  {
    id: 8,
    titulo: 'Taller de Planificación Curricular',
    descripcion: 'Diseño de unidades didácticas alineadas al currículo nacional',
    categoria: 'talleres',
    imagen: '/images/20260224_134549.jpg',
  },
  {
    id: 9,
    titulo: 'Seminario de Innovación Pedagógica',
    descripcion: 'Presentación de experiencias exitosas de transformación educativa',
    categoria: 'capacitaciones',
    imagen: '/images/20260224_134600.jpg',
  },
  {
    id: 10,
    titulo: 'Cierre de Año Escolar 2025',
    descripcion: 'Celebración de logros y aprendizajes del año',
    categoria: 'eventos',
    imagen: '/images/20260224_153223.jpg',
  },
  {
    id: 11,
    titulo: 'Taller de Inclusión Educativa',
    descripcion: 'Estrategias para atender la diversidad en el aula',
    categoria: 'talleres',
    imagen: '/images/20260224_153231.jpg',
  },
  {
    id: 12,
    titulo: 'Capacitación en Tutoría entre Pares',
    descripcion: 'Formación de facilitadores en mentoría docente',
    categoria: 'capacitaciones',
    imagen: '/images/20260224_153247.jpg',
  },
]

export default function GaleriaPage() {
  const [categoriaActiva, setCategoria] = useState('todas')
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null)

  const galeriaFiltrada = categoriaActiva === 'todas'
    ? GALERIA
    : GALERIA.filter(item => item.categoria === categoriaActiva)

  return (
    <div className="bg-gris-claro min-h-screen">
      {/* Header */}
      <section className="bg-azul-oscuro py-16 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display font-bold text-4xl mb-4">
            Galería de Actividades
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Momentos destacados de nuestro trabajo en formación docente y desarrollo educativo
          </p>
        </motion.div>
      </section>

      {/* Filtros por categoría */}
      <section className="py-8 bg-white shadow-sm sticky top-14 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-2.5 justify-center">
            {CATEGORIAS.map(cat => (
              <motion.button
                key={cat.id}
                onClick={() => setCategoria(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full
                  text-sm font-display font-semibold transition-all duration-200
                  ${categoriaActiva === cat.id
                    ? 'bg-azul-oscuro text-white shadow-ep'
                    : 'bg-white text-ep-texto border-2 border-gris-medio hover:border-azul-claro hover:text-azul-claro'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de galería */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={categoriaActiva}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {galeriaFiltrada.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                  className="bg-white rounded-ep-lg shadow-ep overflow-hidden
                             cursor-pointer group"
                  onClick={() => setImagenSeleccionada(item)}
                  whileHover={{ y: -4, shadow: '0 12px 32px rgba(0,53,128,0.2)' }}
                >
                  {/* Imagen */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      className="w-full h-full object-cover transition-transform
                                 duration-500 group-hover:scale-110"
                      onError={e => {
                        e.target.style.display = 'none'
                        e.target.nextElementSibling.style.display = 'flex'
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-azul-oscuro
                                  to-azul-claro items-center justify-center hidden"
                    >
                      <span className="text-6xl opacity-60">📷</span>
                    </div>

                    {/* Overlay en hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40
                                    transition-all duration-300 flex items-center
                                    justify-center">
                      <motion.div
                        className="text-white opacity-0 group-hover:opacity-100
                                   transition-opacity duration-300 text-center px-4"
                        initial={false}
                      >
                        <p className="text-3xl mb-2">🔍</p>
                        <p className="font-display font-semibold text-sm">
                          Ver imagen
                        </p>
                      </motion.div>
                    </div>

                    {/* Badge de categoría */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-block bg-white/90 backdrop-blur-sm
                                       text-azul-oscuro text-xs font-semibold px-2.5
                                       py-1 rounded-full shadow-sm">
                        {CATEGORIAS.find(c => c.id === item.categoria)?.emoji}{' '}
                        {CATEGORIAS.find(c => c.id === item.categoria)?.label}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-azul-oscuro text-lg
                                   mb-2 line-clamp-1">
                      {item.titulo}
                    </h3>
                    <p className="text-ep-suave text-sm line-clamp-2">
                      {item.descripcion}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Mensaje si no hay resultados */}
          {galeriaFiltrada.length === 0 && (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">📷</p>
              <p className="font-display text-xl text-azul-oscuro font-bold mb-2">
                No hay imágenes en esta categoría
              </p>
              <p className="text-ep-suave text-sm">
                Prueba con otra categoría o vuelve pronto
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal de imagen */}
      <AnimatePresence>
        {imagenSeleccionada && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center
                       justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setImagenSeleccionada(null)}
          >
            <motion.div
              className="bg-white rounded-ep-lg max-w-4xl w-full overflow-hidden
                         shadow-2xl"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Imagen en modal */}
              <div className="relative h-96 md:h-[500px]">
                <img
                  src={imagenSeleccionada.imagen}
                  alt={imagenSeleccionada.titulo}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextElementSibling.style.display = 'flex'
                  }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-br from-azul-oscuro
                              to-azul-claro items-center justify-center hidden"
                >
                  <span className="text-8xl opacity-60">📷</span>
                </div>

                {/* Botón cerrar */}
                <motion.button
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90
                             hover:bg-white rounded-full flex items-center
                             justify-center shadow-lg transition-colors text-xl
                             text-azul-oscuro"
                  onClick={() => setImagenSeleccionada(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Info */}
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-azul-oscuro
                                   text-2xl mb-2">
                      {imagenSeleccionada.titulo}
                    </h3>
                    <p className="text-ep-suave">
                      {imagenSeleccionada.descripcion}
                    </p>
                  </div>
                  <span className="inline-block bg-azul-oscuro/10 text-azul-oscuro
                                   text-xs font-semibold px-3 py-1.5 rounded-full
                                   flex-shrink-0">
                    {CATEGORIAS.find(c => c.id === imagenSeleccionada.categoria)?.emoji}{' '}
                    {CATEGORIAS.find(c => c.id === imagenSeleccionada.categoria)?.label}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <AnimatedSection variante="fade-up" className="py-16 bg-azul-oscuro text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display font-bold text-3xl mb-4">
            ¿Quieres ser parte de estas experiencias?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de aprendizaje y vive estas experiencias
            de desarrollo profesional.
          </p>
          <a href="/login"
             className="inline-flex items-center gap-2 bg-white text-azul-oscuro
                        font-display font-bold px-8 py-3.5 rounded-xl shadow-lg
                        hover:bg-gris-claro transition-colors duration-300">
            🔐 Acceder al Portal
          </a>
        </div>
      </AnimatedSection>
    </div>
  )
}
