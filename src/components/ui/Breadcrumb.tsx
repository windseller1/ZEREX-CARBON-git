import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: string
}

export default function Breadcrumb({
  items,
  className,
  separator = '/'
}: BreadcrumbProps) {
  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <span className="text-gray-400 mx-2">{separator}</span>
            )}
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'text-sm font-medium',
                  item.current
                    ? 'text-gray-500'
                    : 'text-gray-700 hover:text-green-600 transition-colors cursor-pointer'
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
