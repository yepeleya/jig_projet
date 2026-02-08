'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'

interface StoreHydrationWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function StoreHydrationWrapper({ children, fallback = null }: StoreHydrationWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  useEffect(() => {
    // Attendre que Zustand soit complètement hydraté
    if (hasHydrated) {
      setIsHydrated(true)
    }
  }, [hasHydrated])

  useEffect(() => {
    // Forcer l'hydratation si elle n'est pas encore effectuée
    const timeout = setTimeout(() => {
      setIsHydrated(true)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  if (!isHydrated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}