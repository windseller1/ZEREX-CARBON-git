'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  disabled?: boolean
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

export default function Accordion({
  items,
  allowMultiple = false,
  className
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setOpenItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      )
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleItem(item.id)}
            disabled={item.disabled}
            className={cn(
              'w-full px-4 py-3 text-left flex items-center justify-between transition-colors',
              item.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset'
            )}
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            <svg
              className={cn(
                'h-5 w-5 text-gray-500 transition-transform',
                openItems.includes(item.id) && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          
          {openItems.includes(item.id) && (
            <div className="px-4 pb-3 text-gray-700">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}