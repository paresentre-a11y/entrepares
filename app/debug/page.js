'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { obtenerTodosArticulos } from '@/lib/blog'

export default function DebugPage() {
  const [logs, setLogs] = useState([])
  const [articulos, setArticulos] = useState([])
  const [session, setSession] = useState(null)

  function addLog(message, type = 'info') {
    setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }])
  }

  useEffect(() => {
    async function runTests() {
      addLog('=== INICIANDO TEST ===', 'info')
      
      addLog(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`, 'info')
      addLog(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***' : 'undefined'}`, 'info')
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        addLog(`Sesión: ${session ? 'ACTIVA' : 'NO ACTIVA'}`, session ? 'success' : 'warning')
        if (session) {
          addLog(`Usuario: ${session.user?.email}`, 'success')
        }
      } catch (e) {
        addLog(`Error en auth: ${e.message}`, 'error')
      }
      
      addLog('--- Test Artículos (lib/blog.js) ---', 'info')
      const artsResult = await obtenerTodosArticulos()
      addLog(`Artículos error: ${artsResult.error?.message || 'none'}`, artsResult.error ? 'error' : 'success')
      addLog(`Artículos encontrados: ${artsResult.data?.length}`, artsResult.data?.length > 0 ? 'success' : 'warning')
      setArticulos(artsResult.data || [])
      artsResult.data?.forEach(a => addLog(`  • ${a.titulo} - ${a.publicado ? 'Publicado' : 'Borrador'}`, 'info'))
      
      addLog('--- Test Query Directa (Artículos) ---', 'info')
      const { data: directArts, error: directArtsError } = await supabase.from('articulos').select('*')
      if (directArtsError) {
        addLog(`Error query directa: ${directArtsError.message}`, 'error')
        addLog(`Details: ${JSON.stringify(directArtsError)}`, 'error')
      } else {
        addLog(`Query directa OK: ${directArts?.length} artículos`, 'success')
      }
      
      addLog('=== TEST COMPLETADO ===', 'info')
    }
    
    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-6 text-white">🔍 Debug Page - Supabase Connection</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logs */}
        <div className="bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto">
          <h2 className="font-bold text-white mb-4">📋 Logs</h2>
          {logs.map((log, i) => (
            <div key={i} className={`mb-2 ${
              log.type === 'error' ? 'text-red-400' :
              log.type === 'success' ? 'text-green-400' :
              log.type === 'warning' ? 'text-yellow-400' :
              'text-gray-300'
            }`}>
              <span className="text-gray-500">[{log.time}]</span> {log.message}
            </div>
          ))}
        </div>
        
        {/* Artículos */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="font-bold text-white mb-4">📝 Artículos ({articulos.length})</h2>
            {articulos.length === 0 ? (
              <p className="text-gray-500">Sin artículos</p>
            ) : (
              <ul className="space-y-2">
                {articulos.map(a => (
                  <li key={a.id} className="text-gray-300">
                    <strong>{a.titulo}</strong>
                    <br/>
                    <span className="text-xs text-gray-500">
                      Estado: {a.publicado ? '✅ Publicado' : '⏸ Borrador'}
                    </span>
                    <br/>
                    <span className="text-xs text-gray-500">
                      Categoría: {a.categoria || 'Sin categoría'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {session && (
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h2 className="font-bold text-white mb-4">👤 Sesión Activa</h2>
          <p className="text-gray-300">Email: {session.user?.email}</p>
          <p className="text-gray-300">ID: {session.user?.id}</p>
        </div>
      )}
      
      <button 
        onClick={() => window.location.reload()}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold"
      >
        🔄 Recargar Test
      </button>
    </div>
  )
}
