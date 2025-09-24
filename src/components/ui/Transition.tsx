'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TransitionProps {
  children: React.ReactNode
  show: boolean
  duration?: number
  className?: string
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
}

export default function Transition({
  children,
  show,
  duration = 300,
  className,
  enter = 'transition-all duration-300 ease-in-out',
  enterFrom = 'opacity-0 transform scale-95',
  enterTo = 'opacity-100 transform scale-100',
  leave = 'transition-all duration-300 ease-in-out',
  leaveFrom = 'opacity-100 transform scale-100',
  leaveTo = 'opacity-0 transform scale-95'
}: TransitionProps) {
  const [isVisible, setIsVisible] = useState(show)
  const [isEntering, setIsEntering] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setIsEntering(true)
      setIsLeaving(false)
      
      const timer = setTimeout(() => {
        setIsEntering(false)
      }, duration)

      return () => clearTimeout(timer)
    } else {
      setIsLeaving(true)
      setIsEntering(false)
      
      const timer = setTimeout(() => {
        setIsVisible(false)
        setIsLeaving(false)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        enter,
        isEntering && enterFrom,
        !isEntering && !isLeaving && enterTo,
        leave,
        isLeaving && leaveFrom,
        isLeaving && leaveTo,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}
