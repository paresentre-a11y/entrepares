'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export default function ParallaxLayer({
  children,
  velocidad = 0.3,
  className = '',
}) {
  const ref = useRef(null)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const vel = isMobile ? velocidad * 0.3 : velocidad

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-vel * 80}px`, `${vel * 80}px`]
  )

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
