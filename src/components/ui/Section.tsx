'use client'

import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export default function Section({
  children,
  title,
  subtitle,
  padding = 'md',
  className,
  titleClassName,
  subtitleClassName
}: SectionProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  return (
    <section className={cn('w-full', paddingClasses[padding], className)}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className={cn('text-2xl font-bold text-gray-900', titleClassName)}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={cn('mt-2 text-gray-600', subtitleClassName)}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
