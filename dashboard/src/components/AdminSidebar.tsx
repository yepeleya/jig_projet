'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminStore } from '@/store/adminStore'
import { 
  LayoutDashboard, 
  Users, 
  Scale, 
  FolderOpen, 
  Vote, 
  FileText, 
  LogOut,
  Menu,
  X,
  Shield,
  User,
  TrendingUp
} from 'lucide-react'
import { useState, useEffect } from 'react'

const menuItems = [
  {
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    label: 'Tableau de bord',
    description: 'Vue d\'ensemble et statistiques'
  },
  {
    href: '/admin/participants',
    icon: Users,
    label: 'Participants',
    description: 'Gestion des étudiants'
  },
  {
    href: '/admin/jurys',
    icon: Scale,
    label: 'Jurys',
    description: 'Gestion des jurys'
  },
  {
    href: '/admin/projets',
    icon: FolderOpen,
    label: 'Projets',
    description: 'Validation des projets'
  },
  {
    href: '/admin/votes',
    icon: Vote,
    label: 'Votes',
    description: 'Suivi des votes'
  },
  {
    href: '/admin/resultats-votes',
    icon: TrendingUp,
    label: 'Résultats',
    description: 'Classements et analyses'
  },
  {
    href: '/admin/pages',
    icon: FileText,
    label: 'Contenu',
    description: 'Gestion du contenu'
  },
  {
    href: '/admin/profile',
    icon: User,
    label: 'Mon Profil',
    description: 'Gestion du profil administrateur'
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { admin, logout } = useAdminStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [])

  // Attendre l'hydratation côté client pour éviter les erreurs d'hydratation
  if (!isClient) {
    return (
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <div className="p-2 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-600 w-10 h-10" />
      </div>
    )
  }

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout()
      // Nettoyer complètement le localStorage
      localStorage.clear()
      // Redirection vers la page de connexion
      window.location.href = '/'
    }
  }

  return (
    <>
      {/* Mobile menu button - version sans ClientOnly pour éviter l'hydratation */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - version simplifiée pour éviter l'hydratation */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-40 w-80
        transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarContent 
          pathname={pathname} 
          admin={admin} 
          handleLogout={handleLogout}
          onMenuItemClick={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Styles CSS personnalisés pour le scroll */}
      <style jsx global>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        .sidebar-scroll:hover::-webkit-scrollbar-thumb {
          background: #9ca3af;
        }
        
        /* Indicateur de scroll */
        .scroll-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(transparent, rgba(255, 255, 255, 0.8));
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        .scroll-indicator.hidden {
          opacity: 0;
        }
      `}</style>
    </>
  )
}

// Composant séparé pour le contenu de la sidebar
function SidebarContent({ pathname, admin, handleLogout, onMenuItemClick }: {
  pathname: string
  admin: { prenom?: string; nom?: string; email?: string } | null
  handleLogout: () => void
  onMenuItemClick?: () => void
}) {
  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin JIG 2026</h1>
            <p className="text-sm text-gray-500">Dashboard d&apos;administration</p>
          </div>
        </div>
      </div>

      {/* User info */}
      {admin && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-semibold text-sm">
                {admin.prenom?.[0] || 'A'}{admin.nom?.[0] || 'D'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {admin.prenom || 'Admin'} {admin.nom || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{admin.email || 'admin@example.com'}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                Administrateur
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation avec scroll */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll p-4 space-y-2 max-h-[calc(100vh-280px)]">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMenuItemClick}
              className={`
                flex items-center p-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`
                w-5 h-5 mr-3 transition-colors
                ${isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-500'}
              `} />
              <div className="flex-1">
                <div className={`text-sm font-medium ${isActive ? 'text-red-700' : ''}`}>
                  {item.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-red-600 rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer avec logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 group"
        >
          <LogOut className="w-5 h-5 mr-3 group-hover:text-red-600" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
        
        {/* Information de version */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Dashboard v1.0 - JIG 2026
          </p>
        </div>
      </div>
    </>
  )
}