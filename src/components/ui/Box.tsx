'use client'

import { cn } from '@/lib/utils'

interface BoxProps {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  [key: string]: any
}

export default function Box({
  children,
  className,
  as: Component = 'div',
  ...props
}: BoxProps) {
  return (
    <Component
      className={cn('', className)}
      {...props}
    >
      {children}
    </Component>
  )
}
