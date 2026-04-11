'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function GSAPParallax({
  children,
  velocidad  = 0.4,
  className  = '',
  desactivarMobile = true,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isMobile = window.innerWidth < 768
    if (isMobile && desactivarMobile) return

    const tween = gsap.fromTo(el,
      { yPercent: -velocidad * 30 },
      {
        yPercent: velocidad * 30,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      }
    )

    return () => {
      tween?.scrollTrigger?.kill()
      tween?.kill()
    }
  }, [velocidad, desactivarMobile])

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={ref} className="will-change-transform">
        {children}
      </div>
    </div>
  )
}
