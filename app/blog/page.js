'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { obtenerArticulos, formatearFecha, CATEGORIAS } from '@/lib/blog'
import AnimatedCard from '@/components/AnimatedCard'

// ── Slides del carrusel ──
const SLIDES = [
  {
    imagen: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&q=85',
    emoji: '📚',
    titulo: 'Aula Lista para Usar',
    subtitulo: 'Recursos Educativos',
    items: [
      'Recursos didácticos para tus clases',
      'Materiales y actividades prácticas',
      'Guías listas para implementar',
    ],
  },
  {
    imagen: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&q=85',
    emoji: '🎓',
    titulo: 'Crece como Docente',
    subtitulo: 'Formación y Cursos',
    items: [
      'Cursos y capacitaciones certificadas',
      'Formación continua y desarrollo',
      'Comunidad de aprendizaje entre pares',
    ],
  },
  {
    imagen: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400&q=85',
    emoji: '💻',
    titulo: 'Enseña con Tecnología',
    subtitulo: 'Innovación Educativa',
    items: [
      'Herramientas digitales educativas',
      'Apps y plataformas para el aula',
      'Innovación pedagógica con TIC',
    ],
  },
]

function Carrusel() {
  const [actual, setActual] = useState(0)
  const [animando, setAnimando] = useState(false)
  const timer = useRef(null)

  const cambiarA = (siguiente) => {
    if (animando) return
    setAnimando(true)
    setTimeout(() => {
      setActual(siguiente)
      setAnimando(false)
    }, 400)
  }

  const iniciarTimer = () => {
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      cambiarA((actual + 1) % SLIDES.length)
    }, 5500)
  }

  useEffect(() => {
    iniciarTimer()
    return () => clearInterval(timer.current)
  }, [actual])

  const irA = (i) => {
    if (i === actual) return
    cambiarA(i)
  }

  const s = SLIDES[actual]

  return (
    <div className="relative rounded-2xl overflow-hidden mb-10
                    h-72 md:h-96 shadow-ep-lg">

      {/* Imágenes con crossfade */}
      {SLIDES.map((slide, i) => (
        <div key={i}
             className={`absolute inset-0 transition-all duration-1000
               ${i === actual
                 ? 'opacity-100 scale-100'
                 : 'opacity-0 scale-105'}`}>
          <img src={slide.imagen} alt={slide.titulo}
               className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r
                      from-black/75 via-black/40 to-transparent" />

      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i}
               className="absolute rounded-full bg-white/8"
               style={{
                 width: `${80 + i * 50}px`,
                 height: `${80 + i * 50}px`,
                 right: `${5 + i * 8}%`,
                 top: `${5 + i * 18}%`,
                 animation: `pulsar-luz ${2 + i * 0.6}s ease-in-out infinite`,
                 animationDelay: `${i * 0.3}s`,
                 filter: 'blur(25px)',
               }} />
        ))}
      </div>

      {/* Contenido */}
      <div className={`absolute inset-0 flex items-center z-10
                       transition-all duration-400
                       ${animando
                         ? 'opacity-0 translate-x-6'
                         : 'opacity-100 translate-x-0'}`}>
        <div className="px-8 md:px-14 max-w-xl">
          <span className="inline-block bg-white/15 backdrop-blur-sm
                           text-white text-xs font-semibold px-3 py-1.5
                           rounded-full mb-3 border border-white/25">
            {s.emoji} {s.subtitulo}
          </span>
          <h2 className="font-display font-bold text-white
                         text-2xl md:text-4xl leading-tight mb-4
                         drop-shadow-lg">
            {s.titulo}
          </h2>
          <ul className="space-y-2">
            {s.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full
                                 bg-white/80 flex-shrink-0" />
                <span className="text-white/90 text-sm md:text-base
                                 drop-shadow">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Puntos — SIN FLECHAS */}
      <div className="absolute bottom-5 left-0 right-0
                      flex justify-center gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => irA(i)}
                  className={`h-2 rounded-full transition-all duration-500
                    ${i === actual
                      ? 'bg-white w-10 shadow-lg'
                      : 'bg-white/40 w-2 hover:bg-white/70 hover:w-5'}`}
                  aria-label={`Ir al slide ${i + 1}`} />
        ))}
      </div>

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 right-0
                      h-0.5 bg-white/20 z-10">
        <div key={actual}
             className="h-full bg-white/60 rounded-full"
             style={{
               animation: 'progreso-barra 5.5s linear forwards',
             }} />
      </div>
    </div>
  )
}

