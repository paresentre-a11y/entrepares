---
name: entrepares-nextjs-migration
description: >
  Agente especializado en migrar el proyecto Entre Pares Chiriquí de HTML/CSS/JS
  puro a Next.js 14 con App Router, Tailwind CSS y Supabase SSR.
  Construye toda la estructura Next.js desde cero conservando el diseño visual
  actual (Space Grotesk + Inter, colores #003580/#0066CC/#0047AB, layout 2 paneles
  del login, sidebar del dashboard) y toda la lógica de Supabase.
  Úsalo cuando el usuario quiera migrar a Next.js manteniendo el diseño y la BD.
---

# AGENTE MIGRACIÓN NEXT.JS — Entre Pares Chiriquí

## Tu misión
Migrar el proyecto de HTML estático a Next.js 14 (App Router) con:
- Mismos colores y tipografía del diseño actual
- Supabase con las mismas credenciales y lógica
- Diseño login de 2 paneles igual al actual
- Menú responsive que funciona en todos los dispositivos
- Dashboard protegido igual que ahora

---

## CREDENCIALES SUPABASE (NUNCA cambiar)

```
SUPABASE_URL  = "https://jetjlftghxhzrbmlzjeh.supabase.co"
SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldGpsZnRnaHhoenJibWx6amVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTQwMjMsImV4cCI6MjA4OTk3MDAyM30.Eosrf8nST0e96nf5mx4lAJztkW2d8uArWydZokLqvQo"
```

Tabla principal: `articulos`
Funciones de auth: login, logout, verificarSesion, protegerPagina

---

## PASO 1 — CREAR EL PROYECTO NEXT.JS

Ejecutar en la raíz del repositorio:

```bash
npx create-next-app@latest . \
  --no-typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --no-import-alias

npm install @supabase/supabase-js @supabase/ssr
```

Cuando pregunte:
- TypeScript → No
- Tailwind → Yes
- App Router → Yes
- src/ dir → No
- import alias → No

---

## PASO 2 — ESTRUCTURA DE CARPETAS

Crear exactamente:

```
app/
  layout.js           ← Layout principal con fuentes y Navbar
  page.js             ← Página de inicio (index.html)
  globals.css         ← Variables CSS + estilos base
  login/
    page.js           ← Login 2 paneles
  dashboard/
    page.js           ← Panel protegido
  blog/
    page.js           ← Blog público
  equipo/
    page.js           ← Equipo de facilitadores
  nosotros/
    page.js           ← Misión y visión

lib/
  supabase.js         ← Cliente Supabase (mismo que supabase.js original)
  auth.js             ← Funciones de auth migradas
  blog.js             ← Funciones de blog migradas

components/
  Navbar.jsx          ← Header + Nav responsivo
  Footer.jsx          ← Footer institucional
  ProtectedRoute.jsx  ← Wrapper para rutas privadas

public/
  images/
    logo.png          ← Copiar desde el proyecto original
```

---

## PASO 3 — TAILWIND CONFIG (colores del proyecto)

