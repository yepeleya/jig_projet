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
  FaUser,
  FaUserPlus,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaArrowLeft,
  FaPalette,
  FaGraduationCap
} from 'react-icons/fa'
import AOS from 'aos'
import { authService } from '@/services/api'
import Logo from '@/components/Logo'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    role: 'UTILISATEUR',
    ecole: '',
    filiere: '',
    niveau: ''
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

  // Afficher une notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' })
    }, 5000)
  }

  // Validation en temps réel pour les noms
  const validateNameInput = (value, fieldName) => {
    // Regex pour accepter uniquement les lettres, espaces, apostrophes et tirets
    const nameRegex = /^[a-zA-ZÀ-ÿĀ-žÀ-ÿ\s'-]*$/
    
    if (!nameRegex.test(value)) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: 'Veuillez entrer uniquement des lettres pour le ' + (fieldName === 'nom' ? 'nom' : 'prénom')
      }))
      return false
    }
    
    // Effacer l'erreur si la validation passe
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }))
    }
    return true
  }

  // Validation en temps réel pour l'email
  const validateEmailInput = (value) => {
    // Regex plus complète pour les emails
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
    if (value && !emailRegex.test(value)) {
      setErrors(prev => ({
        ...prev,
        email: 'Format d\'email invalide'
      }))
      return false
    }
    
    // Effacer l'erreur si la validation passe
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }))
    }
    return true
  }

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Validation en temps réel pour nom et prénom
    if (name === 'nom' || name === 'prenom') {
      // Filtrer les caractères non autorisés
      const filteredValue = value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue
      }))
      
      // Valider en temps réel
      if (filteredValue !== value) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Veuillez entrer uniquement des lettres pour le ' + (name === 'nom' ? 'nom' : 'prénom')
        }))
      } else if (filteredValue.length >= 2) {
        validateNameInput(filteredValue, name)
      }
    } else if (name === 'email') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      
      // Validation email en temps réel (seulement si le champ n'est pas vide)
      if (value.trim()) {
        setTimeout(() => validateEmailInput(value), 500) // Délai pour éviter trop de validations
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Effacer l'erreur du champ quand l'utilisateur tape (sauf pour nom/prénom/email qui ont leur propre logique)
    if (errors[name] && name !== 'nom' && name !== 'prenom' && name !== 'email') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {}
    
    // Validation nom avec regex stricte
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères'
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.nom.trim())) {
      newErrors.nom = 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'
    }
    
    // Validation prénom avec regex stricte
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis'
    } else if (formData.prenom.trim().length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères'
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.prenom.trim())) {
      newErrors.prenom = 'Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets'
    }
    
    // Validation email améliorée
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      const commonDomains = [
        'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'yahoo.fr',
        'istc.edu.ci', 'orange.ci', 'moov.ci', 'mtn.ci',
        'live.com', 'icloud.com', 'protonmail.com'
      ]
      
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Format d\'email invalide (ex: nom@domaine.com)'
      } else {
        const domain = formData.email.split('@')[1].toLowerCase()
        // Vérification optionnelle des domaines courants (warning seulement)
        if (!commonDomains.includes(domain) && !domain.includes('edu')) {
          // Pas d'erreur, juste un domaine moins courant
        }
      }
    }
    
    // Validation mot de passe
    if (!formData.motDePasse.trim()) {
      newErrors.motDePasse = 'Le mot de passe est requis'
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    // Validation confirmation mot de passe
    if (!formData.confirmerMotDePasse.trim()) {
      newErrors.confirmerMotDePasse = 'Veuillez confirmer le mot de passe'
    } else if (formData.motDePasse !== formData.confirmerMotDePasse) {
      newErrors.confirmerMotDePasse = 'Les mots de passe ne correspondent pas'
    }
    
    // Validation champs étudiants
    if (formData.role === 'ETUDIANT') {
      if (!formData.ecole) {
        newErrors.ecole = 'L\'école est requise pour les étudiants'
      }
      if (!formData.filiere) {
        newErrors.filiere = 'La filière est requise pour les étudiants'
      }
      if (!formData.niveau) {
        newErrors.niveau = 'Le niveau est requis pour les étudiants'
      }
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
      // Préparer les données sans la confirmation du mot de passe
      const { confirmerMotDePasse, ...dataToSend } = formData
      
      const response = await authService.register(dataToSend)
      
      if (response.success) {
        showNotification('success', 'Inscription réussie ! Vous pouvez maintenant vous connecter.')
        
        // Redirection vers la page de connexion après 2 secondes
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        showNotification('error', response.message || 'Erreur lors de l\'inscription')
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      showNotification('error', 'Erreur d\'inscription. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* Notification Toast */}
      {notification.show && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 max-w-md transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
            'bg-yellow-50 border-yellow-500 text-yellow-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'success' && <FaCheckCircle className="w-5 h-5 mr-3" />}
              {notification.type === 'error' && <FaTimes className="w-5 h-5 mr-3" />}
              {notification.type === 'warning' && <FaExclamationTriangle className="w-5 h-5 mr-3" />}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button 
              onClick={() => setNotification({ show: false, type: '', message: '' })}
              className="ml-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Partie gauche - Image et contenu inspirant */}
      <div className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-800 flex items-center justify-center p-8 md:p-12" style={{ background: 'linear-gradient(135deg, #9E1B32 0%, #7A1529 50%, #5A0F1D 100%)' }}>
        
        {/* Effet de texture et motifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-lg animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-black/10"></div>

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
            Rejoignez la <span className="text-yellow-300">JIG 2026</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-red-100 mb-8 leading-relaxed">
            Créez votre compte et participez à la plus grande exposition créative de l&apos;ISTC Polytechnique
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-red-200">
            <div className="w-12 h-px bg-red-200"></div>
            <span className="text-sm font-medium">Votre créativité compte</span>
            <div className="w-12 h-px bg-red-200"></div>
          </div>
        </motion.div>
      </div>

      {/* Partie droite - Formulaire d'inscription */}
      <div className="bg-gray-50 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
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
              Inscription
            </h2>
            <p className="text-gray-600">
              Créez votre compte étudiant
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6" data-aos="fade-up" data-aos-delay="200">
            
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nom */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
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
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.nom}
                  </motion.p>
                )}
              </div>

              {/* Prénom */}
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
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
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.prenom}
                  </motion.p>
                )}
              </div>
            </div>

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
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
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

            {/* Type de compte */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Je m&apos;inscris en tant que :
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none"
                >
                  <option value="ETUDIANT">🎓 Étudiant ISTC Polytechnique</option>
                  <option value="UTILISATEUR">👤 Utilisateur (ami, parent, invité...)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Seuls les étudiants de l&apos;EAIN (ISTC Polytechnique) peuvent soumettre des projets.
              </p>
            </div>

            {/* Champs spécifiques aux étudiants */}
            {formData.role === 'ETUDIANT' && (
              <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-medium text-red-800 mb-2">
                  Informations académiques
                </h3>
                
                {/* École */}
                <div>
                  <label htmlFor="ecole" className="block text-sm font-medium text-gray-700 mb-2">
                    École *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="ecole"
                      name="ecole"
                      value={formData.ecole}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none"
                      required={formData.role === 'ETUDIANT'}
                    >
                      <option value="">Sélectionnez votre école</option>
                      <option value="ISTC_POLYTECHNIQUE">ISTC Polytechnique</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Filière */}
                <div>
                  <label htmlFor="filiere" className="block text-sm font-medium text-gray-700 mb-2">
                    Filière *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="filiere"
                      name="filiere"
                      value={formData.filiere}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none"
                      required={formData.role === 'ETUDIANT'}
                      disabled={formData.ecole !== 'ISTC_POLYTECHNIQUE'}
                    >
                      <option value="">Sélectionnez votre filière</option>
                      <option value="EAIN">EAIN - École des Arts et Images Numériques</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Niveau */}
                <div>
                  <label htmlFor="niveau" className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="niveau"
                      name="niveau"
                      value={formData.niveau}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none"
                      required={formData.role === 'ETUDIANT'}
                    >
                      <option value="">Sélectionnez votre niveau</option>
                      <option value="L1">L1 - Première année Licence</option>
                      <option value="L2">L2 - Deuxième année Licence</option>
                      <option value="L3">L3 - Troisième année Licence</option>
                      <option value="M1">M1 - Première année Master</option>
                      <option value="M2">M2 - Deuxième année Master</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Important :</strong> Seuls les étudiants de l&apos;EAIN pourront participer au concours et soumettre des projets.
                  </p>
                </div>
              </div>
            )}

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
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
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

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmerMotDePasse" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmerMotDePasse"
                  name="confirmerMotDePasse"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmerMotDePasse}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmerMotDePasse ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Confirmez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmerMotDePasse && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.confirmerMotDePasse}
                </motion.p>
              )}
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center ${
                isLoading 
                  ? 'opacity-75 cursor-not-allowed bg-gray-400' 
                  : 'bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
              style={!isLoading ? { backgroundColor: '#9E1B32' } : {}}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin w-5 h-5 mr-3" />
                  Inscription en cours...
                </>
              ) : (
                <>
                  <FaUserPlus className="w-5 h-5 mr-3" />
                  S&apos;inscrire
                </>
              )}
            </button>
          </form>

          {/* Liens additionnels */}
          <div className="mt-8 text-center space-y-4" data-aos="fade-up" data-aos-delay="400">
            <div className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link 
                href="/login" 
                className="font-medium transition-colors duration-200"
                style={{ color: '#9E1B32' }}
                onMouseEnter={(e) => e.target.style.color = '#7A1529'}
                onMouseLeave={(e) => e.target.style.color = '#9E1B32'}
              >
                Connectez-vous ici
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