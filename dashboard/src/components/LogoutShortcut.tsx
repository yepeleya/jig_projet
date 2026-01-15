'use client'

import { useEffect } from 'react'
import { useAdminStore } from '@/store/adminStore'

export default function LogoutShortcut() {
  const { logout } = useAdminStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + Shift + L pour déconnexion rapide
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault()
        if (window.confirm('Déconnexion rapide - Êtes-vous sûr ?')) {
          logout()
          localStorage.clear()
          window.location.href = '/'
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [logout])

  return null // Ce composant n'affiche rien, il écoute juste les raccourcis
}