'use client'

import { NetworkErrorHandler } from '../utils/networkErrorHandler.js'

// Configuration de l'API
let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// S'assurer que l'URL se termine par /api
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = `${API_BASE_URL}/api`
}

// Classe pour gérer les appels API
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getToken() {
    // 1. Essayer depuis le store Zustand persisté
    try {
      const persistedAuth = localStorage.getItem('jig-auth-storage')
      if (persistedAuth) {
        const authData = JSON.parse(persistedAuth)
        if (authData?.state?.token) {
          return authData.state.token
        }
      }
    } catch (e) {
      console.warn('Erreur lecture token depuis auth store:', e)
    }
    
    // 2. Fallback vers les anciennes clés
    return localStorage.getItem('jig2026_token') || 
           localStorage.getItem('token') || 
           localStorage.getItem('authToken')
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  // Méthode générique pour faire des requêtes avec gestion d'erreur réseau
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    console.log('🌐 API Request:', options.method || 'GET', url)
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    // Ajouter le token d'authentification depuis différentes sources
    let token = null;
    
    // 1. Essayer depuis le store Zustand persisté
    try {
      const persistedAuth = localStorage.getItem('jig-auth-storage')
      if (persistedAuth) {
        const authData = JSON.parse(persistedAuth)
        token = authData?.state?.token
      }
    } catch (e) {
      console.warn('Erreur lecture auth store:', e)
    }
    
    // 2. Fallback vers les anciennes clés de localStorage
    if (!token) {
      token = localStorage.getItem('jig2026_token') || 
              localStorage.getItem('token') || 
              localStorage.getItem('authToken')
    }
    
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`
      console.log('🔑 Token ajouté aux headers:', token.substring(0, 20) + '...')
    } else {
      console.log('⚠️ Pas de token trouvé pour la requête')
    }

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    }

    try {
      // Utiliser un simple fetch sans timeout pour éviter les interruptions
      console.log('📤 Envoi requête avec options:', finalOptions)
      const response = await fetch(url, finalOptions)
      console.log('📥 Réponse reçue:', response.status, response.statusText)
      
      // Lire la réponse complètement avant de vérifier le status
      const responseData = await response.json()
      console.log('📊 Données reçues:', responseData)
      
      // Si la réponse n'est pas OK, lancer une erreur avec plus de détails
      if (!response.ok) {
        const errorData = responseData || { message: `Erreur HTTP: ${response.status}` }
        
        // Gestion spécifique des codes d'erreur
        if (response.status === 401) {
          // Token expiré ou invalide
          localStorage.removeItem('jig2026_token')
          if (typeof window !== 'undefined' && window.location.pathname !== '/') {
            // Rediriger vers la page de connexion si ce n'est pas déjà la page d'accueil
            window.location.href = '/'
          }
          throw new Error(errorData.message || 'Session expirée, veuillez vous reconnecter')
        } else if (response.status === 403) {
          throw new Error(errorData.message || 'Accès refusé')
        } else if (response.status === 500) {
          throw new Error(errorData.message || 'Erreur serveur, réessayez plus tard')
        } else {
          throw new Error(errorData.message || `Erreur HTTP: ${response.status}`)
        }
      }

      return responseData
    } catch (error) {
      console.error('Erreur API:', error)
      
      // Gestion des erreurs réseau
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Le serveur est indisponible')
      }
      
      throw error
    }
  }

  // Méthodes HTTP raccourcies
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // Méthode pour envoyer des fichiers
  async uploadFile(endpoint, formData) {
    const token = this.getToken()
    const headers = {}
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    })
  }
}

// Services spécialisés
export class AuthService extends ApiService {
  async login(credentials) {
    console.log('🔐 AuthService.login appelé avec:', credentials)
    try {
      const response = await this.post('/api/auth/login', credentials)
      console.log('📨 Réponse brute de l\'API:', response)
      
      if (response.success && response.data && response.data.token) {
        console.log('✅ Token reçu, sauvegarde en localStorage')
        localStorage.setItem('jig2026_token', response.data.token)
        localStorage.setItem('jig2026_user', JSON.stringify(response.data.user))
      }
      
      return response
    } catch (error) {
      console.error('💥 Erreur dans AuthService.login:', error)
      throw error
    }
  }

  async register(userData) {
    console.log('🔐 AuthService.register appelé avec:', userData)
    try {
      const response = await this.post('/api/auth/register', userData)
      console.log('📨 Réponse brute de l\'API:', response)
      return response
    } catch (error) {
      console.error('💥 Erreur dans AuthService.register:', error)
      throw error
    }
  }

  async logout() {
    // Déconnexion côté client - pas besoin d'appel API
    // On nettoie juste le localStorage
    localStorage.removeItem('jig2026_token')
    localStorage.removeItem('jig2026_user')
    
    console.log('🚪 Déconnexion locale réussie')
  }

  async getProfile() {
    return this.get('/api/auth/profile')
  }

  async verifyToken() {
    return this.get('/api/auth/verify')
  }

  getCurrentUser() {
    // 1. Essayer depuis le store Zustand persisté
    try {
      const persistedAuth = localStorage.getItem('jig-auth-storage')
      if (persistedAuth) {
        const authData = JSON.parse(persistedAuth)
        if (authData?.state?.user) {
          return authData.state.user
        }
      }
    } catch (e) {
      console.warn('Erreur lecture user depuis auth store:', e)
    }
    
    // 2. Fallback vers l'ancienne méthode
    const user = localStorage.getItem('jig2026_user')
    return user ? JSON.parse(user) : null
  }

  setToken(token) {
    localStorage.setItem('jig2026_token', token)
    this.token = token
  }
}

export class ProjetService extends ApiService {
  async getAllProjets(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    
    // TOUJOURS utiliser la route publique pour la page de vote
    const endpoint = queryParams ? `/projets/public?${queryParams}` : '/projets/public'
    
    console.log('🔍 Appel API:', endpoint)
    console.log('🔍 URL complète:', `${this.baseURL}${endpoint}`)
    
    // Ajouter un timestamp pour éviter le cache
    const finalEndpoint = endpoint + (endpoint.includes('?') ? '&' : '?') + `_t=${Date.now()}`
    
    return this.get(finalEndpoint)
  }

  async getProjetById(id) {
    return this.get(`/api/projets/${id}`)
  }

  async createProjet(formData) {
    return this.uploadFile('/api/projets', formData)
  }

  async soumettreProjet(formData) {
    return this.uploadFile('/api/projets/soumettre', formData)
  }

  async updateProjet(id, formData) {
    return this.uploadFile(`/api/projets/${id}`, formData)
  }

  async deleteProjet(id) {
    return this.delete(`/api/projets/${id}`)
  }

  async getProjetsByUser(userId) {
    return this.get(`/api/projets/user/${userId}`)
  }

  async getCategories() {
    return this.get('/api/projets/categories')
  }
}

export class VoteService extends ApiService {
  async vote(projetId, valeur) {
    // Récupérer le token et parser les infos utilisateur
    const token = this.getToken()
    if (!token) {
      throw new Error('Utilisateur non connecté')
    }

    // Décoder le token pour obtenir les infos utilisateur
    let user
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      user = payload
    } catch (error) {
      throw new Error('Token invalide')
    }

    const voteData = {
      projetId: parseInt(projetId),
      valeur: parseInt(valeur),
      typeVote: user.role === 'JURY' ? 'JURY' : 'ETUDIANT'
    }

    // Ajouter l'ID utilisateur selon le rôle
    if (user.role === 'JURY') {
      voteData.juryId = user.id
    } else {
      voteData.userId = user.id
    }

    console.log('📨 Données de vote envoyées:', voteData)
    return this.post('/api/votes', voteData)
  }

  async getVotesByProjet(projetId) {
    return this.get(`/api/votes/${projetId}`)
  }

  async getMyVotes() {
    return this.get('/api/votes/my-votes')
  }

  async getClassement(categorie = null) {
    const endpoint = categorie ? `/api/votes/classement?categorie=${categorie}` : '/api/votes/classement'
    return this.get(endpoint)
  }

  async getResults() {
    return this.get('/api/votes/results')
  }

  async getFinalResults() {
    return this.get('/api/votes/final-results')
  }

  async getAllVotes() {
    return this.get('/api/votes')
  }

  async getScores() {
    return this.get('/api/votes/scores/all')
  }

  async canVote(projetId) {
    return this.get(`/api/votes/can-vote/${projetId}`)
  }
}

export class CommentaireService extends ApiService {
  async addComment(projetId, contenu) {
    return this.post('/api/commentaires', { projetId, contenu })
  }

  async getCommentsByProjet(projetId) {
    return this.get(`/api/commentaires/projet/${projetId}`)
  }

  async updateComment(id, contenu) {
    return this.patch(`/api/commentaires/${id}`, { contenu })
  }

  async deleteComment(id) {
    return this.delete(`/api/commentaires/${id}`)
  }
}

export class ContactService extends ApiService {
  async sendMessage(contactData) {
    return this.post('/api/contact', contactData)
  }

  async getAllMessages() {
    return this.get('/api/contact')
  }

  async updateMessage(id, data) {
    return this.patch(`/api/contact/${id}`, data)
  }
}

export class GalerieService extends ApiService {
  async getAllImages() {
    return this.get('/api/galerie')
  }

  async addImage(formData) {
    return this.uploadFile('/api/galerie', formData)
  }

  async updateImage(id, data) {
    return this.patch(`/api/galerie/${id}`, data)
  }

  async deleteImage(id) {
    return this.delete(`/api/galerie/${id}`)
  }
}

export class AccessControlService extends ApiService {
  async canAccessPage(page) {
    return this.get(`/api/access-control/can-access/${page}`)
  }

  async getContestStatus() {
    return this.get('/api/access-control/status')
  }

  async validateRanking(token) {
    // Remplacer temporairement le token pour cette requête
    const oldToken = localStorage.getItem('jig2026_token')
    localStorage.setItem('jig2026_token', token)
    
    try {
      return this.post('/api/access-control/validate-ranking', {})
    } finally {
      // Restaurer l'ancien token
      if (oldToken) {
        localStorage.setItem('jig2026_token', oldToken)
      } else {
        localStorage.removeItem('jig2026_token')
      }
    }
  }
}

export class ProjetSuiviService extends ApiService {
  async getMesSuivis() {
    return this.get('/api/projet-suivi/mes-suivis')
  }

  async getSuiviProjet(projetId, includeHidden = false) {
    const params = includeHidden ? '?includeHidden=true' : ''
    return this.get(`/api/projet-suivi/projet/${projetId}${params}`)
  }

  async ajouterRemarque(data) {
    return this.post('/api/projet-suivi/ajouter', data)
  }

  async masquerSuivi(suiviId) {
    return this.patch(`/api/projet-suivi/${suiviId}/masquer`, {})
  }

  async supprimerSuivi(suiviId) {
    return this.delete(`/api/projet-suivi/${suiviId}`)
  }
}

export class ProgrammeService extends ApiService {
  async getAllProgrammes() {
    return this.get('/api/programmes')
  }

  async getProgrammeById(id) {
    return this.get(`/api/programmes/${id}`)
  }

  async createProgramme(data) {
    return this.post('/api/programmes', data)
  }

  async updateProgramme(id, data) {
    return this.patch(`/api/programmes/${id}`, data)
  }

  async deleteProgramme(id) {
    return this.delete(`/api/programmes/${id}`)
  }
}

// Instances des services
export const authService = new AuthService()
export const projetService = new ProjetService()
export const voteService = new VoteService()
export const commentaireService = new CommentaireService()
export const contactService = new ContactService()
export const galerieService = new GalerieService()
export const programmeService = new ProgrammeService()
export const accessControlService = new AccessControlService()
export const projetSuiviService = new ProjetSuiviService()

const apiServices = {
  auth: authService,
  projets: projetService,
  votes: voteService,
  commentaires: commentaireService,
  contact: contactService,
  galerie: galerieService,
  programmes: programmeService,
  accessControl: accessControlService,
  projetSuivi: projetSuiviService,
}

export default apiServices