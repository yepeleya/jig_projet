'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  FaTrophy, 
  FaMedal, 
  FaUsers, 
  FaGavel, 
  FaChartBar,
  FaUser,
  FaGraduationCap,
  FaSchool,
  FaBookmark,
  FaClock,
  FaLock,
  FaExclamationTriangle
} from 'react-icons/fa'
import useAOS from '../../hooks/useAOS'

export default function ClassementPage() {
  const [classement, setClassement] = useState([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('final') // 'populaire' ou 'final'
  const [error, setError] = useState(null)
  const [visibilityInfo, setVisibilityInfo] = useState(null)

  const loadClassementPublic = useCallback(async () => {
    try {
      const apiUrl = 'https://jig-projet-1.onrender.com/api' // FORCE RENDER
      const response = await fetch(`${apiUrl}/classement/public?type=${activeTab}`)
      const result = await response.json()
      
      if (result.success) {
        setClassement(result.data.projets || [])
      } else {
        setError(result.message || 'Erreur lors du chargement du classement')
      }
    } catch (error) {
      console.error('Erreur lors du chargement du classement:', error)
      setError('Impossible de charger le classement')
    }
  }, [activeTab])

  const checkVisibilityAndLoadClassement = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Vérifier d'abord si le classement est visible
      const apiUrl = 'https://jig-projet-1.onrender.com/api' // FORCE RENDER
      const visibilityResponse = await fetch(`${apiUrl}/classement/visible`)
      const visibilityResult = await visibilityResponse.json()
      
      setVisibilityInfo(visibilityResult.data)
      setIsVisible(visibilityResult.data.isPublic)

      if (visibilityResult.data.isPublic) {
        // Charger le classement public
        await loadClassementPublic()
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la visibilité:', error)
      setError('Impossible de se connecter au serveur')
    } finally {
      setLoading(false)
    }
  }, [loadClassementPublic])

  useAOS()

  useEffect(() => {
    checkVisibilityAndLoadClassement()
  }, [checkVisibilityAndLoadClassement])

  // Recharger quand on change d'onglet
  useEffect(() => {
    if (isVisible) {
      loadClassementPublic()
    }
  }, [activeTab, isVisible, loadClassementPublic])

  const getMedalIcon = (rang) => {
    switch (rang) {
      case 1: return <FaTrophy className="text-yellow-500 text-2xl" />
      case 2: return <FaMedal className="text-gray-400 text-2xl" />
      case 3: return <FaMedal className="text-orange-600 text-2xl" />
      default: return <span className="text-2xl font-bold text-gray-600">#{rang}</span>
    }
  }

  const getPodiumClass = (rang) => {
    switch (rang) {
      case 1: return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
      case 2: return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
      case 3: return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
      default: return 'bg-white border border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-jig-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement du classement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de connexion</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={checkVisibilityAndLoadClassement}
            className="bg-jig-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (!isVisible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-jig-primary to-pink-500 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center" data-aos="fade-down">
              <FaLock className="text-6xl mx-auto mb-6 text-gray-300" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Classement des Projets
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                JIG 2026 - Concours d'innovation
              </p>
            </div>
          </div>
        </div>

        {/* Message de non-disponibilité */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center" data-aos="zoom-in">
              <FaClock className="text-6xl text-orange-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Classement non encore disponible
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Le classement final n'est pas encore disponible. Revenez après la clôture des votes.
              </p>
              
              {visibilityInfo?.dateLimiteVotes && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <p className="text-orange-800">
                    <FaClock className="inline mr-2" />
                    <strong>Date limite des votes :</strong> {formatDate(visibilityInfo.dateLimiteVotes)}
                  </p>
                </div>
              )}

              {visibilityInfo?.votesActifs && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800">
                    <FaUsers className="inline mr-2" />
                    <strong>Les votes sont encore ouverts !</strong> Vous pouvez encore voter pour vos projets préférés.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/voter" 
                  className="bg-jig-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors inline-flex items-center justify-center"
                >
                  <FaUsers className="mr-2" />
                  Voter maintenant
                </a>
                <Link 
                  href="/" 
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderClassement = (data, type) => (
    <div className="space-y-4">
      {/* Podium des 3 premiers */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {data.slice(0, 3).map((projet) => (
            <div
              key={projet.id}
              className={`${getPodiumClass(projet.rang)} rounded-xl p-6 text-center relative overflow-hidden`}
              data-aos="zoom-in"
              data-aos-delay={projet.rang * 100}
            >
              <div className="absolute top-2 right-2">
                {getMedalIcon(projet.rang)}
              </div>
              
              <div className="mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">
                    {projet.auteur.prenom?.[0]}{projet.auteur.nom?.[0]}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1">{projet.titre}</h3>
                <p className="text-sm opacity-90">
                  {projet.auteur.prenom} {projet.auteur.nom}
                </p>
                <p className="text-xs opacity-75">
                  {projet.auteur.niveau} • {projet.auteur.ecole}
                </p>
              </div>

              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                {type === 'popular' ? (
                  <div>
                    <div className="text-2xl font-bold">{projet.votes.total}</div>
                    <div className="text-sm">votes total</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold">{projet.scores.final}</div>
                    <div className="text-sm">score final</div>
                    <div className="text-xs mt-1">
                      {projet.votes.total} votes
                    </div>
                  </div>
                )}
              </div>

              {projet.rang === 1 && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    🏆 GAGNANT
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Liste complète */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-jig-primary to-pink-500 text-white p-6">
          <h3 className="text-xl font-bold flex items-center">
            <FaChartBar className="mr-3" />
            Classement complet - {data.length} projet{data.length > 1 ? 's' : ''}
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {data.map((projet, index) => (
            <div
              key={projet.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                projet.rang === 1 ? 'bg-yellow-50' : 
                projet.rang === 2 ? 'bg-gray-50' :
                projet.rang === 3 ? 'bg-orange-50' : ''
              }`}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getMedalIcon(projet.rang)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-lg text-gray-900">
                        {projet.titre}
                      </h4>
                      {projet.rang === 1 && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                          🏆 Gagnant
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center">
                        <FaUser className="mr-1" />
                        {projet.auteur.prenom} {projet.auteur.nom}
                      </span>
                      <span className="flex items-center">
                        <FaGraduationCap className="mr-1" />
                        {projet.auteur.niveau}
                      </span>
                      <span className="flex items-center">
                        <FaSchool className="mr-1" />
                        {projet.auteur.ecole}
                      </span>
                      <span className="flex items-center">
                        <FaBookmark className="mr-1" />
                        {projet.categorie}
                      </span>
                    </div>
                    {projet.auteur.filiere && (
                      <p className="text-sm text-gray-500">
                        Filière: {projet.auteur.filiere}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {type === 'popular' ? (
                    <div>
                      <div className="text-2xl font-bold text-jig-primary">
                        {projet.votes.total}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">votes total</div>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="flex items-center text-purple-600">
                          <FaGavel className="mr-1" />
                          {projet.votes.jury} jury
                        </span>
                        <span className="flex items-center text-blue-600">
                          <FaUsers className="mr-1" />
                          {projet.votes.public} public
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl font-bold text-jig-primary">
                        {projet.scores.final}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">score final</div>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="flex items-center text-purple-600">
                          <FaGavel className="mr-1" />
                          {projet.votes.jury} jury
                        </span>
                        <span className="flex items-center text-blue-600">
                          <FaUsers className="mr-1" />
                          {projet.votes.public} public
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {projet.votes.total} votes au total
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-jig-primary to-pink-500 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center" data-aos="fade-down">
            <FaTrophy className="text-6xl mx-auto mb-6 text-yellow-300" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Classement Officiel
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Résultats finaux du concours JIG 2026
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-1 flex">
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'popular'
                  ? 'bg-jig-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaUsers className="inline mr-2" />
              Classement Populaire
            </button>
            <button
              onClick={() => setActiveTab('final')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'final'
                  ? 'bg-jig-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaGavel className="inline mr-2" />
              Classement Final
            </button>
          </div>
        </div>

        {/* Explication du système */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-aos="fade-up">
          <h3 className="font-bold text-lg mb-3 flex items-center">
            <FaChartBar className="mr-3 text-jig-primary" />
            Système de notation
          </h3>
          {activeTab === 'popular' ? (
            <p className="text-gray-600">
              Le <strong>classement populaire</strong> est basé sur le nombre total de votes reçus par chaque projet.
                          <p className="text-gray-600">
              Tous les votes comptent de manière égale, qu'ils viennent du jury, des étudiants ou du public.
            </p>
            </p>
          ) : (
            <p className="text-gray-600">
              Le <strong>classement final</strong> utilise un système pondéré où les votes du jury comptent pour 
              <strong> 70%</strong> et les votes du public (étudiants + utilisateurs) pour <strong>30%</strong> 
              du score final.
            </p>
          )}
        </div>

        {/* Classement */}
        {renderClassement(classement, activeTab)}

        {/* Message si aucun résultat */}
        {classement.length === 0 && (
          <div className="text-center py-16">
            <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun résultat disponible
            </h3>
            <p className="text-gray-500">
              Les votes n'ont pas encore commencé ou aucun projet n'a été soumis.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}