'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useJuryStore } from '@/store/juryStore'
import { juryApi } from '@/lib/api'
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock,
  Award,
  TrendingUp
} from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import ProjectDetailModal from '@/components/ProjectDetailModal'

interface Vote {
  id: number
  projetId: number
  juryId: number
  valeur: number
  typeVote: string
}

interface Comment {
  id: number
  contenu: string
  projetId: number
  juryId: number
}

interface User {
  id: number
  nom: string
  prenom: string
  email: string
}

interface Projet {
  id: number
  titre: string
  description: string
  fichier: string
  createdAt: string
  user: User
  statut: string
  votes?: Vote[]
  commentaires?: Comment[]
}

export default function DashboardPage() {
  const jury = useJuryStore((state) => state.jury)
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'evaluated' | 'pending'>('all')

  // Récupération des projets
  const { data: projets = [], isLoading } = useQuery({
    queryKey: ['projets'],
    queryFn: juryApi.getProjets
  })

  // Récupération des scores/votes
  const { data: myVotes = [] } = useQuery<Vote[]>({
    queryKey: ['my-votes'],
    queryFn: () => juryApi.getScores()
  })

  // Statistiques calculées
  const totalProjets = projets.length
  const projetsEvalues = projets.filter((p: Projet) => 
    myVotes.some((v: Vote) => v.projetId === p.id && v.juryId === jury?.id)
  ).length
  const participants = new Set(projets.map((p: Projet) => p.user?.id)).size

  // Filtrage des projets
  const projetsFiltered = projets.filter((projet: Projet) => {
    if (filterStatus === 'evaluated') {
      return myVotes.some((v: Vote) => v.projetId === projet.id && v.juryId === jury?.id)
    }
    if (filterStatus === 'pending') {
      return !myVotes.some((v: Vote) => v.projetId === projet.id && v.juryId === jury?.id)
    }
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#9E1B32] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {/* En-tête avec bienvenue */}
        <div className="bg-linear-to-r from-[#9E1B32] to-[#7A1528] rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Bienvenue, {jury?.prenom} {jury?.nom}
              </h1>
              <p className="text-white/90 text-lg">
                Interface d&apos;évaluation des projets JIG 2026
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{projetsEvalues}</p>
                <p className="text-sm text-white/80">Évalués</p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalProjets - projetsEvalues}</p>
                <p className="text-sm text-white/80">En attente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projets</p>
                <p className="text-2xl font-bold text-[#333333]">{totalProjets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                Projets disponibles
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-[#333333]">{participants}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Étudiants inscrits
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Évalués</p>
                <p className="text-2xl font-bold text-[#9E1B32]">{projetsEvalues}</p>
              </div>
              <div className="w-12 h-12 bg-[#9E1B32]/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#9E1B32]" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#9E1B32] h-2 rounded-full" 
                  style={{ width: `${totalProjets > 0 ? (projetsEvalues / totalProjets) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-orange-600">{totalProjets - projetsEvalues}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-orange-600">
                <Clock className="w-4 h-4 mr-1" />
                À évaluer
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <h2 className="text-xl font-bold text-[#333333]">Projets à évaluer</h2>
            <span className="bg-[#9E1B32]/10 text-[#9E1B32] px-3 py-1 rounded-full text-sm font-medium">
              {projetsFiltered.length} projet{projetsFiltered.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-[#9E1B32] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Non évalués
            </button>
            <button
              onClick={() => setFilterStatus('evaluated')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'evaluated'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Évalués
            </button>
          </div>
        </div>

        {/* Liste des projets */}
        {projetsFiltered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterStatus === 'pending' && 'Aucun projet en attente d\'évaluation'}
              {filterStatus === 'evaluated' && 'Aucun projet évalué'}
              {filterStatus === 'all' && 'Aucun projet disponible'}
            </h3>
            <p className="text-gray-600">
              {filterStatus === 'pending' && 'Vous avez évalué tous les projets disponibles.'}
              {filterStatus === 'evaluated' && 'Vous n\'avez encore évalué aucun projet.'}
              {filterStatus === 'all' && 'Les projets approuvés apparaîtront ici.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projetsFiltered.map((projet: Projet) => {
              const juryVote = myVotes.find((v: Vote) => v.projetId === projet.id && v.juryId === jury?.id)
              return (
                <ProjectCard
                  key={projet.id}
                  projet={projet}
                  isEvaluated={!!juryVote}
                  juryNote={juryVote?.valeur}
                  onViewDetails={setSelectedProjet}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedProjet && (
        <ProjectDetailModal
          projet={selectedProjet}
          isOpen={!!selectedProjet}
          onClose={() => setSelectedProjet(null)}
          jury={jury}
          isEvaluated={myVotes.some((v: Vote) => v.projetId === selectedProjet.id && v.juryId === jury?.id)}
        />
      )}
    </>
  )
}