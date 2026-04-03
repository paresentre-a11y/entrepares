'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const links = [
  { href: '/',         label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/equipo',   label: 'Equipo' },
  { href: '/blog',     label: 'Blog' },
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  // Cerrar menú al cambiar ruta
  useEffect(() => { setAbierto(false) }, [pathname])
  // Bloquear scroll al abrir menú
  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [abierto])

  if (isDashboard) return null // Dashboard tiene su propio sidebar

  return (
    <>
      {/* Header superior */}
      <header className="bg-azul-oscuro py-3">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/images/logo.png" alt="Entre Pares" width={46} height={46}
                   className="h-11 w-auto object-contain" />
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
             className="text-white/75 text-xs hover:text-white transition-colors
                        hidden md:block truncate">
            entrepares.chiriqui@meduca.gob.pa
          </a>
        </div>
      </header>

      {/* Nav principal */}
      <nav className="bg-azul-claro sticky top-0 z-50 shadow-md">
        {/* Overlay */}
        {abierto && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden"
               onClick={() => setAbierto(false)} />
        )}

        <div className="max-w-6xl mx-auto px-6 flex items-center
                        justify-between h-14 relative">
          {/* Hamburguesa */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-10 h-10
                       items-center justify-center rounded-lg
                       hover:bg-white/10 transition-colors z-50"
            onClick={() => setAbierto(!abierto)}
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={abierto}
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300
              ${abierto ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300
              ${abierto ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300
              ${abierto ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          {/* Links desktop */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                      className={`font-display font-medium text-sm px-3.5 py-2
                                  rounded-md transition-all duration-200 block
                                  ${pathname === link.href
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/85 hover:bg-white/15 hover:text-white'}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Botón acceso desktop */}
          <Link href="/login"
                className="hidden md:inline-flex items-center gap-2 text-white
                           border-2 border-white/55 px-4 py-2 rounded-full
                           text-sm font-display font-semibold
                           hover:bg-white hover:text-azul-claro hover:border-white
                           transition-all duration-200">
            🔐 Acceso Docentes
          </Link>
        </div>

        {/* Menú mobile lateral */}
        <div className={`fixed top-0 right-0 h-screen w-72 bg-azul-oscuro
                         z-50 flex flex-col pt-16 pb-8
                         transition-transform duration-300 ease-out md:hidden
                         ${abierto ? 'translate-x-0' : 'translate-x-full'}`}>
          <button onClick={() => setAbierto(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white
                             text-2xl w-10 h-10 flex items-center justify-center
                             rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Cerrar menú">✕</button>
          <ul className="flex-1 overflow-y-auto">
            {links.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                      className={`block px-6 py-4 font-display font-medium text-base
                                  border-b border-white/8 transition-all duration-200
                                  ${pathname === link.href
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/85 hover:pl-8 hover:bg-white/8 hover:text-white'}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 mt-4">
            <Link href="/login"
                  className="block w-full text-center bg-azul-claro text-white
                             py-3.5 rounded-ep font-display font-semibold
                             hover:bg-azul-medio transition-colors min-h-[48px]
                             flex items-center justify-center">
              🔐 Acceso Docentes
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
