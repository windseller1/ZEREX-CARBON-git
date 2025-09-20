'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface ScrollSpyDotsProps {
  sections: Array<{
    id: string
    label: string
  }>
  className?: string
  offset?: number
  activeClass?: string
  inactiveClass?: string
  smooth?: boolean
  position?: 'left' | 'right'
  showLabels?: boolean
}

export default function ScrollSpyDots({
  sections,
  className,
  offset = 0,
  activeClass = 'bg-green-600 scale-125',
  inactiveClass = 'bg-gray-300 hover:bg-gray-400',
  smooth = true,
  position = 'right',
  showLabels = false
}: ScrollSpyDotsProps) {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = ''

      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (!element) return

        const rect = element.getBoundingClientRect()
        if (rect.top <= offset && rect.bottom >= offset) {
          currentSection = section.id
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections, offset])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (!element) return

    const targetPosition = element.offsetTop - offset
    window.scrollTo({
      top: targetPosition,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }

  const positionClasses = {
    left: 'left-4',
    right: 'right-4'
  }

  return (
    <div
      className={cn(
        'fixed top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-2',
        positionClasses[position],
        className
      )}
    >
      {sections.map((section, index) => (
        <div key={section.id} className="flex items-center space-x-2">
          <Button
            onClick={() => scrollToSection(section.id)}
            variant="outline"
            size="sm"
            className={cn(
              'w-3 h-3 rounded-full p-0 transition-all duration-200',
              activeSection === section.id ? activeClass : inactiveClass
            )}
            title={section.label}
          />
          {showLabels && (
            <span
              className={cn(
                'text-xs transition-colors duration-200',
                activeSection === section.id ? 'text-green-600 font-medium' : 'text-gray-500'
              )}
            >
              {section.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
