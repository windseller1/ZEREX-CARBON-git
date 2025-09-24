'use client'

import { Suspense as ReactSuspense, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Loading from './Loading'

interface SuspenseProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

export default function Suspense({
  children,
  fallback,
  className
}: SuspenseProps) {
  const defaultFallback = (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <Loading size="lg" text="جاري التحميل..." />
    </div>
  )

  return (
    <ReactSuspense fallback={fallback || defaultFallback}>
      {children}
    </ReactSuspense>
  )
}
