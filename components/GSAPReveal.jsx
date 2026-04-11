'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const animaciones = {
  'fade-up': {
    from: { opacity: 0, y: 60, scale: 0.97 },
    to:   { opacity: 1, y: 0,  scale: 1    },
  },
  'fade-down': {
    from: { opacity: 0, y: -60 },
    to:   { opacity: 1, y: 0   },
  },
  'fade-left': {
    from: { opacity: 0, x: -80 },
    to:   { opacity: 1, x: 0   },
  },
  'fade-right': {
    from: { opacity: 0, x: 80 },
    to:   { opacity: 1, x: 0  },
  },
  'zoom': {
    from: { opacity: 0, scale: 0.75 },
    to:   { opacity: 1, scale: 1    },
  },
  'flip-up': {
    from: { opacity: 0, rotationX: 60, transformOrigin: 'top center' },
    to:   { opacity: 1, rotationX: 0                                  },
  },
  'skew': {
    from: { opacity: 0, skewY: 5, y: 40 },
    to:   { opacity: 1, skewY: 0, y: 0  },
  },
}

export default function GSAPReveal({
  children,
  animacion = 'fade-up',
  delay     = 0,
  duration  = 0.8,
  className = '',
  stagger   = false,
  staggerSelector = '.stagger-item',
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el  = ref.current
    if (!el) return

    const anim = animaciones[animacion]
    if (!anim) return

    let tween

    if (stagger) {
      const items = el.querySelectorAll(staggerSelector)
      tween = gsap.fromTo(
        items,
        anim.from,
        {
          ...anim.to,
          duration,
          delay,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    } else {
      tween = gsap.fromTo(el, anim.from, {
        ...anim.to,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    }

    return () => {
      tween?.scrollTrigger?.kill()
      tween?.kill()
    }
  }, [animacion, delay, duration, stagger, staggerSelector])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
