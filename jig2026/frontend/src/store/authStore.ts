import { create } from 'zustand'

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

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hasHydrated: true, // Désactivé pendant debug SSR
  
  setAuth: (user: User, token: string) => {
    set({ user, token, isAuthenticated: true })
  },
  
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
  },
  
  initAuth: () => {
    // Désactivé pour éviter problèmes SSR
  }
}))