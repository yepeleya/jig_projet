'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/api'

/**
 * Hook personnalisé pour l'authentification
 * Fournit des méthodes pratiques pour la gestion de l'auth
 */
export function useAuth() {
  const router = useRouter()
  const store = useAuthStore()

  // Login avec redirection automatique
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      
      if (response.success) {
        store.setAuth(response.data.user, response.data.token)
        
        // Redirection selon le rôle
        switch (response.data.user.role) {
          case 'ADMIN':
            router.push('/dashboard')
            break
          case 'JURY':
            router.push('/jury')
            break
          default:
            router.push('/')
        }
        
        return { success: true, message: 'Connexion réussie !' }
      } else {
        return { success: false, message: response.message || 'Erreur de connexion' }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      return { success: false, message: 'Erreur de connexion' }
    }
  }

  // Register avec message de succès
  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      
      if (response.success) {
        return { success: true, message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' }
      } else {
        return { success: false, message: response.message || 'Erreur lors de l\'inscription' }
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      return { success: false, message: 'Erreur lors de l\'inscription' }
    }
  }

  // Logout avec redirection
  const logout = () => {
    store.logout()
    router.push('/')
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return store.user?.role === role
  }

  // Vérifier si l'utilisateur a l'un des rôles spécifiés
  const hasAnyRole = (roles) => {
    return roles.includes(store.user?.role)
  }

  // Rediriger selon le rôle de l'utilisateur
  const redirectToUserArea = () => {
    if (!store.isAuthenticated) {
      router.push('/login')
      return
    }

    switch (store.user?.role) {
      case 'ADMIN':
        router.push('/dashboard')
        break
      case 'JURY':
        router.push('/jury')
        break
      default:
        router.push('/')
    }
  }

  return {
    // État d'authentification
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    
    // Actions
    login,
    register,
    logout,
    
    // Utilitaires
    hasRole,
    hasAnyRole,
    redirectToUserArea,
  }
}