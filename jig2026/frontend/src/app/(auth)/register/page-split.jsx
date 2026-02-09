/**
 * 🎨 FORMULAIRE D'INSCRIPTION STYLE SPLIT-SCREEN - COMPATIBLE BACKEND
 * Design moderne avec split-screen et champs compatibles Prisma
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationTriangle,
  FaGraduationCap, FaArrowLeft, FaSpinner, FaCheck, FaUsers, FaTrophy
} from 'react-icons/fa'
import { authService } from '@/services/api'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Logo from '@/components/Logo'

export default function RegisterPage() {
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white border border-green-600' 
            : 'bg-red-500 text-white border border-red-600'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <FaCheck className="mr-2 flex-shrink-0" />
            ) : (
              <FaExclamationTriangle className="mr-2 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Partie gauche - Information JIG 2026 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-12 flex-col justify-center relative overflow-hidden">
        {/* Motifs de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white rounded-full"></div>
        </div>

        {/* Contenu principal */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          
          {/* Logo et titre */}
          <div className="mb-8">
            <Logo size="2xl" variant="white" className="mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Rejoignez le
              <span className="block text-yellow-300">JIG 2026</span>
            </h1>
            <p className="text-xl text-red-100 leading-relaxed max-w-md">
              Participez à la plus grande compétition d'infographie de Côte d'Ivoire
            </p>
          </div>

          {/* Points forts */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <FaUsers className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Communauté créative</h3>
                <p className="text-red-100">Rejoignez plus de 500 infographistes passionnés</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <FaTrophy className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Prix attractifs</h3>
                <p className="text-red-100">Plus de 2 millions FCFA de prix à gagner</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center space-x-4"
            >
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Apprentissage</h3>
                <p className="text-red-100">Rencontrez des professionnels et développez vos compétences</p>
              </div>
            </motion.div>
          </div>

          {/* CTA secondaire */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-white border-opacity-20"
          >
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm text-red-100 mb-2">Déjà inscrit ?</p>
                <Link href="/login" className="text-lg font-medium hover:text-yellow-300 transition-colors flex items-center">
                  <FaArrowLeft className="mr-2" />
                  Se connecter
                </Link>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">2026</div>
                <div className="text-sm text-red-100">Edition</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Partie droite - Formulaire d'inscription */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        
        {/* Bouton retour mobile */}
        <div className="lg:hidden absolute top-4 left-4 z-10">
          <Link href="/login" className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
            <FaArrowLeft className="mr-2" />
            Retour
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-md"
        >
          
          {/* Header mobile */}
          <div className="lg:hidden text-center mb-8">
            <Logo size="lg" variant="red" className="mb-4 justify-center" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h2>
            <p className="text-gray-600">Rejoignez le JIG 2026</p>
          </div>

          {/* Header desktop */}
          <div className="hidden lg:block text-center mb-8" data-aos="fade-down">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <FaGraduationCap className="text-red-600 text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h2>
            <p className="text-gray-600">Créez votre compte participant</p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.nom ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Votre nom de famille"
                  />
                </div>
                {errors.nom && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center"
                  >
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.nom}
                  </motion.p>
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.prenom ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Votre prénom"
                  />
                </div>
                {errors.prenom && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center"
                  >
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.prenom}
                  </motion.p>
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center"
                  >
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.email}
                  </motion.p>
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
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Au moins 6 caractères"
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
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center"
                  >
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.password}
                  </motion.p>
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
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
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
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center"
                  >
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.confirmerPassword}
                  </motion.p>
                )}
              </div>

              {/* Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 flex items-start">
                  <FaGraduationCap className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="font-medium">Inscription étudiante :</strong> Votre compte sera créé avec le statut étudiant. 
                    Vous pourrez participer au concours dès validation de votre profil.
                  </span>
                </p>
              </div>

              {/* Bouton de soumission */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || Object.keys(errors).length > 0}
                className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center justify-center ${
                  isLoading || Object.keys(errors).length > 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-red-700 hover:to-red-800 hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <FaGraduationCap className="mr-3" />
                    Créer mon compte JIG 2026
                  </>
                )}
              </motion.button>

              {/* Lien de connexion */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-gray-600 text-sm">
                  Déjà membre ?{' '}
                  <Link href="/login" className="text-red-600 hover:text-red-700 font-medium transition-colors">
                    Connectez-vous ici
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}