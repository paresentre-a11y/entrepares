'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [resultado, setResultado] = useState({
    conexion: 'probando...',
    categorias: null,
    articulos: null,
    errores: []
  })

  useEffect(() => {
    async function testConexion() {
      const errores = []
      
      // Test 1: Verificar conexión básica
      console.log('🔵 [TEST] Probando conexión con Supabase...')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        errores.push(`Auth error: ${sessionError.message}`)
        console.error('❌ [TEST] Auth error:', sessionError)
      }
      
      // Test 2: Obtener categorías
      console.log('🔵 [TEST] Probando obtener categorías...')
      const { data: catsData, error: catsError } = await supabase
        .from('categorias')
        .select('id, nombre, slug')
      
      console.log('📦 [TEST] Categorías resultado:', { catsData, catsError })
      
      if (catsError) {
        errores.push(`Categorías error: ${catsError.message}`)
        console.error('❌ [TEST] Categorías error:', catsError)
      }
      
      // Test 3: Obtener artículos
      console.log('🔵 [TEST] Probando obtener artículos...')
      const { data: artsData, error: artsError } = await supabase
        .from('articulos')
        .select('*')
      
      console.log('📦 [TEST] Artículos resultado:', { artsData, artsError })
      
      if (artsError) {
        errores.push(`Artículos error: ${artsError.message}`)
        console.error('❌ [TEST] Artículos error:', artsError)
      }
      
      setResultado({
        conexion: sessionError ? 'fallida' : 'exitosa',
        categorias: catsData || [],
        articulos: artsData || [],
        errores
      })
    }
    
    testConexion()
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4 font-mono text-sm">
      <h2 className="font-bold text-lg mb-4">🧪 Test de Supabase</h2>
      
      <div className="mb-4">
        <p><strong>Conexión:</strong> {resultado.conexion}</p>
      </div>
      
      <div className="mb-4">
        <p><strong>Categorías encontradas:</strong> {resultado.categorias?.length || 0}</p>
        {resultado.categorias?.length > 0 && (
          <ul className="ml-4 mt-2 list-disc">
            {resultado.categorias.map(c => (
              <li key={c.id}>{c.nombre} ({c.slug})</li>
            ))}
          </ul>
        )}
      </div>
      
      <div>
        <p><strong>Artículos encontrados:</strong> {resultado.articulos?.length || 0}</p>
        {resultado.articulos?.length > 0 && (
          <ul className="ml-4 mt-2 list-disc">
            {resultado.articulos.map(a => (
              <li key={a.id}>{a.titulo}</li>
            ))}
          </ul>
        )}
      </div>
      
      {resultado.errores.length > 0 && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Errores:</p>
          <ul className="list-disc ml-4">
            {resultado.errores.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
