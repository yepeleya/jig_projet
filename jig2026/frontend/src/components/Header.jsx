'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Menu, X, LogIn, UserPlus, LogOut, Settings } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getRoleLabel, getAcademicInfo } from '@/utils/permissions'
import Logo from './Logo'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  // Effect pour détecter le scroll et ajouter l'ombre
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Effect pour fermer le menu utilisateur quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Programme', href: '/programme' },
    { name: 'Galerie', href: '/galerie' },
    { name: 'Vote', href: '/voter' },
    { name: 'Classement', href: '/classement' },
    { name: 'Soumettre', href: '/soumettre' },
    ...(isAuthenticated && user?.role === 'ETUDIANT' ? [{ name: 'Mes Projets', href: '/mes-projets' }] : []),
    ...(isAuthenticated ? [{ name: 'Mes Suivis', href: '/mes-suivis' }] : []),
    { name: 'Contact', href: '/contact' },
  ]

  // Gérer la déconnexion
  const handleLogout = () => {
    logout()
    router.push('/')
    setShowUserMenu(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gradient-to-r from-jig-primary to-red-600 shadow-lg' 
        : 'bg-gradient-to-r from-jig-primary to-red-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo JIG 2026 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <Logo variant="white" size="md" />
              <div className="text-white">
                <span className="text-xl font-bold">JIG 2026</span>
                <p className="text-xs text-red-100">Journée de l&apos;Infographiste</p>
              </div>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Zone utilisateur */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 text-white hover:bg-white/20 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user?.prenom} {user?.nom}
                      </span>
                      {getAcademicInfo(user) && (
                        <span className="text-xs text-white/70">
                          {getAcademicInfo(user)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {user?.role === 'ETUDIANT' ? '🎓' : 
                       user?.role === 'UTILISATEUR' ? '👤' :
                       user?.role === 'JURY' ? '⚖️' :
                       user?.role === 'ADMIN' ? '👑' : ''}
                      {getRoleLabel(user?.role)}
                    </span>
                  </button>
                  
                  {/* Menu déroulant utilisateur */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      )}
                      {user?.role === 'JURY' && (
                        <Link
                          href="/jury"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Panel Jury
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 text-white hover:bg-white/20 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Connexion</span>
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-jig-primary rounded-full px-4 py-2 flex items-center space-x-2 hover:bg-red-50 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm font-medium">Inscription</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-red-200 focus:outline-none focus:text-red-200 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-red-400">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-red-200 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Zone utilisateur mobile */}
              <div className="pt-4 pb-3 border-t border-red-400">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-3 py-2">
                      <User className="w-5 h-5 text-white mr-2" />
                      <div className="text-white">
                        <div className="text-sm font-medium">
                          {user?.prenom} {user?.nom}
                        </div>
                        <div className="text-xs text-red-200">{user?.role}</div>
                      </div>
                    </div>
                    
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/dashboard"
                        className="flex items-center px-3 py-2 text-white hover:text-red-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    )}
                    
                    {user?.role === 'JURY' && (
                      <Link
                        href="/jury"
                        className="flex items-center px-3 py-2 text-white hover:text-red-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Panel Jury
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center px-3 py-2 text-white hover:text-red-200 w-full text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center px-3 py-2 text-white hover:text-red-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center px-3 py-2 text-white hover:text-red-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ligne fine blanche sous le header */}
      <div className="h-px bg-white/20"></div>
    </header>
  )
}