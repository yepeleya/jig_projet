'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

/**
 * Composant pour initialiser l'état d'authentification au démarrage
 * Se charge de récupérer le token et les données utilisateur du localStorage
 */
export default function AuthInitializer() {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    // Initialiser l'authentification au démarrage de l'application
    initAuth()
  }, [initAuth])

  // Ce composant ne rend rien, il fait juste l'initialisation
  return null
}