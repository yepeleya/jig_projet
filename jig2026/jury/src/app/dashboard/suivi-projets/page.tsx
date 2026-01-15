'use client'

import { useState, useEffect, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  MessageCircle, 
  Star, 
  User, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Timer,
  X,
  Loader,
  Save,
  Eye
} from 'lucide-react'

// Types TypeScript
interface UserInfo {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  specialite?: string;
}

interface Projet {
  id: number;
  titre: string;
  description: string;
  statut: 'APPROUVE' | 'REJETE' | 'TERMINE' | 'EVALUE';
  user?: UserInfo;
}

interface Activite {
  id: number;
  typeReaction: string;
  message: string;
  visible: boolean;
  auteur?: UserInfo;
  createdAt: string;
  metadata?: {
    score?: number;
  };
}

// Mock API pour remplacer l'import manquant
const juryApi = {
  getProjets: async (): Promise<Projet[]> => {
    // Mock data - remplacer par un vrai appel API
    return [];
  },
  getSuiviProjet: async (_projetId: number): Promise<Activite[]> => {
    // Mock data - remplacer par un vrai appel API
    return [];
  },
  addRemarque: async (remarque: { typeReaction: string; message: string; visible: boolean }): Promise<void> => {
    // Mock implementation - remplacer par un vrai appel API
    console.log('Ajout remarque:', remarque);
  }
};

