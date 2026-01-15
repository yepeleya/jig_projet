'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function AuthInitializer() {
  const initAuth = useAuthStore((state) => state.initAuth)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initAuth()
    }
  }, [initAuth])

  // Ce composant ne rend rien, il initialise juste l'auth
  return null
}