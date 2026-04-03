---
name: entrepares-blog-upgrade
description: >
  Agente especializado en mejorar el Blog y Dashboard de Entre Pares Chiriquí
  en Next.js. Agrega campo resumen, carrusel de categorías, filtros por etiquetas,
  enlace "Leer más", limpia archivos no usados y conecta correctamente con Supabase.
  Úsalo cuando el usuario quiera mejorar el blog, dashboard o la conexión con Supabase.
---

# AGENTE BLOG & DASHBOARD UPGRADE — Entre Pares Chiriquí

## Credenciales Supabase (NUNCA cambiar)
SUPABASE_URL = "https://jetjlftghxhzrbmlzjeh.supabase.co"
Tabla principal: articulos
Columnas esperadas: id, titulo, resumen, contenido, autor, imagen_url,
                    publicado, categoria, created_at

## Orden de ejecución
1. PASO 1 → Limpiar archivos no usados
2. PASO 2 → Actualizar lib/blog.js con campo resumen y categorías
3. PASO 3 → Mejorar dashboard con campo resumen
4. PASO 4 → Reconstruir blog con carrusel, filtros y "Leer más"
5. PASO 5 → Agregar columna categoria en Supabase (SQL)
6. PASO 6 → Verificación final

---

## PASO 1 — LIMPIAR ARCHIVOS NO USADOS

Eliminar estos archivos si existen (son del HTML original, no se usan en Next.js):

```bash
# Archivos HTML viejos en la raíz del proyecto
rm -f index.html login.html dashboard.html blog.html equipo.html nosotros.html
rm -f debug.html debug-login.html

# Scripts JS del HTML original (ya migrados a lib/)
rm -f js/supabase.js js/auth.js js/blog.js js/animations.js
rmdir js 2>/dev/null || true

# Archivos de configuración innecesarios
rm -f animations.js

# Verificar que NO se elimine nada de app/ components/ lib/ public/
echo "Limpieza completada"
```

---

## PASO 2 — lib/blog.js ACTUALIZADO

Reemplazar lib/blog.js completo con:

```js
import { supabase } from './supabase'

// ── Obtener artículos publicados (con filtro opcional por categoría) ──
export async function obtenerArticulos(soloPublicados = true, categoria = null) {
  let query = supabase
    .from('articulos')
    .select('id, titulo, resumen, contenido, autor, imagen_url, publicado, categoria, created_at')
    .order('created_at', { ascending: false })

  if (soloPublicados) query = query.eq('publicado', true)
  if (categoria && categoria !== 'todos') query = query.eq('categoria', categoria)

  const { data, error } = await query
  if (error) console.error('Error obteniendo artículos:', error)
  return { data: data || [], error }
}

// ── Obtener TODOS los artículos (para el dashboard) ──
export async function obtenerTodosArticulos() {
  const { data, error } = await supabase
    .from('articulos')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

// ── Obtener un artículo por ID ──
export async function obtenerArticuloPorId(id) {
  const { data, error } = await supabase
    .from('articulos')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

// ── Guardar artículo (crear o editar) ──
export async function guardarArticulo(articulo) {
  const payload = {
    titulo:     articulo.titulo,
    resumen:    articulo.resumen || '',
    contenido:  articulo.contenido,
    autor:      articulo.autor || 'Equipo Entre Pares',
    imagen_url: articulo.imagen_url || null,
    publicado:  articulo.publicado || false,
    categoria:  articulo.categoria || 'general',
  }

  if (articulo.id) {
    const { data, error } = await supabase
      .from('articulos')
      .update(payload)
      .eq('id', articulo.id)
      .select()
      .single()
    return { data, error }
  }

  const { data, error } = await supabase
    .from('articulos')
    .insert(payload)
    .select()
    .single()
  return { data, error }
}

// ── Eliminar artículo ──
export async function eliminarArticulo(id) {
  const { error } = await supabase.from('articulos').delete().eq('id', id)
  return !error
}

// ── Publicar / Despublicar ──
export async function togglearPublicacion(id, publicado) {
  const { data, error } = await supabase
    .from('articulos')
    .update({ publicado: !publicado })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// ── Estadísticas ──
export async function obtenerEstadisticasArticulos() {
  const { data } = await supabase
    .from('articulos')
    .select('id, publicado, categoria')
  const total      = data?.length || 0
  const publicados = data?.filter(a => a.publicado).length || 0
  return { total, publicados, borradores: total - publicados }
}

// ── Formatear fecha en español ──
export function formatearFecha(fecha) {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-PA', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

// ── Categorías disponibles ──
export const CATEGORIAS = [
  { id: 'todos',      label: 'Todos',                  emoji: '🗂️'  },
  { id: 'recursos',   label: 'Recursos Educativos',     emoji: '📚'  },
  { id: 'formacion',  label: 'Formación y Cursos',      emoji: '🎓'  },
  { id: 'tecnologia', label: 'Tecnología Educativa',    emoji: '💻'  },
  { id: 'general',    label: 'General',                 emoji: '📌'  },
]
```

