'use client'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'
import AnimatedCard from '@/components/AnimatedCard'
import ParallaxLayer from '@/components/ParallaxLayer'

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const yTexto   = useTransform(scrollYProgress, [0, 1], ['0px', '120px'])
  const yFondo   = useTransform(scrollYProgress, [0, 1], ['0px', '200px'])
  const opacidad = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const escala   = useTransform(scrollYProgress, [0, 0.5], [1, 1.08])

  return (
    <>
      {/* HERO con 3 capas parallax */}
      <section ref={heroRef}
               className="relative min-h-screen flex items-center
                          justify-center overflow-hidden"
               style={{ background: 'linear-gradient(145deg,#001a4d,#003580 50%,#0050b3)' }}>

        {/* CAPA 1 — Fondo (movimiento más lento) */}
        <motion.div
          className="absolute inset-0"
          style={{ y: yFondo, scale: escala }}
        >
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `radial-gradient(circle at 20% 50%, #0066CC 0%, transparent 50%),
                                   radial-gradient(circle at 80% 20%, #00d4ff 0%, transparent 40%),
                                   radial-gradient(circle at 60% 80%, #003580 0%, transparent 45%)`,
               }} />
        </motion.div>

        {/* CAPA 2 — Blobs decorativos (movimiento medio) */}
        <ParallaxLayer velocidad={0.4}
                       className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full opacity-8
                          bg-white/5 -top-20 -right-20
                          animate-pulse" />
          <div className="absolute w-64 h-64 rounded-full opacity-6
                          bg-azul-claro/20 bottom-10 -left-16" />
          <div className="absolute w-48 h-48 rounded-full opacity-5
                          bg-white/10 top-1/2 right-1/4" />
        </ParallaxLayer>

        {/* CAPA 3 — Contenido (fijo) */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          style={{ y: yTexto, opacity: opacidad }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img src="/images/logo.png" alt="Entre Pares Chiriquí"
                 className="h-40 w-auto mx-auto mb-8 object-contain
                            drop-shadow-2xl"
                 onError={e => { e.target.src = 'https://www.entrepares.cloud/images/logo.png' }} />
          </motion.div>

          <motion.h1
            className="font-display font-bold text-white mb-4 leading-tight"
            style={{ fontSize: 'clamp(2rem,6vw,4rem)' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Entre Pares Chiriquí
          </motion.h1>

          <motion.p
            className="text-white/75 mb-8 max-w-xl mx-auto font-light"
            style={{ fontSize: 'clamp(1rem,2.5vw,1.25rem)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            Formando docentes para la educación del siglo XXI
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.a href="/nosotros"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-white text-azul-oscuro font-display
                                 font-bold px-8 py-3.5 rounded-xl
                                 shadow-lg hover:shadow-xl
                                 transition-shadow duration-300">
              Conocer el Programa
            </motion.a>
            <motion.a href="/blog"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="border-2 border-white/60 text-white
                                 font-display font-semibold px-8 py-3.5
                                 rounded-xl hover:bg-white/10
                                 transition-colors duration-300">
              Ver Recursos
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Flecha scroll animada */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full
                          flex items-start justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Sección de bienvenida con scroll reveal */}
      <AnimatedSection variante="fade-up" className="max-w-6xl mx-auto px-6 py-16">
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
      </AnimatedSection>

      {/* Sección de características con cards animadas */}
      <AnimatedSection variante="fade-up" delay={0.1} className="py-16 bg-gris-claro">
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
              <AnimatedCard key={item.title} delay={i * 0.15}
                            className="bg-white rounded-ep-lg p-8 shadow-ep">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-azul-oscuro text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-ep-suave leading-relaxed">{item.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection variante="zoom" className="py-16 bg-azul-oscuro text-white text-center">
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
      </AnimatedSection>
    </>
  )
}
