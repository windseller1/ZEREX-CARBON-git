import { cn } from '@/lib/utils'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  color?: 'gray' | 'green' | 'blue' | 'red' | 'yellow'
  className?: string
}

export default function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'gray',
  className
}: DividerProps) {
  const orientationClasses = {
    horizontal: 'w-full h-px',
    vertical: 'h-full w-px'
  }

  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  }

  const colorClasses = {
    gray: 'border-gray-300',
    green: 'border-green-300',
    blue: 'border-blue-300',
    red: 'border-red-300',
    yellow: 'border-yellow-300'
  }

  return (
    <div
      className={cn(
        'border-0 border-t',
        orientationClasses[orientation],
        variantClasses[variant],
        colorClasses[color],
        className
      )}
    />
  )
}
