'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiDownload, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiAlertCircle,
  FiPlus,
  FiCalendar,
  FiUser,
  FiFileText,
  FiTag,
  FiStar,
  FiTrendingUp,
  FiRefreshCw
} from 'react-icons/fi'
import { useAuthStore } from '@/store/authStore'
import { projetService } from '@/services/api'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MesProjetsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [projets, setProjets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/mes-projets')
      return
    }
    loadProjets()
  }, [isAuthenticated, router])

  const loadProjets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Chargement des projets de l\'utilisateur:', user?.id)
      
      // Récupérer les projets de l'utilisateur connecté
      const response = await projetService.getProjetsByUser(user?.id)
      
      console.log('📦 Projets reçus:', response)
      
      if (response && response.data) {
        setProjets(response.data)
      } else if (Array.isArray(response)) {
        setProjets(response)
      } else {
        setProjets([])
      }
    } catch (err) {
      console.error('❌ Erreur chargement projets:', err)
      setError(err.message || 'Erreur lors du chargement de vos projets')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projetId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) {
      return
    }

    try {
      setDeletingId(projetId)
      await projetService.deleteProjet(projetId)
      setProjets(projets.filter(p => p.id !== projetId))
      alert('Projet supprimé avec succès !')
    } catch (err) {
      console.error('Erreur suppression:', err)
      alert('Erreur lors de la suppression du projet')
    } finally {
      setDeletingId(null)
    }
  }

  const getStatutBadge = (statut) => {
    const badges = {
      'BROUILLON': { bg: 'bg-gray-100', text: 'text-gray-700', icon: <FiEdit className="w-4 h-4" />, label: 'Brouillon' },
      'EN_ATTENTE': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <FiClock className="w-4 h-4" />, label: 'En attente' },
      'VALIDE': { bg: 'bg-green-100', text: 'text-green-700', icon: <FiCheckCircle className="w-4 h-4" />, label: 'Validé' },
      'REJETE': { bg: 'bg-red-100', text: 'text-red-700', icon: <FiXCircle className="w-4 h-4" />, label: 'Rejeté' },
      'TERMINE': { bg: 'bg-blue-100', text: 'text-blue-700', icon: <FiCheckCircle className="w-4 h-4" />, label: 'Terminé' },
    }
    
    const badge = badges[statut] || badges['BROUILLON']
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {badge.label}
      </span>
    )
  }

  const getFileUrl = (fileName) => {
    if (!fileName) return null
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
    return `${baseUrl}/uploads/${fileName}`
  }

  if (!isAuthenticated) {
    return null // Redirection en cours
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#9E1B32' }}>
                  Mes Projets
                </h1>
                <p className="text-gray-600">
                  Gérez vos projets soumis au concours JIG 2026
                </p>
              </div>
              
              <Link
                href="/soumettre"
                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg"
                style={{ backgroundColor: '#9E1B32' }}
              >
                <FiPlus className="w-5 h-5" />
                Nouveau projet
              </Link>
            </div>

            {/* Stats */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold" style={{ color: '#9E1B32' }}>
                        {projets.length}
                      </p>
                    </div>
                    <FiFileText className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Validés</p>
                      <p className="text-2xl font-bold text-green-600">
                        {projets.filter(p => p.statut === 'VALIDE' || p.statut === 'TERMINE').length}
                      </p>
                    </div>
                    <FiCheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En attente</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {projets.filter(p => p.statut === 'EN_ATTENTE').length}
                      </p>
                    </div>
                    <FiClock className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Brouillons</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {projets.filter(p => p.statut === 'BROUILLON').length}
                      </p>
                    </div>
                    <FiEdit className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <FiRefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#9E1B32' }} />
                <p className="text-gray-600">Chargement de vos projets...</p>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <FiAlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-red-800 font-medium">Erreur</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={loadProjets}
                  className="ml-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* Aucun projet */}
          {!loading && !error && projets.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <FiFileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Aucun projet soumis
              </h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore soumis de projet au concours JIG 2026.
              </p>
              <Link
                href="/soumettre"
                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                style={{ backgroundColor: '#9E1B32' }}
              >
                <FiPlus className="w-5 h-5" />
                Soumettre mon premier projet
              </Link>
            </div>
          )}

          {/* Liste des projets */}
          {!loading && !error && projets.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {projets.map((projet) => (
                <div
                  key={projet.id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    {/* En-tête du projet */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-800">
                            {projet.titre}
                          </h3>
                          {getStatutBadge(projet.statut)}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FiTag className="w-4 h-4" />
                            {projet.categorie}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            {new Date(projet.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                          {projet.moyenneVote && (
                            <span className="flex items-center gap-1">
                              <FiStar className="w-4 h-4 text-yellow-500" />
                              {projet.moyenneVote.toFixed(1)} / 5
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {projet.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                      <Link
                        href={`/voter?id=${projet.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                        Voir
                      </Link>

                      {projet.statut === 'BROUILLON' && (
                        <Link
                          href={`/soumettre?id=${projet.id}`}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          style={{ backgroundColor: '#9E1B32' }}
                        >
                          <FiEdit className="w-4 h-4" />
                          Modifier
                        </Link>
                      )}

                      {projet.fichier && (
                        <a
                          href={getFileUrl(projet.fichier)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                        >
                          <FiDownload className="w-4 h-4" />
                          Télécharger
                        </a>
                      )}

                      {(projet.statut === 'BROUILLON' || projet.statut === 'REJETE') && (
                        <button
                          onClick={() => handleDelete(projet.id)}
                          disabled={deletingId === projet.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                        >
                          {deletingId === projet.id ? (
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <FiTrash2 className="w-4 h-4" />
                          )}
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
