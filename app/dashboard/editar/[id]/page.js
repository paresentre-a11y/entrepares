'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { verificarSesion, logout } from '@/lib/auth'
import { obtenerArticuloPorId, guardarArticulo, CATEGORIAS } from '@/lib/blog'
import ProtectedRoute from '@/components/ProtectedRoute'

function EditarArticuloContent() {
  const router = useRouter()
  const params = useParams()
  const articuloId = params.id

  const [usuario, setUsuario] = useState(null)
  const [articulo, setArticulo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  const [mensajeError, setMensajeError] = useState('')

  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    autor: '',
    imagen_url: '',
    descripcion: '',
    categoria: 'general',
    publicado: false
  })

  useEffect(() => {
    cargarDatos()
  }, [articuloId])

  async function cargarDatos() {
    setCargando(true)
    
    const usuarioLogueado = await verificarSesion()
    if (!usuarioLogueado) {
      router.push('/login')
      return
    }
    setUsuario(usuarioLogueado)

    const { data: articuloData, error } = await obtenerArticuloPorId(articuloId)
    
    if (error || !articuloData) {
      setMensajeError('No se pudo cargar el artículo')
      setCargando(false)
      return
    }

    setArticulo(articuloData)
    
    setFormData({
      titulo: articuloData.titulo || '',
      contenido: articuloData.contenido || '',
      autor: articuloData.autor || '',
      imagen_url: articuloData.imagen_url || '',
      descripcion: articuloData.descripcion || '',
      categoria: articuloData.categoria || 'general',
      publicado: articuloData.publicado || false
    })

    setCargando(false)
  }

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  async function handleGuardar(e) {
    e.preventDefault()
    setGuardando(true)
    setMensajeError('')
    setMensajeExito('')

    const { data, error } = await guardarArticulo({ ...formData, id: articuloId })

    if (error) {
      setMensajeError(`❌ Error: ${error.message}`)
    } else {
      setMensajeExito('✅ Artículo actualizado correctamente')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
    
    setGuardando(false)
  }

  if (cargando) {
    return (
      <div className="flex min-h-screen bg-gris-claro items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-azul-oscuro font-medium">Cargando artículo...</p>
        </div>
      </div>
    )
  }

  if (mensajeError && !articulo) {
    return (
      <div className="flex min-h-screen bg-gris-claro items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-ep max-w-md">
          <p className="text-4xl mb-4">🚫</p>
          <p className="text-red-600 font-medium mb-4">{mensajeError}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-azul-claro hover:bg-azul-medio text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gris-claro font-body">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-azul-oscuro text-white z-50 flex flex-col lg:translate-x-0">
        <div className="p-6 border-b border-white/10 text-center">
          <p className="font-display font-bold text-lg">Entre Pares</p>
          <p className="text-white/55 text-xs mt-1">Chiriquí — MEDUCA</p>
        </div>
        <nav className="flex-1 py-4">
          {[
            { href: '/dashboard', icon: '📊', label: 'Dashboard' },
            { href: '/blog', icon: '📖', label: 'Ver Blog' },
            { href: '/', icon: '🏠', label: 'Ir al Sitio' },
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
          <button onClick={handleLogout}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20
                             text-white rounded-xl text-sm font-display
                             font-semibold transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-ep sticky top-0 z-30 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="font-display font-bold text-azul-oscuro text-xl">
              ✏️ Editar Artículo
            </h1>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-azul-oscuro hover:bg-gris-claro px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            ← Volver
          </button>
        </header>

        {/* Contenido */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-ep overflow-hidden max-w-4xl mx-auto">
            <div className="px-6 py-4 border-b border-gris-medio bg-azul-claro/10">
              <h2 className="font-display font-semibold text-azul-oscuro">
                📝 {articulo?.titulo || 'Cargando...'}
              </h2>
              <p className="text-xs text-ep-suave mt-1">
                Última modificación: {new Date(articulo?.updated_at || articulo?.created_at).toLocaleString('es-PA')}
              </p>
            </div>

            <form onSubmit={handleGuardar} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ep-texto mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={e => setFormData({...formData, titulo: e.target.value})}
                  placeholder="Título del artículo"
                  required
                  className="w-full px-4 py-2.5 border-2 border-gris-medio rounded-xl
                             focus:outline-none focus:border-azul-claro text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ep-texto mb-1">Autor</label>
                <input
                  type="text"
                  value={formData.autor}
                  onChange={e => setFormData({...formData, autor: e.target.value})}
                  placeholder="Nombre del autor"
                  className="w-full px-4 py-2.5 border-2 border-gris-medio rounded-xl
                             focus:outline-none focus:border-azul-claro text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ep-texto mb-1">
                  URL de imagen (opcional)
                </label>
                <input
                  type="url"
                  value={formData.imagen_url}
                  onChange={e => setFormData({...formData, imagen_url: e.target.value})}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border-2 border-gris-medio rounded-xl
                             focus:outline-none focus:border-azul-claro text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ep-texto mb-1">
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Breve descripción del artículo (2-3 oraciones)..."
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border-2 border-gris-medio rounded-xl
                             focus:outline-none focus:border-azul-claro text-sm resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ep-texto mb-1">
                  Categoría *
                </label>
                <select
                  value={formData.categoria}
                  onChange={e => setFormData({...formData, categoria: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gris-medio rounded-xl
                             focus:outline-none focus:border-azul-claro text-sm bg-white"
                >
                  {CATEGORIAS.filter(c => c.id !== 'todos').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ep-texto mb-1">
                  Contenido *
                </label>
                <textarea
                  value={formData.contenido}
                  onChange={e => setFormData({...formData, contenido: e.target.value})}
                  placeholder="Escribe el contenido del artículo..."
                  required
                  rows={8}
                  className="w-full px-4 py-2.5 border-2 border-gris-medio rounded-xl
                             focus:outline-none focus:border-azul-claro text-sm resize-y"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.publicado}
                    onChange={e => setFormData({...formData, publicado: e.target.checked})}
                    className="w-4 h-4 accent-azul-claro"
                  />
                  <span className="text-sm text-ep-texto font-medium">Publicar inmediatamente</span>
                </label>
                
                {guardando && (
                  <span className="text-sm text-ep-suave animate-pulse flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Guardando...
                  </span>
                )}
                
                {mensajeExito && (
                  <span className="text-sm text-green-600 font-medium flex items-center gap-2">
                    ✅ {mensajeExito}
                  </span>
                )}
                
                {mensajeError && (
                  <span className="text-sm text-red-600 font-medium flex items-center gap-2">
                    🚫 {mensajeError}
                  </span>
                )}

                <div className="flex gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2.5 border-2 border-gris-medio rounded-xl font-display font-semibold text-sm
                               hover:bg-gris-claro transition-colors text-ep-texto"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={guardando}
                    className="bg-azul-claro hover:bg-azul-medio text-white
                               px-6 py-2.5 rounded-xl font-display font-semibold text-sm
                               transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function EditarArticuloPage() {
  return <ProtectedRoute><EditarArticuloContent /></ProtectedRoute>
}
