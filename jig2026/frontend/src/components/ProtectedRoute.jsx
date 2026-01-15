'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

/**
 * Composant de protection des routes
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 * Peut également vérifier des rôles spécifiques
 */
export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], // Rôles autorisés (vide = tous les utilisateurs connectés)
  requireAuth = true, // Si false, la route est accessible sans authentification
  fallbackPath = '/login' // Page de redirection si pas d'accès
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Attendre que le store soit initialisé
    if (isLoading) return

    // Si l'authentification n'est pas requise, laisser passer
    if (!requireAuth) return

    // Si pas authentifié, rediriger vers la page de connexion
    if (!isAuthenticated) {
      router.push(fallbackPath)
      return
    }

    // Si des rôles spécifiques sont requis, vérifier
    if (allowedRoles.length > 0 && user) {
      if (!allowedRoles.includes(user.role)) {
        // Redirection selon le rôle actuel
        switch (user.role) {
          case 'ADMIN':
            router.push('/dashboard')
            break
          case 'JURY':
            router.push('/jury')
            break
          default:
            router.push('/')
        }
        return
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, requireAuth, fallbackPath, router])

  // Affichage de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jig-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des autorisations...</p>
        </div>
      </div>
    )
  }

  // Si pas d'authentification requise, afficher le contenu
  if (!requireAuth) {
    return children
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null
  }

  // Si des rôles sont requis et l'utilisateur n'a pas le bon rôle
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null
  }

  // Tout est OK, afficher le contenu protégé
  return children
}