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
  titulo: '', descripcion: '', contenido: '', autor: '',
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
      titulo: a.titulo || '', descripcion: a.descripcion || '',
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

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ep-texto mb-1.5">
                    Descripción <span className="text-ep-suave text-xs">(se muestra en las cards del blog)</span>
                  </label>
                  <textarea value={articulo.descripcion}
                            onChange={e => setArticulo({...articulo, descripcion: e.target.value})}
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
                        {a.descripcion && (
                          <p className="text-ep-suave text-xs mt-0.5 line-clamp-1">
                            {a.descripcion}
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
