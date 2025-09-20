'use client'

import { cn } from '@/lib/utils'

interface AspectRatioProps {
  children: React.ReactNode
  ratio?: number
  className?: string
}

export default function AspectRatio({
  children,
  ratio = 16 / 9,
  className
}: AspectRatioProps) {
  return (
    <div
      className={cn('relative w-full', className)}
      style={{
        aspectRatio: ratio.toString()
      }}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  )
}
