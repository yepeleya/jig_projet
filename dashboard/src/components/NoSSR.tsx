'use client'

import { type ReactNode } from 'react'

interface NoSSRProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  // Approche simple : vérifier si on est côté client
  const isClient = typeof window !== 'undefined'

  // Rendu côté client uniquement
  if (!isClient) {
    return <>{fallback}</>
  }

  return <>{children}</>
}