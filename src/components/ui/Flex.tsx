'use client'

import { cn } from '@/lib/utils'

interface FlexProps {
  children: React.ReactNode
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  gap?: number
  className?: string
}

export default function Flex({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'start',
  gap = 0,
  className
}: FlexProps) {
  const directionClasses = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse'
  }

  const wrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse'
  }

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  }

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        wrapClasses[wrap],
        justifyClasses[justify],
        alignClasses[align],
        className
      )}
      style={{ gap: `${gap}px` }}
    >
      {children}
    </div>
  )
}
