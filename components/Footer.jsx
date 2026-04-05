'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gris-oscuro text-white pt-14 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Logo — usando img normal sin filtro */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-32 h-32 rounded-2xl overflow-hidden
                            bg-white flex items-center justify-center
                            mb-4 shadow-lg p-2">
              <img
                src="/images/logo.png"
                alt="Entre Pares Chiriquí"
                className="w-full h-full object-contain"
                onError={e => {
                  e.target.onerror = null
                  e.target.src = 'https://www.entrepares.cloud/images/logo.png'
                }}
              />
            </div>
            <p className="text-white font-display font-bold text-base
                          text-center">
              Entre Pares Chiriquí
            </p>
            <p className="text-white/50 text-xs text-center mt-1">
              Región Educativa de Chiriquí — MEDUCA
            </p>
          </motion.div>

          {/* Contacto */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-display font-semibold mb-4 text-white text-lg">
              Contacto
            </h4>
            <p className="text-white/60 text-sm mb-2">
              ✉️ entrepares.chiriqui@meduca.gob.pa
            </p>
            <p className="text-white/60 text-sm">
              🕐 Lunes a Viernes, 8:00 — 16:00
            </p>
          </motion.div>

          {/* Ubicación */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-display font-semibold mb-4 text-white text-lg">
              Ubicación
            </h4>
            <p className="text-white/60 text-sm">Región Educativa de Chiriquí</p>
            <p className="text-white/60 text-sm">Ministerio de Educación</p>
            <p className="text-white/60 text-sm">República de Panamá</p>
          </motion.div>
        </div>

        {/* Línea divisora */}
        <motion.div
          className="border-t border-white/10 pt-5 text-center
                     text-white/40 text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          © 2026 Entre Pares Chiriquí - MEDUCA. Todos los derechos reservados.
        </motion.div>
      </div>
    </footer>
  )
}
