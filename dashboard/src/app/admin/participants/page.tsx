'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type User } from '@/lib/api'
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  Mail,
  Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ParticipantsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'ALL' | 'ETUDIANT' | 'JURY' | 'UTILISATEUR'>('ALL')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'UTILISATEUR' as User['role'],
    telephone: '',
    ecole: '',
    filiere: '',
    niveau: ''
  })

  const queryClient = useQueryClient()

  // Récupération des utilisateurs
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => adminApi.getUsers()
  })

  // Mutation pour supprimer un utilisateur
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      toast.success('Utilisateur supprimé avec succès')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  // Mutation pour modifier un utilisateur
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => 
      adminApi.updateUser(id, data),
    onSuccess: () => {
      toast.success('Utilisateur modifié avec succès')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setShowEditModal(false)
      setSelectedUser(null)
    },
    onError: () => {
      toast.error('Erreur lors de la modification')
    }
  })

  // Filtrage des utilisateurs
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'ALL' || user.role === filterRole
    
    return matchesSearch && matchesRole
  })

  const handleDelete = (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteMutation.mutate(userId)
    }
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      telephone: user.telephone || '',
      ecole: user.ecole || '',
      filiere: user.filiere || '',
      niveau: user.niveau || ''
    })
    setShowEditModal(true)
  }

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedUser) {
      updateMutation.mutate({
        id: selectedUser.id,
        data: editFormData
      })
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-red-100 text-red-800',
      JURY: 'bg-purple-100 text-purple-800',
      ETUDIANT: 'bg-blue-100 text-blue-800',
      UTILISATEUR: 'bg-green-100 text-green-800'
    }
    return styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return '👑'
      case 'JURY': return '⚖️'
      case 'ETUDIANT': return '🎓'
      case 'UTILISATEUR': return '👤'
      default: return '👤'
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Participants</h1>
          <p className="text-gray-600 mt-2">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} • 
            {users.filter((u: User) => u.role === 'ETUDIANT').length} étudiant{users.filter((u: User) => u.role === 'ETUDIANT').length > 1 ? 's' : ''} • 
            {users.filter((u: User) => u.role === 'JURY').length} jury{users.filter((u: User) => u.role === 'JURY').length > 1 ? 's' : ''} • 
            {users.filter((u: User) => u.role === 'UTILISATEUR').length} utilisateur{users.filter((u: User) => u.role === 'UTILISATEUR').length > 1 ? 's' : ''}
          </p>
        </div>
        
        <button className="mt-4 lg:mt-0 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Ajouter un participant</span>
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filtre par rôle */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'ALL' | 'ETUDIANT' | 'JURY' | 'UTILISATEUR')}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="ALL">Tous les rôles</option>
              <option value="ETUDIANT">Étudiants</option>
              <option value="JURY">Jurys</option>
              <option value="UTILISATEUR">Utilisateurs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Utilisateur</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Rôle</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Inscription</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-sm">
                          {user.prenom?.[0]}{user.nom?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.prenom} {user.nom}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getRoleIcon(user.role)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleView(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Détails de l&apos;utilisateur</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 font-bold text-xl">
                    {selectedUser.prenom?.[0]}{selectedUser.nom?.[0]}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {selectedUser.prenom} {selectedUser.nom}
                </h4>
                <div className="flex justify-center mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Date d&apos;inscription</label>
                  <p className="text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">ID Utilisateur</label>
                  <p className="text-gray-900">#{selectedUser.id}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button 
                onClick={() => {
                  setShowModal(false)
                  handleEdit(selectedUser)
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Modifier l&apos;utilisateur</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom*</label>
                  <input
                    type="text"
                    required
                    value={editFormData.prenom}
                    onChange={(e) => setEditFormData({...editFormData, prenom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom*</label>
                  <input
                    type="text"
                    required
                    value={editFormData.nom}
                    onChange={(e) => setEditFormData({...editFormData, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle*</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({...editFormData, role: e.target.value as User['role']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="UTILISATEUR">Utilisateur</option>
                  <option value="ETUDIANT">Étudiant</option>
                  <option value="JURY">Jury</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={editFormData.telephone}
                  onChange={(e) => setEditFormData({...editFormData, telephone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {(editFormData.role === 'ETUDIANT') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">École</label>
                    <input
                      type="text"
                      value={editFormData.ecole}
                      onChange={(e) => setEditFormData({...editFormData, ecole: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filière</label>
                      <input
                        type="text"
                        value={editFormData.filiere}
                        onChange={(e) => setEditFormData({...editFormData, filiere: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                      <input
                        type="text"
                        value={editFormData.niveau}
                        onChange={(e) => setEditFormData({...editFormData, niveau: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Modification...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}