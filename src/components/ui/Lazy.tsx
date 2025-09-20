'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface LazyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export default function Lazy({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  className
}: LazyProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={elementRef} className={cn('', className)}>
      {isVisible ? children : fallback}
    </div>
  )
}
