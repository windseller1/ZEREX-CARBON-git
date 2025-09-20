'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface ScrollSpyBreadcrumbProps {
  sections: Array<{
    id: string
    label: string
    icon?: string
  }>
  className?: string
  offset?: number
  activeClass?: string
  inactiveClass?: string
  smooth?: boolean
  separator?: string
}

export default function ScrollSpyBreadcrumb({
  sections,
  className,
  offset = 0,
  activeClass = 'text-green-600',
  inactiveClass = 'text-gray-600 hover:text-gray-900',
  smooth = true,
  separator = '/'
}: ScrollSpyBreadcrumbProps) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [breadcrumb, setBreadcrumb] = useState<Array<{ id: string; label: string; icon?: string }>>([])

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = ''
      let currentBreadcrumb: Array<{ id: string; label: string; icon?: string }> = []

      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (!element) return

        const rect = element.getBoundingClientRect()
        if (rect.top <= offset && rect.bottom >= offset) {
          currentSection = section.id
          currentBreadcrumb.push(section)
        }
      })

      setActiveSection(currentSection)
      setBreadcrumb(currentBreadcrumb)
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

  return (
    <nav className={cn('flex items-center space-x-2', className)}>
      {breadcrumb.map((section, index) => (
        <div key={section.id} className="flex items-center space-x-2">
          {index > 0 && (
            <span className="text-gray-400">{separator}</span>
          )}
          <Button
            onClick={() => scrollToSection(section.id)}
            variant="outline"
            size="sm"
            className={cn(
              'transition-colors duration-200',
              activeSection === section.id ? activeClass : inactiveClass
            )}
          >
            {section.icon && (
              <span className="mr-1">{section.icon}</span>
            )}
            {section.label}
          </Button>
        </div>
      ))}
    </nav>
  )
}
