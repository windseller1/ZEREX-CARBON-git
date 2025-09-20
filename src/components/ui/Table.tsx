import { cn } from '@/lib/utils'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string
}

export default function Table({ className, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn('min-w-full divide-y divide-gray-200', className)}
        {...props}
      />
    </div>
  )
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn('bg-gray-50', className)}
      {...props}
    />
  )
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn('bg-white divide-y divide-gray-200', className)}
      {...props}
    />
  )
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
}

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn('hover:bg-gray-50', className)}
      {...props}
    />
  )
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  className?: string
}

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        className
      )}
      {...props}
    />
  )
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  className?: string
}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)}
      {...props}
    />
  )
}

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      className={cn('bg-gray-50', className)}
      {...props}
    />
  )
}
