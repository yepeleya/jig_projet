'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { juryApi } from '@/lib/api'
import { 
  History,
  Calendar,
  Star,
  User,
  FileText,
  CheckCircle,
  Clock,
  Search
} from 'lucide-react'

interface Vote {
  id: number
  valeur: number
  typeVote: string
  projetId: number
  userId?: number
  juryId?: number
  createdAt: string
  projet: {
    id: number
    titre: string
    description: string
    categorie: string
    image?: string
    statut: string
    user?: {
      id: number
      nom: string
      prenom: string
    }
  } | null
}

const VotesPage = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'valeur'>('date')

  const { data: votes = [], isLoading } = useQuery<Vote[]>({
    queryKey: ['jury-votes'],
    queryFn: juryApi.getMyVotes,
  })

  // Filtrer les votes valides (avec projet existant)
  const votesValides = votes.filter((vote: Vote) => vote.projet !== null)

  // Filtrer et trier les votes
  const filteredVotes = votesValides
    .filter((vote: Vote) => {
      if (!vote.projet) return false;
      const matchesSearch = vote.projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (vote.projet.user?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (vote.projet.user?.prenom || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || vote.projet.statut === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a: Vote, b: Vote) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return b.valeur - a.valeur
    })

  // Statistiques basées sur les votes réels
  const stats = {
    total: votesValides.length,
    moyenne: votesValides.length > 0 ? 
      (votesValides.reduce((sum: number, vote: Vote) => sum + vote.valeur, 0) / votesValides.length).toFixed(1) : '0',
    noteMax: votesValides.length > 0 ? Math.max(...votesValides.map((vote: Vote) => vote.valeur)) : 0,
    noteMin: votesValides.length > 0 ? Math.min(...votesValides.map((vote: Vote) => vote.valeur)) : 0,
  }

  const getStatusColor = (statut?: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-blue-100 text-blue-800'
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-800'
      case 'EVALUE': return 'bg-purple-100 text-purple-800'
      case 'TERMINE': return 'bg-green-100 text-green-800'
      case 'APPROUVE': return 'bg-green-100 text-green-800'
      case 'REJETE': return 'bg-red-100 text-red-800'
      case 'SUSPENDU': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (statut?: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return <Calendar className="w-4 h-4" />
      case 'EN_COURS': return <Clock className="w-4 h-4" />
      case 'EVALUE': return <FileText className="w-4 h-4" />
      case 'TERMINE': return <CheckCircle className="w-4 h-4" />
      case 'APPROUVE': return <CheckCircle className="w-4 h-4" />
      case 'REJETE': return <FileText className="w-4 h-4" />
      case 'SUSPENDU': return <Clock className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="ml-4 text-gray-600">Chargement de vos votes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <History className="w-8 h-8 text-red-600" />
            Mes Votes
          </h1>
          <p className="mt-2 text-gray-600">
            Historique et détails de tous vos votes ({stats.total} projets évalués)
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Projets
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.total}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Note Moyenne
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.moyenne}/10
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Note Maximale
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.noteMax}/10
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Note Minimale
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.noteMin}/10
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un projet ou participant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="EN_ATTENTE">⌛ En attente</option>
              <option value="EN_COURS">🔄 En cours</option>
              <option value="EVALUE">📝 Évalué</option>
              <option value="TERMINE">✅ Terminé</option>
              <option value="APPROUVE">👍 Approuvé</option>
              <option value="REJETE">❌ Rejeté</option>
              <option value="SUSPENDU">⏸️ Suspendu</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'valeur')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="date">Trier par date</option>
              <option value="valeur">Trier par note</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mes Votes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5" />
            Mes Votes ({filteredVotes.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">Liste de tous les projets que vous avez évalués</p>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredVotes.length === 0 ? (
            <div className="p-12 text-center">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun vote trouvé</h3>
              <p className="text-gray-500">
                {votes.length === 0 
                  ? "Vous n'avez encore évalué aucun projet."
                  : "Aucun projet ne correspond à vos critères de recherche."
                }
              </p>
            </div>
          ) : (
            filteredVotes.map((vote: Vote) => (
                <div key={vote.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    {/* Note en évidence à gauche */}
                    <div className="flex items-center gap-4 mr-6">
                      <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl font-bold text-white ${
                        vote.valeur >= 8 ? 'bg-green-500' : 
                        vote.valeur >= 6 ? 'bg-yellow-500' : 
                        vote.valeur >= 4 ? 'bg-orange-500' : 'bg-red-500'
                      }`}>
                        <span className="text-lg">{vote.valeur}</span>
                        <span className="text-xs">/10</span>
                      </div>
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        📊 Voté
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <span className="text-xl font-bold text-red-600 mr-2">{vote.valeur}/10</span>
                          <FileText className="w-5 h-5 text-gray-500" />
                          {vote.projet?.titre}
                        </h4>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vote.projet?.statut)}`}>
                          {getStatusIcon(vote.projet?.statut)}
                          {vote.projet?.statut?.replace('_', ' ') || 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Projet de : <strong>{vote.projet?.user?.prenom || 'N/A'} {vote.projet?.user?.nom || ''}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Voté le : {new Date(vote.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Note attribuée : <strong>{vote.valeur}/10</strong>
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p><strong>Description :</strong> {vote.projet?.description || 'Pas de description'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Message si aucun vote */}
      {votes.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun vote enregistré</h3>
          <p className="text-gray-600 mb-4">
            Vous n&apos;avez pas encore voté sur des projets.
          </p>
          <p className="text-sm text-gray-500">
            Rendez-vous dans le dashboard principal pour commencer à évaluer les projets !
          </p>
        </div>
      )}
    </div>
  )
}

export default VotesPage