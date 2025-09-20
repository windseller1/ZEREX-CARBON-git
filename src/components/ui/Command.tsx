'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: string
  onClick: () => void
}

interface CommandProps {
  items: CommandItem[]
  placeholder?: string
  className?: string
  onClose?: () => void
}

export default function Command({
  items,
  placeholder = 'ابحث...',
  className,
  onClose
}: CommandProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < filteredItems.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredItems.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].onClick()
        onClose?.()
      }
    } else if (e.key === 'Escape') {
      onClose?.()
    }
  }

  return (
    <div className={cn('w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200', className)}>
      <div className="p-3 border-b border-gray-200">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            لا توجد نتائج
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                item.onClick()
                onClose?.()
              }}
              className={cn(
                'w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors',
                index === selectedIndex && 'bg-gray-50'
              )}
            >
              <div className="flex items-center">
                {item.icon && (
                  <span className="mr-3 text-gray-400">{item.icon}</span>
                )}
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  {item.description && (
                    <div className="text-sm text-gray-500">{item.description}</div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
