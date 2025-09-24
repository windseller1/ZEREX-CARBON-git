'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ScrollIndicatorProps {
  className?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  height?: number
  position?: 'top' | 'bottom'
}

export default function ScrollIndicator({
  className,
  color = 'primary',
  height = 4,
  position = 'top'
}: ScrollIndicatorProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setScrollProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const colorClasses = {
    primary: 'bg-green-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  }

  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0'
  }

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-50',
        positionClasses[position],
        className
      )}
      style={{ height: `${height}px` }}
    >
      <div
        className={cn(
          'h-full transition-all duration-150 ease-out',
          colorClasses[color]
        )}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
