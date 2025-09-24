'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode]
  direction?: 'horizontal' | 'vertical'
  minSize?: number
  maxSize?: number
  defaultSize?: number
  className?: string
  onResize?: (size: number) => void
}

export default function SplitPane({
  children,
  direction = 'horizontal',
  minSize = 100,
  maxSize = 800,
  defaultSize = 300,
  className,
  onResize
}: SplitPaneProps) {
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

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex',
        isHorizontal ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {/* First Panel */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{
          [isHorizontal ? 'width' : 'height']: size
        }}
      >
        {children[0]}
      </div>

      {/* Resize Handle */}
      <div
        className={cn(
          'flex-shrink-0 bg-gray-300 hover:bg-gray-400 transition-colors',
          isHorizontal ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'
        )}
        onMouseDown={handleMouseDown}
      />

      {/* Second Panel */}
      <div className="flex-1 overflow-hidden">
        {children[1]}
      </div>
    </div>
  )
}
