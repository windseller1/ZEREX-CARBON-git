'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ScrollSpyProgressProps {
  sections: Array<{
    id: string
    label: string
  }>
  className?: string
  offset?: number
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  height?: number
  position?: 'top' | 'bottom'
  showLabels?: boolean
}

export default function ScrollSpyProgress({
  sections,
  className,
  offset = 0,
  color = 'primary',
  height = 4,
  position = 'top',
  showLabels = false
}: ScrollSpyProgressProps) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = ''
      let maxProgress = 0

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id)
        if (!element) return

        const rect = element.getBoundingClientRect()
        const isInView = rect.top <= offset && rect.bottom >= offset
        
        if (isInView) {
          currentSection = section.id
          maxProgress = Math.max(maxProgress, (index + 1) / sections.length)
        }
      })

      setActiveSection(currentSection)
      setProgress(maxProgress)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections, offset])

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
        style={{ width: `${progress * 100}%` }}
      />
      
      {showLabels && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 p-2">
          <div className="flex justify-between text-xs text-gray-600">
            {sections.map((section, index) => (
              <span
                key={section.id}
                className={cn(
                  'transition-colors duration-200',
                  activeSection === section.id ? 'text-green-600 font-medium' : 'text-gray-500'
                )}
              >
                {section.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}