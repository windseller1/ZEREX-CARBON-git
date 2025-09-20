'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface ScrollToTopProps {
  threshold?: number
  className?: string
  show?: boolean
  smooth?: boolean
}

export default function ScrollToTop({
  threshold = 300,
  className,
  show = true,
  smooth = true
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > threshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }

  if (!show || !isVisible) return null

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-4 right-4 z-50 rounded-full p-3 shadow-lg',
        className
      )}
      size="lg"
    >
      ↑
    </Button>
  )
}
