'use client'

const ETIQUETAS = [
  'Todas',
  'Recursos Educativos',
  'Formación Docente',
  'Cursos',
  'Tecnología Educativa',
]

export default function TagFilter({ activa, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {ETIQUETAS.map(etiqueta => (
        <button
          key={etiqueta}
          onClick={() => onChange(etiqueta)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activa === etiqueta
              ? 'bg-azul-claro text-white shadow-md'
              : 'bg-gris-claro text-ep-suave hover:bg-gris-medio hover:text-ep-texto'
            }`}
        >
          {etiqueta}
        </button>
      ))}
    </div>
  )
}
