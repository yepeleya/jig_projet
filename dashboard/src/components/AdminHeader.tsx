'use client'

import { useAdminStore } from '@/store/adminStore'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import { formatFullName, getInitials } from '@/utils/formatters'
import Logo from './Logo'

export default function AdminHeader() {
  const { admin, logout } = useAdminStore()

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout()
      localStorage.clear()
      window.location.href = '/'
    }
  }

  if (!admin) return null

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Logo variant="red" size="sm" />
            <div className="shrink-0">
              <h1 className="text-xl font-bold text-gray-900">JIG 2026</h1>
              <p className="text-sm text-gray-600">Dashboard Administrateur</p>
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationBell />

            {/* Profil utilisateur */}
            <div className="flex items-center space-x-3">
              <Link 
                href="/admin/profile"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-semibold text-sm">
                    {getInitials(admin.prenom, admin.nom)}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {formatFullName(admin.prenom, admin.nom)}
                  </p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
              </Link>

              {/* Bouton de déconnexion */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}