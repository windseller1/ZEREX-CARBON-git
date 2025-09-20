'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface ScrollSpyNavProps {
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
}

export default function ScrollSpyNav({
  sections,
  className,
  offset = 0,
  activeClass = 'text-green-600 bg-green-50',
  inactiveClass = 'text-gray-600 hover:text-gray-900',
  smooth = true
}: ScrollSpyNavProps) {
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

  return (
    <nav className={cn('space-y-1', className)}>
      {sections.map((section) => (
        <Button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          variant="outline"
          className={cn(
            'w-full justify-start transition-colors duration-200',
            activeSection === section.id ? activeClass : inactiveClass
          )}
        >
          {section.icon && (
            <span className="mr-2">{section.icon}</span>
          )}
          {section.label}
        </Button>
      ))}
    </nav>
  )
}
