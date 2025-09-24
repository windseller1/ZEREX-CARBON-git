'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ResizableProps {
  children: React.ReactNode
  direction?: 'horizontal' | 'vertical' | 'both'
  minSize?: number
  maxSize?: number
  defaultSize?: number
  className?: string
  onResize?: (size: number) => void
}

export default function Resizable({
  children,
  direction = 'horizontal',
  minSize = 100,
  maxSize = 800,
  defaultSize = 300,
  className,
  onResize
}: ResizableProps) {
  const [size, setSize] = useState(defaultSize)
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startPosRef = useRef<number>(0)
  const startSizeRef = useRef<number>(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY
    startSizeRef.current = size
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const currentPos = direction === 'horizontal' ? e.clientX : e.clientY
    const delta = currentPos - startPosRef.current
    const newSize = startSizeRef.current + delta

    const clampedSize = Math.min(Math.max(newSize, minSize), maxSize)
    setSize(clampedSize)
    onResize?.(clampedSize)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const isHorizontal = direction === 'horizontal'
  const isVertical = direction === 'vertical'
  const isBoth = direction === 'both'

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{
        width: isHorizontal || isBoth ? size : '100%',
        height: isVertical || isBoth ? size : '100%'
      }}
    >
      {children}
      
      {/* Resize Handle */}
      <div
        className={cn(
          'absolute bg-gray-300 hover:bg-gray-400 transition-colors',
          isHorizontal && 'right-0 top-0 w-1 h-full cursor-col-resize',
          isVertical && 'bottom-0 left-0 w-full h-1 cursor-row-resize',
          isBoth && 'bottom-0 right-0 w-3 h-3 cursor-nw-resize'
        )}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}
