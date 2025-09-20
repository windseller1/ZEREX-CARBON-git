'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: React.ReactNode
  container?: Element | null
  className?: string
}

export default function Portal({ children, container, className }: PortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const targetContainer = container || document.body

  return createPortal(
    <div className={className}>
      {children}
    </div>,
    targetContainer
  )
}
