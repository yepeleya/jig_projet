'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope, 
  FaLock, 
  FaSignInAlt,
  FaSpinner,

  FaArrowLeft
} from 'react-icons/fa'
import AOS from 'aos'
import { authService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { useNotification } from '@/hooks/useNotification'
import NotificationToast from '@/components/NotificationToast'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const { notification, showNotification, hideNotification } = useNotification()

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    if (!formData.motDePasse.trim()) {
      newErrors.motDePasse = 'Le mot de passe est requis'
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)

    try {
      console.log('🚀 Tentative de connexion avec:', formData)
      const response = await authService.login(formData)
      console.log('📨 Réponse API:', response)
      
      if (response.success) {
        showNotification('success', `Connexion réussie ! Bienvenue ${response.data.user.prenom}`)
        
        // Sauvegarder dans le store Zustand
        setAuth(response.data.user, response.data.token)
        
        // Redirection selon le rôle
        setTimeout(() => {
          switch (response.data.user.role) {
            case 'ADMIN':
              router.push('/dashboard')
              break
            case 'JURY':
              router.push('/jury')
              break
            default:
              router.push('/')
          }
        }, 1500)
      } else {
        console.log('❌ Échec de connexion:', response.message)
        showNotification('error', response.message || 'Erreur lors de la connexion')
      }
    } catch (error) {
      console.error('💥 Exception lors de la connexion:', error)
      console.error('💥 Stack trace:', error.stack)
      showNotification('error', 'Erreur de connexion. Vérifiez vos identifiants.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* Notification Toast */}
      <NotificationToast notification={notification} onClose={hideNotification} />

      {/* Partie gauche - Image et contenu inspirant */}
      <div className="relative bg-gradient-to-br from-jig-primary via-red-600 to-red-700 flex items-center justify-center p-8 md:p-12">
        
        {/* Effet de texture et motifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-lg animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Contenu */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white text-center max-w-md"
        >
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <Logo variant="white" size="xl" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Bienvenue à la <span className="text-yellow-300">JIG 2026</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-red-100 mb-8 leading-relaxed">
            Connectez-vous pour découvrir les projets créatifs des étudiants de l&apos;ISTC Polytechnique
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-red-200">
            <div className="w-12 h-px bg-red-200"></div>
            <span className="text-sm font-medium">Journée de l&apos;Infographiste</span>
            <div className="w-12 h-px bg-red-200"></div>
          </div>
        </motion.div>
      </div>

      {/* Partie droite - Formulaire de connexion */}
      <div className="bg-gray-50 flex items-center justify-center p-8 md:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-md"
        >
          
          {/* Header du formulaire */}
          <div className="text-center mb-8" data-aos="fade-up">
            <div className="flex justify-center mb-4">
              <Logo variant="red" size="lg" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Connexion
            </h2>
            <p className="text-gray-600">
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6" data-aos="fade-up" data-aos-delay="200">
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="votre.email@exemple.com"
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="motDePasse"
                  name="motDePasse"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.motDePasse}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-200 ${
                    errors.motDePasse ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.motDePasse && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.motDePasse}
                </motion.p>
              )}
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-jig-primary to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center ${
                isLoading 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'hover:from-red-600 hover:to-jig-primary hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin w-5 h-5 mr-3" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <FaSignInAlt className="w-5 h-5 mr-3" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Liens additionnels */}
          <div className="mt-8 text-center space-y-4" data-aos="fade-up" data-aos-delay="400">
            <div className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link 
                href="/register" 
                className="text-jig-primary hover:text-red-600 font-medium transition-colors duration-200"
              >
                Inscrivez-vous ici
              </Link>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}