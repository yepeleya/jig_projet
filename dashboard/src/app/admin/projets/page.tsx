'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type Projet } from '@/lib/api'
import Image from 'next/image'
import FilePreviewModal from '@/components/FilePreviewModal'
import FileThumbnail from '@/components/FileThumbnail'
import { useFilePreview } from '@/hooks/useFilePreview'
import { 
  Folder, 
  Search, 
  Eye, 
  Download, 
  Trash2, 
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProjetsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const { isPreviewOpen, previewFile, openPreview, closePreview } = useFilePreview()

  const queryClient = useQueryClient()

  // Récupération des projets
  const { data: projets = [], isLoading } = useQuery<Projet[]>({
    queryKey: ['projets'],
    queryFn: () => adminApi.getProjets()
  })

  // Mutation pour supprimer un projet
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteProjet,
    onSuccess: () => {
      toast.success('Projet supprimé avec succès')
      queryClient.invalidateQueries({ queryKey: ['projets'] })
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  // Mutation pour approuver un projet
  const approveMutation = useMutation({
    mutationFn: adminApi.approveProjet,
    onSuccess: () => {
      toast.success('Projet approuvé avec succès')
      queryClient.invalidateQueries({ queryKey: ['projets'] })
      setShowDetailModal(false)
    },
    onError: () => {
      toast.error('Erreur lors de l\'approbation')
    }
  })

  // Mutation pour rejeter un projet
  const rejectMutation = useMutation({
    mutationFn: adminApi.rejectProjet,
    onSuccess: () => {
      toast.success('Projet rejeté avec succès')
      queryClient.invalidateQueries({ queryKey: ['projets'] })
      setShowDetailModal(false)
    },
    onError: () => {
      toast.error('Erreur lors du rejet')
    }
  })

  // Filtrage des projets
  const filteredProjets = projets.filter((projet: Projet) =>
    projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.user.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (projetId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteMutation.mutate(projetId)
    }
  }

  const handleView = (projet: Projet) => {
    setSelectedProjet(projet)
    setShowDetailModal(true)
  }

  const handlePreview = (fileName: string) => {
    openPreview(fileName)
  }

  const handleExportExcel = async () => {
    try {
      const response = await adminApi.exportData('projets')
      
      // Créer un blob et déclencher le téléchargement
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `projets_export_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Export Excel téléchargé avec succès')
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      toast.error('Erreur lors de l\'export Excel')
    }
  }

  const handleDownload = async (projet: Projet) => {
    try {
      if (projet.fichier) {
        // Utiliser l'endpoint sécurisé pour télécharger le fichier
        const token = localStorage.getItem('admin-token')
        const response = await fetch(`http://localhost:5000/api/projets/download/${projet.fichier}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }

        // Créer un blob et un lien de téléchargement
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = projet.fichier
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        toast.success(`Téléchargement de "${projet.fichier}" démarré`)
      } else {
        toast.error('Aucun fichier disponible pour ce projet')
      }
    } catch (error) {
      console.error('Erreur téléchargement:', error)
      toast.error('Erreur lors du téléchargement')
    }
  }

  // Fonction pour déterminer le type de fichier et afficher l'aperçu approprié
  const getFilePreview = (fileName: string) => {
    if (!fileName) return null
    
    const fileUrl = `http://localhost:5000/uploads/${fileName}`
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return (
        <div className="relative">
          <Image 
            src={fileUrl} 
            alt="Aperçu du projet" 
            width={400}
            height={192}
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            style={{ objectFit: 'contain' }}
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={() => window.open(fileUrl, '_blank')}
              className="bg-black bg-opacity-50 text-white p-1 rounded text-xs hover:bg-opacity-70"
            >
              Voir en grand
            </button>
          </div>
        </div>
      )
    }
    
    // Vidéos - utiliser la route proxy pour éviter CORS
    if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension || '')) {
      const videoUrl = `/api/video/${encodeURIComponent(fileName)}`
      return (
        <div className="relative group">
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-48 rounded-lg border border-gray-200 bg-black"
            preload="metadata"
            poster=""
            onError={(e) => {
              console.error('Erreur de lecture vidéo:', e)
              // Afficher un message d'erreur au lieu de masquer
              e.currentTarget.style.display = 'none'
              const errorDiv = document.createElement('div')
              errorDiv.className = 'w-full h-48 bg-red-50 rounded-lg flex flex-col items-center justify-center border border-red-200'
              errorDiv.innerHTML = `
                <div class="text-red-600 text-center p-4">
                  <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <p class="font-medium">Impossible de charger la vidéo</p>
                  <p class="text-sm mt-1">Fichier: ${fileName}</p>
                </div>
              `
              e.currentTarget.parentNode?.appendChild(errorDiv)
            }}
            onLoadStart={(e) => {
              // Vérifier si la source fonctionne
              const video = e.currentTarget
              setTimeout(() => {
                if (video.readyState === 0) {
                  console.warn('La vidéo ne se charge pas, tentative avec URL directe')
                  video.src = fileUrl
                }
              }, 2000)
            }}
          >
            <source src={videoUrl} type={`video/${extension}`} />
            <p className="text-center text-gray-600 p-4">
              Votre navigateur ne supporte pas la lecture vidéo.
              <br />
              <a href={fileUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                Télécharger la vidéo
              </a>
            </p>
          </video>
          
          {/* Overlay de contrôles */}
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={() => window.open(fileUrl, '_blank')}
              className="bg-black bg-opacity-70 text-white p-2 rounded text-xs hover:bg-opacity-90 transition-opacity"
              title="Ouvrir dans un nouvel onglet"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3.293 4.293a1 1 0 011.414 0L10 9.586l5.293-5.293a1 1 0 111.414 1.414L11.414 11l5.293 5.293a1 1 0 01-1.414 1.414L10 12.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 11 3.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Badge du type de fichier */}
          <div className="absolute bottom-2 left-2">
            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
              📹 {extension?.toUpperCase()} Video
            </span>
          </div>
        </div>
      )
    }
    
    // Documents PDF
    if (extension === 'pdf') {
      return (
        <div className="w-full h-48 bg-red-50 rounded-lg flex flex-col items-center justify-center border border-red-200 relative">
          <FileText className="w-12 h-12 text-red-600 mb-2" />
          <p className="text-red-800 font-medium">Document PDF</p>
          <p className="text-red-600 text-sm text-center px-2">{fileName}</p>
          <div className="absolute top-2 right-2">
            <button
              onClick={() => window.open(fileUrl, '_blank')}
              className="bg-red-600 text-white p-2 rounded text-xs hover:bg-red-700"
            >
              Ouvrir PDF
            </button>
          </div>
          <iframe
            src={`${fileUrl}#toolbar=0`}
            className="hidden"
            title="Aperçu PDF"
          />
        </div>
      )
    }
    
    // Autres types de fichiers
    return (
      <div className="w-full h-48 bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-gray-200 relative">
        <FileText className="w-12 h-12 text-gray-600 mb-2" />
        <p className="text-gray-800 font-medium">Fichier projet</p>
        <p className="text-gray-600 text-sm text-center px-2">{fileName}</p>
        <div className="absolute top-2 right-2">
          <button
            onClick={() => window.open(fileUrl, '_blank')}
            className="bg-gray-600 text-white p-2 rounded text-xs hover:bg-gray-700"
          >
            Télécharger
          </button>
        </div>
      </div>
    )
  }

  const handleApprove = (projetId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir approuver ce projet ?')) {
      approveMutation.mutate(projetId)
    }
  }

  const handleReject = (projetId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir rejeter ce projet ?')) {
      rejectMutation.mutate(projetId)
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'APPROUVE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approuvé
          </span>
        )
      case 'REJETE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeté
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </span>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Projets</h1>
          <p className="text-gray-600 mt-2">
            {projets.length} projet{projets.length > 1 ? 's' : ''} soumis • Concours JIG 2026
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex space-x-3">
          <button 
            onClick={handleExportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Projets</p>
              <p className="text-2xl font-bold text-gray-900">{projets.length}</p>
            </div>
            <Folder className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">En attente</p>
              <p className="text-2xl font-bold text-orange-600">
                {projets.filter(p => p.statut === 'EN_ATTENTE').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Approuvés</p>
              <p className="text-2xl font-bold text-green-600">
                {projets.filter(p => p.statut === 'APPROUVE').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rejetés</p>
              <p className="text-2xl font-bold text-red-600">
                {projets.filter(p => p.statut === 'REJETE').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un projet par titre, description ou auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des projets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Projet</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Aperçu</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Auteur</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Statut</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjets.map((projet: Projet) => (
                <tr key={projet.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{projet.titre}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{projet.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <FileThumbnail 
                      fileName={projet.fichier}
                      showPreviewButton={true}
                      onPreview={() => handlePreview(projet.fichier)}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {projet.user.prenom} {projet.user.nom}
                        </p>
                        <p className="text-sm text-gray-500">{projet.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(projet.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatutBadge(projet.statut)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(projet)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {projet.fichier && (
                        <button
                          onClick={() => handlePreview(projet.fichier)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Prévisualiser le fichier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDownload(projet)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(projet.id)}
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

        {filteredProjets.length === 0 && (
          <div className="p-12 text-center">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Aucun projet ne correspond à votre recherche.' : 'Aucun projet n\'a encore été soumis.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showDetailModal && selectedProjet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Détails du projet</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header du projet */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedProjet.titre}</h4>
                {getStatutBadge(selectedProjet.statut)}
              </div>

              {/* Informations de l'auteur */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Informations de l&apos;auteur</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom complet</label>
                    <p className="text-gray-900">{selectedProjet.user.prenom} {selectedProjet.user.nom}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedProjet.user.email}</p>
                  </div>
                </div>
              </div>

              {/* Aperçu du fichier */}
              {selectedProjet.fichier && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Aperçu du fichier</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {getFilePreview(selectedProjet.fichier)}
                  </div>
                </div>
              )}

              {/* Description du projet */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Description du projet</h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedProjet.description}</p>
                </div>
              </div>

              {/* Informations techniques */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de soumission</label>
                  <p className="text-gray-900">
                    {new Date(selectedProjet.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fichier projet</label>
                  {selectedProjet.fichier ? (
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900">{selectedProjet.fichier}</p>
                      <button
                        onClick={() => handleDownload(selectedProjet)}
                        className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Télécharger</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-400">Non spécifié</p>
                  )}
                </div>
              </div>

              {/* Actions d'approbation - uniquement pour les projets en attente */}
              {selectedProjet.statut === 'EN_ATTENTE' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-800 mb-3">Actions de modération</h5>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleApprove(selectedProjet.id)}
                      disabled={approveMutation.isPending}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{approveMutation.isPending ? 'Approbation...' : 'Approuver'}</span>
                    </button>
                    <button 
                      onClick={() => handleReject(selectedProjet.id)}
                      disabled={rejectMutation.isPending}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{rejectMutation.isPending ? 'Rejet...' : 'Rejeter'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Information du statut pour les projets déjà traités */}
              {selectedProjet.statut !== 'EN_ATTENTE' && (
                <div className={`border rounded-lg p-4 ${
                  selectedProjet.statut === 'APPROUVE' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h5 className={`font-medium mb-2 ${
                    selectedProjet.statut === 'APPROUVE' 
                      ? 'text-green-800' 
                      : 'text-red-800'
                  }`}>
                    Statut du projet
                  </h5>
                  <p className={`text-sm ${
                    selectedProjet.statut === 'APPROUVE' 
                      ? 'text-green-700' 
                      : 'text-red-700'
                  }`}>
                    Ce projet a été {selectedProjet.statut === 'APPROUVE' ? 'approuvé' : 'rejeté'} par l&apos;équipe de modération.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => handleDownload(selectedProjet)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation plein écran */}
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        fileName={previewFile}
        title="Prévisualisation du fichier projet"
      />
    </div>
  )
}