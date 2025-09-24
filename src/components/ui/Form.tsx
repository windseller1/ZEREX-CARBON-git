'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  className?: string
}

export default function Form({ children, className, ...props }: FormProps) {
  return (
    <form
      className={cn('space-y-6', className)}
      {...props}
    >
      {children}
    </form>
  )
}

interface FormGroupProps {
  children: ReactNode
  className?: string
}

export function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  )
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  required?: boolean
  className?: string
}

export function FormLabel({ children, required, className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-gray-700',
        required && 'after:content-["*"] after:ml-1 after:text-red-500',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}

interface FormErrorProps {
  children: ReactNode
  className?: string
}

export function FormError({ children, className }: FormErrorProps) {
  return (
    <p className={cn('text-sm text-red-600', className)}>
      {children}
    </p>
  )
}

interface FormHelperTextProps {
  children: ReactNode
  className?: string
}

export function FormHelperText({ children, className }: FormHelperTextProps) {
  return (
    <p className={cn('text-sm text-gray-500', className)}>
      {children}
    </p>
  )
}

interface FormFieldProps {
  children: ReactNode
  className?: string
}

export function FormField({ children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {children}
    </div>
  )
}
