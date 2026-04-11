'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGSAPAnimation(callback, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      callback(ref)
    }, ref)
    return () => ctx.revert()
  }, deps)

  return ref
}

export { gsap, ScrollTrigger }