export default function BlogPage() {
  const [articulos,    setArticulos]    = useState([])
  const [cargando,     setCargando]     = useState(true)
  const [categoriaActiva, setCategoria] = useState('todos')
  const [modalArticulo, setModal]       = useState(null)

  useEffect(() => {
    setCargando(true)
    obtenerArticulos(true, categoriaActiva).then(({ data }) => {
      setArticulos(data || [])
      setCargando(false)
    })
  }, [categoriaActiva])

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">

      {/* ── Carrusel banner ── */}
      <Carrusel />

      {/* ── Título sección ── */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-azul-oscuro text-4xl mb-2">
          Blog Educativo
        </h1>
        <p className="text-ep-suave">
          Recursos y formación para docentes de la Región Educativa de Chiriquí
        </p>
      </div>

      {/* ── Filtros por categoría (4 etiquetas) ── */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {CATEGORIAS.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoria(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full
              text-sm font-display font-semibold transition-all duration-200
              ${categoriaActiva === cat.id
                ? 'bg-azul-oscuro text-white shadow-ep'
                : 'bg-white text-ep-texto border-2 border-gris-medio hover:border-azul-claro hover:text-azul-claro'}`}>
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ── Grid de artículos ── */}
      {cargando ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-gris-medio
                          border-t-azul-claro rounded-full animate-spin" />
        </div>
      ) : articulos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-display text-xl text-azul-oscuro font-bold mb-2">
            No hay artículos en esta categoría
          </p>
          <p className="text-ep-suave text-sm">
            Prueba con otra categoría o vuelve pronto
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articulos.map((a, i) => (
            <AnimatedCard
              key={a.id}
              delay={Math.min(i * 0.08, 0.4)}
              onClick={() => setModal(a)}
              className="bg-white rounded-2xl shadow-ep overflow-hidden flex flex-col"
            >
              {/* Imagen */}
              {a.imagen_url ? (
                <img src={a.imagen_url} alt={a.titulo}
                     className="w-full h-48 object-cover"
                     onError={e => { e.target.style.display='none' }} />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-azul-oscuro
                                to-azul-claro flex items-center justify-center">
                  <span className="text-5xl opacity-60">📄</span>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Categoría badge */}
                {a.categoria && (
                  <span className="inline-block self-start mb-2 px-2.5 py-1
                                   bg-azul-oscuro/8 text-azul-oscuro text-xs
                                   font-semibold rounded-lg">
                    {CATEGORIAS.find(c => c.id === a.categoria)?.emoji}{' '}
                    {CATEGORIAS.find(c => c.id === a.categoria)?.label || a.categoria}
                  </span>
                )}

                <p className="text-azul-claro text-xs font-medium mb-2">
                  {formatearFecha(a.created_at)}
                </p>
                <h2 className="font-display font-bold text-azul-oscuro text-lg
                               mb-2 line-clamp-2 leading-snug">
                  {a.titulo}
                </h2>
                <p className="text-ep-suave text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                  {a.descripcion || a.contenido}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3
                                border-t border-gris-medio">
                  <p className="text-xs text-ep-suave">Por {a.autor}</p>
                  {/* ── LEER MÁS ── */}
                  <button
                    onClick={() => setModal(a)}
                    className="inline-flex items-center gap-1.5 text-azul-claro
                               text-sm font-display font-semibold
                               hover:text-azul-medio transition-colors group">
                    Leer más
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      )}

      {/* ── Modal "Leer más" ── */}
      {modalArticulo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center
                        justify-center p-4 backdrop-blur-sm"
             onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh]
                          overflow-y-auto shadow-2xl"
               onClick={e => e.stopPropagation()}>
            {modalArticulo.imagen_url && (
              <img src={modalArticulo.imagen_url} alt={modalArticulo.titulo}
                   className="w-full h-56 object-cover rounded-t-2xl"
                   onError={e => { e.target.style.display='none' }} />
            )}
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="font-display font-bold text-azul-oscuro text-2xl
                               leading-snug">
                  {modalArticulo.titulo}
                </h2>
                <button onClick={() => setModal(null)}
                        className="text-ep-suave hover:text-ep-texto flex-shrink-0
                                   w-8 h-8 flex items-center justify-center
                                   rounded-full hover:bg-gris-claro transition-colors
                                   text-xl">
                  ✕
                </button>
              </div>
              <p className="text-ep-suave text-sm mb-6">
                Por {modalArticulo.autor} · {formatearFecha(modalArticulo.created_at)}
              </p>
              {modalArticulo.descripcion && (
                <p className="text-ep-texto font-medium mb-4 text-base leading-relaxed
                               border-l-4 border-azul-claro pl-4 italic">
                  {modalArticulo.descripcion}
                </p>
              )}
              <div className="prose prose-sm max-w-none text-ep-texto leading-relaxed
                              whitespace-pre-line">
                {modalArticulo.contenido}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
