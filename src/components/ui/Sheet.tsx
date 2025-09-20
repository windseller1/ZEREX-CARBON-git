'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export default function Sheet({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  size = 'md',
  className
}: SheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sideClasses = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full'
  }

  const sizeClasses = {
    sm: side === 'left' || side === 'right' ? 'w-80' : 'h-80',
    md: side === 'left' || side === 'right' ? 'w-96' : 'h-96',
    lg: side === 'left' || side === 'right' ? 'w-[32rem]' : 'h-[32rem]',
    xl: side === 'left' || side === 'right' ? 'w-[40rem]' : 'h-[40rem]',
    full: side === 'left' || side === 'right' ? 'w-full' : 'h-full'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        className={cn(
          'fixed bg-white shadow-xl transition-transform',
          sideClasses[side],
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || true) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="ml-auto"
            >
              ✕
            </Button>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
