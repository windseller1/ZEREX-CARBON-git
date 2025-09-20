'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AnimateProps {
  children: React.ReactNode
  animation?: 'fadeIn' | 'slideIn' | 'zoomIn' | 'bounce' | 'pulse' | 'spin' | 'ping' | 'wiggle'
  duration?: number
  delay?: number
  className?: string
  trigger?: 'onMount' | 'onHover' | 'onClick' | 'onScroll'
}

export default function Animate({
  children,
  animation = 'fadeIn',
  duration = 300,
  delay = 0,
  className,
  trigger = 'onMount'
}: AnimateProps) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger === 'onMount') {
      const timer = setTimeout(() => {
        setIsActive(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [trigger, delay])

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
      setIsActive(!isActive)
    }
  }

  const animationClasses = {
    fadeIn: 'opacity-0 animate-fade-in',
    slideIn: 'transform translate-x-full animate-slide-in',
    zoomIn: 'transform scale-0 animate-zoom-in',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    ping: 'animate-ping',
    wiggle: 'animate-wiggle'
  }

  const eventHandlers = {
    onHover: { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
    onClick: { onClick: handleClick },
    onScroll: {},
    onMount: {}
  }

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        isActive && animationClasses[animation],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
      {...eventHandlers[trigger]}
    >
      {children}
    </div>
  )
}
