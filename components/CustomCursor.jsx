'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dot  = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return

    const moveDot = e => {
      gsap.to(dot.current,  {
        x: e.clientX, y: e.clientY,
        duration: 0.1, ease: 'power2.out',
      })
      gsap.to(ring.current, {
        x: e.clientX, y: e.clientY,
        duration: 0.35, ease: 'power2.out',
      })
    }

    const growRing = () => {
      gsap.to(ring.current, {
        scale: 1.8, opacity: 0.5, duration: 0.25,
      })
    }
    const shrinkRing = () => {
      gsap.to(ring.current, {
        scale: 1, opacity: 1, duration: 0.25,
      })
    }

    window.addEventListener('mousemove', moveDot)
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', growRing)
      el.addEventListener('mouseleave', shrinkRing)
    })

    return () => {
      window.removeEventListener('mousemove', moveDot)
    }
  }, [])

  return (
    <>
      <div ref={dot}  className="cursor-dot"  />
      <div ref={ring} className="cursor-ring" />
    </>
  )
}
