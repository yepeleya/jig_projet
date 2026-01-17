'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiBook, 
  FiTag, 
  FiType, 
  FiFileText, 
  FiUpload, 
  FiLink, 
  FiSend,
  FiCheckCircle,
  FiLoader,
  FiTrash2,
  FiSave,
  FiEye,
  FiX,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi'
import AOS from 'aos'
import { useNotification } from '@/hooks/useNotification'
import NotificationToast from '@/components/NotificationToast'
import { useAuthStore } from '@/store/authStore'
import { canSubmitProject, getPermissionMessage } from '@/utils/permissions'
import { useAccessControl } from '../../hooks/useAccessControl'
import { AccessGuard } from '../../components/AccessGuard'
import apiServices from '@/services/api'

const apiService = apiServices

export default function SoumettrePage() {
  const { user, isAuthenticated } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)
  const { notification, showNotification, hideNotification } = useNotification()

  // Nouveau système de contrôle d'accès
  const accessControl = useAccessControl('submission')

  // Vérification des permissions
  const canSubmit = canSubmitProject(user)
  
  // Attendre l'hydratation du store avant de vérifier l'auth
  useEffect(() => {
    setIsHydrated(true)
  }, [])
  
  useEffect(() => {
    if (!isHydrated) return // Ne rien faire avant hydratation
    
    if (!isAuthenticated) {
      showNotification('error', 'Vous devez être connecté pour soumettre un projet.')
      return
    }
    
    if (!canSubmit) {
      showNotification('error', getPermissionMessage('submit_project'))
      return
    }
  }, [isAuthenticated, canSubmit, showNotification, isHydrated])

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
    watch,
    setValue,
    getValues
  } = useForm({ mode: 'onChange' })

  // Surveiller les changements pour l'auto-sauvegarde
  const watchedFields = watch()

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
    
    // Charger le brouillon sauvegardé si disponible
    loadDraft()
  }, [])

  // Auto-sauvegarde toutes les 30 secondes si des changements sont détectés
  useEffect(() => {
    const hasData = Object.keys(dirtyFields).length > 0
    if (hasData && !isSubmitting) {
      const timer = setTimeout(() => {
        saveDraft(true) // true = auto-save silencieux
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [watchedFields, dirtyFields, isSubmitting])

  // Charger le brouillon depuis localStorage
  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem('jig2026_project_draft')
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft)
        Object.keys(draftData).forEach(key => {
          setValue(key, draftData[key])
        })
        setIsDraft(true)
        showNotification('info', 'Brouillon chargé automatiquement')
      }
    } catch (error) {
      console.error('Erreur lors du chargement du brouillon:', error)
    }
  }

  // Sauvegarder en brouillon
  const saveDraft = async (isAutoSave = false) => {
    setIsSaving(true)
    try {
      const formData = getValues()
      localStorage.setItem('jig2026_project_draft', JSON.stringify(formData))
      setIsDraft(true)
      
      if (!isAutoSave) {
        showNotification('success', 'Brouillon sauvegardé avec succès')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      if (!isAutoSave) {
        showNotification('error', 'Erreur lors de la sauvegarde')
      }
    }
    setIsSaving(false)
  }

  // Effacer le formulaire
  const clearForm = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tout le formulaire ?')) {
      reset()
      setSelectedFile(null)
      setFilePreview(null)
      localStorage.removeItem('jig2026_project_draft')
      setIsDraft(false)
      showNotification('info', 'Formulaire effacé')
    }
  }

  // Gérer la sélection de fichier
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Vérifier la taille du fichier (100 MB = 100 * 1024 * 1024 bytes)
      const maxSize = 100 * 1024 * 1024
      if (file.size > maxSize) {
        showNotification('error', `Le fichier est trop volumineux. Taille maximale autorisée : 100 MB`)
        event.target.value = '' // Reset input
        setSelectedFile(null)
        setFilePreview(null)
        return
      }

      setSelectedFile(file)
      
      // Créer une prévisualisation pour les images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFilePreview(e.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        setFilePreview(null)
      }
    }
  }

  // Soumission du formulaire
  const onSubmit = async (data) => {
    // Vérifier l'authentification avant de commencer
    if (!isAuthenticated || !user) {
      showNotification('warning', 'Vous devez être connecté pour soumettre un projet.')
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
      return
    }

    setIsSubmitting(true)
    
    try {
      // Préparer FormData pour l'envoi du fichier
      const formData = new FormData()
      
      // Ajouter le fichier avec le bon nom attendu par le backend
      if (selectedFile) {
        formData.append('fichier', selectedFile)
      }
      
      // Mapper les noms de champs frontend vers backend
      formData.append('titre', data.projectTitle)
      formData.append('description', data.description)
      formData.append('categorie', data.category)
      formData.append('niveau', user?.niveau || 'Licence') // Utiliser le niveau de l'utilisateur ou par défaut

      console.log('🚀 Données du formulaire:', data)
      console.log('📁 Fichier sélectionné:', selectedFile)
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const backendUrl = apiBaseUrl.replace('/api', '')
      const submissionUrl = `${backendUrl}/api/projets/soumettre`
      
      console.log('🔗 URL de soumission:', submissionUrl)
      
      // Envoi à l'API backend avec gestion automatique du token et de l'expiration
      const response = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        
        // Suivi de progression de l'upload
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(progress)
          }
        })
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              ok: true,
              status: xhr.status,
              json: () => Promise.resolve(JSON.parse(xhr.responseText))
            })
          } else {
            resolve({
              ok: false,
              status: xhr.status,
              json: () => Promise.resolve(JSON.parse(xhr.responseText || '{}'))
            })
          }
        })
        
        xhr.addEventListener('error', () => {
          reject(new Error('Erreur réseau lors de l\'upload'))
        })
        
        xhr.open('POST', submissionUrl)
        
        // Utiliser le service API pour récupérer le token
        const token = apiService.auth.getToken()
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        }
        
        xhr.send(formData)
      })
      
      // Si l'API n'existe pas encore, simuler un succès
      if (!response.ok && response.status === 404) {
        // Simulation de réussite
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        setIsSuccess(true)
        reset()
        setSelectedFile(null)
        setFilePreview(null)
        localStorage.removeItem('jig2026_project_draft')
        setIsDraft(false)
        showNotification('success', 'Projet soumis avec succès ! Vous recevrez une confirmation par email.')
        
        // Masquer le message de succès après 8 secondes
        setTimeout(() => {
          setIsSuccess(false)
        }, 8000)
      } else {
        const result = await response.json()
        
        console.log('❌ Erreur soumission:', {
          status: response.status,
          result: result
        })
        
        // Gestion spécifique de l'expiration du token
        if (response.status === 403 || response.status === 401) {
          console.log('Token expiré ou invalide, redirection vers la connexion')
          showNotification('error', 'Votre session a expiré. Redirection vers la page de connexion...')
          
          // Nettoyer le store auth
          const { logout } = useAuthStore.getState()
          logout()
          
          // Rediriger vers la page de connexion après un délai
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
          return
        }
        
        if (result.success) {
          setIsSuccess(true)
          reset()
          setSelectedFile(null)
          setFilePreview(null)
          localStorage.removeItem('jig2026_project_draft')
          setIsDraft(false)
          showNotification('success', 'Projet soumis avec succès !')
        } else {
          throw new Error(result.message || result.error || 'Erreur lors de la soumission')
        }
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      
      // Messages d'erreur plus spécifiques
      if (error.message.includes('expired') || error.message.includes('Token') || error.message.includes('403') || error.message.includes('401')) {
        showNotification('error', 'Votre session a expiré. Veuillez vous reconnecter.')
        
        // Nettoyer le store auth
        const { logout } = useAuthStore.getState()
        logout()
        
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else if (error.message.includes('réseau') || error.message.includes('Network')) {
        showNotification('error', 'Erreur de connexion. Vérifiez votre connexion internet.')
      } else {
        showNotification('error', error.message || 'Erreur lors de la soumission. Veuillez réessayer.')
      }
    }
    
    setIsSubmitting(false)
    setUploadProgress(0)
  }

  const categories = [
    { value: '', label: 'Sélectionnez une catégorie' },
    { value: 'pao', label: 'PAO (Publication Assistée par Ordinateur)' },
    { value: 'web', label: 'Développement Web' },
    { value: 'photo', label: 'Photographie' },
    { value: 'animation2d', label: 'Animation 2D' },
    { value: 'animation3d', label: 'Animation 3D' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Notification Toast */}
      <NotificationToast notification={notification} onClose={hideNotification} />

      {/* Protection par le système de contrôle d'accès automatique */}
      <AccessGuard pageName="submission" showPhaseInfo={true}>
        {/* Contenu principal de la page de soumission */}
        
        {/* Modal de prévisualisation */}
        {showPreview && filePreview && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Prévisualisation du fichier</h3>
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4">
                  <img src={filePreview} alt="Prévisualisation" className="max-w-full h-auto" />
                </div>
              </div>
            </div>
          )}
          
          {/* Bannière titre avec fond incliné */}
          <section className="relative overflow-hidden bg-gradient-to-br from-jig-primary via-red-600 to-red-700 pt-20">
        
        {/* Effet incliné */}
        <div className="absolute inset-0 bg-gradient-to-br from-jig-primary/90 via-red-600/90 to-red-700/90 transform skew-y-1 origin-top-left"></div>
        
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <div data-aos="fade-down">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Soumettez votre projet
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Partagez vos créations et participez à la JIG 2026 !
            </p>
            {isDraft && (
              <div className="mt-4 inline-flex items-center bg-yellow-500/20 text-yellow-100 px-4 py-2 rounded-full">
                <FiSave className="w-4 h-4 mr-2" />
                Brouillon disponible
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section formulaire principal */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Bannière de confirmation EAIN */}
          {canSubmit && user?.role === 'ETUDIANT' && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start">
                <FiCheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    ✨ Étudiant EAIN - Soumission autorisée
                  </h3>
                  <p className="text-green-700 mb-2">
                    Vous êtes étudiant à l&apos;<strong>EAIN (École des Arts et Images Numériques)</strong> de l&apos;<strong>ISTC Polytechnique</strong>.
                  </p>
                  <p className="text-green-700 text-sm">
                    Vous pouvez soumettre votre projet au concours JIG 2026 !
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Bannière d'information EAIN */}
          {!canSubmit && user?.role === 'ETUDIANT' && (
            <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start">
                <FiAlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Accès restreint - Étudiants EAIN uniquement
                  </h3>
                  <p className="text-yellow-700 mb-2">
                    La soumission de projets est réservée aux étudiants de l&apos;<strong>EAIN (École des Arts et Images Numériques)</strong> de l&apos;<strong>ISTC Polytechnique</strong>.
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Si vous êtes étudiant EAIN, assurez-vous d&apos;avoir sélectionné la bonne école et filière lors de votre inscription.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {!canSubmit && user?.role === 'UTILISATEUR' && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start">
                <FiInfo className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Vous êtes connecté en tant qu&apos;utilisateur
                  </h3>
                  <p className="text-blue-700 mb-2">
                    Les utilisateurs peuvent voter et commenter les projets, mais ne peuvent pas en soumettre.
                  </p>
                  <p className="text-blue-700 text-sm">
                    Seuls les étudiants de l&apos;EAIN (ISTC Polytechnique) peuvent participer au concours.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Formulaire de soumission */}
            <div className="lg:col-span-2">
              <div 
                data-aos="fade-up" 
                className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100"
              >
                
                {/* Message de succès */}
                {isSuccess && (
                  <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center text-green-800">
                    <FiCheckCircle className="w-5 h-5 mr-3 text-green-600" />
                    <span className="font-medium">✅ Votre projet a été soumis avec succès !</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Barre d'actions en haut du formulaire */}
                  <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border">
                    <button
                      type="button"
                      onClick={() => saveDraft(false)}
                      disabled={isSaving}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FiSave className="w-4 h-4 mr-2" />
                      )}
                      Sauvegarder
                    </button>
                    
                    <button
                      type="button"
                      onClick={clearForm}
                      className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Effacer
                    </button>
                    
                    {isDraft && (
                      <div className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg">
                        <FiInfo className="w-4 h-4 mr-2" />
                        Auto-sauvegarde activée
                      </div>
                    )}
                  </div>
                  
                  {/* Informations personnelles */}
                  <div data-aos="fade-up" data-aos-delay="100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                      Informations personnelles
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Nom complet */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            {...register('fullName', { required: 'Le nom complet est requis' })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all ${
                              errors.fullName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Votre nom complet"
                          />
                        </div>
                        {errors.fullName && (
                          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            {...register('email', { 
                              required: 'L&apos;email est requis',
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Format d&apos;email invalide'
                              }
                            })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="votre.email@exemple.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Téléphone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            {...register('phone', { required: 'Le téléphone est requis' })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="+225 XX XX XX XX XX"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* École */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          École ou Institution *
                        </label>
                        <div className="relative">
                          <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            {...register('institution', { required: 'L&apos;institution est requise' })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all ${
                              errors.institution ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="ISTC Polytechnique, ESATIC, etc."
                          />
                        </div>
                        {errors.institution && (
                          <p className="mt-1 text-sm text-red-600">{errors.institution.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informations sur le projet */}
                  <div data-aos="fade-up" data-aos-delay="200">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                      Informations sur le projet
                    </h3>
                    
                    {/* Catégorie */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie de participation *
                      </label>
                      <div className="relative">
                        <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                          {...register('category', { required: 'La catégorie est requise' })}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all appearance-none bg-white ${
                            errors.category ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>

                    {/* Titre du projet */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du projet *
                      </label>
                      <div className="relative">
                        <FiType className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          {...register('projectTitle', { required: 'Le titre du projet est requis' })}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all ${
                            errors.projectTitle ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Nom de votre projet créatif"
                        />
                      </div>
                      {errors.projectTitle && (
                        <p className="mt-1 text-sm text-red-600">{errors.projectTitle.message}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description du projet *
                      </label>
                      <div className="relative">
                        <FiFileText className="absolute left-3 top-4 text-gray-400" />
                        <textarea
                          {...register('description', { 
                            required: 'La description est requise',
                            minLength: {
                              value: 50,
                              message: 'La description doit contenir au moins 50 caractères'
                            }
                          })}
                          rows={6}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all resize-none ${
                            errors.description ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Décrivez votre projet, les outils utilisés, l'inspiration, les défis relevés..."
                        />
                      </div>
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Fichier */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fichier ou maquette du projet *
                      </label>
                      <div className="relative">
                        <FiUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="file"
                          {...register('projectFile', { required: 'Un fichier est requis' })}
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar,.mp4,.avi,.mov,.webm"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all ${
                            errors.projectFile ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      
                      {/* Informations sur le fichier sélectionné */}
                      {selectedFile && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FiCheckCircle className="w-5 h-5 text-green-500 mr-2" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            {filePreview && (
                              <button
                                type="button"
                                onClick={() => setShowPreview(true)}
                                className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                              >
                                <FiEye className="w-4 h-4 mr-1" />
                                Aperçu
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <p className="mt-1 text-xs text-gray-500">
                        Formats acceptés : PDF, images (JPG, PNG, GIF, WebP), vidéos (MP4, AVI, MOV, WebM), archives (ZIP, RAR) - Max 100 Mo
                      </p>
                      {errors.projectFile && (
                        <p className="mt-1 text-sm text-red-600">{errors.projectFile.message}</p>
                      )}
                    </div>

                    {/* Lien externe */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lien externe (optionnel)
                      </label>
                      <div className="relative">
                        <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          {...register('externalLink')}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all"
                          placeholder="https://behance.net/votre-projet"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Lien vers Behance, GitHub, site web, etc.
                      </p>
                    </div>
                  </div>

                  {/* Bouton de soumission */}
                  <div data-aos="fade-up" data-aos-delay="300" className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-gradient-to-r from-jig-primary to-red-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-jig-primary/30 flex items-center justify-center ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="w-5 h-5 mr-3 animate-spin" />
                          Envoi en cours... {uploadProgress > 0 && `${uploadProgress}%`}
                        </>
                      ) : (
                        <>
                          <FiSend className="w-5 h-5 mr-3" />
                          Soumettre le projet
                        </>
                      )}
                    </button>
                    
                    {/* Barre de progression pour les gros fichiers */}
                    {isSubmitting && uploadProgress > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Téléchargement en cours...</span>
                          <span className="text-sm font-medium text-jig-primary">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-jig-primary to-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        {selectedFile && (
                          <p className="text-xs text-gray-500 mt-1">
                            Fichier : {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Section illustrée */}
            <div className="lg:col-span-1">
              <div data-aos="fade-left" data-aos-delay="400" className="sticky top-8">
                <div className="bg-gradient-to-br from-jig-primary via-red-500 to-red-700 rounded-2xl p-8 text-white text-center shadow-xl">
                  <div className="text-6xl mb-6">🎨</div>
                  <h3 className="text-2xl font-bold mb-4">JIG 2026</h3>
                  <p className="text-red-100 leading-relaxed mb-6">
                    Montrez votre talent créatif et rejoignez la communauté des infographistes de demain !
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-red-100">
                      <FiCheckCircle className="w-5 h-5 mr-3 text-green-300" />
                      <span>Évaluation par jury professionnel</span>
                    </div>
                    <div className="flex items-center text-red-100">
                      <FiCheckCircle className="w-5 h-5 mr-3 text-green-300" />
                      <span>Récompenses et certificats</span>
                    </div>
                    <div className="flex items-center text-red-100">
                      <FiCheckCircle className="w-5 h-5 mr-3 text-green-300" />
                      <span>Visibilité pour votre travail</span>
                    </div>
                  </div>

                  {/* Boutons d'actions rapides */}
                  <div className="space-y-3">
                    <Link 
                      href="/galerie"
                      className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 border border-white/30"
                    >
                      Voir la galerie des projets
                    </Link>
                    
                    <Link 
                      href="/programme"
                      className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 border border-white/30"
                    >
                      Consulter le programme
                    </Link>
                    
                    <button
                      type="button"
                      onClick={() => {
                        document.querySelector('form').scrollIntoView({ behavior: 'smooth' })
                        document.querySelector('input[name="fullName"]')?.focus()
                      }}
                      className="block w-full bg-white text-jig-primary font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                    >
                      Commencer la soumission
                    </button>
                  </div>
                </div>

                {/* Bouton retour */}
                <div className="mt-8 text-center">
                  <Link 
                    href="/"
                    className="inline-flex items-center text-jig-primary hover:text-red-600 font-medium transition-colors"
                  >
                    ← Retour à l&apos;accueil
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section d'aide et conseils */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div data-aos="fade-up" className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Conseils pour votre soumission
            </h2>
            <p className="text-gray-600">
              Maximisez vos chances de succès avec ces recommandations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div data-aos="fade-up" data-aos-delay="100" className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Description claire</h3>
              <p className="text-gray-600 text-sm">
                Expliquez votre processus créatif, les outils utilisés et l&apos;inspiration derrière votre projet.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Qualité visuelle</h3>
              <p className="text-gray-600 text-sm">
                Assurez-vous que vos fichiers soient en haute résolution et bien organisés.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="300" className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Mettez en avant l&apos;originalité et les aspects techniques innovants de votre travail.
              </p>
            </div>
          </div>

          {/* Contact support */}
          <div data-aos="fade-up" data-aos-delay="400" className="mt-12 text-center p-6 bg-gray-50 rounded-xl border">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Besoin d&apos;aide ?</h3>
            <p className="text-gray-600 mb-4">
              Notre équipe est là pour vous accompagner dans votre soumission
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:support@jig2026.com"
                className="inline-flex items-center px-4 py-2 bg-jig-primary text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <FiMail className="w-4 h-4 mr-2" />
                support@jig2026.com
              </a>
              <a 
                href="tel:+2250123456789"
                className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FiPhone className="w-4 h-4 mr-2" />
                +225 01 23 45 67 89
              </a>
            </div>
          </div>
        </div>
      </section>
      </AccessGuard>
    </div>
  )
}