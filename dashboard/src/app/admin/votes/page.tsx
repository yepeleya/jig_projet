'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type Vote, type Score } from '@/lib/api'
import { 
  BarChart3, 
  Search, 
  Eye, 
  Trash2, 
  Star,
  Users,
  Scale,
  TrendingUp,
  Award,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function VotesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'ALL' | 'JURY' | 'ETUDIANT'>('ALL')
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const queryClient = useQueryClient()

  // Récupération des votes
  const { data: votes = [], isLoading } = useQuery({
    queryKey: ['votes'],
    queryFn: () => adminApi.getVotes()
  })

  // Récupération des scores finaux
  const { data: scores = [], isLoading: isLoadingScores } = useQuery({
    queryKey: ['scores'],
    queryFn: () => adminApi.getScores()
  })

  // Mutation pour supprimer un vote
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteVote,
    onSuccess: () => {
      toast.success('Vote supprimé avec succès')
      queryClient.invalidateQueries({ queryKey: ['votes'] })
      queryClient.invalidateQueries({ queryKey: ['scores'] })
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  // Calculs des statistiques
  const totalVotes = votes.length
  const votesJury = votes.filter(vote => vote.typeVote === 'JURY').length
  const votesEtudiants = votes.filter(vote => vote.typeVote === 'ETUDIANT').length
  const moyenneGenerale = votes.length > 0 
    ? (votes.reduce((sum, vote) => sum + vote.valeur, 0) / votes.length).toFixed(2)
    : '0.00'

  // Filtrage des votes
  const filteredVotes = votes.filter(vote => {
    const matchesSearch = 
      vote.projet?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.user?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.user?.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'ALL' || vote.typeVote === filterType
    
    return matchesSearch && matchesType
  })

  const handleDelete = (voteId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce vote ?')) {
      deleteMutation.mutate(voteId)
    }
  }

  const handleView = (vote: Vote) => {
    setSelectedVote(vote)
    setShowDetailModal(true)
  }

  const exportScores = async () => {
    try {
      await adminApi.exportData('scores')
      toast.success('Export des scores en cours...')
    } catch {
      toast.error('Erreur lors de l\'export')
    }
  }

  if (isLoading || isLoadingScores) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Votes</h1>
          <p className="text-gray-600 mt-2">
            {totalVotes} vote{totalVotes > 1 ? 's' : ''} • Système pondéré : 70% Jury / 30% Public
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex space-x-3">
          <button 
            onClick={exportScores}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Résultats</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{totalVotes}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Votes Jury (70%)</p>
              <p className="text-2xl font-bold text-red-600">{votesJury}</p>
            </div>
            <Scale className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Votes Public (30%)</p>
              <p className="text-2xl font-bold text-blue-600">{votesEtudiants}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Moyenne Générale</p>
              <p className="text-2xl font-bold text-green-600">{moyenneGenerale}/5</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Classement des projets */}
      {scores.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">🏆 Classement Final</h2>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
          
          <div className="space-y-4">
            {scores.slice(0, 5).map((score: Score, index: number) => (
              <div 
                key={score.projetId} 
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  index === 0 ? 'border-yellow-300 bg-yellow-50' :
                  index === 1 ? 'border-gray-300 bg-gray-50' :
                  index === 2 ? 'border-orange-300 bg-orange-50' :
                  'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{score.titre}</h3>
                    <p className="text-sm text-gray-500">par {score.auteur}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-lg">{score.scoreFinal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Jury: {score.scoreJury.toFixed(1)} • Public: {score.scorePublic.toFixed(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par projet ou votant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            {['ALL', 'JURY', 'ETUDIANT'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as 'ALL' | 'JURY' | 'ETUDIANT')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'ALL' ? 'Tous' : type === 'JURY' ? 'Jury' : 'Public'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des votes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Projet</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Votant</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Note</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVotes.map((vote) => (
                <tr key={vote.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{vote.projet?.titre || 'Projet supprimé'}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">
                        {vote.user?.prenom || 'Utilisateur'} {vote.user?.nom || 'supprimé'}
                      </p>
                      <p className="text-sm text-gray-500">{vote.user?.email || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      vote.typeVote === 'JURY' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {vote.typeVote === 'JURY' ? (
                        <>
                          <Scale className="w-3 h-3 mr-1" />
                          Jury (70%)
                        </>
                      ) : (
                        <>
                          <Users className="w-3 h-3 mr-1" />
                          Public (30%)
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < vote.valeur ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-semibold">{vote.valeur}/5</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500">
                      {new Date(vote.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(vote)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vote.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVotes.length === 0 && (
          <div className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun vote trouvé</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'ALL' 
                ? 'Aucun vote ne correspond à vos critères de recherche.' 
                : 'Aucun vote n\'a encore été enregistré.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showDetailModal && selectedVote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Détails du vote</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < selectedVote.valeur ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <h4 className="text-2xl font-bold text-gray-900">{selectedVote.valeur}/5</h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  selectedVote.typeVote === 'JURY' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedVote.typeVote === 'JURY' ? 'Vote Jury (70%)' : 'Vote Public (30%)'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Projet évalué</label>
                  <p className="text-gray-900 font-medium">{selectedVote.projet?.titre || 'Projet supprimé'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Votant</label>
                  <p className="text-gray-900">
                    {selectedVote.user?.prenom || 'Utilisateur'} {selectedVote.user?.nom || 'supprimé'}
                  </p>
                  <p className="text-sm text-gray-500">{selectedVote.user?.email || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Date du vote</label>
                  <p className="text-gray-900">
                    {new Date(selectedVote.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}