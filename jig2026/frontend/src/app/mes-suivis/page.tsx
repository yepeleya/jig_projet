'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaEye, 
  FaComment, 
  FaStar, 
  FaUser, 
  FaClock, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaTimes,
  FaSpinner
} from 'react-icons/fa'

import apiServices from '@/services/api'
import { useAuthStore } from '@/store/authStore'

type Auteur = {
  nom: string;
  prenom: string;
  specialite?: string;
};

type Activite = {
  id: number;
  projetId: number;
  projet: Projet;
  typeReaction: string;
  message: string;
  auteur?: Auteur;
  metadata?: { score?: number };
  createdAt: string;
};

type Projet = {
  titre: string;
  statut: string;
};

export default function MesSuivisPage() {
  const [suivis, setSuivis] = useState<Activite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  
  // Vérifier l'état d'authentification via le store Zustand
  const { user, token, isAuthenticated, initAuth } = useAuthStore()

  // Initialiser l'authentification au chargement
  useEffect(() => {
    // Forcer l'initialisation de l'authentification si pas déjà fait
    if (!isAuthenticated) {
      console.log('🔄 Initialisation de l\'authentification...')
      initAuth()
    }
  }, [isAuthenticated, initAuth])

  // Récupérer les suivis au chargement
  useEffect(() => {
    const fetchSuivis = async () => {
      try {
        // Diagnostic complet de l'authentification
        console.log('🔍 État Zustand:', { 
          user: user ? `${user.nom} ${user.prenom} (${user.role})` : 'null',
          tokenZustand: token ? 'Présent' : 'Absent',
          isAuthenticated 
        })
        
        const tokenAPI = apiServices.auth.getToken()
        console.log('🔑 Token API récupéré:', tokenAPI ? 'Présent' : 'Absent')
        
        // Vérifier qu'on a au moins un token (soit Zustand soit API)
        if (!tokenAPI && !token) {
          console.error('❌ Aucun token d\'authentification trouvé')
          setError('Vous devez être connecté pour voir vos suivis')
          setLoading(false)
          return
        }

        console.log('✅ Authentification OK - Appel API getMesSuivis...')
        console.log('🌐 URL API:', apiServices.projetSuivi)
        
        try {
          const response = await apiServices.projetSuivi.getMesSuivis()
          console.log('Réponse API getMesSuivis:', response)

          if (response && response.success) {
            console.log('Données suivis reçues:', response.data)
            setSuivis(response.data as Activite[] || [])
          } else {
            console.log('Erreur API ou pas de succès:', response)
            setError(response?.message || 'Erreur lors du chargement des suivis')
          }
        } catch (apiError: any) {
          console.error('Erreur API:', apiError)
          
          // Vérifier si c'est une erreur d'authentification (token expiré)
          if (apiError.message && apiError.message.includes('Token invalide')) {
            console.log('🔑 Token expiré détecté - Nettoyage et redirection')
            
            // Nettoyer les tokens expirés
            localStorage.removeItem('jig2026_token')
            localStorage.removeItem('jig-auth-storage')
            
            // Rediriger vers la page de connexion
            window.location.href = '/auth/login'
            return
          }
          
          setError('Erreur lors du chargement des suivis')
        }
      } catch (err) {
        console.error('Erreur lors du chargement des suivis:', err)
        const error = err as Error;
        if (error.message && (error.message.includes('401') || error.message.includes('Token'))) {
          setError('Session expirée, veuillez vous reconnecter')
        } else {
          setError('Erreur de connexion au serveur')
        }
      } finally {
        setLoading(false)
      }
    }
    
    // Attendre que l'authentification soit initialisée ou qu'un token API soit présent
    const tokenAPI = apiServices.auth.getToken()
    if (isAuthenticated || tokenAPI) {
      fetchSuivis()
    }
  }, [isAuthenticated]) // Relancer quand l'authentification change

  // Fonction pour obtenir l'icône selon le type de réaction
  const getReactionIcon = (typeReaction: string) => {
    switch (typeReaction) {
      case 'VOTE':
        return <FaStar className="text-yellow-500" />
      case 'COMMENTAIRE':
        return <FaComment className="text-blue-500" />
      case 'MODIFICATION':
        return <FaCheckCircle className="text-green-500" />
      case 'AVIS_JURY':
        return <FaUser className="text-purple-500" />
      case 'VALIDATION':
        return <FaCheckCircle className="text-green-600" />
      case 'REJET':
        return <FaTimes className="text-red-500" />
      case 'DEMANDE_MODIFICATION':
        return <FaExclamationTriangle className="text-orange-500" />
      default:
        return <FaHourglassHalf className="text-gray-500" />
    }
  }

  // Fonction pour obtenir la couleur selon le type de réaction
  const getReactionColor = (typeReaction: string) => {
    switch (typeReaction) {
      case 'VOTE':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'COMMENTAIRE':
        return 'border-l-blue-500 bg-blue-50'
      case 'MODIFICATION':
        return 'border-l-green-500 bg-green-50'
      case 'AVIS_JURY':
        return 'border-l-purple-500 bg-purple-50'
      case 'VALIDATION':
        return 'border-l-green-600 bg-green-50'
      case 'REJET':
        return 'border-l-red-500 bg-red-50'
      case 'DEMANDE_MODIFICATION':
        return 'border-l-orange-500 bg-orange-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Regrouper les suivis par projet
  type SuivisProjet = {
    [projetId: number]: {
      projet: Projet;
      activites: Activite[];
    }
  };
  const suivisByProjet: SuivisProjet = suivis.reduce((acc: SuivisProjet, suivi: Activite) => {
    const projetId = suivi.projetId;
    if (!acc[projetId]) {
      acc[projetId] = {
        projet: suivi.projet,
        activites: []
      };
    }
    acc[projetId].activites.push(suivi);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" style={{ color: '#9E1B32' }} />
          <p className="text-gray-600">Chargement de vos suivis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Suivi de mes projets
              </h1>
              <p className="text-gray-600 mt-1">
                Consultez l&apos;historique et les retours sur vos projets soumis
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FaEye />
              <span>{suivis.length} activité{suivis.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(suivisByProjet).length === 0 ? (
          <div className="text-center py-12">
            <FaHourglassHalf className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucun suivi disponible
            </h3>
            <p className="text-gray-500">
              Vous n&apos;avez pas encore de projets avec des activités de suivi.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(suivisByProjet).map(([projetId, value]) => {
              const { projet, activites } = value;
              return (
                <motion.div
                  key={projetId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  {/* En-tête du projet */}
                  <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: '#9E1B32' }}>
                    <h2 className="text-xl font-semibold text-white">
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
                      <span className="text-red-100 text-sm">
                        {activites.length} activité{activites.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Timeline des activités */}
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {activites.map((activite: Activite, index: number) => (
                        <motion.div
                          key={activite.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`border-l-4 pl-4 py-3 rounded-r-lg ${getReactionColor(activite.typeReaction)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                {getReactionIcon(activite.typeReaction)}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-900 font-medium">
                                  {activite.message}
                                </p>
                                {activite.auteur && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Par {activite.auteur.prenom} {activite.auteur.nom}
                                    {activite.auteur.specialite && (
                                      <span className="text-gray-500"> - {activite.auteur.specialite}</span>
                                    )}
                                  </p>
                                )}
                                {activite.metadata && activite.metadata.score && (
                                  <div className="mt-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      <FaStar className="mr-1" />
                                      {activite.metadata.score}/5
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <FaClock className="mr-1" />
                              {formatDate(activite.createdAt)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}