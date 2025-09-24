'use client'

import { cn } from '@/lib/utils'

interface CenterProps {
  children: React.ReactNode
  className?: string
  inline?: boolean
}

export default function Center({
  children,
  className,
  inline = false
}: CenterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        inline ? 'inline-flex' : 'w-full h-full',
        className
      )}
    >
      {children}
    </div>
  )
}
