'use client'

import { ReactNode } from 'react'
import { useHydrationFix } from '@/hooks/useHydrationFix'

interface HydrationWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Composant wrapper pour éviter les erreurs d'hydratation
 * Affiche le fallback côté serveur, les children côté client
 */
export function HydrationWrapper({ children, fallback = null }: HydrationWrapperProps) {
  const isMounted = useHydrationFix()

  if (!isMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}