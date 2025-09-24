'use client'

import { cn } from '@/lib/utils'

interface ScrollSpyItemProps {
  id: string
  children: React.ReactNode
  className?: string
  isActive?: boolean
  activeClass?: string
  inactiveClass?: string
}

export default function ScrollSpyItem({
  id,
  children,
  className,
  isActive = false,
  activeClass = 'text-green-600',
  inactiveClass = 'text-gray-600'
}: ScrollSpyItemProps) {
  return (
    <div
      id={id}
      data-scroll-spy
      className={cn(
        'transition-colors duration-200',
        isActive ? activeClass : inactiveClass,
        className
      )}
    >
      {children}
    </div>
  )
}
