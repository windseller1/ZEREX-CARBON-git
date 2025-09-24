'use client'

import { cn } from '@/lib/utils'

interface StackProps {
  children: React.ReactNode
  direction?: 'row' | 'column'
  spacing?: number
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  className?: string
}

export default function Stack({
  children,
  direction = 'column',
  spacing = 16,
  align = 'start',
  justify = 'start',
  className
}: StackProps) {
  const directionClasses = {
    row: 'flex-row',
    column: 'flex-col'
  }

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  }

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
      style={{ gap: `${spacing}px` }}
    >
      {children}
    </div>
  )
}
