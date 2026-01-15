'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAdminStore } from '@/store/adminStore'
import AdminHeader from '@/components/AdminHeader'
import LogoutShortcut from '@/components/LogoutShortcut'
import { Toaster } from 'react-hot-toast'

// Import AdminSidebar sans SSR pour éviter les erreurs d'hydratation
const AdminSidebar = dynamic(() => import('@/components/AdminSidebar'), { 
  ssr: false,
  loading: () => (
    <div className="lg:hidden fixed top-4 left-4 z-50">
      <div className="p-2 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-600 w-10 h-10" />
    </div>
  )
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { admin, isAuthenticated } = useAdminStore()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isClient && !isAuthenticated()) {
      router.push('/')
    }
  }, [admin, isAuthenticated, router, isClient])

  // Attendre l'hydratation côté client pour éviter les erreurs d'hydratation
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification des autorisations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <LogoutShortcut />
      
      {/* Main content */}
      <div className="lg:ml-80 min-h-screen">
        {/* Header avec bouton de déconnexion */}
        <AdminHeader />
        
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          }
        }}
      />
    </div>
  )
}