/**
 * 🔧 FORMULAIRE D'INSCRIPTION SIMPLIFIÉ - COMPATIBLE BACKEND
 * Envoie seulement les champs acceptés par le schéma Prisma
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationTriangle,
  FaGraduationCap, FaArrowLeft, FaSpinner
} from 'react-icons/fa'
import authService from '@/services/api'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function RegisterPageFixed() {
  // State simplifié - Seulement les champs du schéma Prisma
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '', 
    password: '',           // ✅ password au lieu de motDePasse
    confirmerPassword: ''   // ✅ pour la validation côté client
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const [errors, setErrors] = useState({})
  
  const router = useRouter()

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  // Gestion des notifications
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' })
    }, 5000)
  }

  // Gestion des changements de champs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Nettoyer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validation simplifiée
  const validateForm = () => {
    const newErrors = {}

    // Validation nom
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères'
    }

    // Validation prénom
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis'
    } else if (formData.prenom.trim().length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères'
    }

    // Validation email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Format d\'email invalide'
      }
    }
    
    // Validation mot de passe
    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    // Validation confirmation mot de passe
    if (!formData.confirmerPassword.trim()) {
      newErrors.confirmerPassword = 'Veuillez confirmer le mot de passe'
    } else if (formData.password !== formData.confirmerPassword) {
      newErrors.confirmerPassword = 'Les mots de passe ne correspondent pas'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)

    try {
      // Préparer les données compatibles backend
      const { confirmerPassword, ...dataToSend } = formData
      
      // Ajouter le rôle par défaut
      const finalData = {
        ...dataToSend,
        role: 'ETUDIANT'  // ✅ Rôle compatible backend
      }
      
      console.log('📤 Envoi des données d\'inscription (format compatible):', finalData)
      
      const response = await authService.register(finalData)
      console.log('📥 Réponse reçue:', response)
      
      // Gestion de la réponse
      if (response && response.data && response.data.user) {
        showNotification('success', 'Inscription réussie ! Redirection...')
        
        setTimeout(() => {
          router.push('/login?message=registration-success')
        }, 2000)
        
      } else {
        showNotification('error', 'Erreur lors de l\'inscription')
      }
      
    } catch (error) {
      console.error('💥 Erreur d\'inscription:', error)
      
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Erreur lors de l\'inscription'
                          
      showNotification('error', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            {notification.type === 'error' && <FaExclamationTriangle className="mr-2" />}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header avec retour */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link 
            href="/login" 
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Retour à la connexion
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          
          {/* Titre */}
          <div data-aos="fade-down" className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
            <p className="text-gray-600">Rejoignez le JIG 2026</p>
          </div>

          {/* Formulaire */}
          <div data-aos="fade-up" className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Nom */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.nom ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Votre nom"
                  />
                </div>
                {errors.nom && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.nom}
                  </p>
                )}
              </div>

              {/* Prénom */}
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.prenom ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Votre prénom"
                  />
                </div>
                {errors.prenom && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.prenom}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmerPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmerPassword"
                    name="confirmerPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmerPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmerPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmerPassword && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.confirmerPassword}
                  </p>
                )}
              </div>

              {/* Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Information :</strong> Votre compte sera créé avec le rôle étudiant. 
                  Vous pourrez vous connecter et participer au concours immédiatement après validation.
                </p>
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isLoading || Object.keys(errors).length > 0}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Création du compte...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </button>

              {/* Lien de connexion */}
              <div className="text-center">
                <p className="text-gray-600">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-red-600 hover:text-red-700 font-medium transition-colors">
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}