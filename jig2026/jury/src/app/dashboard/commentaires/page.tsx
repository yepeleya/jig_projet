'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { juryApi } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { 
  MessageSquare,
  Edit,
  Trash2,
  Calendar,
  User,
  FileText,
  Save,
  X,
  Search,
  Filter,
  Plus
} from 'lucide-react'

interface Comment {
  id: string
  contenu: string
  dateCreation: string
  dateModification?: string
  projet: {
    id: string
    titre: string
    description: string
    user: {
      prenom: string
      nom: string
      email: string
    }
    statut: string
  } | null
  jury: {
    prenom: string
    nom: string
  }
}

const CommentairesPage = () => {
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'modified'>('date')

  const queryClient = useQueryClient()

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ['jury-comments'],
    queryFn: juryApi.getMyComments,
  })

  const editMutation = useMutation({
    mutationFn: ({ commentId, contenu }: { commentId: string; contenu: string }) =>
      juryApi.updateComment(commentId, contenu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jury-comments'] })
      setEditingComment(null)
      setEditContent('')
      toast.success('Commentaire modifié avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la modification du commentaire')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: juryApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jury-comments'] })
      toast.success('Commentaire supprimé avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du commentaire')
    },
  })

  // Filtrer et trier les commentaires
  const filteredComments = comments
    .filter((comment: Comment) => {
      // Vérifier si le projet existe (pas supprimé)
      if (!comment.projet) {
        return false;
      }
      
      const matchesSearch = comment.projet.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           comment.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (comment.projet.user?.nom || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || comment.projet.statut === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a: Comment, b: Comment) => {
      if (sortBy === 'date') {
        return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
      }
      const aModified = a.dateModification || a.dateCreation
      const bModified = b.dateModification || b.dateCreation
      return new Date(bModified).getTime() - new Date(aModified).getTime()
    })

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.contenu)
  }

  const handleSaveEdit = () => {
    if (editingComment && editContent.trim()) {
      editMutation.mutate({
        commentId: editingComment,
        contenu: editContent.trim()
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditContent('')
  }

  const handleDelete = (commentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      deleteMutation.mutate(commentId)
    }
  }

  const getStatusColor = (statut?: string) => {
    switch (statut) {
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-800'
      case 'TERMINE': return 'bg-green-100 text-green-800'
      case 'EN_ATTENTE': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Statistiques
  const stats = {
    total: comments.length,
    recent: comments.filter((c: Comment) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(c.dateCreation) > weekAgo
    }).length,
    modified: comments.filter((c: Comment) => c.dateModification).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-red-600" />
            Mes Commentaires
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez tous vos commentaires sur les projets
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Commentaires
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
                <Plus className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Cette semaine
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.recent}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Modifiés
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.modified}
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
                placeholder="Rechercher dans les commentaires..."
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
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminé</option>
              <option value="EN_ATTENTE">En attente</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'modified')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="date">Trier par date</option>
              <option value="modified">Trier par modification</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des commentaires */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Mes commentaires ({filteredComments.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des commentaires...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Aucun commentaire trouvé</p>
            <p className="text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Essayez de modifier vos critères de recherche' 
                : 'Vous n&apos;avez pas encore commenté de projets'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredComments.map((comment: Comment) => (
              <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-500" />
                        {comment.projet?.titre || 'Projet supprimé'}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(comment.projet?.statut)}`}>
                        {comment.projet?.statut?.replace('_', ' ') || 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {comment.projet?.user?.prenom || 'N/A'} {comment.projet?.user?.nom || ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(comment.dateCreation).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {comment.dateModification && (
                        <span className="flex items-center gap-1 text-orange-600">
                          <Edit className="w-4 h-4" />
                          Modifié le {new Date(comment.dateModification).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(comment)}
                      disabled={editingComment === comment.id}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Modifier le commentaire"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Supprimer le commentaire"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {editingComment === comment.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Modifiez votre commentaire..."
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={editMutation.isPending || !editContent.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        {editMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={editMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.contenu}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentairesPage