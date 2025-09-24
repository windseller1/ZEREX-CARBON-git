'use client'

import { cn } from '@/lib/utils'

interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  name: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Radio({
  options,
  value,
  onChange,
  name,
  disabled = false,
  size = 'md',
  className
}: RadioProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const dotSizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-3">
          <button
            type="button"
            role="radio"
            aria-checked={value === option.value}
            disabled={disabled || option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center justify-center rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
              sizeClasses[size],
              value === option.value
                ? 'bg-green-600 border-green-600'
                : 'bg-white border-gray-300',
              (disabled || option.disabled) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {value === option.value && (
              <div
                className={cn(
                  'rounded-full bg-white',
                  dotSizeClasses[size]
                )}
              />
            )}
          </button>
          
          <label className="text-sm font-medium text-gray-700">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  )
}
