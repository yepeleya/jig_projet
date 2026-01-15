'use client'

import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Trophy, 
  Users, 
  Scale, 
  Download,
  Eye,
  Search,
  Calendar,
  Award,
  ToggleLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  Timer
} from 'lucide-react'

interface Projet {
  id: number
  rang: number
  titre: string
  description: string
  categorie: string
  image: string
  auteur: {
    nom: string
    prenom: string
    niveau: string
    ecole: string
    filiere: string
    email: string
  }
  votes: {
    total: number
    jury: number
    etudiants: number
    utilisateurs: number
    public: number
  }
  scores: {
    final: number
    jury: number
    public: number
  }
  createdAt: string
}

interface ClassementData {
  projets: Projet[]
  total: number
  type: string
  configuration: {
    isPublic: boolean
    canActivate: boolean
    dateLimiteVotes: string
    votesActifs: boolean
  }
}

export default function ResultatsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'popular' | 'final'>('final')
  const [showSettings, setShowSettings] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const queryClient = useQueryClient()

  // Test de connexion au backend
  const checkBackendConnection = useCallback(async () => {
    try {
      // Test avec l'endpoint public de visibilité
      const response = await fetch('http://localhost:5000/api/classement/visible')
      if (response.ok) {
        setConnectionStatus('connected')
        return true
      } else {
        setConnectionStatus('error')
        return false
      }
    } catch (error) {
      console.error('Erreur de connexion backend:', error)
      setConnectionStatus('error')
      return false
    }
  }, [])

  // Initialiser la vérification de connexion
  useEffect(() => {
    // Pas besoin d'auto-configuration, utiliser le token du dashboard
    
    // Vérifier la connexion de façon asynchrone
    setTimeout(() => {
      checkBackendConnection()
    }, 0)
  }, [checkBackendConnection])

  // Récupération du classement
  const { data: classementData, isLoading, error, refetch } = useQuery({
    queryKey: ['classement', sortBy],
    queryFn: async (): Promise<ClassementData> => {
      // Vérifier s'il y a un token d'authentification (utiliser le bon nom de token du dashboard)
      const token = localStorage.getItem('admin-token')
      
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.')
      }

      const response = await fetch(`http://localhost:5000/api/classement?type=${sortBy}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré ou invalide
          localStorage.removeItem('admin-token')
          localStorage.removeItem('admin-user')
          throw new Error('Session expirée. Veuillez vous reconnecter.')
        }
        if (response.status === 403) {
          throw new Error('Accès refusé. Droits administrateur requis.')
        }
        throw new Error(`Erreur serveur: ${response.status}`)
      }
      
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la récupération des données')
      }
      
      return result.data
    },
    retry: 1, // Ne réessayer qu'une fois
    retryDelay: 1000,
    enabled: connectionStatus === 'connected' // Activer seulement si connecté
  })

  // Mutation pour basculer la visibilité
  const toggleVisibilityMutation = useMutation({
    mutationFn: async (visible: boolean) => {
      const token = localStorage.getItem('admin-token')
      
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.')
      }

      const response = await fetch('http://localhost:5000/api/classement/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ visible })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin-token')
          localStorage.removeItem('admin-user')
          throw new Error('Session expirée. Veuillez vous reconnecter.')
        }
        if (response.status === 403) {
          throw new Error('Accès refusé. Droits administrateur requis.')
        }
        
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || `Erreur serveur: ${response.status}`)
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classement'] })
      // Afficher une notification de succès
    },
    onError: (error: Error) => {
      console.error('Erreur toggle visibilité:', error)
      
      // Rediriger vers la connexion si problème d'authentification
      if (error.message.includes('Session expirée') || error.message.includes('Token d\'authentification manquant')) {
        window.location.href = '/login'
        return
      }
      
      alert(`Erreur: ${error.message}`)
    }
  })

  // Données filtrées
  const filteredProjets = classementData?.projets?.filter(projet =>
    projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${projet.auteur.prenom} ${projet.auteur.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.auteur.ecole.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Fonctions utilitaires
  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2: return <Award className="w-6 h-6 text-gray-400" />
      case 3: return <Award className="w-6 h-6 text-orange-600" />
      default: return (
        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-gray-600">#{position}</span>
        </div>
      )
    }
  }

  const exportResults = () => {
    if (!classementData?.projets) return
    
    const headers = [
      'Rang',
      'Titre du Projet', 
      'Auteur',
      'Niveau',
      'École',
      'Catégorie',
      sortBy === 'final' ? 'Score Final' : 'Total Votes',
      'Votes Jury',
      'Votes Public',
      'Date de création'
    ]
    
    const rows = classementData.projets.map((projet) => [
      projet.rang,
      projet.titre,
      `${projet.auteur.prenom} ${projet.auteur.nom}`,
      projet.auteur.niveau,
      projet.auteur.ecole,
      projet.categorie,
      sortBy === 'final' ? projet.scores.final : projet.votes.total,
      projet.votes.jury,
      projet.votes.public,
      new Date(projet.createdAt).toLocaleDateString('fr-FR')
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `classement_${sortBy}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getTimeRemaining = () => {
    if (!classementData?.configuration.dateLimiteVotes) return null
    
    const now = new Date()
    const deadline = new Date(classementData.configuration.dateLimiteVotes)
    const timeLeft = deadline.getTime() - now.getTime()
    
    if (timeLeft <= 0) return null
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return { days, hours }
  }

  const timeRemaining = getTimeRemaining()

  if (isLoading || connectionStatus === 'checking') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {connectionStatus === 'checking' ? 'Vérification de la connexion...' : 'Chargement du classement...'}
          </p>
        </div>
      </div>
    )
  }

  if (error || connectionStatus === 'error') {
    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion'
    const isAuthError = errorMessage.includes('Session expirée') || errorMessage.includes('Token d\'authentification manquant')
    
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-2xl">
          <div className="text-red-600 text-6xl mb-4">
            {isAuthError ? '🔒' : '⚠️'}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isAuthError ? 'Authentification requise' : 'Erreur de connexion'}
          </h3>
          <p className="text-gray-500 mb-4">
            {errorMessage}
          </p>
          
          {/* Instructions pour configurer le token */}
          {isAuthError && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-4">
              <h4 className="font-medium text-blue-900 mb-2">🔧 Configuration du token d&apos;authentification</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p>1. Ouvrez une nouvelle fenêtre de terminal</p>
                <p>2. Naviguez vers le backend : <code className="bg-blue-100 px-1 rounded">cd c:\wamp64\www\jig_projet\jig2026\backend</code></p>
                <p>3. Générez un token : <code className="bg-blue-100 px-1 rounded">node generate-admin-token.mjs</code></p>
                <p>4. Copiez le token généré</p>
                <p>5. Ouvrez la console du navigateur (F12)</p>
                <p>6. Exécutez : <code className="bg-blue-100 px-1 rounded">localStorage.setItem(&apos;adminToken&apos;, &apos;VOTRE_TOKEN&apos;)</code></p>
                <p>7. Rafraîchissez cette page</p>
              </div>
            </div>
          )}
          
          <div className="space-x-2">
            {isAuthError ? (
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Vérifier l&apos;authentification
              </button>
            ) : (
              <>
                <button 
                  onClick={() => checkBackendConnection()} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Tester la connexion
                </button>
                <button 
                  onClick={() => refetch()} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Réessayer
                </button>
              </>
            )}
          </div>
          
          {/* Informations de débogage */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-left text-xs text-gray-600">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Backend:</strong> http://localhost:5000</div>
              <div><strong>Token admin:</strong> {localStorage.getItem('admin-token') ? 'Oui' : 'Non'}</div>
              <div><strong>Utilisateur:</strong> {localStorage.getItem('admin-user') ? JSON.parse(localStorage.getItem('admin-user') || '{}').nom : 'Non connecté'}</div>
              <div><strong>Status:</strong> {connectionStatus}</div>
              <div><strong>Heure:</strong> {new Date().toLocaleString('fr-FR')}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Header avec contrôles */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Classement des Projets</h1>
          <p className="text-gray-600 mt-2">
            Gestion et contrôle de la visibilité publique du classement JIG 2026
          </p>
          
          {/* Statut et temps restant */}
          <div className="flex items-center space-x-4 mt-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              classementData?.configuration.isPublic 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {classementData?.configuration.isPublic ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Classement Public</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Classement Privé</span>
                </>
              )}
            </div>
            
            {timeRemaining && (
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                <Timer className="w-4 h-4" />
                <span>{timeRemaining.days}j {timeRemaining.hours}h restants</span>
              </div>
            )}
            
            {!classementData?.configuration.votesActifs && (
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <Clock className="w-4 h-4" />
                <span>Votes terminés</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 lg:mt-0 flex flex-col space-y-3">
          {/* Bouton d'activation/désactivation */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => toggleVisibilityMutation.mutate(!classementData?.configuration.isPublic)}
              disabled={!classementData?.configuration.canActivate && !classementData?.configuration.isPublic}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                classementData?.configuration.isPublic
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : classementData?.configuration.canActivate
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ToggleLeft className="w-4 h-4" />
              <span>
                {classementData?.configuration.isPublic 
                  ? 'Désactiver le classement public'
                  : 'Activer le classement public'
                }
              </span>
            </button>
          </div>
          
          {!classementData?.configuration.canActivate && !classementData?.configuration.isPublic && (
            <div className="flex items-center space-x-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span>Le classement peut être activé après la fin des votes</span>
            </div>
          )}
          
          {/* Boutons d'action */}
          <div className="flex space-x-2">
            <button 
              onClick={exportResults}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
            
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Paramètres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Panel de paramètres */}
      {showSettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres du Classement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date limite des votes
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">
                  {classementData?.configuration.dateLimiteVotes 
                    ? new Date(classementData.configuration.dateLimiteVotes).toLocaleDateString('fr-FR')
                    : 'Non définie'
                  }
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut des votes
              </label>
              <div className={`flex items-center space-x-2 ${
                classementData?.configuration.votesActifs ? 'text-green-600' : 'text-red-600'
              }`}>
                {classementData?.configuration.votesActifs ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span>
                  {classementData?.configuration.votesActifs ? 'Actifs' : 'Terminés'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Projets au classement</p>
              <p className="text-2xl font-bold text-gray-900">{classementData?.total || 0}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Votes Jury Total</p>
              <p className="text-2xl font-bold text-purple-600">
                {classementData?.projets?.reduce((sum, p) => sum + p.votes.jury, 0) || 0}
              </p>
            </div>
            <Scale className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Votes Public Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {classementData?.projets?.reduce((sum, p) => sum + p.votes.public, 0) || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Votes Total</p>
              <p className="text-2xl font-bold text-red-600">
                {classementData?.projets?.reduce((sum, p) => sum + p.votes.total, 0) || 0}
              </p>
            </div>
            <Eye className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Contrôles du tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'final')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="final">Classement Final (Pondéré)</option>
              <option value="popular">Classement Populaire</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par projet, auteur ou école..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Tableau des résultats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            {sortBy === 'final' ? 'Classement Final (70% Jury + 30% Public)' : 'Classement Populaire (Total des votes)'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Rang</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Projet</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Auteur</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Niveau</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  {sortBy === 'final' ? 'Score Final' : 'Total Votes'}
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Détails Votes</th>
                <th className="text-right py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjets.map((projet) => (
                <tr key={projet.id} className={`hover:bg-gray-50 transition-colors ${
                  projet.rang === 1 ? 'bg-yellow-50' : 
                  projet.rang === 2 ? 'bg-gray-50' :
                  projet.rang === 3 ? 'bg-orange-50' : ''
                }`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getMedalIcon(projet.rang)}
                      {projet.rang === 1 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                          🏆 Gagnant
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-gray-900">{projet.titre}</div>
                      <div className="text-sm text-gray-500">{projet.categorie}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">
                        {projet.auteur.prenom} {projet.auteur.nom}
                      </div>
                      <div className="text-sm text-gray-500">{projet.auteur.ecole}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {projet.auteur.niveau}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-2xl font-bold text-red-600">
                      {sortBy === 'final' ? projet.scores.final : projet.votes.total}
                    </div>
                    {sortBy === 'final' && (
                      <div className="text-xs text-gray-500">
                        Jury: {projet.scores.jury} • Public: {projet.scores.public}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col space-y-1 text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-purple-600">
                          <Scale className="w-4 h-4 mr-1" />
                          {projet.votes.jury} jury
                        </span>
                        <span className="flex items-center text-blue-600">
                          <Users className="w-4 h-4 mr-1" />
                          {projet.votes.public} public
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Total: {projet.votes.total} votes
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjets.length === 0 && (
          <div className="p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Aucun projet trouvé' : 'Aucun résultat disponible'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Essayez de modifier vos critères de recherche.' 
                : 'Les votes n\'ont pas encore commencé ou aucun projet n\'a reçu de votes.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}