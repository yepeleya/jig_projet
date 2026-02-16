'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationTriangle,
  FaGraduationCap, FaSpinner, FaCheck, FaSchool, FaUserTie
} from 'react-icons/fa'
import { authService } from '@/services/api'

// Composant Logo
const Logo = ({ variant = 'red', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto', 
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto'
  }

  const logoSrc = variant === 'white' 
    ? '/logo/logo_blanc.png'
    : '/logo/logo_rouge.jpeg'

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Logo JIG"
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  )
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '', 
    password: '',
    confirmerPassword: '',
    typeUtilisateur: 'ETUDIANT',
    filiere: '',
    ecole: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const [errors, setErrors] = useState({})
  
  const router = useRouter()

  const filieres = [
    { value: 'EAIN', label: 'EAIN - École des Arts et Images Numériques' },
    { value: 'EJ', label: 'EJ - École de Journalisme' },
    { value: 'EPA', label: 'EPA - École de Production Audio-Visuel' },
    { value: 'EPM', label: 'EPM - École de Publicité Marketing' },
    { value: 'ETTA', label: 'ETTA - École de Télécommunication' },
    { value: 'AUTRE', label: 'Autre école (non-ISTC)' }
  ]

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' })
    }, 5000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    if (name === 'typeUtilisateur') {
      setFormData(prev => ({
        ...prev,
        filiere: '',
        ecole: ''
      }))
    }

    if (name === 'filiere' && value !== 'AUTRE') {
      setFormData(prev => ({
        ...prev,
        ecole: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    }
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    if (!formData.confirmerPassword.trim()) {
      newErrors.confirmerPassword = 'Veuillez confirmer le mot de passe'
    } else if (formData.password !== formData.confirmerPassword) {
      newErrors.confirmerPassword = 'Les mots de passe ne correspondent pas'
    }

    if (formData.typeUtilisateur === 'ETUDIANT' && !formData.filiere) {
      newErrors.filiere = 'La filière est requise pour les étudiants'
    }

    if (formData.filiere === 'AUTRE' && !formData.ecole.trim()) {
      newErrors.ecole = 'Le nom de l\'école est requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)

    try {
      const { confirmerPassword, typeUtilisateur, filiere, ecole, ...dataToSend } = formData
      
      // Format compatible avec le backend
      const finalData = {
        nom: dataToSend.nom,
        prenom: dataToSend.prenom,
        email: dataToSend.email,
        password: dataToSend.password, // Backend attend 'password', pas 'motDePasse'
        role: 'ETUDIANT'
      }
      
      console.log('📤 Envoi des données d\'inscription:', finalData)
      
      const response = await authService.register(finalData)
      console.log('📥 Réponse reçue:', response)
      
      showNotification('success', 'Inscription réussie ! Redirection...')
      
      setTimeout(() => {
        router.push('/login?message=registration-success')
      }, 2000)
      
    } catch (error) {
      console.error('💥 Erreur d\'inscription:', error)
      
      const errorMessage = error?.message || 'Erreur lors de l\'inscription'
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

      {/* Partie gauche - Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl mb-6">
              <FaGraduationCap className="text-red-600 text-3xl" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Rejoignez la JIG 2026</h1>
            <p className="text-red-100 text-lg">Créez votre compte pour participer</p>
          </div>
        </div>
      </div>

      {/* Partie droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <Logo size="lg" className="mb-6 justify-center" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h2>
            <p className="text-gray-600">Créez votre compte participant</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Type d'utilisateur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type de compte *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'typeUtilisateur', value: 'ETUDIANT' }})}
                    className={`flex items-center justify-center p-3 border rounded-xl transition-all ${
                      formData.typeUtilisateur === 'ETUDIANT' 
                        ? 'border-red-500 bg-red-50 text-red-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <FaGraduationCap className="mr-2" />
                    Étudiant
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'typeUtilisateur', value: 'INVITE' }})}
                    className={`flex items-center justify-center p-3 border rounded-xl transition-all ${
                      formData.typeUtilisateur === 'INVITE' 
                        ? 'border-red-500 bg-red-50 text-red-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <FaUserTie className="mr-2" />
                    Invité
                  </button>
                </div>
              </div>

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
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="votre.email@exemple.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Filière - Affiché seulement pour les étudiants */}
              {formData.typeUtilisateur === 'ETUDIANT' && (
                <div>
                  <label htmlFor="filiere" className="block text-sm font-medium text-gray-700 mb-2">
                    Filière / École *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSchool className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="filiere"
                      name="filiere"
                      value={formData.filiere}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                        errors.filiere ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <option value="">Sélectionnez votre filière</option>
                      {filieres.map((filiere) => (
                        <option key={filiere.value} value={filiere.value}>
                          {filiere.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.filiere && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <FaExclamationTriangle className="mr-1 h-4 w-4" />
                      {errors.filiere}
                    </p>
                  )}
                </div>
              )}

              {/* Nom de l'école pour "Autre" */}
              {formData.filiere === 'AUTRE' && (
                <div>
                  <label htmlFor="ecole" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de votre école *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSchool className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="ecole"
                      name="ecole"
                      type="text"
                      value={formData.ecole}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                        errors.ecole ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Nom de votre établissement"
                    />
                  </div>
                  {errors.ecole && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <FaExclamationTriangle className="mr-1 h-4 w-4" />
                      {errors.ecole}
                    </p>
                  )}
                </div>
              )}

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
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
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
                    type={showConfirmPassword ? "text" : "password"}
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
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <FaExclamationTriangle className="mr-1 h-4 w-4" />
                    {errors.confirmerPassword}
                  </p>
                )}
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center justify-center ${
                  isLoading
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
              </button>

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
        </div>
      </div>
    </div>
  )
}