'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Menu, X, LogIn, UserPlus, LogOut, Settings, Home, Calendar, Image, Vote, Award, Upload, FolderOpen, Eye } from 'lucide-react'
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

  // Effect pour fermer le menu mobile quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileMenuOpen])

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

  // Configuration de navigation avec icônes
  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Programme', href: '/programme', icon: Calendar },
    { name: 'Galerie', href: '/galerie', icon: Image },
    { name: 'Vote', href: '/voter', icon: Vote },
    { name: 'Classement', href: '/classement', icon: Award },
    { name: 'Soumettre', href: '/soumettre', icon: Upload, authRequired: true },
    ...(isAuthenticated && user?.role === 'ETUDIANT' ? [{ name: 'Mes Projets', href: '/mes-projets', icon: FolderOpen }] : []),
    ...(isAuthenticated ? [{ name: 'Mes Suivis', href: '/mes-suivis', icon: Eye }] : []),
  ]

  // Gérer la déconnexion
  const handleLogout = () => {
    logout()
    router.push('/')
    setShowUserMenu(false)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Header principal */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-jig-primary to-red-600 shadow-lg backdrop-blur-sm' 
          : 'bg-gradient-to-r from-jig-primary to-red-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo JIG 2026 */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3">
                <Logo variant="white" size="md" />

              </Link>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white hover:text-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group flex items-center space-x-1"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Zone utilisateur Desktop */}
            <div className="hidden lg:block">
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

            {/* Bouton menu mobile (maintenant visible dès md) */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-red-200 focus:outline-none focus:text-red-200 transition-colors p-2"
                aria-label="Menu de navigation"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ligne fine blanche sous le header */}
        <div className="h-px bg-white/20"></div>
      </header>

      {/* Overlay sombre pour mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menu mobile - Offcanvas style */}
      <div className={`mobile-menu-container fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-gradient-to-b from-jig-primary to-red-600 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header du menu mobile */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <Logo variant="white" size="sm" />
            <div className="text-white">
              <span className="text-lg font-bold">JIG 2026</span>
              <p className="text-xs text-red-100">Menu</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white hover:text-red-200 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Zone utilisateur mobile */}
        {isAuthenticated && (
          <div className="p-4 border-b border-white/20 bg-white/10">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-white">
                <div className="text-sm font-medium">
                  {user?.prenom} {user?.nom}
                </div>
                <div className="text-xs text-red-200 flex items-center space-x-2">
                  <span>{getRoleLabel(user?.role)}</span>
                  <span>{user?.role === 'ETUDIANT' ? '🎓' : 
                         user?.role === 'UTILISATEUR' ? '👤' :
                         user?.role === 'JURY' ? '⚖️' :
                         user?.role === 'ADMIN' ? '👑' : ''}</span>
                </div>
                {getAcademicInfo(user) && (
                  <div className="text-xs text-white/70 mt-1">
                    {getAcademicInfo(user)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation mobile */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 text-white hover:text-red-200 hover:bg-white/10 px-3 py-3 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Liens spéciaux pour rôles */}
          {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'JURY') && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-white/70 text-sm font-medium mb-3 px-3">Administration</h3>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 text-white hover:text-red-200 hover:bg-white/10 px-3 py-3 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              )}
              {user?.role === 'JURY' && (
                <Link
                  href="/jury"
                  className="flex items-center space-x-3 text-white hover:text-red-200 hover:bg-white/10 px-3 py-3 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Panel Jury</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Footer du menu mobile */}
        <div className="p-4 border-t border-white/20 bg-white/5">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-white hover:text-red-200 hover:bg-white/10 px-3 py-3 rounded-md text-base font-medium transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                className="flex items-center space-x-3 text-white hover:text-red-200 hover:bg-white/10 px-3 py-3 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                <span>Connexion</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center space-x-3 bg-white text-jig-primary hover:bg-red-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserPlus className="w-5 h-5" />
                <span>Inscription</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
