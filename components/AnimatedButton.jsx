'use client'
import { motion } from 'framer-motion'

export default function AnimatedButton({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        scale: disabled ? 1 : 1.03,
        boxShadow: disabled ? 'none' : '0 8px 25px rgba(0,102,204,0.4)',
      }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}
