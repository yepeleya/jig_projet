'use client'

import { useEffect, useState } from 'react'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Utiliser un timeout pour éviter les problèmes d'hydratation
    const timeout = setTimeout(() => {
      setIsClient(true)
    }, 0)
    
    return () => clearTimeout(timeout)
  }, [])

  if (!isClient) {
    return <>{fallback}</>
  }

  return <>{children}</>
}