Reemplazar `tailwind.config.js` con:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'azul-oscuro':  '#003580',
        'azul-claro':   '#0066CC',
        'azul-medio':   '#0047AB',
        'gris-claro':   '#F5F7FA',
        'gris-medio':   '#E0E4EA',
        'gris-oscuro':  '#2D3748',
        'ep-texto':     '#1A202C',
        'ep-suave':     '#4A5568',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        ep: '10px',
        'ep-lg': '16px',
      },
      boxShadow: {
        ep:    '0 2px 8px rgba(0,53,128,0.10)',
        'ep-lg': '0 8px 32px rgba(0,53,128,0.16)',
      },
    },
  },
  plugins: [],
}
```

---

## PASO 4 — app/globals.css

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --azul-oscuro: #003580;
  --azul-claro:  #0066CC;
  --azul-medio:  #0047AB;
}

@layer base {
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  h1,h2,h3,h4,h5,h6 { font-family: 'Space Grotesk', sans-serif; }
  input[type="email"],
  input[type="password"],
  input[type="text"],
  textarea { font-size: max(16px, 1rem); }
}

@layer components {
  .btn-ep {
    @apply inline-flex items-center justify-center gap-2 px-6 py-3
           rounded-ep font-display font-semibold text-sm
           transition-all duration-300 relative overflow-hidden
           cursor-pointer border-none;
  }
  .btn-primary {
    @apply btn-ep bg-gradient-to-br from-azul-claro to-azul-medio
           text-white shadow-ep hover:-translate-y-0.5
           hover:shadow-ep-lg active:translate-y-0;
  }
  .btn-outline {
    @apply btn-ep border-2 border-white/60 text-white
           hover:bg-white hover:text-azul-claro;
  }
  .card-ep {
    @apply bg-white rounded-ep-lg shadow-ep transition-all duration-300
           hover:-translate-y-1 hover:shadow-ep-lg overflow-hidden;
  }
  .input-ep {
    @apply w-full px-4 py-3 border-2 border-gris-medio rounded-ep
           font-body text-ep-texto transition-all duration-300
           focus:outline-none focus:border-azul-claro
           focus:ring-2 focus:ring-azul-claro/10 bg-white;
  }
  .label-ep {
    @apply block text-sm font-medium text-ep-texto mb-2;
  }
}
```

---

## PASO 5 — lib/supabase.js

```js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jetjlftghxhzrbmlzjeh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldGpsZnRnaHhoenJibWx6amVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTQwMjMsImV4cCI6MjA4OTk3MDAyM30.Eosrf8nST0e96nf5mx4lAJztkW2d8uArWydZokLqvQo'

let _client = null

export function getSupabase() {
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return _client
}

export const supabase = getSupabase()
```

---

## PASO 6 — lib/auth.js

```js
'use client'
import { supabase } from './supabase'

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { error: error?.message || null, user: data?.user || null }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  return !error
}

export async function verificarSesion() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined'
      ? window.location.origin + '/login'
      : ''
  })
  return { error: error?.message || null }
}
```

---

## PASO 7 — lib/blog.js

```js
import { supabase } from './supabase'

export async function obtenerArticulos(soloPublicados = true) {
  let query = supabase
    .from('articulos')
    .select('*')
    .order('created_at', { ascending: false })
  if (soloPublicados) query = query.eq('publicado', true)
  const { data, error } = await query
  return { data: data || [], error }
}

export async function obtenerArticuloPorId(id) {
  const { data, error } = await supabase
    .from('articulos')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function guardarArticulo(articulo) {
  if (articulo.id) {
    const { data, error } = await supabase
      .from('articulos')
      .update(articulo)
      .eq('id', articulo.id)
      .select()
      .single()
    return { data, error }
  }
  const { data, error } = await supabase
    .from('articulos')
    .insert(articulo)
    .select()
    .single()
  return { data, error }
}

export async function eliminarArticulo(id) {
  const { error } = await supabase.from('articulos').delete().eq('id', id)
  return !error
}

export async function togglearPublicacion(id, publicado) {
  const { data, error } = await supabase
    .from('articulos')
    .update({ publicado: !publicado })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function obtenerEstadisticasArticulos() {
  const { data } = await supabase.from('articulos').select('id, publicado')
  const total = data?.length || 0
  const publicados = data?.filter(a => a.publicado).length || 0
  return { total, publicados, borradores: total - publicados }
}

export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-PA', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}
```

---

## PASO 8 — app/layout.js

