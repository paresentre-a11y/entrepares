'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { obtenerArticulos, formatearFecha, CATEGORIAS } from '@/lib/blog'

// ── Slides del carrusel ──
const SLIDES = [
  {
    emoji: '📚',
    titulo: 'Aula Lista para Usar',
    items: ['Recursos didácticos', 'Materiales para tus clases', 'Actividades y guías prácticas'],
    bg: 'from-[#003580] to-[#0047AB]',
  },
  {
    emoji: '🎓',
    titulo: 'Crece como Docente',
    items: ['Cursos y capacitaciones', 'Formación continua', 'Desarrollo profesional'],
    bg: 'from-[#0047AB] to-[#0066CC]',
  },
  {
    emoji: '💻',
    titulo: 'Enseña con Tecnología',
    items: ['Herramientas digitales', 'Apps educativas', 'Innovación en el aula'],
    bg: 'from-[#0066CC] to-[#0080FF]',
  },
]

function Carrusel() {
  const [actual, setActual] = useState(0)
  const timer = useRef(null)

  const iniciarTimer = () => {
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      setActual(prev => (prev + 1) % SLIDES.length)
    }, 4500)
  }

  useEffect(() => { iniciarTimer(); return () => clearInterval(timer.current) }, [])

  const irA = (i) => { setActual(i); iniciarTimer() }
  const anterior = () => { irA((actual - 1 + SLIDES.length) % SLIDES.length) }
  const siguiente = () => { irA((actual + 1) % SLIDES.length) }

  const s = SLIDES[actual]

  return (
    <div className={`relative bg-gradient-to-br ${s.bg} rounded-2xl overflow-hidden
                     mb-10 transition-all duration-700`}>
      <div className="flex flex-col md:flex-row items-center gap-6 px-8 py-10 md:py-12">

        {/* Icono */}
        <div className="text-7xl md:text-8xl select-none flex-shrink-0">
          {s.emoji}
        </div>

        {/* Contenido */}
        <div className="flex-1 text-white text-center md:text-left">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
            {s.titulo}
          </h2>
          <ul className="space-y-1.5">
            {s.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2
                                     justify-center md:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                <span className="text-white/85 text-sm md:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Controles */}
        <div className="flex md:flex-col gap-3 flex-shrink-0">
          <button onClick={anterior}
                  className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25
                             text-white flex items-center justify-center
                             transition-colors text-lg">‹</button>
          <button onClick={siguiente}
                  className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25
                             text-white flex items-center justify-center
                             transition-colors text-lg">›</button>
        </div>
      </div>

      {/* Puntos indicadores */}
      <div className="flex justify-center gap-2 pb-4">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => irA(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300
                    ${i === actual ? 'bg-white w-6' : 'bg-white/40'}`} />
        ))}
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
          {articulos.map(a => (
            <article key={a.id}
                     className="bg-white rounded-2xl shadow-ep overflow-hidden
                                hover:-translate-y-1 hover:shadow-ep-lg
                                transition-all duration-300 flex flex-col">
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
            </article>
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
