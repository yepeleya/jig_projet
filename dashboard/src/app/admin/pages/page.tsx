'use client'
import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import Image from 'next/image'
import {
  FileText,
  Edit,
  Save,
  X,
  Eye,
  Globe,
  Home,
  Info,
  Mail,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ContentItem {
  id: number
  cle: string
  titre: string
  contenu: string
  type: 'TEXT' | 'HTML' | 'MARKDOWN' | 'IMAGE' | 'JSON'
  page: string
  section: string
  description?: string
  ordre: number
  actif: boolean
  createdAt: string
  updatedAt: string
}

export default function PagesPage() {
  const [selectedPage, setSelectedPage] = useState<string>('home')
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    titre: '',
    contenu: '',
    type: 'TEXT' as 'TEXT' | 'HTML' | 'MARKDOWN' | 'IMAGE' | 'JSON',
    description: '',
    ordre: 0
  })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newContent, setNewContent] = useState({
    cle: '',
    titre: '',
    contenu: '',
    type: 'TEXT' as 'TEXT' | 'HTML' | 'MARKDOWN' | 'IMAGE' | 'JSON',
    page: 'home',
    section: '',
    description: '',
    ordre: 0
  })

  const queryClient = useQueryClient()

  // Récupérer tout le contenu
  const { data: contentData, isLoading, error } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const response = await adminApi.get('/content')
      return response.data.data || response.data
    },
    retry: 3
  })

  // Mutation pour mettre à jour le contenu
  const updateContentMutation = useMutation({
    mutationFn: async ({ cle, data }: { cle: string, data: unknown }) => {
      const response = await adminApi.put(`/content/${cle}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      setEditingSection(null)
      toast.success('Contenu mis à jour avec succès')
    },
    onError: (error: Error | { response?: { data?: { message?: string } } }) => {
      console.error('Erreur mise à jour:', error)
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? error.response?.data?.message || 'Erreur lors de la mise à jour'
        : 'Erreur lors de la mise à jour'
      toast.error(errorMessage)
    }
  })

  // Mutation pour créer du contenu
  const createContentMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await adminApi.post('/content', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      setShowCreateForm(false)
      resetNewContent()
      toast.success('Contenu créé avec succès')
    },
    onError: (error: Error | { response?: { data?: { message?: string } } }) => {
      console.error('Erreur création:', error)
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? error.response?.data?.message || 'Erreur lors de la création'
        : 'Erreur lors de la création'
      toast.error(errorMessage)
    }
  })

  // Mutation pour supprimer du contenu
  const deleteContentMutation = useMutation({
    mutationFn: async (cle: string) => {
      const response = await adminApi.delete(`/content/${cle}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      toast.success('Contenu supprimé avec succès')
    },
    onError: (error: Error | { response?: { data?: { message?: string } } }) => {
      console.error('Erreur suppression:', error)
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? error.response?.data?.message || 'Erreur lors de la suppression'
        : 'Erreur lors de la suppression'
      toast.error(errorMessage)
    }
  })

  // Mutation pour activer/désactiver le contenu
  const toggleContentMutation = useMutation({
    mutationFn: async (cle: string) => {
      const response = await adminApi.patch(`/content/${cle}/toggle`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      toast.success('Statut modifié avec succès')
    },
    onError: (error: Error | { response?: { data?: { message?: string } } }) => {
      console.error('Erreur toggle:', error)
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? error.response?.data?.message || 'Erreur lors du changement de statut'
        : 'Erreur lors du changement de statut'
      toast.error(errorMessage)
    }
  })

  // Mutation pour initialiser le contenu par défaut
  const initializeContentMutation = useMutation({
    mutationFn: async () => {
      const response = await adminApi.post('/content/initialize', {})
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      toast.success('Contenu par défaut initialisé')
    },
    onError: (error: Error | { response?: { data?: { message?: string } } }) => {
      console.error('Erreur initialisation:', error)
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? error.response?.data?.message || 'Erreur lors de l\'initialisation'
        : 'Erreur lors de l\'initialisation'
      toast.error(errorMessage)
    }
  })

  const content = contentData || []
  const pages = [
    { id: 'home', name: 'Accueil', icon: Home, description: 'Page d\'accueil du site' },
    { id: 'about', name: 'À propos', icon: Info, description: 'Présentation de l\'événement' },
    { id: 'contact', name: 'Contact', icon: Mail, description: 'Informations de contact' },
    { id: 'global', name: 'Global', icon: Globe, description: 'Éléments globaux du site' }
  ]

  const resetNewContent = () => {
    setNewContent({
      cle: '',
      titre: '',
      contenu: '',
      type: 'TEXT',
      page: selectedPage,
      section: '',
      description: '',
      ordre: 0
    })
  }

  const handleEdit = (item: ContentItem) => {
    setEditingSection(item.cle)
    setEditForm({
      titre: item.titre,
      contenu: item.contenu,
      type: item.type,
      description: item.description || '',
      ordre: item.ordre
    })
  }

  const handleSave = useCallback(() => {
    if (!editingSection) return
    updateContentMutation.mutate({
      cle: editingSection,
      data: editForm
    })
  }, [editingSection, editForm, updateContentMutation])

  const handleCancel = () => {
    setEditingSection(null)
    setEditForm({
      titre: '',
      contenu: '',
      type: 'TEXT',
      description: '',
      ordre: 0
    })
  }

  const handleCreate = () => {
    if (!newContent.cle || !newContent.titre || !newContent.contenu) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    createContentMutation.mutate(newContent)
  }

  const handleDelete = (cle: string, titre: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${titre}" ?`)) {
      deleteContentMutation.mutate(cle)
    }
  }

  const previewSite = () => {
    window.open('http://localhost:3002', '_blank')
  }

  // Raccourci clavier pour sauvegarder
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's' && editingSection) {
        e.preventDefault()
        handleSave()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editingSection, handleSave])

  const currentPageContents = content.filter((item: ContentItem) => item.page === selectedPage)
    .sort((a: ContentItem, b: ContentItem) => a.ordre - b.ordre)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Erreur de chargement</h3>
            <p className="text-sm text-gray-500 mt-2">
              Impossible de charger le contenu. Voulez-vous initialiser le contenu par défaut ?
            </p>
          </div>
          <button
            onClick={() => initializeContentMutation.mutate()}
            disabled={initializeContentMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {initializeContentMutation.isPending ? 'Initialisation...' : 'Initialiser le contenu'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion du Contenu</h1>
          <p className="text-gray-600 mt-2">
            Modifiez le contenu des pages du site web JIG 2026
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 lg:mt-0">
          {content.length === 0 && (
            <button 
              onClick={() => initializeContentMutation.mutate()}
              disabled={initializeContentMutation.isPending}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Initialiser le contenu</span>
            </button>
          )}
          <button 
            onClick={previewSite}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Globe className="w-4 h-4" />
            <span>Prévisualiser le site</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation des pages */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pages du site</h2>
            <div className="space-y-2">
              {pages.map((page) => {
                const Icon = page.icon
                const pageContentCount = content.filter((item: ContentItem) => item.page === page.id).length
                return (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPage(page.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      selectedPage === page.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{page.name}</div>
                      <div className="text-xs text-gray-500">
                        {pageContentCount} section{pageContentCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Contenu de la page sélectionnée */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            
            {/* Header de la section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {pages.find(p => p.id === selectedPage)?.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {currentPageContents.length} section{currentPageContents.length > 1 ? 's' : ''} de contenu
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                  <button 
                    onClick={previewSite}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Prévisualiser"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Formulaire de création */}
            {showCreateForm && (
              <div className="p-6 border-b border-gray-200 bg-green-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouveau contenu</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clé unique*</label>
                    <input
                      type="text"
                      value={newContent.cle}
                      onChange={(e) => setNewContent({...newContent, cle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="hero-title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre*</label>
                    <input
                      type="text"
                      value={newContent.titre}
                      onChange={(e) => setNewContent({...newContent, titre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Titre du contenu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newContent.type}
                      onChange={(e) => setNewContent({...newContent, type: e.target.value as 'TEXT' | 'HTML' | 'MARKDOWN' | 'IMAGE' | 'JSON'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="TEXT">Texte</option>
                      <option value="HTML">HTML</option>
                      <option value="MARKDOWN">Markdown</option>
                      <option value="IMAGE">Image</option>
                      <option value="JSON">JSON</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input
                      type="text"
                      value={newContent.section}
                      onChange={(e) => setNewContent({...newContent, section: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Hero, About, etc."
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={newContent.description}
                      onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description du contenu"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenu*</label>
                    <textarea
                      value={newContent.contenu}
                      onChange={(e) => setNewContent({...newContent, contenu: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre contenu ici..."
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleCreate}
                    disabled={createContentMutation.isPending}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {createContentMutation.isPending ? 'Création...' : 'Créer'}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      resetNewContent()
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Sections de contenu */}
            <div className="p-6 space-y-6">
              {currentPageContents.map((item: ContentItem) => (
                <div key={item.cle} className="border border-gray-200 rounded-lg p-4">
                  
                  {/* Header de la section */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.titre}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{item.section}</span>
                        <span>•</span>
                        <span>{item.description}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {item.type}
                      </span>
                      <button
                        onClick={() => toggleContentMutation.mutate(item.cle)}
                        className={`p-1 rounded transition-colors ${
                          item.actif ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={item.actif ? 'Désactiver' : 'Activer'}
                      >
                        {item.actif ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      {editingSection === item.cle ? (
                        <div className="flex space-x-1">
                          <button
                            onClick={handleSave}
                            disabled={updateContentMutation.isPending}
                            className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                            title="Sauvegarder"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            title="Annuler"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.cle, item.titre)}
                            className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contenu */}
                  {editingSection === item.cle ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editForm.titre}
                          onChange={(e) => setEditForm({...editForm, titre: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Titre"
                        />
                        <select
                          value={editForm.type}
                          onChange={(e) => setEditForm({...editForm, type: e.target.value as 'TEXT' | 'HTML' | 'MARKDOWN' | 'IMAGE' | 'JSON'})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="TEXT">Texte</option>
                          <option value="HTML">HTML</option>
                          <option value="MARKDOWN">Markdown</option>
                          <option value="IMAGE">Image</option>
                          <option value="JSON">JSON</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Description"
                      />
                      <textarea
                        value={editForm.contenu}
                        onChange={(e) => setEditForm({...editForm, contenu: e.target.value})}
                        rows={editForm.type === 'TEXT' ? 3 : 6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                      <div className="text-xs text-gray-500">
                        {editForm.type === 'MARKDOWN' && 'Utilisez la syntaxe Markdown pour le formatage'}
                        {editForm.type === 'HTML' && 'HTML autorisé pour un formatage avancé'}
                        {editForm.type === 'TEXT' && 'Texte simple sans formatage'}
                      </div>
                    </div>
                  ) : (
                    <div className={`rounded-lg p-3 ${item.actif ? 'bg-gray-50' : 'bg-gray-100 opacity-60'}`}>
                      {item.type === 'MARKDOWN' ? (
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                          {item.contenu}
                        </pre>
                      ) : item.type === 'HTML' ? (
                        <div 
                          className="text-sm text-gray-700"
                          dangerouslySetInnerHTML={{ __html: item.contenu }}
                        />
                      ) : item.type === 'JSON' ? (
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded">
                          {JSON.stringify(JSON.parse(item.contenu || '{}'), null, 2)}
                        </pre>
                      ) : item.type === 'IMAGE' ? (
                        <div className="text-sm text-gray-700">
                          <div className="relative max-w-xs">
                            <Image 
                              src={item.contenu} 
                              alt={item.titre} 
                              width={300}
                              height={200}
                              className="rounded object-cover"
                              onError={() => {
                                console.log('Image loading error:', item.contenu)
                              }}
                              unoptimized
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700">{item.contenu}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {currentPageContents.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contenu</h3>
                  <p className="text-gray-500 mb-4">Cette page n&apos;a pas encore de contenu éditable.</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter du contenu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section d'aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Guide d&apos;utilisation</h3>
            <div className="text-blue-800 text-sm space-y-1">
              <p>• <strong>Texte :</strong> Contenu simple sans formatage spécial</p>
              <p>• <strong>HTML :</strong> Permet l&apos;utilisation de balises HTML pour un formatage avancé</p>
              <p>• <strong>Markdown :</strong> Syntaxe simplifiée (** pour gras, * pour italique, # pour titres)</p>
              <p>• <strong>Image :</strong> URL d&apos;une image à afficher</p>
              <p>• <strong>JSON :</strong> Données structurées au format JSON</p>
              <p>• Utilisez le bouton de toggle pour activer/désactiver temporairement du contenu</p>
              <p>• Les modifications sont sauvegardées dans la base de données</p>
              <p>• <strong>Raccourci :</strong> Ctrl+S pour sauvegarder en mode édition</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}