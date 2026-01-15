import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services/api'

interface User {
  id: number
  nom: string
  prenom: string
  email: string
  role: 'ADMIN' | 'JURY' | 'ETUDIANT'
  telephone?: string
  filiere?: string
  niveau?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  initAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user: User, token: string) => {
        // Sauvegarder dans le service API aussi
        authService.setToken(token)
        set({ user, token, isAuthenticated: true })
      },
      
      logout: () => {
        // Nettoyer d'abord le state local
        set({ user: null, token: null, isAuthenticated: false })
        // Puis nettoyer le service API (qui ne fera plus d'appel réseau)
        authService.logout()
      },
      
      initAuth: () => {
        // Vérifier si l'utilisateur est déjà connecté via le service API
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser()
          const token = authService.getToken()
          if (user && token) {
            set({ user, token, isAuthenticated: true })
          }
        }
      }
    }),
    {
      name: 'jig-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)