---

## PASO 3 — app/dashboard/page.js COMPLETO

Reemplazar app/dashboard/page.js con:

```jsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { verificarSesion, logout } from '@/lib/auth'
import {
  obtenerEstadisticasArticulos, obtenerTodosArticulos,
  guardarArticulo, eliminarArticulo, togglearPublicacion,
  formatearFecha, CATEGORIAS
} from '@/lib/blog'
import ProtectedRoute from '@/components/ProtectedRoute'

const ARTICULO_VACIO = {
  titulo: '', resumen: '', contenido: '', autor: '',
  imagen_url: '', publicado: false, categoria: 'general'
}

function DashboardContent() {
  const [usuario,        setUsuario]        = useState(null)
  const [stats,          setStats]          = useState({ total:0, publicados:0, borradores:0 })
  const [articulos,      setArticulos]      = useState([])
  const [sidebarAbierto, setSidebar]        = useState(false)
  const [articulo,       setArticulo]       = useState(ARTICULO_VACIO)
  const [editandoId,     setEditandoId]     = useState(null)
  const [guardando,      setGuardando]      = useState(false)
  const [mensaje,        setMensaje]        = useState({ texto:'', tipo:'' })
  const router = useRouter()

  useEffect(() => {
    verificarSesion().then(u => { if (u) setUsuario(u) })
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const s        = await obtenerEstadisticasArticulos()
    const { data } = await obtenerTodosArticulos()
    setStats(s)
    setArticulos(data || [])
  }

  function mostrarMensaje(texto, tipo = 'ok') {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje({ texto:'', tipo:'' }), 3500)
  }

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  async function handleGuardar(e) {
    e.preventDefault()
    setGuardando(true)
    const payload = editandoId ? { ...articulo, id: editandoId } : articulo
    const { error } = await guardarArticulo(payload)
    if (!error) {
      mostrarMensaje(editandoId ? '✅ Artículo actualizado' : '✅ Artículo guardado')
      setArticulo(ARTICULO_VACIO)
      setEditandoId(null)
      cargarDatos()
    } else {
      mostrarMensaje('❌ Error al guardar: ' + error.message, 'error')
    }
    setGuardando(false)
  }

  function handleEditar(a) {
    setArticulo({
      titulo: a.titulo || '', resumen: a.resumen || '',
      contenido: a.contenido || '', autor: a.autor || '',
      imagen_url: a.imagen_url || '', publicado: a.publicado || false,
      categoria: a.categoria || 'general'
    })
    setEditandoId(a.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelar() {
    setArticulo(ARTICULO_VACIO)
    setEditandoId(null)
  }

  async function handleToggle(id, publicado) {
    await togglearPublicacion(id, publicado)
    cargarDatos()
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return
    const ok = await eliminarArticulo(id)
    if (ok) { mostrarMensaje('🗑️ Artículo eliminado'); cargarDatos() }
    else mostrarMensaje('❌ Error al eliminar', 'error')
  }

  const inputCls = `w-full px-4 py-2.5 border-2 border-gris-medio rounded-xl
    focus:outline-none focus:border-azul-claro text-sm transition-colors`

  return (
    <div className="flex min-h-screen bg-gris-claro font-body">

      {/* ── Sidebar ── */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-azul-oscuro
        text-white z-50 flex flex-col transition-transform duration-300
        ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-white/10 text-center">
          <p className="font-display font-bold text-lg">Entre Pares</p>
          <p className="text-white/55 text-xs mt-1">Chiriquí — MEDUCA</p>
        </div>
        <nav className="flex-1 py-4">
          {[
            { href:'/dashboard', icon:'📊', label:'Dashboard' },
            { href:'/blog',      icon:'📖', label:'Ver Blog'  },
            { href:'/',          icon:'🏠', label:'Ir al Sitio' },
          ].map(item => (
            <a key={item.href} href={item.href}
               className="flex items-center gap-3 px-6 py-3.5 text-white/80
                          hover:bg-white/10 hover:text-white transition-colors">
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-5 border-t border-white/10">
          <p className="text-white/50 text-xs truncate mb-3">{usuario?.email}</p>
          <button id="logout-btn" onClick={handleLogout}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20
                             text-white rounded-xl text-sm font-display
                             font-semibold transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Overlay sidebar mobile */}
      {sidebarAbierto && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
             onClick={() => setSidebar(false)} />
      )}

      {/* ── Contenido principal ── */}
      <div className="flex-1 lg:ml-64 flex flex-col">

        {/* Topbar */}
        <header className="bg-white shadow-ep sticky top-0 z-30
                           flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button id="menu-toggle" onClick={() => setSidebar(!sidebarAbierto)}
                    className="lg:hidden text-azul-oscuro w-10 h-10
                               flex items-center justify-center rounded-xl
                               hover:bg-gris-claro transition-colors text-xl">
              ☰
            </button>
            <h1 className="font-display font-bold text-azul-oscuro text-xl">
              {editandoId ? '✏️ Editando artículo' : 'Panel de Control'}
            </h1>
          </div>
          {mensaje.texto && (
            <span className={`text-sm font-medium px-4 py-2 rounded-xl
              ${mensaje.tipo === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'}`}>
              {mensaje.texto}
            </span>
          )}
        </header>

        <main className="flex-1 p-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label:'Total',      valor:stats.total,      color:'from-azul-claro to-azul-medio', icon:'📝' },
              { label:'Publicados', valor:stats.publicados, color:'from-green-500 to-green-600',   icon:'✅' },
              { label:'Borradores', valor:stats.borradores, color:'from-amber-500 to-amber-600',   icon:'✏️' },
            ].map(s => (
              <div key={s.label}
                   className="bg-white rounded-2xl shadow-ep flex items-center
                              gap-4 p-5 hover:-translate-y-0.5 hover:shadow-ep-lg
                              transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color}
                                  flex items-center justify-center text-2xl flex-shrink-0`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-ep-suave text-xs font-medium uppercase tracking-wide">
                    {s.label}
                  </p>
                  <p className="font-display font-bold text-3xl text-azul-oscuro">
                    {s.valor}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Formulario artículo ── */}
          <div className="bg-white rounded-2xl shadow-ep overflow-hidden">
            <div className="px-6 py-4 border-b border-gris-medio flex
                            items-center justify-between">
              <h2 className="font-display font-semibold text-azul-oscuro text-lg">
                {editandoId ? '✏️ Editar Artículo' : '➕ Nuevo Artículo'}
              </h2>
              {editandoId && (
                <button onClick={handleCancelar}
                        className="text-sm text-ep-suave hover:text-ep-texto
                                   underline transition-colors">
                  Cancelar edición
                </button>
              )}
            </div>

            <form onSubmit={handleGuardar} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Título */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ep-texto mb-1.5">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input type="text" required value={articulo.titulo}
                         onChange={e => setArticulo({...articulo, titulo: e.target.value})}
                         placeholder="Escribe el título del artículo"
                         className={inputCls} />
                </div>

                {/* Resumen — CAMPO NUEVO */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ep-texto mb-1.5">
                    Resumen <span className="text-ep-suave text-xs">(se muestra en las cards del blog)</span>
                  </label>
                  <textarea value={articulo.resumen}
                            onChange={e => setArticulo({...articulo, resumen: e.target.value})}
                            placeholder="Breve descripción del artículo (2-3 oraciones)..."
                            rows={2}
                            className={`${inputCls} resize-none`} />
                </div>

                {/* Contenido */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ep-texto mb-1.5">
                    Contenido completo <span className="text-red-500">*</span>
                  </label>
                  <textarea required value={articulo.contenido}
                            onChange={e => setArticulo({...articulo, contenido: e.target.value})}
                            placeholder="Escribe el contenido completo del artículo..."
                            rows={7}
                            className={`${inputCls} resize-y`} />
                </div>

                {/* Autor */}
                <div>
                  <label className="block text-sm font-medium text-ep-texto mb-1.5">
                    Autor
                  </label>
                  <input type="text" value={articulo.autor}
                         onChange={e => setArticulo({...articulo, autor: e.target.value})}
                         placeholder="Nombre del autor"
                         className={inputCls} />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-ep-texto mb-1.5">
                    Categoría
                  </label>
                  <select value={articulo.categoria}
                          onChange={e => setArticulo({...articulo, categoria: e.target.value})}
                          className={inputCls}>
                    {CATEGORIAS.filter(c => c.id !== 'todos').map(c => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* URL imagen */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ep-texto mb-1.5">
                    URL de imagen <span className="text-ep-suave text-xs">(opcional)</span>
                  </label>
                  <input type="url" value={articulo.imagen_url}
                         onChange={e => setArticulo({...articulo, imagen_url: e.target.value})}
                         placeholder="https://..."
                         className={inputCls} />
                  {articulo.imagen_url && (
                    <img src={articulo.imagen_url} alt="Preview"
                         className="mt-2 h-24 w-auto rounded-xl object-cover border border-gris-medio"
                         onError={e => { e.target.style.display='none' }} />
                  )}
                </div>

                {/* Publicar + botón */}
                <div className="md:col-span-2 flex flex-wrap items-center gap-4 pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={articulo.publicado}
                           onChange={e => setArticulo({...articulo, publicado: e.target.checked})}
                           className="w-4 h-4 accent-azul-claro" />
                    <span className="text-sm font-medium text-ep-texto">
                      Publicar inmediatamente
                    </span>
                  </label>
                  <button type="submit" disabled={guardando}
                          className="ml-auto bg-azul-claro hover:bg-azul-medio text-white
                                     px-8 py-2.5 rounded-xl font-display font-semibold
                                     text-sm transition-colors disabled:opacity-60
                                     disabled:cursor-not-allowed min-h-[44px]">
                    {guardando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Guardar Artículo'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* ── Tabla de artículos ── */}
          <div className="bg-white rounded-2xl shadow-ep overflow-hidden">
            <div className="px-6 py-4 border-b border-gris-medio">
              <h2 className="font-display font-semibold text-azul-oscuro text-lg">
                📋 Artículos ({articulos.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gris-claro text-ep-suave text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">Título / Resumen</th>
                    <th className="px-6 py-3 text-left hidden md:table-cell">Categoría</th>
                    <th className="px-6 py-3 text-left hidden lg:table-cell">Fecha</th>
                    <th className="px-6 py-3 text-left">Estado</th>
                    <th className="px-6 py-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gris-medio">
                  {articulos.map(a => (
                    <tr key={a.id}
                        className="hover:bg-gris-claro/50 transition-colors">
                      <td className="px-6 py-4 max-w-xs">
                        <p className="font-semibold text-azul-oscuro line-clamp-1">
                          {a.titulo}
                        </p>
                        {a.resumen && (
                          <p className="text-ep-suave text-xs mt-0.5 line-clamp-1">
                            {a.resumen}
                          </p>
                        )}
                        <p className="text-ep-suave text-xs mt-0.5">Por {a.autor}</p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-xs bg-azul-oscuro/10 text-azul-oscuro
                                        px-2 py-1 rounded-lg font-medium">
                          {CATEGORIAS.find(c => c.id === a.categoria)?.emoji || '📌'}{' '}
                          {CATEGORIAS.find(c => c.id === a.categoria)?.label || a.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-ep-suave hidden lg:table-cell">
                        {formatearFecha(a.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full
                          text-xs font-semibold
                          ${a.publicado
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'}`}>
                          {a.publicado ? '✅ Publicado' : '✏️ Borrador'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5 flex-wrap">
                          <button onClick={() => handleEditar(a)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                             bg-blue-100 text-blue-700 hover:bg-blue-200
                                             transition-colors">
                            Editar
                          </button>
                          <button onClick={() => handleToggle(a.id, a.publicado)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold
                                    transition-colors
                                    ${a.publicado
                                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                            {a.publicado ? 'Despublicar' : 'Publicar'}
                          </button>
                          <button onClick={() => handleEliminar(a.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold
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
                  <p className="text-5xl mb-3">📝</p>
                  <p className="font-display font-medium text-lg">No hay artículos aún</p>
                  <p className="text-sm mt-1">Crea el primero con el formulario de arriba</p>
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

## PASO 4 — app/blog/page.js COMPLETO

Reemplazar app/blog/page.js con:

```jsx
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
                  {a.resumen || a.contenido}
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
              {modalArticulo.resumen && (
                <p className="text-ep-texto font-medium mb-4 text-base leading-relaxed
                               border-l-4 border-azul-claro pl-4 italic">
                  {modalArticulo.resumen}
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
```

---

## PASO 5 — SQL para Supabase (ejecutar en el Editor SQL de Supabase)

Si la columna resumen o categoria no existe en la tabla articulos,
ejecutar en Supabase Dashboard → SQL Editor:

```sql
-- Agregar columna resumen si no existe
ALTER TABLE articulos
  ADD COLUMN IF NOT EXISTS resumen TEXT DEFAULT '';

-- Agregar columna categoria si no existe
ALTER TABLE articulos
  ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'general';

-- Verificar estructura
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'articulos'
ORDER BY ordinal_position;
```

---

## PASO 6 — VERIFICACIÓN FINAL

```bash
# Reiniciar servidor
Ctrl+C
npm run dev
```

Verificar en el navegador:
- /blog → carrusel visible con 3 slides que rotan
- /blog → 4 filtros de categoría (Todos, Recursos, Formación, Tecnología, General)
- /blog → artículos de Supabase con imagen, resumen y botón "Leer más"
- /blog → al hacer click en "Leer más" abre modal con contenido completo
- /dashboard → formulario tiene campo "Resumen"
- /dashboard → selector de categoría en el formulario
- /dashboard → tabla muestra resumen y categoría de cada artículo

## REGLAS ABSOLUTAS
- NO cambiar credenciales en lib/supabase.js
- NO cambiar colores #003580 #0066CC #0047AB
- NO eliminar nada de app/ components/ lib/ public/
