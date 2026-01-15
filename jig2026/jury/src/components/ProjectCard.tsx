'use client'

import { 
  Eye,
  FileText,
  User,
  Calendar,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react'

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
}

interface ProjectCardProps {
  projet: Projet
  isEvaluated: boolean
  onViewDetails: (projet: Projet) => void
  juryNote?: number
}

export default function ProjectCard({ projet, isEvaluated, onViewDetails, juryNote }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group">
      <div className="p-6">
        {/* Header avec statut et note */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              {/* Note du jury en évidence */}
              {isEvaluated && juryNote !== undefined && (
                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg font-bold text-white text-sm ${
                  juryNote >= 8 ? 'bg-green-500' : 
                  juryNote >= 6 ? 'bg-yellow-500' : 
                  juryNote >= 4 ? 'bg-orange-500' : 'bg-red-500'
                }`}>
                  <span>{juryNote}</span>
                  <span className="text-xs">/10</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#333333] mb-2 group-hover:text-[#9E1B32] transition-colors">
                  {projet.titre}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {projet.description}
                </p>
              </div>
            </div>
          </div>
          <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
            isEvaluated 
              ? 'bg-green-100 text-green-800 flex items-center space-x-1'
              : 'bg-orange-100 text-orange-800 flex items-center space-x-1'
          }`}>
            {isEvaluated ? (
              <>
                <CheckCircle className="w-3 h-3" />
                <span>✅ Évalué</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3" />
                <span>⏳ En attente</span>
              </>
            )}
          </div>
        </div>

        {/* Informations étudiant */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-[#9E1B32] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#333333]">
              {projet.user?.prenom} {projet.user?.nom}
            </p>
            <p className="text-xs text-gray-600">{projet.user?.email}</p>
          </div>
        </div>

        {/* Fichier et date */}
        <div className="space-y-3 mb-6">
          {projet.fichier && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>Fichier disponible</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Soumis le {formatDate(projet.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {isEvaluated && juryNote !== undefined && (
              <div className="flex items-center space-x-1 text-green-600">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Note: {juryNote}/10</span>
              </div>
            )}
            {!isEvaluated && (
              <div className="flex items-center space-x-1 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">À évaluer</span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => onViewDetails(projet)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#9E1B32] text-white text-sm font-medium rounded-lg hover:bg-[#7A1528] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9E1B32] focus:ring-offset-2"
          >
            <Eye className="w-4 h-4" />
            <span>Voir détails</span>
          </button>
        </div>
      </div>
    </div>
  )
}