'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ScrollSpyProps {
  children: React.ReactNode
  className?: string
  offset?: number
  activeClass?: string
  inactiveClass?: string
}

export default function ScrollSpy({
  children,
  className,
  offset = 0,
  activeClass = 'text-green-600',
  inactiveClass = 'text-gray-600'
}: ScrollSpyProps) {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-scroll-spy]')
      let currentSection = ''

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= offset && rect.bottom >= offset) {
          currentSection = section.id
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        isActive: activeSection === child.props.id,
        activeClass,
        inactiveClass
      })
    }
    return child
  })

  return (
    <div className={cn('', className)}>
      {childrenWithProps}
    </div>
  )
}
