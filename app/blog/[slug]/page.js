'use client'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'next/navigation'
import { obtenerArticuloPorId, formatearFecha } from '@/lib/blog'

export default function BlogPostPage() {
  const params = useParams()
  const [articulo, setArticulo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!params?.slug) return
    obtenerArticuloPorId(params.slug).then(({ data, error: err }) => {
      if (err || !data) setError(true)
      else setArticulo(data)
      setCargando(false)
    })
  }, [params?.slug])

  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gris-medio border-t-azul-claro rounded-full animate-spin" />
    </div>
  )

  if (error || !articulo) return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-center">
      <p className="text-5xl mb-4">😕</p>
      <h1 className="font-display font-bold text-azul-oscuro text-2xl mb-3">Artículo no encontrado</h1>
      <a href="/blog" className="text-azul-claro font-semibold hover:underline">← Volver al blog</a>
    </main>
  )

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <a href="/blog" className="text-azul-claro text-sm font-semibold hover:underline mb-6 inline-block">
        ← Volver al blog
      </a>

      {articulo.imagen_url && (
        <img
          src={articulo.imagen_url}
          alt={articulo.titulo}
          className="w-full h-64 sm:h-80 object-cover rounded-ep-lg mb-8"
          onError={e => { e.target.style.display = 'none' }}
        />
      )}

      {articulo.etiqueta && (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium
          bg-azul-claro/10 text-azul-claro mb-3">
          {articulo.etiqueta}
        </span>
      )}

      <h1 className="font-display font-bold text-azul-oscuro text-3xl sm:text-4xl mb-4">
        {articulo.titulo}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-ep-suave mb-8 pb-6 border-b border-gris-medio">
        <span>{formatearFecha(articulo.created_at)}</span>
        {articulo.autor && <span>Por {articulo.autor}</span>}
      </div>

      <div className="prose prose-sm sm:prose max-w-none text-ep-texto leading-relaxed whitespace-pre-line">
        {articulo.contenido}
      </div>
    </main>
  )
}
