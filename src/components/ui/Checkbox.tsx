'use client'

import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className
}: CheckboxProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'flex items-center justify-center rounded border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
          sizeClasses[size],
          checked
            ? 'bg-green-600 border-green-600 text-white'
            : 'bg-white border-gray-300 text-transparent',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {checked && (
          <svg
            className={cn('text-white', iconSizeClasses[size])}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
      
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
    </div>
  )
}
