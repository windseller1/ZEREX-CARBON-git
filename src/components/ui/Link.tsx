'use client'

import { cn } from '@/lib/utils'
import NextLink from 'next/link'

interface LinkProps {
  children: React.ReactNode
  href: string
  external?: boolean
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  underline?: 'none' | 'hover' | 'always'
  className?: string
}

export default function Link({
  children,
  href,
  external = false,
  variant = 'default',
  size = 'md',
  weight = 'normal',
  underline = 'hover',
  className
}: LinkProps) {
  const variantClasses = {
    default: 'text-gray-600 hover:text-gray-900',
    primary: 'text-green-600 hover:text-green-700',
    secondary: 'text-gray-500 hover:text-gray-700',
    success: 'text-green-600 hover:text-green-700',
    warning: 'text-yellow-600 hover:text-yellow-700',
    error: 'text-red-600 hover:text-red-700',
    info: 'text-blue-600 hover:text-blue-700'
  }

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const weightClasses = {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black'
  }

  const underlineClasses = {
    none: 'no-underline',
    hover: 'hover:underline',
    always: 'underline'
  }

  const linkClasses = cn(
    'transition-colors duration-200',
    variantClasses[variant],
    sizeClasses[size],
    weightClasses[weight],
    underlineClasses[underline],
    className
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        {children}
      </a>
    )
  }

  return (
    <NextLink href={href} className={linkClasses}>
      {children}
    </NextLink>
  )
}
