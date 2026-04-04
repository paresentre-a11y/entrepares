'use client'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gris-oscuro text-white pt-14 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="flex flex-col items-center">
            <img
              src="/images/logo.png"
              alt="Entre Pares Chiriquí"
              width={160}
              height={64}
              className="h-16 w-auto mx-auto mb-4 object-contain brightness-0 invert"
              onError={e => {
                e.target.src = 'https://www.entrepares.cloud/images/logo.png'
              }}
            />
            <p className="text-white/60 text-sm text-center">
              Entre Pares Chiriquí
            </p>
            <p className="text-white/40 text-xs text-center mt-1">
              Región Educativa de Chiriquí — MEDUCA
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-display font-semibold mb-4 text-white">Contacto</h4>
            <p className="text-white/60 text-sm mb-2">
              ✉️ entrepares.chiriqui@meduca.gob.pa
            </p>
            <p className="text-white/60 text-sm">🕐 Lunes a Viernes, 8:00 — 16:00</p>
          </div>
          <div className="text-center">
            <h4 className="font-display font-semibold mb-4 text-white">Ubicación</h4>
            <p className="text-white/60 text-sm">Región Educativa de Chiriquí</p>
            <p className="text-white/60 text-sm">Ministerio de Educación</p>
            <p className="text-white/60 text-sm">República de Panamá</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 text-center
                        text-white/40 text-xs">
          © 2026 Entre Pares Chiriquí - MEDUCA. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
