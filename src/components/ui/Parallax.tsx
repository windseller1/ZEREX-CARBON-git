'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
  offset?: number
}

export default function Parallax({
  children,
  speed = 0.5,
  direction = 'up',
  className,
  offset = 0
}: ParallaxProps) {
  const [transform, setTransform] = useState('')
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * -speed

      let transformValue = ''
      
      switch (direction) {
        case 'up':
          transformValue = `translateY(${rate + offset}px)`
          break
        case 'down':
          transformValue = `translateY(${-rate + offset}px)`
          break
        case 'left':
          transformValue = `translateX(${rate + offset}px)`
          break
        case 'right':
          transformValue = `translateX(${-rate + offset}px)`
          break
      }

      setTransform(transformValue)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, direction, offset])

  return (
    <div
      ref={elementRef}
      className={cn('', className)}
      style={{ transform }}
    >
      {children}
    </div>
  )
}
