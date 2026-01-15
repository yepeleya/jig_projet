'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useJuryStore } from '@/store/juryStore'
import { toast } from 'react-hot-toast'
import { Logo } from './Logo'
import { Footer } from './Footer'
import { JIG_CLASSES } from '@/lib/design-system'
import { 
  Home, 
  Vote, 
  MessageSquare, 
  User, 
  LogOut,
  BarChart3,
  Menu,
  X,
  Eye
} from 'lucide-react'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const jury = useJuryStore((state) => state.jury)
  const logout = useJuryStore((state) => state.logout)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Déconnexion réussie')
    router.push('/')
  }

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/dashboard',
      icon: Home,
      current: pathname === '/dashboard'
    },
    {
      name: 'Mes Votes',
      href: '/dashboard/votes',
      icon: Vote,
      current: pathname === '/dashboard/votes'
    },
    {
      name: 'Mes Commentaires',
      href: '/dashboard/commentaires',
      icon: MessageSquare,
      current: pathname === '/dashboard/commentaires'
    },
    {
      name: 'Suivi Projets',
      href: '/dashboard/suivi-projets',
      icon: Eye,
      current: pathname === '/dashboard/suivi-projets'
    },
    {
      name: 'Résultats',
      href: '/dashboard/resultats',
      icon: BarChart3,
      current: pathname === '/dashboard/resultats'
    },
    {
      name: 'Mon Profil',
      href: '/dashboard/profil',
      icon: User,
      current: pathname === '/dashboard/profil'
    }
  ]

  if (!jury) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <header className={`${JIG_CLASSES.bgSecondary} shadow-lg border-b-4 border-[#9E1B32]`}>
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-white hover:bg-gray-600 transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Logo variant="white" size="md" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">Interface Jury</h1>
              <p className="text-sm text-gray-300">JIG 2026 - Plateforme d&apos;évaluation</p>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">
                {jury.prenom} {jury.nom}
              </p>
              <p className="text-xs text-gray-300 capitalize">{jury.role}</p>
            </div>
            <div className={`w-10 h-10 ${JIG_CLASSES.bgPrimary} rounded-full flex items-center justify-center`}>
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transition-transform duration-300 ease-in-out lg:transition-none`}>
          <div className="flex flex-col h-full">
            {/* Navigation Links */}
            <div className="flex-1 p-6">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        item.current
                          ? `${JIG_CLASSES.bgPrimary} text-white shadow-lg`
                          : `text-[#333333] hover:bg-gray-100 hover:text-[#9E1B32]`
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${item.current ? 'text-white' : 'text-gray-500'}`} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}