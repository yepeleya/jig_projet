'use client';

import { useState, useEffect } from "react";
import { Star, Search, FileX, RefreshCw, User, Award, Calendar, Grid, List, Heart, TrendingUp, Eye, Download, Play, Image as ImageIcon, FileText } from "lucide-react";
import { authService, projetService, voteService } from "@/services/api";
import { useRouter } from "next/navigation";

export default function VoterPage() {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [votesLoading, setVotesLoading] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('titre'); // 'titre', 'note', 'date'
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifier l'authentification côté client uniquement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(authService.isAuthenticated());
    }
  }, []);

  const categories = [
    'all',
    'Design UX/UI',
    'Animation 3D', 
    'PAO',
    'Photographie',
    'Développement Web',
    'Animation 2D'
  ];

  const filteredAndSortedProjets = projets
    .filter(projet => {
      const matchesSearch = 
        projet.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.user?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.user?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || projet.categorie === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'note':
          return (b.moyenneVote || 0) - (a.moyenneVote || 0);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'titre':
        default:
          return a.titre.localeCompare(b.titre);
      }
    });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : index < rating 
            ? 'fill-yellow-200 text-yellow-200' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCategorieColor = (categorie) => {
    const colors = {
      'développement web': 'bg-blue-500 text-white',
      'design ux/ui': 'bg-purple-500 text-white',
      'mobile': 'bg-green-500 text-white',
      'animation 3d': 'bg-orange-500 text-white',
      'animation 2d': 'bg-red-500 text-white',
      'photographie': 'bg-pink-500 text-white',
      'pao': 'bg-indigo-500 text-white',
      'default': 'bg-gray-500 text-white'
    };
    const key = categorie?.toLowerCase().replace(/[^a-z]/g, '') || 'default';
    return colors[key] || colors.default;
  };

  // Fonction pour obtenir l'icône du type de fichier
  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <ImageIcon className="w-5 h-5 text-green-600" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'webm':
        return <Play className="w-5 h-5 text-blue-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  // Fonction pour vérifier si un fichier est une image
  const isImage = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
  };

  // Fonction pour vérifier si un fichier est une vidéo
  const isVideo = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    return ['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(extension);
  };

  // Fonction pour obtenir l'URL complète du fichier
  const getFileUrl = (fileName) => {
    if (!fileName) return null;
    
    // Pour les vidéos, utiliser le proxy Next.js pour éviter les problèmes CORS
    if (isVideo(fileName)) {
      return `/api/video/${fileName}`;
    }
    
    // Construire l'URL de base sans /api pour les autres fichiers statiques
    const baseUrl = 'https://jig-projet-1.onrender.com'; // FORCE RENDER
    return `${baseUrl}/uploads/${fileName}`;
  };

  // Composant pour afficher les fichiers du projet
  const ProjectFiles = ({ projet }) => {
    if (!projet.fichier && !projet.fichiers) {
      return null;
    }

    // Gérer les anciens projets avec un seul fichier
    const fichiers = projet.fichiers || (projet.fichier ? [projet.fichier] : []);
    
    if (fichiers.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Fichiers du projet
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {fichiers.map((fichier, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getFileIcon(fichier)}
                  <span className="font-medium text-sm text-gray-700">
                    {fichier.split('/').pop()}
                  </span>
                </div>
                <a
                  href={getFileUrl(fichier)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  <Download className="w-3 h-3" />
                  Télécharger
                </a>
              </div>
              
              {/* Prévisualisation pour les images */}
              {isImage(fichier) && (
                <div className="mb-3">
                  <img
                    src={getFileUrl(fichier)}
                    alt={`Aperçu de ${fichier}`}
                    className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              {/* Prévisualisation pour les vidéos */}
              {isVideo(fichier) && (
                <div className="mb-3">
                  <video
                    controls
                    className="w-full max-h-64 rounded-lg border border-gray-200"
                    preload="metadata"
                  >
                    <source src={getFileUrl(fichier)} type={`video/${fichier.split('.').pop()}`} />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                </div>
              )}
              
              {/* Aperçu PDF intégré */}
              {fichier.endsWith('.pdf') && (
                <div className="mb-3">
                  <iframe
                    src={`${getFileUrl(fichier)}#toolbar=1&navpanes=1&scrollbar=1`}
                    className="w-full h-96 border border-gray-200 rounded-lg"
                    title={`Aperçu PDF de ${fichier}`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 === DEBUT CHARGEMENT PROJETS ===');
      console.log('🔍 TOKEN UTILISÉ:', projetService.getToken());
      console.log('🌐 URL BASE API:', projetService.baseURL);
      
      const response = await projetService.getAllProjets();
      
      console.log('📦 RÉPONSE BRUTE:', response);
      console.log('📦 TYPE RÉPONSE:', typeof response);
      console.log('📦 SUCCESS:', response?.success);
      console.log('📦 DATA:', response?.data);
      console.log('📦 DATA LENGTH:', response?.data?.length);
      
      let projetsData = [];
      
      if (Array.isArray(response)) {
        projetsData = response;
      } else if (response && response.success && Array.isArray(response.data)) {
        projetsData = response.data;
      } else if (response && Array.isArray(response.projets)) {
        projetsData = response.projets;
      } else {
        console.error('Format de données invalide:', response);
        setError('Format de données invalide reçu du serveur');
        return;
      }
      
      // 🚨 PLUS DE DONNÉES DE TEST - On doit corriger la vraie API
      if (projetsData.length === 0) {
        console.error('❌ API retourne tableau vide - le backend doit être corrigé');
        console.error('Vérifiez que l\endpoint /projets/public retourne bien tous les projets TERMINE');
      }
      
      setProjets(projetsData);
      console.log(`${projetsData.length} projets chargés avec succès`);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      
      if (error.message.includes('401')) {
        setError('Connexion requise pour voir les projets');
      } else if (error.message.includes('403')) {
        setError('Accès non autorisé à cette ressource');
      } else if (error.message.includes('500')) {
        setError('Erreur serveur. Veuillez réessayer plus tard');
      } else if (error.message.includes('fetch')) {
        setError('Impossible de se connecter au serveur');
      } else {
        setError(`Erreur lors du chargement des projets: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (projetId, note) => {
    if (!isLoggedIn) {
      setError('Vous devez être connecté pour voter');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    try {
      setVotesLoading(prev => ({ ...prev, [projetId]: true }));
      
      // Utiliser le service de vote au lieu d'une requête fetch directe
      const response = await voteService.vote(projetId, note);
      
      if (response.success) {
        await loadProjects();
        setSelectedProjet(null);
        setError(null);
      } else {
        setError(response.message || 'Erreur lors du vote');
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      setError(error.message || 'Erreur lors du vote');
    } finally {
      setVotesLoading(prev => ({ ...prev, [projetId]: false }));
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jig-background via-white to-jig-accent">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Chargement des projets...</h2>
              <p className="text-gray-600">Préparation de l&apos;expérience de vote</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <FileX className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Oups ! Un problème est survenu</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={loadProjects}
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jig-background via-white to-jig-accent">
      {/* En-tête héroique */}
      <div className="relative overflow-hidden bg-gradient-to-r from-jig-primary via-red-600 to-jig-primary">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center text-white space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-jig-accent bg-clip-text text-transparent">
                Voter
              </span>{" "}
              pour les Projets
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Découvrez et soutenez les créations exceptionnelles des étudiants JIG 2026
            </p>
            
            {/* Statistiques */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-8 h-8 text-white mr-2" />
                  <span className="text-3xl font-bold">{projets.length}</span>
                </div>
                <p className="text-white/80">Projets</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8 text-white mr-2" />
                  <span className="text-3xl font-bold">
                    {projets.length > 0 ? 
                      (projets.reduce((sum, p) => sum + (p.moyenneVote || 0), 0) / projets.length).toFixed(1)
                      : '0.0'
                    }
                  </span>
                </div>
                <p className="text-white/80">Note moyenne</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="w-8 h-8 text-white mr-2" />
                  <span className="text-3xl font-bold">{filteredAndSortedProjets.length}</span>
                </div>
                <p className="text-white/80">Affichés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles de filtrage et recherche */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un projet, auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jig-primary focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Toutes les catégories' : cat}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jig-primary focus:border-transparent"
              >
                <option value="titre">Trier par titre</option>
                <option value="note">Trier par note</option>
                <option value="date">Trier par date</option>
              </select>

              {/* Mode d'affichage */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-jig-primary shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-jig-primary shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des projets */}
        {filteredAndSortedProjets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileX className="h-16 w-16 text-gray-300 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Aucun projet trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== 'all' ? 
                "Essayez d'ajuster vos filtres de recherche." :
                "Aucun projet n'est disponible pour le moment."
              }
            </p>
            {(searchTerm || filterCategory !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory('all');
                }} 
                                className="px-6 py-3 bg-jig-primary text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-6"
          }>
            {filteredAndSortedProjets.map((projet) => (
              <div 
                key={projet.id} 
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'overflow-hidden'
                }`}
              >
                {viewMode === 'grid' ? (
                  // Vue grille
                  <>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">
                          {projet.titre}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategorieColor(projet.categorie)}`}>
                          {projet.categorie}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {projet.description?.substring(0, 120)}
                        {projet.description?.length > 120 && '...'}
                      </p>
                      
                      <div className="space-y-4">
                        {/* Auteur */}
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-2" />
                          <span>{projet.user?.prenom} {projet.user?.nom}</span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(projet.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>

                        {/* Note et votes */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {renderStars(projet.moyenneVote || 0)}
                            </div>
                            <span className="font-bold text-gray-800">
                              {(projet.moyenneVote || 0).toFixed(1)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {projet.totalVotes || 0} vote{(projet.totalVotes || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-jig-primary to-red-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${(projet.moyenneVote || 0) * 20}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6">
                      <button
                        onClick={() => setSelectedProjet(projet)}
                        disabled={!isLoggedIn || votesLoading[projet.id]}
                        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-jig-primary to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                      >
                        {votesLoading[projet.id] ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Vote en cours...
                          </>
                        ) : (
                          <>
                            <Star className="h-5 w-5 mr-2" />
                            {isLoggedIn ? 'Voter pour ce projet' : 'Connexion requise'}
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  // Vue liste
                  <>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{projet.titre}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategorieColor(projet.categorie)}`}>
                          {projet.categorie}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {projet.description?.substring(0, 200)}
                        {projet.description?.length > 200 && '...'}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {projet.user?.prenom} {projet.user?.nom}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(projet.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {renderStars(projet.moyenneVote || 0)}
                          </div>
                          <span className="font-bold">{(projet.moyenneVote || 0).toFixed(1)}</span>
                          <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {projet.totalVotes || 0} vote{(projet.totalVotes || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <button
                        onClick={() => setSelectedProjet(projet)}
                        disabled={!isLoggedIn || votesLoading[projet.id]}
                        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-black text-white rounded-xl hover:from-orange-700 hover:to-gray-900 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                      >
                        {votesLoading[projet.id] ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Vote...
                          </>
                        ) : (
                          <>
                            <Star className="h-5 w-5 mr-2" />
                            {isLoggedIn ? 'Voter' : 'Connexion'}
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de vote amélioré */}
      {selectedProjet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative p-8">
              {/* Header du modal */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-jig-primary to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Votez pour ce projet
                </h3>
                <h4 className="text-xl text-jig-primary font-semibold mb-2">
                  &ldquo;{selectedProjet.titre}&rdquo;
                </h4>
                <p className="text-gray-600">
                  Attribuez une note de 1 à 5 étoiles à ce projet
                </p>
              </div>
              
              {/* Système de vote */}
              <div className="space-y-6">
                <div className="text-center">
                  <p className="font-medium text-gray-700 mb-6">Votre évaluation :</p>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((note) => (
                      <button
                        key={note}
                        onClick={() => handleVote(selectedProjet.id, note)}
                        disabled={votesLoading[selectedProjet.id]}
                        className="group p-3 hover:scale-110 transition-all duration-200 disabled:cursor-not-allowed"
                      >
                        <Star className="h-12 w-12 fill-yellow-400 text-yellow-400 group-hover:fill-yellow-500 group-hover:text-yellow-500 transition-colors" />
                        <div className="text-xs font-medium text-gray-600 mt-1">{note}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Cliquez sur une étoile pour attribuer votre note
                  </p>
                </div>
                
                {/* Informations sur le projet */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        Par <strong>{selectedProjet.user?.prenom} {selectedProjet.user?.nom}</strong>
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        {new Date(selectedProjet.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {selectedProjet.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedProjet.description}
                      </p>
                    )}
                    
                    {/* Affichage des fichiers du projet */}
                    <ProjectFiles projet={selectedProjet} />
                  </div>
                </div>
                
                {/* Boutons d'actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedProjet(null)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}