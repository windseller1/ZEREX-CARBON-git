'use client'

import { cn } from '@/lib/utils'

interface GridProps {
  children: React.ReactNode
  columns?: number
  gap?: number
  className?: string
  responsive?: boolean
}

export default function Grid({
  children,
  columns = 3,
  gap = 16,
  className,
  responsive = true
}: GridProps) {
  const gridTemplateColumns = `repeat(${columns}, 1fr)`
  const gapValue = `${gap}px`

  const responsiveClasses = responsive
    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
    : ''

  return (
    <div
      className={cn(
        'grid',
        responsive ? responsiveClasses : '',
        className
      )}
      style={{
        gridTemplateColumns: responsive ? undefined : gridTemplateColumns,
        gap: gapValue
      }}
    >
      {children}
    </div>
  )
}

interface GridItemProps {
  children: React.ReactNode
  span?: number
  className?: string
}

export function GridItem({ children, span = 1, className }: GridItemProps) {
  return (
    <div
      className={cn('', className)}
      style={{
        gridColumn: `span ${span}`
      }}
    >
      {children}
    </div>
  )
}
