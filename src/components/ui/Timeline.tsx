'use client'

import { cn } from '@/lib/utils'

interface TimelineItem {
  id: string
  title: string
  description?: string
  date?: string
  icon?: string
  status?: 'completed' | 'current' | 'upcoming'
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'gray'
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
  orientation?: 'left' | 'right' | 'center'
}

export default function Timeline({
  items,
  className,
  orientation = 'left'
}: TimelineProps) {
  const orientationClasses = {
    left: 'pl-8',
    right: 'pr-8',
    center: 'px-8'
  }

  const getStatusColor = (status: TimelineItem['status'], color: TimelineItem['color']) => {
    if (status === 'completed') {
      return 'bg-green-500 border-green-500 text-white'
    }
    if (status === 'current') {
      return 'bg-blue-500 border-blue-500 text-white'
    }
    
    const colorClasses = {
      green: 'bg-green-100 border-green-300 text-green-600',
      blue: 'bg-blue-100 border-blue-300 text-blue-600',
      red: 'bg-red-100 border-red-300 text-red-600',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-600',
      gray: 'bg-gray-100 border-gray-300 text-gray-600'
    }
    
    return colorClasses[color || 'gray']
  }

  return (
    <div className={cn('relative', className)}>
      {/* Timeline Line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
      
      <div className="space-y-8">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn('relative flex items-start', orientationClasses[orientation])}
          >
            {/* Timeline Dot */}
            <div
              className={cn(
                'absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium',
                getStatusColor(item.status, item.color)
              )}
            >
              {item.icon || (index + 1)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.title}
                </h3>
                {item.date && (
                  <time className="text-sm text-gray-500">
                    {item.date}
                  </time>
                )}
              </div>
              
              {item.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
