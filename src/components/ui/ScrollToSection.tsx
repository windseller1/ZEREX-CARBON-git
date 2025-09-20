'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface ScrollToSectionProps {
  targetId: string
  children: React.ReactNode
  className?: string
  smooth?: boolean
  offset?: number
  activeClass?: string
  inactiveClass?: string
}

export default function ScrollToSection({
  targetId,
  children,
  className,
  smooth = true,
  offset = 0,
  activeClass = 'text-green-600',
  inactiveClass = 'text-gray-600'
}: ScrollToSectionProps) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById(targetId)
      if (!target) return

      const rect = target.getBoundingClientRect()
      const isInView = rect.top <= offset && rect.bottom >= offset
      setIsActive(isInView)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [targetId, offset])

  const scrollToSection = () => {
    const target = document.getElementById(targetId)
    if (!target) return

    const targetPosition = target.offsetTop - offset
    window.scrollTo({
      top: targetPosition,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }

  return (
    <Button
      onClick={scrollToSection}
      className={cn(
        'transition-colors duration-200',
        isActive ? activeClass : inactiveClass,
        className
      )}
      variant="outline"
    >
      {children}
    </Button>
  )
}
