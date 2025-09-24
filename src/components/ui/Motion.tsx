'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MotionProps {
  children: React.ReactNode
  initial?: Record<string, any>
  animate?: Record<string, any>
  exit?: Record<string, any>
  transition?: Record<string, any>
  className?: string
  trigger?: 'onMount' | 'onHover' | 'onClick' | 'onScroll'
}

export default function Motion({
  children,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: -20 },
  transition = { duration: 0.3, ease: 'easeOut' },
  className,
  trigger = 'onMount'
}: MotionProps) {
  const [isActive, setIsActive] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (trigger === 'onMount') {
      setIsActive(true)
    }
  }, [trigger])

  const handleMouseEnter = () => {
    if (trigger === 'onHover') {
      setIsActive(true)
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'onHover') {
      setIsActive(false)
    }
  }

  const handleClick = () => {
    if (trigger === 'onClick') {
      if (isActive) {
        setIsExiting(true)
        setTimeout(() => {
          setIsActive(false)
          setIsExiting(false)
        }, transition.duration * 1000)
      } else {
        setIsActive(true)
      }
    }
  }

  const getStyle = () => {
    if (isExiting) {
      return {
        ...exit,
        transition: `all ${transition.duration}s ${transition.ease}`
      }
    }
    
    if (isActive) {
      return {
        ...animate,
        transition: `all ${transition.duration}s ${transition.ease}`
      }
    }
    
    return {
      ...initial,
      transition: `all ${transition.duration}s ${transition.ease}`
    }
  }

  const eventHandlers = {
    onHover: { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
    onClick: { onClick: handleClick },
    onScroll: {},
    onMount: {}
  }

  return (
    <div
      className={cn('', className)}
      style={getStyle()}
      {...eventHandlers[trigger]}
    >
      {children}
    </div>
  )
}
