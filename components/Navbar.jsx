'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '/',         label: 'Inicio',   emoji: '🏠' },
  { href: '/nosotros', label: 'Nosotros', emoji: '📋' },
  { href: '/equipo',   label: 'Equipo',   emoji: '👥' },
  { href: '/blog',     label: 'Blog',     emoji: '📚' },
]

export default function Navbar() {
  const [abierto, setAbierto]  = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname                 = usePathname()
  const isDashboard              = pathname?.startsWith('/dashboard')

  useEffect(() => { setAbierto(false) }, [pathname])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [abierto])

  if (isDashboard) return null

  return (
    <>
      {/* ── Header superior ── */}
      <motion.header
        className="bg-azul-oscuro py-3 relative z-50"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6
                        flex justify-between items-center gap-3">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            {/* Logo con fondo blanco para verlo correctamente */}
            <div className="w-11 h-11 rounded-xl overflow-hidden
                            bg-white flex items-center justify-center
                            flex-shrink-0 shadow-md p-1">
              <img
                src="/images/logo.png"
                alt="Entre Pares"
                className="w-full h-full object-contain"
                onError={e => {
                  e.target.onerror = null
                  e.target.src = 'https://www.entrepares.cloud/images/logo.png'
                }}
              />
            </div>
            <div>
              <p className="font-display font-bold text-white
                            text-sm sm:text-base leading-tight">
                Entre Pares Chiriquí
              </p>
              <p className="text-white/60 text-xs hidden sm:block mt-0.5">
                Región Educativa de Chiriquí — MEDUCA
              </p>
            </div>
          </Link>

          <a href="mailto:entrepares.chiriqui@meduca.gob.pa"
             className="text-white/65 text-xs hover:text-white
                        transition-colors hidden lg:block truncate
                        max-w-xs">
            entrepares.chiriqui@meduca.gob.pa
          </a>
        </div>
      </motion.header>

      {/* ── Nav principal ── */}
      <motion.nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(0,102,204,0.95)'
            : '#0066CC',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          boxShadow: scrolled
            ? '0 4px 24px rgba(0,53,128,0.35)'
            : '0 2px 8px rgba(0,0,0,0.15)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        {/* Overlay */}
        <AnimatePresence>
          {abierto && (
            <motion.div
              className="fixed inset-0 bg-black/60
                         backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setAbierto(false)}
            />
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto px-4 sm:px-6
                        flex items-center justify-between
                        h-14 relative">

          {/* ── Hamburguesa ── */}
          <motion.button
            className="md:hidden relative w-10 h-10 flex items-center
                       justify-center rounded-xl hover:bg-white/10
                       transition-colors z-50 flex-shrink-0"
            onClick={() => setAbierto(!abierto)}
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            whileTap={{ scale: 0.88 }}
          >
            <div className="flex flex-col gap-[5px]">
              <motion.span
                className="block h-[2px] bg-white rounded-full origin-center"
                animate={abierto
                  ? { width: 22, rotate: 45, y: 7 }
                  : { width: 22, rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
              <motion.span
                className="block h-[2px] bg-white rounded-full"
                animate={abierto
                  ? { width: 0, opacity: 0 }
                  : { width: 16, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-[2px] bg-white rounded-full origin-center"
                animate={abierto
                  ? { width: 22, rotate: -45, y: -7 }
                  : { width: 22, rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </div>
          </motion.button>

          {/* ── Links desktop ── */}
          <ul className="hidden md:flex items-center gap-1 flex-1">
            {links.map((link, i) => (
              <motion.li key={link.href}
                         initial={{ opacity: 0, y: -12 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.07 + 0.3 }}>
                <Link href={link.href}
                      className={`relative font-display font-medium
                                  text-sm px-4 py-2 rounded-lg
                                  transition-all duration-200 block
                                  ${pathname === link.href
                                    ? 'text-white bg-white/20'
                                    : 'text-white/80 hover:text-white hover:bg-white/12'}`}>
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-2 right-2
                                 h-0.5 bg-white rounded-full"
                      layoutId="activeLink"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Botón acceso desktop */}
          <motion.div
            className="hidden md:block flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link href="/login"
                    className="inline-flex items-center gap-2 text-white
                               border-2 border-white/50 px-5 py-2
                               rounded-full text-sm font-display font-bold
                               hover:bg-white hover:text-azul-claro
                               hover:border-white transition-all duration-200
                               shadow-sm hover:shadow-md">
                🔐 Acceso Docentes
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Menú mobile panel lateral ── */}
        <AnimatePresence>
          {abierto && (
            <motion.div
              className="fixed top-0 right-0 h-screen
                         w-[min(320px,85vw)] z-50 flex flex-col
                         md:hidden overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #002060 0%, #003580 40%, #0047AB 100%)',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 32,
                mass: 0.9,
              }}
            >
              {/* Decoración de fondo */}
              <div className="absolute inset-0 overflow-hidden
                              pointer-events-none">
                <div className="absolute w-64 h-64 rounded-full
                                bg-white/3 -top-16 -right-16" />
                <div className="absolute w-48 h-48 rounded-full
                                bg-azul-claro/20 bottom-20 -left-12" />
              </div>

              {/* Header del panel */}
              <div className="relative flex items-center justify-between
                              px-6 pt-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white
                                  flex items-center justify-center
                                  shadow-md p-1.5">
                    <img src="/images/logo.png" alt="EP"
                         className="w-full h-full object-contain"
                         onError={e => {
                           e.target.onerror = null
                           e.target.src = 'https://www.entrepares.cloud/images/logo.png'
                         }} />
                  </div>
                  <div>
                    <p className="text-white font-display font-bold text-sm">
                      Entre Pares
                    </p>
                    <p className="text-white/50 text-xs">Chiriquí</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setAbierto(false)}
                  className="w-9 h-9 rounded-xl bg-white/10
                             hover:bg-white/20 text-white
                             flex items-center justify-center
                             transition-colors text-lg"
                  whileTap={{ scale: 0.88 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Links con stagger */}
              <nav className="flex-1 px-4 py-6 relative z-10">
                <ul className="space-y-1">
                  {links.map((link, i) => (
                    <motion.li key={link.href}
                               initial={{ opacity: 0, x: 30 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{
                                 delay: i * 0.07 + 0.1,
                                 type: 'spring',
                                 stiffness: 400,
                                 damping: 28,
                               }}>
                      <Link href={link.href}
                            onClick={() => setAbierto(false)}
                            className={`flex items-center gap-4 px-4 py-3.5
                                        rounded-xl font-display font-medium
                                        text-base transition-all duration-200
                                        group
                                        ${pathname === link.href
                                          ? 'bg-white/15 text-white'
                                          : 'text-white/75 hover:bg-white/10 hover:text-white'}`}>
                        <span className={`text-xl transition-transform
                                          duration-200 group-hover:scale-110
                                          ${pathname === link.href
                                            ? 'scale-110' : ''}`}>
                          {link.emoji}
                        </span>
                        <span>{link.label}</span>
                        {pathname === link.href && (
                          <motion.div
                            className="ml-auto w-1.5 h-1.5 rounded-full
                                       bg-white"
                            layoutId="activeDot"
                          />
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer del panel */}
              <motion.div
                className="relative z-10 px-4 pb-8 pt-4
                           border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Link href="/login"
                      onClick={() => setAbierto(false)}
                      className="flex items-center justify-center
                                 gap-2 w-full bg-white text-azul-oscuro
                                 py-3.5 rounded-xl font-display font-bold
                                 text-sm hover:bg-white/90
                                 transition-colors shadow-lg
                                 min-h-[52px]">
                  <span>🔐</span>
                  <span>Acceso Docentes</span>
                </Link>
                <p className="text-white/30 text-xs text-center mt-4">
                  © 2026 MEDUCA — Entre Pares Chiriquí
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
