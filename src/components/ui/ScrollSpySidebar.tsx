'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface ScrollSpySidebarProps {
  sections: Array<{
    id: string
    label: string
    icon?: string
    children?: Array<{
      id: string
      label: string
      icon?: string
    }>
  }>
  className?: string
  offset?: number
  activeClass?: string
  inactiveClass?: string
  smooth?: boolean
  collapsible?: boolean
}

export default function ScrollSpySidebar({
  sections,
  className,
  offset = 0,
  activeClass = 'text-green-600 bg-green-50 border-r-2 border-green-600',
  inactiveClass = 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
  smooth = true,
  collapsible = true
}: ScrollSpySidebarProps) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = ''

      const checkSection = (section: any) => {
        const element = document.getElementById(section.id)
        if (!element) return

        const rect = element.getBoundingClientRect()
        if (rect.top <= offset && rect.bottom >= offset) {
          currentSection = section.id
        }

        if (section.children) {
          section.children.forEach(checkSection)
        }
      }

      sections.forEach(checkSection)
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

  const toggleSection = (sectionId: string) => {
    if (!collapsible) return

    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const renderSection = (section: any, level = 0) => {
    const isActive = activeSection === section.id
    const isExpanded = expandedSections.has(section.id)
    const hasChildren = section.children && section.children.length > 0

    return (
      <div key={section.id} className={cn('', level > 0 && 'ml-4')}>
        <Button
          onClick={() => {
            scrollToSection(section.id)
            if (hasChildren) {
              toggleSection(section.id)
            }
          }}
          variant="outline"
          className={cn(
            'w-full justify-start transition-colors duration-200',
            isActive ? activeClass : inactiveClass
          )}
        >
          {section.icon && (
            <span className="mr-2">{section.icon}</span>
          )}
          <span className="flex-1 text-left">{section.label}</span>
          {hasChildren && (
            <span className={cn(
              'transition-transform duration-200',
              isExpanded ? 'rotate-90' : 'rotate-0'
            )}>
              ▶
            </span>
          )}
        </Button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {section.children.map((child: any) => renderSection(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className={cn('space-y-1', className)}>
      {sections.map(section => renderSection(section))}
    </nav>
  )
}
