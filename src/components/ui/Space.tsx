'use client'

import { cn } from '@/lib/utils'

interface SpaceProps {
  children: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export default function Space({
  children,
  size = 'md',
  direction = 'horizontal',
  className
}: SpaceProps) {
  const sizeClasses = {
    xs: 'space-x-1',
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-6',
    xl: 'space-x-8',
    '2xl': 'space-x-12',
    '3xl': 'space-x-16'
  }

  const verticalSizeClasses = {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12',
    '3xl': 'space-y-16'
  }

  const directionClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  }

  return (
    <div
      className={cn(
        directionClasses[direction],
        direction === 'horizontal' ? sizeClasses[size] : verticalSizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}
