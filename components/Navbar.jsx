'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const links = [
  { href: '/',         label: 'Inicio'   },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/equipo',   label: 'Equipo'   },
  { href: '/blog',     label: 'Blog'     },
]

export default function Navbar() {
  const [abierto, setAbierto]       = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const pathname                     = usePathname()
  const router                       = useRouter()
  const isDashboard                  = pathname?.startsWith('/dashboard')

  useEffect(() => { setAbierto(false) }, [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [abierto])

  if (isDashboard) return null

  return (
    <>
      {/* Header superior */}
      <motion.header
        className="bg-azul-oscuro py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6
                        flex justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/images/logo.png" alt="Entre Pares"
                   width={46} height={46}
                   className="h-11 w-auto object-contain"
                   onError={e => { e.target.src = 'https://www.entrepares.cloud/images/logo.png' }} />
            <div>
              <p className="font-display font-bold text-white text-base leading-tight">
                Entre Pares Chiriquí
              </p>
              <p className="text-white/65 text-xs mt-0.5 hidden sm:block">
                Región Educativa de Chiriquí — MEDUCA
              </p>
            </div>
          </Link>
          <a href="mailto:entrepares.chiriqui@meduca.gob.pa"
             className="text-white/70 text-xs hover:text-white
                        transition-colors hidden md:block truncate">
            entrepares.chiriqui@meduca.gob.pa
          </a>
        </div>
      </motion.header>

      {/* Nav principal */}
      <motion.nav
        className="bg-azul-claro sticky top-0 z-50"
        style={{
          boxShadow: scrolled
            ? '0 4px 20px rgba(0,53,128,0.3)'
            : '0 2px 8px rgba(0,0,0,0.15)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Overlay */}
        <AnimatePresence>
          {abierto && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAbierto(false)}
            />
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto px-6 flex items-center
                        justify-between h-14 relative">

          {/* Botón hamburguesa animado */}
          <motion.button
            className="md:hidden flex flex-col gap-1.5 w-10 h-10
                       items-center justify-center rounded-lg
                       hover:bg-white/10 transition-colors z-50"
            onClick={() => setAbierto(!abierto)}
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            whileTap={{ scale: 0.9 }}
          >
            <motion.span
              className="block w-5 h-0.5 bg-white rounded-full origin-center"
              animate={abierto
                ? { rotate: 45, y: 7 }
                : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-5 h-0.5 bg-white rounded-full"
              animate={abierto
                ? { opacity: 0, scaleX: 0 }
                : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-5 h-0.5 bg-white rounded-full origin-center"
              animate={abierto
                ? { rotate: -45, y: -7 }
                : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          {/* Links desktop con animación */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map((link, i) => (
              <motion.li key={link.href}
                         initial={{ opacity: 0, y: -10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.08 + 0.3 }}>
                <Link href={link.href}
                      className={`font-display font-medium text-sm
                                  px-3.5 py-2 rounded-md transition-all
                                  duration-200 block relative
                                  ${pathname === link.href
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/85 hover:bg-white/15 hover:text-white'}`}>
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Botón acceso desktop */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/login"
                  className="inline-flex items-center gap-2 text-white
                             border-2 border-white/55 px-4 py-2
                             rounded-full text-sm font-display font-semibold
                             hover:bg-white hover:text-azul-claro
                             hover:border-white transition-all duration-200">
              🔐 Acceso Docentes
            </Link>
          </motion.div>
        </div>

        {/* Menú mobile — slide desde la derecha */}
        <AnimatePresence>
          {abierto && (
            <motion.div
              className="fixed top-0 right-0 h-screen w-72
                         bg-azul-oscuro z-50 flex flex-col
                         pt-16 pb-8 md:hidden overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Botón cerrar */}
              <motion.button
                onClick={() => setAbierto(false)}
                className="absolute top-4 right-4 text-white/80
                           hover:text-white text-2xl w-10 h-10
                           flex items-center justify-center
                           rounded-full hover:bg-white/10 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              {/* Links con stagger */}
              <ul className="flex-1">
                {links.map((link, i) => (
                  <motion.li key={link.href}
                             initial={{ opacity: 0, x: 30 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.08 + 0.1 }}>
                    <Link href={link.href}
                          className={`block px-6 py-4 font-display
                                      font-medium text-base border-b
                                      border-white/8 transition-all
                                      duration-200
                                      ${pathname === link.href
                                        ? 'bg-white/10 text-white pl-8'
                                        : 'text-white/85 hover:pl-8 hover:bg-white/8 hover:text-white'}`}>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="px-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/login"
                      className="block w-full text-center bg-azul-claro
                                 text-white py-3.5 rounded-xl font-display
                                 font-semibold hover:bg-azul-medio
                                 transition-colors min-h-[48px]
                                 flex items-center justify-center">
                  🔐 Acceso Docentes
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
