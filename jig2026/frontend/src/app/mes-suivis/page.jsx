'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  FiEye, 
  FiMessageCircle, 
  FiStar, 
  FiUser, 
  FiClock, 
  FiCheckCircle,
  FiAlertTriangle,
  FiLoader,
  FiX,
  FiPlus,
  FiFilter,
  FiRefreshCw,
  FiArrowLeft,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiFileText,
  FiAward,
  FiThumbsUp,
  FiThumbsDown,
  FiInfo
} from 'react-icons/fi'
import AOS from 'aos'
import 'aos/dist/aos.css'

import apiServices from '@/services/api'
import { projetService, projetSuiviService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { useNotification } from '@/hooks/useNotification'
import NotificationToast from '@/components/NotificationToast'

export default function SuiviPage() {
  const { user, isAuthenticated, token } = useAuthStore()
  const { notification, showNotification, hideNotification } = useNotification()

  // État principal
  const [suivis, setSuivis] = useState([])
  const [projets, setProjets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProjet, setSelectedProjet] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [onlyMyProjects, setOnlyMyProjects] = useState(user?.role === 'ETUDIANT')

  // Modal ajout suivi
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProjetForAdd, setSelectedProjetForAdd] = useState('')
  const [newSuiviData, setNewSuiviData] = useState({
    typeReaction: '',
    message: '',
    visible: true
  })

  // Chargement initial
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
    })
  }, [])

  // Récupération des données
  const fetchData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      if (!showLoader) setRefreshing(true)

      console.log('🔍 Récupération suivis et projets...', { 
        user: user?.nom, 
        role: user?.role,
        onlyMyProjects 
      })

      // Récupérer les suivis avec protection
      let suivisData = []
      if (onlyMyProjects || user?.role === 'ETUDIANT') {
        console.log('🔍 Récupération MES suivis via projetSuiviService...')
        // 🛠️ PROTECTION: Utiliser directement projetSuiviService
        const suivisResponse = await projetSuiviService.getMesSuivis()
        if (suivisResponse.success) {
          suivisData = suivisResponse.data || []
        }
      } else {
        // Pour admin/jury, récupérer tous les suivis
        const suivisResponse = await apiServices.get('/projet-suivi/all')
        if (suivisResponse.success) {
          suivisData = suivisResponse.data || []
        }
      }

      setSuivis(suivisData)

      // Récupérer les projets pour les filtres avec protection
      let projetsData = []
      if (user?.role === 'ADMIN' || user?.role === 'JURY') {
        // Pour admin/jury : tous les projets
        try {
          const projetsResponse = await apiServices.projets.getAllProjets()
          projetsData = projetsResponse.data || projetsResponse || []
        } catch (error) {
          console.warn('⚠️ Fallback: Utilisation projetService direct pour admin')
          const projetsResponse = await projetService.getAllProjets()
          projetsData = projetsResponse.data || projetsResponse || []
        }
      } else {
        // Pour utilisateur normal : ses projets seulement
        try {
          console.log('🔍 Récupération des projets utilisateur via projetService...')
          // 🛠️ PROTECTION: Utiliser directement projetService au lieu d'apiServices.projet
          if (typeof projetService?.getMesProjets === 'function') {
            const projetsResponse = await projetService.getMesProjets()
            projetsData = projetsResponse.data || projetsResponse || []
          } else if (user?.id && typeof projetService?.getProjetsByUser === 'function') {
            console.log('🔄 Fallback: Utilisation getProjetsByUser pour user ID:', user.id)
            const projetsResponse = await projetService.getProjetsByUser(user.id)
            projetsData = projetsResponse.data || projetsResponse || []
          } else {
            console.error('❌ Aucune méthode disponible pour récupérer les projets utilisateur')
            projetsData = []
          }
        } catch (error) {
          console.error('❌ Erreur récupération projets utilisateur:', error)
          projetsData = []
        }
      }

      setProjets(projetsData)
      console.log(`✅ Chargé ${suivisData.length} suivis et ${projetsData.length} projets`)

    } catch (error) {
      console.error('❌ Erreur chargement:', error)
      setError('Erreur lors du chargement des données')
      showNotification('Erreur de chargement', 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user, onlyMyProjects, showNotification])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchData()
    } else if (!isAuthenticated) {
      setError('Connexion requise')
    }
  }, [isAuthenticated, user, fetchData])

  // Fonctions utilitaires
  const getTypeIcon = (type) => {
    const iconProps = { className: "w-5 h-5" }
    switch (type) {
      case 'VOTE': return <FiStar {...iconProps} className="w-5 h-5 text-yellow-500" />
      case 'COMMENTAIRE': return <FiMessageCircle {...iconProps} className="w-5 h-5 text-blue-500" />
      case 'MODIFICATION': return <FiEdit3 {...iconProps} className="w-5 h-5 text-indigo-500" />
      case 'AVIS_JURY': return <FiUser {...iconProps} className="w-5 h-5 text-purple-500" />
      case 'VALIDATION': return <FiCheckCircle {...iconProps} className="w-5 h-5 text-green-500" />
      case 'APPROBATION': return <FiThumbsUp {...iconProps} className="w-5 h-5 text-green-600" />
      case 'REJET': return <FiThumbsDown {...iconProps} className="w-5 h-5 text-red-500" />
      case 'DEMANDE_MODIFICATION': return <FiAlertTriangle {...iconProps} className="w-5 h-5 text-orange-500" />
      case 'NOTE_INTERNE': return <FiFileText {...iconProps} className="w-5 h-5 text-gray-500" />
      default: return <FiInfo {...iconProps} className="w-5 h-5 text-gray-400" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'VOTE': return 'border-l-yellow-500 bg-yellow-50'
      case 'COMMENTAIRE': return 'border-l-blue-500 bg-blue-50'
      case 'MODIFICATION': return 'border-l-indigo-500 bg-indigo-50'
      case 'AVIS_JURY': return 'border-l-purple-500 bg-purple-50'
      case 'VALIDATION': return 'border-l-green-500 bg-green-50'
      case 'APPROBATION': return 'border-l-green-600 bg-green-50'
      case 'REJET': return 'border-l-red-500 bg-red-50'
      case 'DEMANDE_MODIFICATION': return 'border-l-orange-500 bg-orange-50'
      case 'NOTE_INTERNE': return 'border-l-gray-500 bg-gray-50'
      default: return 'border-l-gray-400 bg-gray-50'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // Filtrage des suivis
  const filteredSuivis = suivis.filter(suivi => {
    if (searchTerm && !suivi.message.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !suivi.projet?.titre.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    if (selectedProjet && suivi.projetId !== parseInt(selectedProjet)) {
      return false
    }
    if (selectedType && suivi.typeReaction !== selectedType) {
      return false
    }
    return true
  })

  // Groupement par projet
  const suivisGroupes = filteredSuivis.reduce((acc, suivi) => {
    const projetId = suivi.projetId
    if (!acc[projetId]) {
      acc[projetId] = {
        projet: suivi.projet || { id: projetId, titre: `Projet #${projetId}`, statut: 'INCONNU' },
        suivis: []
      }
    }
    acc[projetId].suivis.push(suivi)
    return acc
  }, {})

  // Ajouter un nouveau suivi (admin/jury seulement)
  const handleAddSuivi = async () => {
    try {
      if (!selectedProjetForAdd || !newSuiviData.typeReaction || !newSuiviData.message.trim()) {
        showNotification('Veuillez remplir tous les champs requis', 'error')
        return
      }

      const response = await apiServices.projetSuivi.ajouterSuivi({
        projetId: parseInt(selectedProjetForAdd),
        typeReaction: newSuiviData.typeReaction,
        message: newSuiviData.message.trim(),
        visible: newSuiviData.visible
      })

      if (response.success) {
        showNotification('Suivi ajouté avec succès', 'success')
        setShowAddModal(false)
        setNewSuiviData({ typeReaction: '', message: '', visible: true })
        setSelectedProjetForAdd('')
        fetchData(false) // Refresh sans loader
      } else {
        showNotification(response.message || 'Erreur lors de l\'ajout', 'error')
      }
    } catch (error) {
      console.error('Erreur ajout suivi:', error)
      showNotification('Erreur lors de l\'ajout du suivi', 'error')
    }
  }

  // Types de réaction disponibles
  const typesReaction = [
    { value: 'COMMENTAIRE', label: 'Commentaire' },
    { value: 'AVIS_JURY', label: 'Avis du jury' },
    { value: 'VALIDATION', label: 'Validation' },
    { value: 'APPROBATION', label: 'Approbation' },
    { value: 'REJET', label: 'Rejet' },
    { value: 'DEMANDE_MODIFICATION', label: 'Demande de modification' },
    { value: 'NOTE_INTERNE', label: 'Note interne' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center" data-aos="fade-up">
          <div className="relative">
            <FiLoader className="animate-spin text-6xl text-jig-primary mx-auto mb-4" />
            <div className="absolute inset-0 animate-ping">
              <FiLoader className="text-6xl text-jig-primary mx-auto opacity-25" />
            </div>
          </div>
          <p className="text-xl text-gray-600">Chargement de vos suivis...</p>
          <p className="text-sm text-gray-500 mt-2">Récupération des données</p>
        </div>
      </div>
    )
  }

  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-4" data-aos="zoom-in">
          <FiAlertTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès restreint</h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à la page de suivi des projets.
          </p>
          <Link 
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 bg-jig-primary text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FiUser className="mr-2" />
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NotificationToast 
        notification={notification}
        onClose={hideNotification}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b" data-aos="fade-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/mes-projets" 
                className="flex items-center text-gray-600 hover:text-jig-primary transition-colors duration-300"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Suivi des projets
                </h1>
                <p className="text-gray-600 mt-1">
                  Historique et activités de {onlyMyProjects ? 'vos' : 'tous les'} projets
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <FiEye className="w-4 h-4 mr-1" />
                  <span>{filteredSuivis.length} activité{filteredSuivis.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiFileText className="w-4 h-4 mr-1" />
                  <span>{Object.keys(suivisGroupes).length} projet{Object.keys(suivisGroupes).length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchData(false)}
                  disabled={refreshing}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-jig-primary hover:bg-gray-100 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
                
                {(user?.role === 'ADMIN' || user?.role === 'JURY') && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-jig-primary text-white hover:bg-red-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Ajouter suivi
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-aos="fade-up" data-aos-delay="100">
            {/* Recherche */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Filtre par projet */}
            <select
              value={selectedProjet}
              onChange={(e) => setSelectedProjet(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-300"
            >
              <option value="">Tous les projets</option>
              {projets.map(projet => (
                <option key={projet.id} value={projet.id}>
                  {projet.titre}
                </option>
              ))}
            </select>

            {/* Filtre par type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-300"
            >
              <option value="">Tous les types</option>
              {typesReaction.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Toggle mes projets */}
            {(user?.role === 'ADMIN' || user?.role === 'JURY') && (
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyMyProjects}
                    onChange={(e) => setOnlyMyProjects(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    onlyMyProjects ? 'bg-jig-primary' : 'bg-gray-300'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      onlyMyProjects ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                  <span className="ml-3 text-sm text-gray-700">
                    Mes projets uniquement
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(suivisGroupes).length === 0 ? (
          <div className="text-center py-16" data-aos="fade-up">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <FiFileText className="text-8xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Aucun suivi trouvé
              </h3>
              <p className="text-gray-600 mb-8">
                {searchTerm || selectedProjet || selectedType 
                  ? 'Aucun suivi ne correspond à vos critères de recherche.'
                  : 'Il n\'y a pas encore d\'activité de suivi pour vos projets.'
                }
              </p>
              {(searchTerm || selectedProjet || selectedType) && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedProjet('')
                    setSelectedType('')
                  }}
                  className="inline-flex items-center px-6 py-3 bg-jig-primary text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FiX className="w-4 h-4 mr-2" />
                  Effacer les filtres
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(suivisGroupes).map(([projetId, data]) => {
              const { projet, suivis } = data
              return (
                <div
                  key={projetId}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {/* En-tête du projet */}
                  <div className="bg-gradient-to-r from-jig-primary to-red-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {projet.titre}
                        </h2>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            projet.statut === 'APPROUVE' ? 'bg-green-100 text-green-800' :
                            projet.statut === 'REJETE' ? 'bg-red-100 text-red-800' :
                            projet.statut === 'TERMINE' ? 'bg-blue-100 text-blue-800' :
                            projet.statut === 'EVALUE' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {projet.statut}
                          </span>
                          <span className="text-red-100 text-sm flex items-center">
                            <FiClock className="w-4 h-4 mr-1" />
                            {suivis.length} activité{suivis.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link 
                          href={`/mes-projets/${projetId}`}
                          className="flex items-center px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all duration-300"
                        >
                          <FiEye className="w-4 h-4 mr-1" />
                          Voir
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Timeline des activités */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {suivis
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((suivi, index) => (
                        <div
                          key={suivi.id}
                          className={`border-l-4 pl-6 pr-4 py-4 rounded-r-lg ${getTypeColor(suivi.typeReaction)} transition-all duration-300 hover:shadow-md`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="flex-shrink-0 mt-1">
                                {getTypeIcon(suivi.typeReaction)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                    {suivi.typeReaction.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-gray-900 leading-relaxed">
                                  {suivi.message}
                                </p>
                                
                                {/* Auteur */}
                                {(suivi.user || suivi.jury) && (
                                  <div className="mt-3 flex items-center space-x-2">
                                    <FiUser className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      Par{' '}
                                      {suivi.user 
                                        ? `${suivi.user.prenom} ${suivi.user.nom}` 
                                        : `${suivi.jury.prenom} ${suivi.jury.nom}`
                                      }
                                      {suivi.jury?.specialite && (
                                        <span className="text-gray-500"> - {suivi.jury.specialite}</span>
                                      )}
                                    </span>
                                  </div>
                                )}

                                {/* Métadonnées */}
                                {suivi.metadata && (
                                  <div className="mt-3">
                                    {typeof suivi.metadata === 'string' ? (
                                      <span className="text-sm text-gray-600 italic">
                                        {suivi.metadata}
                                      </span>
                                    ) : suivi.metadata.score !== undefined ? (
                                      <div className="flex items-center space-x-2">
                                        <FiStar className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm font-medium text-gray-700">
                                          Note: {suivi.metadata.score}/5
                                        </span>
                                      </div>
                                    ) : (
                                      <pre className="text-sm text-gray-600 bg-gray-100 rounded p-2 mt-2 overflow-x-auto">
                                        {JSON.stringify(suivi.metadata, null, 2)}
                                      </pre>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span>{formatDate(suivi.createdAt)}</span>
                              {(user?.role === 'ADMIN') && (
                                <div className="flex items-center space-x-1">
                                  <button className="p-1 hover:bg-gray-200 rounded transition-colors duration-300">
                                    <FiEdit3 className="w-3 h-3" />
                                  </button>
                                  <button className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors duration-300">
                                    <FiTrash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal ajout suivi */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" data-aos="zoom-in">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ajouter un suivi
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Sélection du projet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projet
                </label>
                <select
                  value={selectedProjetForAdd}
                  onChange={(e) => setSelectedProjetForAdd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Sélectionner un projet</option>
                  {projets.map(projet => (
                    <option key={projet.id} value={projet.id}>
                      {projet.titre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type de réaction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'activité
                </label>
                <select
                  value={newSuiviData.typeReaction}
                  onChange={(e) => setNewSuiviData(prev => ({ ...prev, typeReaction: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  {typesReaction.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newSuiviData.message}
                  onChange={(e) => setNewSuiviData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Décrivez l'activité ou le commentaire..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-300 resize-none"
                  required
                />
              </div>

              {/* Visibilité */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newSuiviData.visible}
                    onChange={(e) => setNewSuiviData(prev => ({ ...prev, visible: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    newSuiviData.visible ? 'bg-jig-primary' : 'bg-gray-300'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      newSuiviData.visible ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                  <span className="ml-3 text-sm text-gray-700">
                    Visible par l'étudiant
                  </span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
              >
                Annuler
              </button>
              <button
                onClick={handleAddSuivi}
                className="px-4 py-2 bg-jig-primary text-white hover:bg-red-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}