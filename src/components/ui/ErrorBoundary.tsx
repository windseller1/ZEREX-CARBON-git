'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  className?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className={cn('flex flex-col items-center justify-center p-8', this.props.className)}>
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            حدث خطأ غير متوقع
          </h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو تحديث الصفحة.
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
            >
              تحديث الصفحة
            </Button>
            <Button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              variant="outline"
            >
              المحاولة مرة أخرى
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
