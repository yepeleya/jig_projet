'use client'

// ==============================
// API SERVICE WITH ENHANCED ERROR HANDLING
// ==============================
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://jig-backend-2026.onrender.com/api'  // ✅ URL FORCÉE VERS RENDER
  : 'http://localhost:10000/api'

console.log('🎯 API_BASE_URL configurée:', API_BASE_URL)

export class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jig2026_token')
    }
    return null
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getToken()
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    console.log('🔄 API Request:', { url, method: config.method || 'GET' })

    try {
      const response = await fetch(url, config)
      console.log('📡 API Response Status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ API Response Data:', data)
      return data

    } catch (error) {
      console.error('💥 API Error:', error)
      throw error
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT', 
      body: JSON.stringify(data),
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

// ==============================
// AUTH SERVICE
// ==============================
export class AuthService extends ApiService {
  async register(userData) {
    return this.post('/auth/register', userData)
  }

  async login(credentials) {
    const response = await this.post('/auth/login', credentials)
    
    if (response.data?.token) {
      localStorage.setItem('jig2026_token', response.data.token)
      localStorage.setItem('jig2026_user', JSON.stringify(response.data.user))
    }
    
    return response
  }

  logout() {
    localStorage.removeItem('jig2026_token')
    localStorage.removeItem('jig2026_user')
  }

  getProfile() {
    return this.get('/auth/profile')
  }
}

// ==============================
// PROJET SERVICE WITH ENHANCED ERROR HANDLING
// ==============================
export class ProjetService extends ApiService {
  getAllProjets(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.get(`/projets/public${params ? `?${params}` : ''}`)
  }

  getProjetById(id) {
    return this.get(`/projets/${id}`)
  }

  // 🔥 SOUMISSION PROJET AVEC GESTION D'ERREURS RENFORCÉE
  async soumettreProjet(formData) {
    try {
      console.log('🚀 Début soumission projet...')
      const token = this.getToken()

      if (!token) {
        throw new Error('Token d\'authentification manquant')
      }

      // Vérification que formData est bien un FormData
      if (!(formData instanceof FormData)) {
        throw new Error('Les données doivent être au format FormData')
      }

      console.log('📤 Envoi vers /projets/soumettre...')
      
      const response = await fetch(`${this.baseURL}/projets/soumettre`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Ne pas définir Content-Type pour FormData (le navigateur le fait automatiquement)
        },
        body: formData,
      })

      console.log('📡 Status de réponse:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Erreur serveur:', errorData)
        
        // Messages d'erreur plus descriptifs  
        if (response.status === 404) {
          throw new Error('Service de soumission non disponible. Veuillez réessayer plus tard.')
        } else if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.')
        } else if (response.status === 413) {
          throw new Error('Les fichiers sont trop volumineux.')
        } else {
          throw new Error(errorData.message || `Erreur serveur (${response.status})`)
        }
      }

      const data = await response.json()
      console.log('✅ Projet soumis avec succès:', data)
      return data

    } catch (error) {
      console.error('💥 Erreur lors de la soumission:', error)
      
      // Fallback en cas d'erreur réseau
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Problème de connexion. Vérifiez votre connexion internet.')
      }
      
      throw error
    }
  }

  getMesProjets() {
    return this.get('/projets/mes-projets')
  }

  getCategories() {
    return this.get('/projets/categories')
  }
}

// ==============================
// VOTE SERVICE
// ==============================
export class VoteService extends ApiService {
  vote(projetId, valeur) {
    return this.post('/votes', { projetId, valeur })
  }

  getVotesByProjet(id) {
    return this.get(`/votes/${id}`)
  }

  getClassement(categorie) {
    return this.get(`/votes/classement${categorie ? `?categorie=${categorie}` : ''}`)
  }
}

// ==============================
// COMMENTAIRES
// ==============================
export class CommentaireService extends ApiService {
  addComment(projetId, contenu) {
    return this.post('/commentaires', { projetId, contenu })
  }

  getCommentsByProjet(projetId) {
    return this.get(`/commentaires/projet/${projetId}`)
  }
}

// ==============================
// CONTACT
// ==============================
export class ContactService extends ApiService {
  sendMessage(data) {
    return this.post('/contact', data)
  }

  getAllMessages() {
    return this.get('/contact')
  }
}

// ==============================
// GALERIE (UPLOAD SIMPLE)
// ==============================
export class GalerieService extends ApiService {
  getAllImages() {
    return this.get('/galerie')
  }

  async addImage(formData) {
    const token = this.getToken()

    const response = await fetch(`${this.baseURL}/galerie`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    return data
  }
}

// ==============================
// PROGRAMME
// ==============================
export class ProgrammeService extends ApiService {
  getAllProgrammes() {
    return this.get('/programmes')
  }

  createProgramme(data) {
    return this.post('/programmes', data)
  }
}

// ==============================
// ACCESS CONTROL
// ==============================
export class AccessControlService extends ApiService {
  canAccessPage(pageName) {
    return this.get(`/access-control/page/${pageName}`)
  }

  getContestStatus() {
    return this.get('/access-control/status')
  }

  validateRanking() {
    return this.post('/access-control/validate')
  }
}

// ==============================
// PROJET SUIVI
// ==============================
export class ProjetSuiviService extends ApiService {
  getMesSuivis() {
    return this.get('/projets/mes-suivis')
  }

  getSuiviById(id) {
    return this.get(`/projets/suivi/${id}`)
  }
}

// ==============================
// INSTANCES
// ==============================
export const authService = new AuthService()
export const projetService = new ProjetService()
export const voteService = new VoteService()
export const commentaireService = new CommentaireService()
export const contactService = new ContactService()
export const galerieService = new GalerieService()
export const programmeService = new ProgrammeService()
export const accessControlService = new AccessControlService()
export const projetSuiviService = new ProjetSuiviService()

export default {
  auth: authService,
  projets: projetService,
  votes: voteService,
  commentaires: commentaireService,
  contact: contactService,
  galerie: galerieService,
  programme: programmeService,
  accessControl: accessControlService,
  projetSuivi: projetSuiviService,
}