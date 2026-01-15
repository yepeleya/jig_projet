'use client'

import { type ReactNode } from 'react'

interface NoSSRProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  // Approche simple et robuste : vérifier si on est côté client
  if (typeof window === 'undefined') {
    return <>{fallback}</>
  }

  return <>{children}</>
}