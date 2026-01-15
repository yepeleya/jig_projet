'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type Jury } from '@/lib/api'
import { 
  Scale, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Mail,
  Calendar,
  UserPlus
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function JurysPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedJury, setSelectedJury] = useState<Jury | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    specialite: '',
    bio: ''
  })
  const [motDePasseVisible, setMotDePasseVisible] = useState(false)

  const queryClient = useQueryClient()

  // Récupération des jurys
  const { data: jurys = [], isLoading } = useQuery({
    queryKey: ['jurys'],
    queryFn: adminApi.getJurys
  })

  // Mutation pour créer un jury
  const createMutation = useMutation({
    mutationFn: (data: { nom: string; prenom: string; email: string; motDePasse: string }) =>
      adminApi.createJury(data),
    onSuccess: () => {
      toast.success('Jury créé avec succès')
      queryClient.invalidateQueries({ queryKey: ['jurys'] })
      setShowCreateModal(false)
      setFormData({ nom: '', prenom: '', email: '', motDePasse: '', specialite: '', bio: '' })
    },
    onError: () => {
      toast.error('Erreur lors de la création du jury')
    }
  })

  // Mutation pour supprimer un jury
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteJury,
    onSuccess: () => {
      toast.success('Jury supprimé avec succès')
      queryClient.invalidateQueries({ queryKey: ['jurys'] })
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  // Filtrage des jurys
  const filteredJurys = jurys.filter(jury =>
    jury.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jury.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jury.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nom || !formData.prenom || !formData.email || !formData.motDePasse) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    createMutation.mutate({
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      motDePasse: formData.motDePasse
    })
  }

  const handleDelete = (juryId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jury ?')) {
      deleteMutation.mutate(juryId)
    }
  }

  const handleView = (jury: Jury) => {
    setSelectedJury(jury)
    setShowDetailModal(true)
  }

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Jurys</h1>
          <p className="text-gray-600 mt-2">
            {jurys.length} membre{jurys.length > 1 ? 's' : ''} du jury • Évaluation professionnelle (70%)
          </p>
        </div>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 lg:mt-0 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un jury</span>
        </button>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un jury par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Cartes des jurys */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJurys.map((jury) => (
          <div key={jury.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Scale className="w-6 h-6 text-purple-600" />
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                JURY
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {jury.prenom} {jury.nom}
                </h3>
                <div className="flex items-center space-x-2 text-gray-500 text-sm mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{jury.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Inscrit le {new Date(jury.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(jury)}
                    className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                    title="Voir les détails"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Voir</span>
                  </button>
                  <button
                    className="flex-1 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Modifier</span>
                  </button>
                  <button
                    onClick={() => handleDelete(jury.id)}
                    className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                    title="Supprimer"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJurys.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun jury trouvé</h3>
          <p className="text-gray-500 mb-6">Commencez par ajouter des membres du jury pour évaluer les projets.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <UserPlus className="w-5 h-5" />
            <span>Ajouter le premier jury</span>
          </button>
        </div>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Ajouter un nouveau jury</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom*</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom*</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="email@jury.fr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe*</label>
                <div className="relative">
                  <input
                    type={motDePasseVisible ? "text" : "password"}
                    required
                    value={formData.motDePasse}
                    onChange={(e) => setFormData({...formData, motDePasse: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9E1B32] focus:border-transparent"
                    placeholder="Mot de passe temporaire"
                  />
                  <button
                    type="button"
                    onClick={() => setMotDePasseVisible(!motDePasseVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#9E1B32] transition-colors"
                  >
                    {motDePasseVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Création...' : 'Créer le jury'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {showDetailModal && selectedJury && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Détails du jury</h3>
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
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {selectedJury.prenom} {selectedJury.nom}
                </h4>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                  Membre du Jury
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedJury.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Date d&apos;ajout</label>
                  <p className="text-gray-900">
                    {new Date(selectedJury.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Accès interface jury</label>
                  <p className="text-gray-900 text-sm">
                    <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                      http://localhost:3000
                    </a>
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
              <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
