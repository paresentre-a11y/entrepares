'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function GSAPCounter({ valor, sufijo = '', duracion = 2 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obj = { val: 0 }

    const tween = gsap.to(obj, {
      val: parseFloat(valor),
      duration: duracion,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val) + sufijo
      },
    })

    return () => {
      tween?.scrollTrigger?.kill()
      tween?.kill()
    }
  }, [valor, sufijo, duracion])

  return <span ref={ref}>0{sufijo}</span>
}
