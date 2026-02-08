import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  nom: string
  prenom: string
  email: string
  role: 'ADMIN' | 'JURY' | 'ETUDIANT'
  telephone?: string
  ecole?: string
  filiere?: string
  niveau?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  hasHydrated: boolean
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
      hasHydrated: false,
      
      setAuth: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true })
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
      
      initAuth: () => {
        // Désactivé temporairement pour éviter les problèmes SSR
      }
    }),
    {
      name: 'jig-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true })
      }
    }
  )
)