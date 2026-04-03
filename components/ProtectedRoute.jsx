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
