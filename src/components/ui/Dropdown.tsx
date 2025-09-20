'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface DropdownItem {
  id: string
  label: string
  icon?: string
  onClick: () => void
  disabled?: boolean
  divider?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  position?: 'left' | 'right' | 'center'
  className?: string
}

export default function Dropdown({
  trigger,
  items,
  position = 'left',
  className
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50',
            positionClasses[position]
          )}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <div key={item.id}>
                {item.divider && index > 0 && (
                  <div className="border-t border-gray-100 my-1" />
                )}
                <button
                  onClick={() => {
                    item.onClick()
                    setIsOpen(false)
                  }}
                  disabled={item.disabled}
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center">
                    {item.icon && (
                      <span className="mr-3 text-gray-400">{item.icon}</span>
                    )}
                    {item.label}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
