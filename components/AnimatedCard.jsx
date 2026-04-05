'use client'
import { motion } from 'framer-motion'

export default function AnimatedCard({
  children,
  delay = 0,
  className = '',
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -8,
        boxShadow: '0 20px 40px rgba(0,53,128,0.18)',
        transition: { duration: 0.25 },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  )
}
