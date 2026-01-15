import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface JuryUser {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
}

interface JuryState {
  jury: JuryUser | null
  token: string | null
  setJury: (jury: JuryUser, token: string) => void
  updateJury: (updates: Partial<JuryUser>) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useJuryStore = create<JuryState>()(
  persist(
    (set, get) => ({
      jury: null,
      token: null,
      setJury: (jury, token) => set({ jury, token }),
      updateJury: (updates) => set((state) => ({
        jury: state.jury ? { ...state.jury, ...updates } : null
      })),
      logout: () => set({ jury: null, token: null }),
      isAuthenticated: () => {
        const { jury, token } = get()
        return !!(jury && token)
      }
    }),
    {
      name: 'jury-storage'
    }
  )
)