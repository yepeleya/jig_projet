'use client'

import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { juryApi } from '@/lib/api'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { 
  X,
  FileText,
  Download,
  User,
  Calendar,
  Star,
  Send,
  CheckCircle,
  File,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  Archive,
  Code,
  Eye
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

interface JuryUser {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
}

interface ProjectDetailModalProps {
  projet: Projet
  isOpen: boolean
  onClose: () => void
  jury: JuryUser | null
  isEvaluated: boolean
}

export default function ProjectDetailModal({ 
  projet, 
  isOpen, 
  onClose, 
  jury,
  isEvaluated 
}: ProjectDetailModalProps) {
  const [note, setNote] = useState<number>(0)
  const [commentaire, setCommentaire] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const queryClient = useQueryClient()

  // Mutation pour voter
  const voteMutation = useMutation({
    mutationFn: ({ projetId, valeur }: { projetId: number; valeur: number }) =>
      juryApi.voter({
        projetId,
        juryId: jury?.id || 0,
        valeur,
        typeVote: 'JURY'
      }),
    onSuccess: async () => {
      toast.success('Note enregistrée avec succès - Statut mis à jour automatiquement')
      
      // Invalider les caches pour actualiser l'interface
      queryClient.invalidateQueries({ queryKey: ['my-votes'] })
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      queryClient.invalidateQueries({ queryKey: ['projets'] })
      
      // Fermer le modal après succès
      onClose()
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement de la note')
    }
  })

  // Mutation pour commenter
  const commentMutation = useMutation({
    mutationFn: ({ projetId, contenu }: { projetId: number; contenu: string }) =>
      juryApi.ajouterCommentaire({
        projetId,
        juryId: jury?.id || 0,
        contenu
      }),
    onSuccess: async () => {
      toast.success('Commentaire ajouté avec succès - Statut mis à jour automatiquement')
      setCommentaire('')
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: ['projets'] })
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout du commentaire')
    }
  })

  // Fonctions utilitaires pour les fichiers
  const getFileIcon = (filename: string) => {
    if (!filename) return <File className="w-5 h-5" />
    
    const extension = filename.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return <ImageIcon className="w-5 h-5 text-blue-600" />
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
        return <FileVideo className="w-5 h-5 text-purple-600" />
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
        return <FileAudio className="w-5 h-5 text-green-600" />
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
        return <Archive className="w-5 h-5 text-orange-600" />
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
      case 'py':
      case 'java':
      case 'cpp':
        return <Code className="w-5 h-5 text-indigo-600" />
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />
      default:
        return <File className="w-5 h-5 text-gray-600" />
    }
  }

  const isImageFile = (filename: string) => {
    if (!filename) return false
    const extension = filename.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')
  }

  const isVideoFile = (filename: string) => {
    if (!filename) return false
    const extension = filename.split('.').pop()?.toLowerCase()
    return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension || '')
  }

  const getFileUrl = (filename: string) => {
    return `http://localhost:5000/uploads/${filename}`
  }

  const getVideoUrl = (filename: string) => {
    // Utiliser directement le backend (CORS peut poser problème)
    return `http://localhost:5000/api/projets/video/${encodeURIComponent(filename)}`
  }

  const handleDownload = () => {
    if (projet.fichier) {
      const link = document.createElement('a')
      link.href = getFileUrl(projet.fichier)
      link.download = projet.fichier
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Téléchargement démarré')
    }
  }

  const handleOpenFile = () => {
    if (projet.fichier) {
      window.open(getFileUrl(projet.fichier), '_blank')
    }
  }

  const handleSubmitEvaluation = async () => {
    if (note < 1 || note > 10) {
      toast.error('Veuillez saisir une note entre 1 et 10')
      return
    }

    setIsSubmitting(true)

    try {
      // Soumettre la note
      await voteMutation.mutateAsync({ projetId: projet.id, valeur: note })
      
      // Soumettre le commentaire si présent
      if (commentaire.trim()) {
        await commentMutation.mutateAsync({ projetId: projet.id, contenu: commentaire })
      }
      
      // Fermer le modal après succès
      setTimeout(() => {
        onClose()
        setNote(0)
        setCommentaire('')
      }, 1000)
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold text-[#333333] mb-2"
                    >
                      {projet.titre}
                    </Dialog.Title>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{projet.user?.prenom} {projet.user?.nom}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Soumis le {formatDate(projet.createdAt)}</span>
                      </div>
                      {isEvaluated && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Déjà évalué</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Colonne gauche - Informations du projet */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h4 className="text-lg font-semibold text-[#333333] mb-3">Description</h4>
                      <p className="text-gray-700 leading-relaxed">{projet.description}</p>
                    </div>

                    {/* Fichier joint avec aperçu amélioré */}
                    {projet.fichier && (
                      <div>
                        <h4 className="text-lg font-semibold text-[#333333] mb-3">Fichier joint</h4>
                        
                        {/* Aperçu du fichier pour les images */}
                        {isImageFile(projet.fichier) && (
                          <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={getFileUrl(projet.fichier)}
                              alt="Aperçu du projet"
                              width={600}
                              height={400}
                              className="w-full h-64 object-cover"
                              onError={() => console.log('Erreur de chargement de l\'image')}
                            />
                          </div>
                        )}

                        {/* Aperçu du fichier pour les vidéos */}
                        {isVideoFile(projet.fichier) && (
                          <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                            <video
                              controls
                              className="w-full h-64 object-cover bg-black"
                              preload="metadata"
                              onError={(e) => {
                                console.log('Erreur de chargement de la vidéo:', e)
                                // Fallback vers l'URL directe si l'API proxy ne fonctionne pas
                                const video = e.currentTarget
                                if (video.src !== getFileUrl(projet.fichier)) {
                                  video.src = getFileUrl(projet.fichier)
                                }
                              }}
                            >
                              <source src={getVideoUrl(projet.fichier)} type="video/mp4" />
                              <source src={getFileUrl(projet.fichier)} type="video/mp4" />
                              Votre navigateur ne supporte pas la lecture de vidéos.
                            </video>
                          </div>
                        )}
                        
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#9E1B32] rounded-lg flex items-center justify-center">
                                {getFileIcon(projet.fichier)}
                              </div>
                              <div>
                                <p className="font-medium text-[#333333]">{projet.fichier}</p>
                                <p className="text-sm text-gray-600">
                                  {isImageFile(projet.fichier) ? 'Image' : 
                                   isVideoFile(projet.fichier) ? 'Vidéo' : 'Fichier du projet'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={handleOpenFile}
                                className="inline-flex items-center space-x-2 px-3 py-2 text-sm text-[#9E1B32] hover:text-[#7A1528] hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Ouvrir</span>
                              </button>
                              <button
                                onClick={handleDownload}
                                className="inline-flex items-center space-x-2 px-3 py-2 bg-[#9E1B32] text-white text-sm rounded-lg hover:bg-[#7A1528] transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                <span>Télécharger</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Informations de l'étudiant */}
                    <div>
                      <h4 className="text-lg font-semibold text-[#333333] mb-3">Étudiant</h4>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[#9E1B32] rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#333333]">
                              {projet.user?.prenom} {projet.user?.nom}
                            </p>
                            <p className="text-sm text-gray-600">{projet.user?.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite - Évaluation */}
                  <div className="space-y-6">
                    {!isEvaluated ? (
                      <>
                        {/* Note */}
                        <div>
                          <h4 className="text-lg font-semibold text-[#333333] mb-3">
                            Évaluation du projet
                          </h4>
                          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Note sur 10 <span className="text-red-500">*</span>
                              </label>
                              <div className="flex items-center space-x-4">
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={note || ''}
                                  onChange={(e) => setNote(Number(e.target.value))}
                                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9E1B32] focus:border-[#9E1B32] transition-colors"
                                  placeholder="1-10"
                                />
                                <div className="flex items-center space-x-1">
                                  {[...Array(10)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-5 h-5 cursor-pointer transition-colors ${
                                        i < note ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                      onClick={() => setNote(i + 1)}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Cliquez sur les étoiles ou saisissez directement la note
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Commentaire */}
                        <div>
                          <h4 className="text-lg font-semibold text-[#333333] mb-3">
                            Commentaire (optionnel)
                          </h4>
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <textarea
                              value={commentaire}
                              onChange={(e) => setCommentaire(e.target.value)}
                              placeholder="Partagez vos observations, recommandations ou retours constructifs..."
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9E1B32] focus:border-[#9E1B32] transition-colors resize-none"
                              rows={6}
                            />
                            <p className="text-xs text-gray-600 mt-2">
                              Votre commentaire aidera l&apos;étudiant à améliorer son projet
                            </p>
                          </div>
                        </div>

                        {/* Bouton de soumission */}
                        <div className="pt-4">
                          <button
                            onClick={handleSubmitEvaluation}
                            disabled={note < 1 || note > 10 || isSubmitting}
                            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#9E1B32] text-white font-medium rounded-lg hover:bg-[#7A1528] focus:outline-none focus:ring-2 focus:ring-[#9E1B32] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Envoi en cours...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                <span>Soumettre mon évaluation</span>
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-[#333333] mb-2">
                          Projet déjà évalué
                        </h4>
                        <p className="text-gray-600">
                          Vous avez déjà soumis votre évaluation pour ce projet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}