'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  closeOnClickOutside?: boolean
}

export default function Popover({
  trigger,
  content,
  position = 'bottom',
  className,
  closeOnClickOutside = true
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (closeOnClickOutside) {
      const handleClickOutside = (event: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [closeOnClickOutside])

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div className={cn('relative', className)} ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4',
            positionClasses[position]
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
