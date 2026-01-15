import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminUser {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
}

interface AdminState {
  admin: AdminUser | null
  token: string | null
  setAdmin: (admin: AdminUser, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      setAdmin: (admin, token) => {
        set({ admin, token })
        localStorage.setItem('admin-token', token)
        localStorage.setItem('admin-user', JSON.stringify(admin))
      },
      logout: () => {
        set({ admin: null, token: null })
        localStorage.removeItem('admin-token')
        localStorage.removeItem('admin-user')
      },
      isAuthenticated: () => {
        const { admin, token } = get()
        return !!(admin && token && admin.role === 'ADMIN')
      }
    }),
    {
      name: 'admin-storage'
    }
  )
)