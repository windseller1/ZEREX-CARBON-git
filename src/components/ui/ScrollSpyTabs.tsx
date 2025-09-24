'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface ScrollSpyTabsProps {
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
  variant?: 'default' | 'pills' | 'underline'
}

export default function ScrollSpyTabs({
  sections,
  className,
  offset = 0,
  activeClass = 'text-green-600 border-green-600',
  inactiveClass = 'text-gray-600 border-transparent hover:text-gray-900',
  smooth = true,
  variant = 'default'
}: ScrollSpyTabsProps) {
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

  const variantClasses = {
    default: 'border-b-2',
    pills: 'rounded-full px-4 py-2',
    underline: 'border-b-2'
  }

  return (
    <div className={cn('flex space-x-1', className)}>
      {sections.map((section) => (
        <Button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          variant="outline"
          className={cn(
            'transition-colors duration-200',
            variantClasses[variant],
            activeSection === section.id ? activeClass : inactiveClass
          )}
        >
          {section.icon && (
            <span className="mr-2">{section.icon}</span>
          )}
          {section.label}
        </Button>
      ))}
    </div>
  )
}