export default function SuiviProjetsPage() {
  const [projets, setProjets] = useState<Projet[]>([])
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null)
  const [suiviProjet, setSuiviProjet] = useState<Activite[]>([])
  const [newRemarque, setNewRemarque] = useState({
    typeReaction: 'AVIS_JURY',
    message: '',
    visible: true
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Récupérer les projets au chargement
  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const response = await juryApi.getProjets()
        setProjets(response)
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error)
        setError('Erreur de connexion au serveur')
      } finally {
        setLoading(false)
      }
    }

    fetchProjets()
  }, [])

  // Récupérer le suivi d'un projet spécifique
  const fetchSuiviProjet = async (projetId: number) => {
    try {
      const token = localStorage.getItem('juryToken')
      const response = await fetch(`http://localhost:5000/api/projet-suivi/${projetId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.success) {
        setSuiviProjet(data.data || [])
      } else {
        console.error('Erreur chargement suivi:', data.message)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du suivi:', error)
    }
  }

  // Sélectionner un projet et charger son suivi
  const handleSelectProjet = (projet: Projet) => {
    setSelectedProjet(projet)
    fetchSuiviProjet(projet.id)
  }

  // Ajouter une nouvelle remarque
  const handleAddRemarque = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!newRemarque.message.trim()) {
      alert('Veuillez saisir une remarque')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('juryToken')
      const response = await fetch('http://localhost:5000/api/projet-suivi', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projetId: selectedProjet?.id || 0,
          typeReaction: newRemarque.typeReaction,
          message: newRemarque.message,
          visible: newRemarque.visible
        })
      })

      const data = await response.json()
      if (data.success) {
        // Recharger le suivi
        if (selectedProjet) {
          fetchSuiviProjet(selectedProjet.id)
        }
        // Réinitialiser le formulaire
        setNewRemarque({
          typeReaction: 'AVIS_JURY',
          message: '',
          visible: true
        })
        alert('Remarque ajoutée avec succès !')
      } else {
        alert('Erreur lors de l\'ajout de la remarque: ' + data.message)
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la remarque:', error)
      alert('Erreur de connexion au serveur')
    } finally {
      setSubmitting(false)
    }
  }

  // Fonction pour obtenir l'icône selon le type de réaction
  const getReactionIcon = (typeReaction: string) => {
    switch (typeReaction) {
      case 'VOTE':
        return <Star className="text-yellow-500" />
      case 'COMMENTAIRE':
        return <MessageCircle className="text-blue-500" />
      case 'MODIFICATION':
        return <CheckCircle className="text-green-500" />
      case 'AVIS_JURY':
        return <User className="text-purple-500" />
      case 'VALIDATION':
        return <CheckCircle className="text-green-600" />
      case 'REJET':
        return <X className="text-red-500" />
      case 'DEMANDE_MODIFICATION':
        return <AlertTriangle className="text-orange-500" />
      case 'NOTE_INTERNE':
        return <MessageCircle className="text-gray-500" />
      default:
        return <Timer className="text-gray-500" />
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
      case 'NOTE_INTERNE':
        return 'border-l-gray-500 bg-gray-50'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-4xl mx-auto mb-4" style={{ color: '#9E1B32' }} />
          <p className="text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Suivi des projets
          </h1>
          <p className="text-gray-600 mt-1">
            Consultez et ajoutez des remarques aux projets soumis
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Liste des projets */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200" style={{ backgroundColor: '#9E1B32' }}>
                <h2 className="text-lg font-semibold text-white">
                  Projets ({projets.length})
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {projets.map((projet) => (
                  <div
                    key={projet.id}
                    onClick={() => handleSelectProjet(projet)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedProjet?.id === projet.id ? 'bg-red-50 border-l-4 border-l-red-600' : ''
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 truncate">
                      {projet.titre}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {projet.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        projet.statut === 'APPROUVE' ? 'bg-green-100 text-green-800' :
                        projet.statut === 'REJETE' ? 'bg-red-100 text-red-800' :
                        projet.statut === 'TERMINE' ? 'bg-blue-100 text-blue-800' :
                        projet.statut === 'EVALUE' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {projet.statut}
                      </span>
                      {projet.user && (
                        <span className="text-xs text-gray-500">
                          {projet.user.prenom} {projet.user.nom}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Détails du projet sélectionné */}
          <div className="lg:col-span-2">
            {selectedProjet ? (
              <div className="space-y-6">
                {/* Informations du projet */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: '#9E1B32' }}>
                    <h2 className="text-xl font-semibold text-white">
                      {selectedProjet.titre}
                    </h2>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-gray-700 mb-4">
                      {selectedProjet.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedProjet.statut === 'APPROUVE' ? 'bg-green-100 text-green-800' :
                        selectedProjet.statut === 'REJETE' ? 'bg-red-100 text-red-800' :
                        selectedProjet.statut === 'TERMINE' ? 'bg-blue-100 text-blue-800' :
                        selectedProjet.statut === 'EVALUE' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedProjet.statut}
                      </span>
                      {selectedProjet.user && (
                        <span className="text-sm text-gray-600">
                          Auteur: {selectedProjet.user.prenom} {selectedProjet.user.nom}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Formulaire d'ajout de remarque */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Plus className="mr-2 text-green-600" />
                      Ajouter une remarque
                    </h3>
                  </div>
                  <form onSubmit={handleAddRemarque} className="px-6 py-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de remarque
                      </label>
                      <select
                        value={newRemarque.typeReaction}
                        onChange={(e) => setNewRemarque({...newRemarque, typeReaction: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="AVIS_JURY">Avis du jury</option>
                        <option value="DEMANDE_MODIFICATION">Demande de modification</option>
                        <option value="VALIDATION">Validation</option>
                        <option value="REJET">Rejet</option>
                        <option value="NOTE_INTERNE">Note interne</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={newRemarque.message}
                        onChange={(e) => setNewRemarque({...newRemarque, message: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Saisissez votre remarque..."
                        required
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="visible"
                        checked={newRemarque.visible}
                        onChange={(e) => setNewRemarque({...newRemarque, visible: e.target.checked})}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="visible" className="ml-2 block text-sm text-gray-700">
                        <Eye className="inline mr-1" />
                        Visible par l&apos;étudiant
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      style={{ backgroundColor: '#9E1B32' }}
                    >
                      {submitting ? (
                        <>
                          <Loader className="animate-spin mr-2" />
                          Ajout en cours...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2" />
                          Ajouter la remarque
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Historique du suivi */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Historique du suivi ({suiviProjet.length})
                    </h3>
                  </div>
                  <div className="px-6 py-4">
                    {suiviProjet.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        Aucun suivi pour ce projet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {suiviProjet.map((activite, index) => (
                          <motion.div
                            key={activite.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`border-l-4 pl-4 py-3 rounded-r-lg ${getReactionColor(activite.typeReaction)}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="shrink-0 mt-1">
                                  {getReactionIcon(activite.typeReaction)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <p className="text-gray-900 font-medium">
                                      {activite.message}
                                    </p>
                                    {!activite.visible && (
                                      <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                                        Masqué
                                      </span>
                                    )}
                                  </div>
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
                                        <Star className="mr-1" />
                                        {activite.metadata.score}/5
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="mr-1" />
                                {formatDate(activite.createdAt)}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Eye className="text-4xl mx-auto mb-4" />
                  <p className="text-lg">Sélectionnez un projet</p>
                  <p className="text-sm">pour voir son suivi et ajouter des remarques</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}