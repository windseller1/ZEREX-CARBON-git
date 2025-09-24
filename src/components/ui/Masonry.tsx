'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface MasonryProps {
  children: React.ReactNode[]
  columns?: number
  gap?: number
  className?: string
}

export default function Masonry({
  children,
  columns = 3,
  gap = 16,
  className
}: MasonryProps) {
  const [columnHeights, setColumnHeights] = useState<number[]>(new Array(columns).fill(0))
  const [items, setItems] = useState<React.ReactNode[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (children.length === 0) return

    const newItems = children.map((child, index) => ({
      id: index,
      content: child,
      height: Math.random() * 200 + 100 // Random height for demo
    }))

    // Distribute items to columns based on height
    const newColumnHeights = new Array(columns).fill(0)
    const newItemsWithColumns = newItems.map(item => {
      const shortestColumn = newColumnHeights.indexOf(Math.min(...newColumnHeights))
      newColumnHeights[shortestColumn] += item.height
      return { ...item, column: shortestColumn }
    })

    setItems(newItemsWithColumns)
    setColumnHeights(newColumnHeights)
  }, [children, columns])

  return (
    <div
      ref={containerRef}
      className={cn('flex', className)}
      style={{ gap: `${gap}px` }}
    >
      {Array.from({ length: columns }, (_, columnIndex) => (
        <div
          key={columnIndex}
          className="flex-1"
          style={{ gap: `${gap}px` }}
        >
          {items
            .filter(item => item.column === columnIndex)
            .map(item => (
              <div
                key={item.id}
                className="mb-4"
                style={{ height: item.height }}
              >
                {item.content}
              </div>
            ))
          }
        </div>
      ))}
    </div>
  )
}
