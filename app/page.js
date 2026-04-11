'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GSAPReveal   from '@/components/GSAPReveal'
import GSAPParallax from '@/components/GSAPParallax'
import GSAPCounter  from '@/components/GSAPCounter'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const heroRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Animación de entrada del hero en secuencia ──
      const tl = gsap.timeline({ delay: 0.2 })

      tl.fromTo('.hero-logo',
        { opacity: 0, scale: 0.6, rotation: -10 },
        { opacity: 1, scale: 1, rotation: 0,
          duration: 0.9, ease: 'back.out(1.7)' }
      )
      .fromTo('.hero-titulo',
        { opacity: 0, y: 60, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0,
          duration: 0.8, ease: 'power4.out' },
        '-=0.4'
      )
      .fromTo('.hero-subtitulo',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0,
          duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo('.hero-botones',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1,
          duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('.hero-scroll-indicator',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.1'
      )

      // ── Animación continua del indicador de scroll ──
      gsap.to('.hero-scroll-dot', {
        y: 12,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })

      // ── Blobs flotantes ──
      gsap.to('.blob-1', {
        y: -30, x: 15, rotation: 15,
        duration: 6,
        repeat: -1, yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.blob-2', {
        y: 25, x: -20, rotation: -10,
        duration: 8,
        repeat: -1, yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      })
      gsap.to('.blob-3', {
        y: -20, x: 10,
        duration: 7,
        repeat: -1, yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      })

      // ── Parallax del hero al hacer scroll ──
      gsap.to('.hero-content', {
        y: 100,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to('.hero-bg', {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      })

      // ── Animación de las cards de misión con stagger ──
      gsap.fromTo('.mision-card',
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.mision-grid',
            start: 'top 85%',
          },
        }
      )

    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* ════════════ HERO con GSAP + ScrollTrigger ════════════ */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
               style={{ background: 'linear-gradient(145deg,#001a4d,#003580 50%,#0050b3)' }}>

        {/* CAPA 1 — Fondo parallax */}
        <div className="hero-bg absolute inset-0">
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `radial-gradient(circle at 20% 50%, #0066CC 0%, transparent 50%),
                                   radial-gradient(circle at 80% 20%, #00d4ff 0%, transparent 40%),
                                   radial-gradient(circle at 60% 80%, #003580 0%, transparent 45%)`,
               }} />
        </div>

        {/* CAPA 2 — Blobs decorativos flotantes */}
        <div className="blob-1 absolute w-96 h-96 rounded-full opacity-8 bg-white/5 -top-20 -right-20" />
        <div className="blob-2 absolute w-64 h-64 rounded-full opacity-6 bg-azul-claro/20 bottom-10 -left-16" />
        <div className="blob-3 absolute w-48 h-48 rounded-full opacity-5 bg-white/10 top-1/2 right-1/4" />

        {/* CAPA 3 — Contenido */}
        <div className="hero-content relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div>
            <img src="/images/logo.png" alt="Entre Pares Chiriquí"
                 className="hero-logo h-40 w-auto mx-auto mb-8 object-contain drop-shadow-2xl"
                 onError={e => { e.target.src = 'https://www.entrepares.cloud/images/logo.png' }} />
          </div>

          <h1 className="hero-titulo font-display font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(2rem,6vw,4rem)' }}>
            Entre Pares Chiriquí
          </h1>

          <p className="hero-subtitulo text-white/75 mb-8 max-w-xl mx-auto font-light"
             style={{ fontSize: 'clamp(1rem,2.5vw,1.25rem)' }}>
            Formando docentes para la educación del siglo XXI
          </p>

          <div className="hero-botones flex gap-4 justify-center flex-wrap">
            <a href="/nosotros"
               className="bg-white text-azul-oscuro font-display font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              Conocer el Programa
            </a>
            <a href="/blog"
               className="border-2 border-white/60 text-white font-display font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors duration-300">
              Ver Recursos
            </a>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
            <div className="hero-scroll-dot w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ════════════ Sección de bienvenida ════════════ */}
      <GSAPReveal animacion="fade-up" className="max-w-6xl mx-auto px-6 py-16">
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
            <div className="mision-grid grid grid-cols-2 gap-6">
              <div className="mision-card text-center p-4 bg-white rounded-ep shadow-ep">
                <p className="text-4xl mb-2">👩‍🏫</p>
                <p className="font-display font-bold text-2xl text-azul-oscuro">
                  <GSAPCounter valor={17} duracion={2} />
                </p>
                <p className="text-ep-suave text-sm">Facilitadores</p>
              </div>
              <div className="mision-card text-center p-4 bg-white rounded-ep shadow-ep">
                <p className="text-4xl mb-2">🗺️</p>
                <p className="font-display font-bold text-2xl text-azul-oscuro">
                  <GSAPCounter valor={1} duracion={1.5} />
                </p>
                <p className="text-ep-suave text-sm">Región Educativa</p>
              </div>
              <div className="mision-card text-center p-4 bg-white rounded-ep shadow-ep">
                <p className="text-4xl mb-2">📚</p>
                <p className="font-display font-bold text-2xl text-azul-oscuro">100+</p>
                <p className="text-ep-suave text-sm">Recursos</p>
              </div>
              <div className="mision-card text-center p-4 bg-white rounded-ep shadow-ep">
                <p className="text-4xl mb-2">🏆</p>
                <p className="font-display font-bold text-2xl text-azul-oscuro">
                  <GSAPCounter valor={100} sufijo="%" duracion={2.5} />
                </p>
                <p className="text-ep-suave text-sm">Compromiso</p>
              </div>
            </div>
          </div>
        </div>
      </GSAPReveal>

      {/* ════════════ Sección de características ════════════ */}
      <GSAPReveal animacion="fade-up" delay={0.1} className="py-16 bg-gris-claro">
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
            ].map((item, i) => (
              <div key={item.title}
                   className="stagger-item bg-white rounded-ep-lg p-8 shadow-ep hover:-translate-y-1 transition-shadow duration-300">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-azul-oscuro text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-ep-suave leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </GSAPReveal>

      {/* ════════════ CTA ════════════ */}
      <GSAPReveal animacion="zoom" className="py-16 bg-azul-oscuro text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display font-bold text-3xl mb-4">
            Únete a la comunidad de Entre Pares Chiriquí
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Accede a recursos exclusivos, participa en comunidades de aprendizaje
            y fortalece tu práctica docente.
          </p>
          <Link href="/login" className="btn-primary bg-white text-azul-claro hover:bg-gris-claro">
            Acceder al Portal
          </Link>
        </div>
      </GSAPReveal>
    </>
  )
}
