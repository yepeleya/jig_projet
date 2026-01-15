'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useJuryStore } from '@/store/juryStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const isAuthenticated = useJuryStore((state) => state.isAuthenticated())
  const jury = useJuryStore((state) => state.jury)

  useEffect(() => {
    if (!isAuthenticated || !jury) {
      router.push('/')
      return
    }

    // Vérifier le rôle avec une protection supplémentaire
    if (!jury?.role || (jury.role !== 'JURY' && jury.role !== 'ADMIN')) {
      router.push('/')
      return
    }
  }, [isAuthenticated, jury, router])

  if (!isAuthenticated || !jury) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}