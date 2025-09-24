import { cn } from '@/lib/utils'

interface ToolbarProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'compact' | 'spacious'
}

export default function Toolbar({
  children,
  className,
  variant = 'default'
}: ToolbarProps) {
  const variantClasses = {
    default: 'px-4 py-3',
    compact: 'px-3 py-2',
    spacious: 'px-6 py-4'
  }

  return (
    <div
      className={cn(
        'bg-white border-b border-gray-200 flex items-center justify-between',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  )
}

interface ToolbarGroupProps {
  children: React.ReactNode
  className?: string
}

export function ToolbarGroup({ children, className }: ToolbarGroupProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {children}
    </div>
  )
}

interface ToolbarTitleProps {
  children: React.ReactNode
  className?: string
}

export function ToolbarTitle({ children, className }: ToolbarTitleProps) {
  return (
    <h2 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h2>
  )
}
