'use client'
import { useState, useEffect } from 'react'

const slides = [
  {
    emoji: '📚',
    title: 'Aula Lista para Usar',
    items: ['Recursos didácticos', 'Materiales para tus clases', 'Actividades y guías prácticas'],
    gradient: 'from-azul-oscuro via-azul-medio to-azul-claro',
  },
  {
    emoji: '🎓',
    title: 'Crece como Docente',
    items: ['Cursos y capacitaciones', 'Formación continua', 'Desarrollo profesional'],
    gradient: 'from-indigo-800 via-indigo-600 to-blue-500',
  },
  {
    emoji: '💻',
    title: 'Enseña con Tecnología',
    items: ['Herramientas digitales', 'Apps educativas', 'Innovación en el aula'],
    gradient: 'from-teal-700 via-teal-500 to-cyan-400',
  },
]

export default function BlogCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = index => setCurrent(index)
  const prev = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length)
  const next = () => setCurrent(prev => (prev + 1) % slides.length)

  return (
    <section className="relative w-full overflow-hidden rounded-ep-lg shadow-ep-lg mb-10">
      {/* Slides */}
      <div className="relative h-[280px] sm:h-[320px] md:h-[360px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out
              ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6 text-center">
              <span className="text-5xl sm:text-6xl mb-4">{slide.emoji}</span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
                {slide.title}
              </h2>
              <ul className="space-y-2">
                {slide.items.map((item, j) => (
                  <li key={j} className="text-sm sm:text-base md:text-lg text-white/90 flex items-center gap-2 justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10
          bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full
          flex items-center justify-center text-white transition-colors"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10
          bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full
          flex items-center justify-center text-white text-xl transition-colors"
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300
              ${i === current ? 'bg-white w-7' : 'bg-white/50 hover:bg-white/70'}`}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
