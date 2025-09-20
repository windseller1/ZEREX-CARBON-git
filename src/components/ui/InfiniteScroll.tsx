'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import Spinner from './Spinner'

interface InfiniteScrollProps {
  children: React.ReactNode
  hasMore: boolean
  loadMore: () => void
  threshold?: number
  className?: string
  loadingComponent?: React.ReactNode
  endComponent?: React.ReactNode
}

export default function InfiniteScroll({
  children,
  hasMore,
  loadMore,
  threshold = 100,
  className,
  loadingComponent,
  endComponent
}: InfiniteScrollProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasReachedEnd, setHasReachedEnd] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || hasReachedEnd) return

    setIsLoading(true)
    try {
      await loadMore()
    } catch (error) {
      console.error('Error loading more items:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, hasReachedEnd, loadMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !isLoading) {
          handleLoadMore()
        }
      },
      {
        rootMargin: `${threshold}px`
      }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [handleLoadMore, hasMore, isLoading, threshold])

  useEffect(() => {
    if (!hasMore && !isLoading) {
      setHasReachedEnd(true)
    }
  }, [hasMore, isLoading])

  return (
    <div className={cn('space-y-4', className)}>
      {children}
      
      {hasMore && !hasReachedEnd && (
        <div ref={observerRef} className="flex justify-center py-4">
          {loadingComponent || (
            <div className="flex items-center space-x-2">
              <Spinner size="sm" />
              <span className="text-sm text-gray-500">جاري التحميل...</span>
            </div>
          )}
        </div>
      )}
      
      {hasReachedEnd && endComponent && (
        <div className="flex justify-center py-4">
          {endComponent}
        </div>
      )}
    </div>
  )
}
