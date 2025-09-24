'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface ScrollSpyStepsProps {
  sections: Array<{
    id: string
    label: string
    description?: string
  }>
  className?: string
  offset?: number
  activeClass?: string
  inactiveClass?: string
  completedClass?: string
  smooth?: boolean
  position?: 'left' | 'right'
  showConnectors?: boolean
}

export default function ScrollSpySteps({
  sections,
  className,
  offset = 0,
  activeClass = 'bg-green-600 text-white border-green-600',
  inactiveClass = 'bg-white text-gray-600 border-gray-300 hover:border-gray-400',
  completedClass = 'bg-green-100 text-green-600 border-green-300',
  smooth = true,
  position = 'right',
  showConnectors = true
}: ScrollSpyStepsProps) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = ''
      let newCompletedSections = new Set<string>()

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id)
        if (!element) return

        const rect = element.getBoundingClientRect()
        if (rect.top <= offset && rect.bottom >= offset) {
          currentSection = section.id
        }

        // Mark previous sections as completed
        if (rect.top < offset) {
          newCompletedSections.add(section.id)
        }
      })

      setActiveSection(currentSection)
      setCompletedSections(newCompletedSections)
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
        'fixed top-1/2 transform -translate-y-1/2 z-50 flex flex-col',
        positionClasses[position],
        className
      )}
    >
      {sections.map((section, index) => {
        const isActive = activeSection === section.id
        const isCompleted = completedSections.has(section.id)
        const isLast = index === sections.length - 1

        return (
          <div key={section.id} className="flex items-start space-x-3">
            <div className="flex flex-col items-center">
              <Button
                onClick={() => scrollToSection(section.id)}
                variant="outline"
                size="sm"
                className={cn(
                  'w-8 h-8 rounded-full p-0 transition-all duration-200 flex items-center justify-center text-sm font-medium border-2',
                  isActive ? activeClass : isCompleted ? completedClass : inactiveClass
                )}
                title={section.label}
              >
                {isCompleted ? '✓' : index + 1}
              </Button>
              
              {showConnectors && !isLast && (
                <div
                  className={cn(
                    'w-0.5 h-8 mt-2 transition-colors duration-200',
                    isCompleted ? 'bg-green-300' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  'text-sm font-medium transition-colors duration-200 cursor-pointer',
                  isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'
                )}
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
              </div>
              {section.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {section.description}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
