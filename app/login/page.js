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
