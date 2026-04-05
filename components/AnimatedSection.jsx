'use client'
import { motion } from 'framer-motion'

const variantes = {
  'fade-up': {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-down': {
    hidden:  { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-left': {
    hidden:  { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  'fade-right': {
    hidden:  { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  'zoom': {
    hidden:  { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
}

export default function AnimatedSection({
  children,
  variante = 'fade-up',
  delay = 0,
  duration = 0.6,
  className = '',
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      variants={variantes[variante]}
      className={className}
    >
      {children}
    </motion.div>
  )
}
