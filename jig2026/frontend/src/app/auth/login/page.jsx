'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Page de redirection pour la compatibilité des routes
 * Redirige /auth/login vers /login (qui utilise le groupe de routes (auth))
 */
export default function AuthLoginRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirection immédiate vers la vraie page de login
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirection vers la page de connexion...</p>
      </div>
    </div>
  )
}