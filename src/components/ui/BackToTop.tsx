'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface BackToTopProps {
  threshold?: number
  className?: string
  show?: boolean
  smooth?: boolean
  text?: string
  icon?: string
}

export default function BackToTop({
  threshold = 300,
  className,
  show = true,
  smooth = true,
  text = 'العودة للأعلى',
  icon = '↑'
}: BackToTopProps) {
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
      <span className="flex items-center space-x-2">
        <span>{icon}</span>
        {text && <span className="text-sm">{text}</span>}
      </span>
    </Button>
  )
}
