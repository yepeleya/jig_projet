'use client'

import { Suspense } from 'react'
import AdminProfile from '@/components/AdminProfile'
import { FiUser, FiLoader } from 'react-icons/fi'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de page */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          </div>
          <p className="text-gray-600">
            Gérez vos informations personnelles et paramètres de sécurité
          </p>
        </div>

        {/* Composant de profil avec Suspense pour le chargement */}
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <FiLoader className="w-6 h-6 animate-spin" />
              <span>Chargement du profil...</span>
            </div>
          </div>
        }>
          <AdminProfile />
        </Suspense>
      </div>
    </div>
  )
}