```jsx
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Entre Pares Chiriquí — MEDUCA',
  description: 'Formando docentes para la educación del siglo XXI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-body text-ep-texto bg-white">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

---

## PASO 9 — components/Navbar.jsx (responsivo)

```jsx
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
```

---

## PASO 10 — app/login/page.js (2 paneles)

```jsx
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { login, verificarSesion, resetPassword } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMsg, setResetMsg]     = useState('')
  const router = useRouter()

  useEffect(() => {
    verificarSesion().then(u => { if (u) router.push('/dashboard') })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setCargando(true)
    const res = await login(email, password)
    if (res.error) { setError(res.error); setCargando(false) }
    else router.push('/dashboard')
  }

  const handleReset = async (e) => {
    e.preventDefault()
    const res = await resetPassword(resetEmail)
    if (res.error) setError(res.error)
    else setResetMsg('Revisa tu correo institucional')
  }

  return (
    <div className="min-h-screen flex font-body">

      {/* PANEL IZQUIERDO */}
      <div className="hidden lg:flex flex-[0_0_58%] relative overflow-hidden
                      items-center justify-center p-16"
           style={{background:'linear-gradient(145deg,#001a4d,#003580 45%,#0050b3)'}}>
        {/* Decoración */}
        <div className="absolute w-[500px] h-[500px] rounded-full -top-28 -right-28
                        bg-white/[0.03]" />
        <div className="absolute w-[300px] h-[300px] rounded-full -bottom-16 -left-16
                        bg-white/[0.04]" />

        <div className="relative z-10 max-w-md w-full text-white">
          {/* Brand */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl border border-white/25
                            bg-white/10 flex items-center justify-center
                            font-display font-bold text-xl backdrop-blur-sm">EP</div>
            <div>
              <p className="font-display font-bold text-xl leading-tight">Entre Pares</p>
              <p className="text-white/60 text-xs mt-0.5">Chiriquí — MEDUCA</p>
            </div>
          </div>

          <h1 className="font-display font-bold leading-snug mb-4
                         text-[clamp(1.6rem,3vw,2.4rem)]">
            Transformando la educación,<br/>aula por aula.
          </h1>
          <p className="text-white/70 leading-relaxed mb-10 text-[0.97rem]">
            Sistema de Gestión Académica para el desarrollo profesional
            y la modernización tecnológica del MEDUCA.
          </p>

          {/* Stats */}
          <div className="flex flex-col gap-3.5 mb-10">
            {[
              { icon: '👩‍🏫', num: '17',   lbl: 'Docentes Facilitadores' },
              { icon: '🗺️',  num: '1',    lbl: 'Región Educativa' },
              { icon: '🏫',  num: '100%', lbl: 'Compromiso Educativo' },
            ].map(s => (
              <div key={s.lbl}
                   className="flex items-center gap-4 bg-white/8 border
                              border-white/12 rounded-xl px-5 py-3.5
                              backdrop-blur-sm hover:bg-white/12
                              transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/12 flex
                                items-center justify-center text-lg flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="font-display font-bold text-2xl leading-none">{s.num}</p>
                  <p className="text-white/60 text-xs mt-1">{s.lbl}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/35 text-xs">
            © 2026 Ministerio de Educación (MEDUCA) • Entre Pares Chiriquí
          </p>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <Image src="/images/logo.png" alt="Entre Pares" width={120} height={62}
                 className="h-16 w-auto mx-auto mb-7 object-contain" />
          <h2 className="font-display font-bold text-azul-oscuro text-3xl
                         text-center mb-1">Identificación</h2>
          <p className="text-ep-suave text-sm text-center mb-8">
            Plataforma Institucional de Gestión
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600
                            rounded-ep px-4 py-3 mb-5 text-sm">{error}</div>
          )}

          {!showReset ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="label-ep" htmlFor="email">
                  ✉️ Correo institucional
                </label>
                <input id="email" type="email" required
                       value={email} onChange={e=>setEmail(e.target.value)}
                       placeholder="nombre@meduca.gob.pa"
                       className="input-ep" />
              </div>
              <div>
                <label className="label-ep" htmlFor="password">
                  🔒 Contraseña
                </label>
                <input id="password" type="password" required
                       value={password} onChange={e=>setPassword(e.target.value)}
                       placeholder="••••••••"
                       className="input-ep" />
              </div>
              <button type="submit" disabled={cargando}
                      className="btn-primary w-full min-h-[50px] mt-2 disabled:opacity-60
                                 disabled:cursor-not-allowed disabled:transform-none">
                {cargando ? 'Verificando...' : 'Acceder al Portal'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="label-ep" htmlFor="resetEmail">
                  ✉️ Correo institucional
                </label>
                <input id="resetEmail" type="email" required
                       value={resetEmail} onChange={e=>setResetEmail(e.target.value)}
                       placeholder="nombre@meduca.gob.pa"
                       className="input-ep" />
              </div>
              {resetMsg && (
                <p className="text-sm text-green-700 bg-green-50 px-4 py-3
                               rounded-ep border border-green-200">{resetMsg}</p>
              )}
              <button type="submit" className="btn-primary w-full min-h-[50px]">
                Enviar enlace de recuperación
              </button>
              <button type="button" onClick={()=>setShowReset(false)}
                      className="w-full py-3 rounded-ep bg-gris-claro text-ep-texto
                                 font-display font-semibold hover:bg-gris-medio
                                 transition-colors min-h-[48px]">
                Cancelar
              </button>
            </form>
          )}

          <div className="flex justify-between items-center mt-5 text-sm">
            <button onClick={()=>setShowReset(!showReset)}
                    className="text-azul-claro font-medium hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
            <a href="/" className="text-azul-claro font-medium hover:underline">
              ← Inicio
            </a>
          </div>
          <p className="mt-7 pt-5 border-t border-gris-medio text-xs
                        text-ep-suave text-center leading-relaxed">
            Sistema reservado para docentes de la Región Educativa de Chiriquí
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

## PASO 11 — components/ProtectedRoute.jsx

```jsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { verificarSesion } from '@/lib/auth'

export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(false)
  const router = useRouter()

  useEffect(() => {
    verificarSesion().then(user => {
      if (!user) router.push('/login')
      else setOk(true)
    })
  }, [])

  if (!ok) return (
    <div className="min-h-screen flex items-center justify-center bg-gris-claro">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gris-medio border-t-azul-claro
                        rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ep-suave font-display">Verificando sesión...</p>
      </div>
    </div>
  )
  return children
}
```

---

## PASO 12 — app/dashboard/page.js

```jsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { verificarSesion, logout } from '@/lib/auth'
import { obtenerEstadisticasArticulos, obtenerTodosArticulos,
         guardarArticulo, eliminarArticulo, togglearPublicacion,
         formatearFecha } from '@/lib/blog'
import ProtectedRoute from '@/components/ProtectedRoute'

function DashboardContent() {
  const [usuario, setUsuario]   = useState(null)
  const [stats, setStats]       = useState({ total:0, publicados:0, borradores:0 })
  const [articulos, setArticulos] = useState([])
  const [sidebarAbierto, setSidebar] = useState(false)
  const router = useRouter()

  useEffect(() => {
    verificarSesion().then(u => { if(u) setUsuario(u) })
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const s = await obtenerEstadisticasArticulos()
    setStats(s)
    const { data } = await obtenerTodosArticulos()
    setArticulos(data || [])
  }

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  async function handleToggle(id, publicado) {
    await togglearPublicacion(id, publicado)
    cargarDatos()
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar este artículo?')) return
    await eliminarArticulo(id)
    cargarDatos()
  }

  return (
    <div className="flex min-h-screen bg-gris-claro font-body">

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-azul-oscuro
                         text-white z-50 flex flex-col
                         transition-transform duration-300
                         ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}
                         lg:translate-x-0`}>
        <div className="p-6 border-b border-white/10 text-center">
          <p className="font-display font-bold text-lg">Entre Pares</p>
          <p className="text-white/60 text-xs">Chiriquí — MEDUCA</p>
        </div>
        <nav className="flex-1 py-4">
          {[
            { href:'/dashboard', icon:'📊', label:'Dashboard' },
            { href:'/blog',      icon:'📖', label:'Ver Blog' },
            { href:'/',          icon:'🏠', label:'Ir al Sitio' },
          ].map(item => (
            <a key={item.href} href={item.href}
               className="flex items-center gap-3 px-6 py-3 text-white/80
                          hover:bg-white/10 hover:text-white transition-colors">
              <span>{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-white/60 text-xs truncate mb-3">{usuario?.email}</p>
          <button id="logout-btn" onClick={handleLogout}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20
                             text-white rounded-ep text-sm font-display
                             font-medium transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarAbierto && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
             onClick={() => setSidebar(false)} />
      )}

      {/* Contenido principal */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-ep sticky top-0 z-30
                           flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button id="menu-toggle" onClick={() => setSidebar(!sidebarAbierto)}
                    className="lg:hidden text-azul-oscuro text-2xl
                               w-10 h-10 flex items-center justify-center
                               rounded-lg hover:bg-gris-claro transition-colors">
              ☰
            </button>
            <h1 className="font-display font-bold text-azul-oscuro text-xl">
              Panel de Control
            </h1>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {[
              { label:'Total Artículos', valor:stats.total,      color:'from-azul-claro to-azul-medio', icon:'📝' },
              { label:'Publicados',      valor:stats.publicados, color:'from-green-500 to-green-600',   icon:'✅' },
              { label:'Borradores',      valor:stats.borradores, color:'from-amber-500 to-amber-600',   icon:'✏️' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-ep-lg shadow-ep
                                            flex items-center gap-4 p-5
                                            hover:-translate-y-1 hover:shadow-ep-lg
                                            transition-all duration-300">
                <div className={`w-14 h-14 rounded-ep bg-gradient-to-br ${s.color}
                                  flex items-center justify-center text-2xl flex-shrink-0`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-ep-suave text-sm">{s.label}</p>
                  <p className="font-display font-bold text-3xl text-azul-oscuro">
                    {s.valor}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla artículos */}
          <div className="bg-white rounded-ep-lg shadow-ep overflow-hidden">
            <div className="px-6 py-4 border-b border-gris-medio flex
                            items-center justify-between">
              <h2 className="font-display font-semibold text-azul-oscuro">
                Artículos del Blog
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gris-claro text-ep-suave uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">Título</th>
                    <th className="px-6 py-3 text-left hidden md:table-cell">Fecha</th>
                    <th className="px-6 py-3 text-left">Estado</th>
                    <th className="px-6 py-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gris-medio">
                  {articulos.map(a => (
                    <tr key={a.id} className="hover:bg-gris-claro/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-azul-oscuro line-clamp-1">{a.titulo}</p>
                        <p className="text-ep-suave text-xs mt-0.5">{a.autor}</p>
                      </td>
                      <td className="px-6 py-4 text-ep-suave hidden md:table-cell">
                        {formatearFecha(a.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                          ${a.publicado
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'}`}>
                          {a.publicado ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => handleToggle(a.id, a.publicado)}
                                  className={`px-3 py-1.5 rounded-ep text-xs font-medium
                                    transition-colors
                                    ${a.publicado
                                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                            {a.publicado ? 'Despublicar' : 'Publicar'}
                          </button>
                          <button onClick={() => handleEliminar(a.id)}
                                  className="px-3 py-1.5 rounded-ep text-xs font-medium
                                             bg-red-100 text-red-700 hover:bg-red-200
                                             transition-colors">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {articulos.length === 0 && (
                <div className="text-center py-16 text-ep-suave">
                  <p className="text-4xl mb-3">📝</p>
                  <p className="font-display font-medium">No hay artículos aún</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>
}
```

---

## PASO 13 — next.config.js (para GitHub Pages si se necesita)

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Para Vercel (recomendado) — sin output: 'export'
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.entrepares.cloud' },
    ],
  },
}
module.exports = nextConfig
```

---

## PASO 14 — PÁGINAS PÚBLICAS (index, blog, equipo, nosotros)

Para cada página pública seguir este patrón en `app/[pagina]/page.js`:

```jsx
// Ejemplo: app/page.js (inicio)
'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section style={{background:'linear-gradient(145deg,#002060,#003580 50%,#004cb3)'}}
               className="py-20 text-center relative overflow-hidden">
        <Image src="/images/logo.png" alt="Entre Pares" width={200} height={200}
               className="h-48 w-auto mx-auto mb-8 object-contain" />
        <h1 className="font-display font-bold text-white text-5xl mb-4">
          Entre Pares Chiriquí
        </h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto mb-8 font-light">
          Formando docentes para la educación del siglo XXI
        </p>
        <div className="flex gap-4 justify-center flex-wrap px-4">
          <Link href="/nosotros" className="btn-primary">Conocer el Programa</Link>
          <Link href="/blog"
                className="btn-outline inline-flex items-center px-6 py-3
                           rounded-ep font-display font-semibold text-sm">
            Ver Recursos
          </Link>
        </div>
      </section>
      {/* Resto del contenido de index.html aquí */}
    </>
  )
}
```

---

## PASO 15 — components/Footer.jsx

```jsx
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gris-oscuro text-white pt-14 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="text-center">
            <Image src="/images/logo.png" alt="Entre Pares" width={160} height={60}
                   className="h-14 w-auto mx-auto mb-4 object-contain brightness-0 invert" />
          </div>
          <div className="text-center">
            <h4 className="font-display font-semibold mb-4 text-white">Contacto</h4>
            <p className="text-white/60 text-sm mb-2">
              ✉️ entrepares.chiriqui@meduca.gob.pa
            </p>
            <p className="text-white/60 text-sm">🕐 Lunes a Viernes, 8:00 — 16:00</p>
          </div>
          <div className="text-center">
            <h4 className="font-display font-semibold mb-4 text-white">Ubicación</h4>
            <p className="text-white/60 text-sm">Región Educativa de Chiriquí</p>
            <p className="text-white/60 text-sm">Ministerio de Educación</p>
            <p className="text-white/60 text-sm">República de Panamá</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 text-center
                        text-white/40 text-xs">
          © 2026 Entre Pares Chiriquí - MEDUCA. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
```

---

## PASO 16 — DESPLIEGUE EN VERCEL (recomendado sobre GitHub Pages)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Variables de entorno en Vercel Dashboard:
# NEXT_PUBLIC_SUPABASE_URL = https://jetjlftghxhzrbmlzjeh.supabase.co
# NEXT_PUBLIC_SUPABASE_KEY = eyJhbGci...
```

---

## CHECKLIST FINAL

- [ ] `npm run dev` corre sin errores
- [ ] Login funciona con Supabase (email + password)
- [ ] Redirección a /dashboard tras login exitoso
- [ ] /dashboard redirige a /login si no hay sesión
- [ ] Menú hamburguesa funciona en mobile
- [ ] Logo se ve en todas las páginas
- [ ] Tipografía Space Grotesk en títulos, Inter en cuerpo
- [ ] Colores #003580 #0066CC #0047AB respetados
- [ ] Login tiene 2 paneles en desktop
- [ ] Stats del dashboard se cargan desde Supabase
- [ ] Publicar/Despublicar/Eliminar artículos funciona

---

## REGLAS ABSOLUTAS

```
SUPABASE_URL  = "https://jetjlftghxhzrbmlzjeh.supabase.co"  ← NUNCA cambiar
SUPABASE_KEY  = "eyJhbGci..."                                 ← NUNCA cambiar
Tabla         = "articulos"                                   ← NUNCA cambiar
Colores       = #003580 / #0066CC / #0047AB                   ← NUNCA cambiar
```
