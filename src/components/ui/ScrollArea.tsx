'use client'

import { cn } from '@/lib/utils'

interface ScrollAreaProps {
  children: React.ReactNode
  className?: string
  scrollbar?: 'auto' | 'hidden' | 'visible'
  orientation?: 'vertical' | 'horizontal' | 'both'
}

export default function ScrollArea({
  children,
  className,
  scrollbar = 'auto',
  orientation = 'vertical'
}: ScrollAreaProps) {
  const scrollbarClasses = {
    auto: 'scrollbar-auto',
    hidden: 'scrollbar-hide',
    visible: 'scrollbar-visible'
  }

  const orientationClasses = {
    vertical: 'overflow-y-auto overflow-x-hidden',
    horizontal: 'overflow-x-auto overflow-y-hidden',
    both: 'overflow-auto'
  }

  return (
    <div
      className={cn(
        'relative',
        orientationClasses[orientation],
        scrollbarClasses[scrollbar],
        className
      )}
    >
      {children}
    </div>
  )
}
