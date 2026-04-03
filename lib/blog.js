import { supabase } from './supabase'

// ── Obtener artículos publicados (con filtro opcional por categoría) ──
export async function obtenerArticulos(soloPublicados = true, categoria = null) {
  let query = supabase
    .from('articulos')
    .select('id, titulo, descripcion, contenido, autor, imagen_url, publicado, categoria, created_at')
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
    descripcion:    articulo.descripcion || '',
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
