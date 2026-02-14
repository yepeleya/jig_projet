'use client'

// ==============================
// CONFIGURATION API
// ==============================
const API_BASE_URL = 'https://jig-projet-1.onrender.com/api'

console.log('🎯 API BASE URL:', API_BASE_URL)

// ==============================
// CLASSE BASE API
// ==============================
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getToken() {
    return localStorage.getItem('jig2026_token')
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  // ==============================
  // REQUÊTES JSON UNIQUEMENT
  // ==============================
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getToken()

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('jig2026_token')
        window.location.href = '/'
      }
      throw new Error(data.message || 'Erreur API')
    }

    return data
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

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
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
  async login(credentials) {
    const response = await this.post('/auth/login', credentials)

    if (response?.data?.token) {
      localStorage.setItem('jig2026_token', response.data.token)
      localStorage.setItem('jig2026_user', JSON.stringify(response.data.user))
    }

    return response
  }

  async register(data) {
    return this.post('/auth/register', data)
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
// PROJET SERVICE
// ==============================
export class ProjetService extends ApiService {
  getAllProjets(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.get(`/projets/public${params ? `?${params}` : ''}`)
  }

  getProjetById(id) {
    return this.get(`/projets/${id}`)
  }

  // 🔥 UPLOAD PROJET – VERSION UNIQUE ET SAINE
  async soumettreProjet(formData) {
    const token = this.getToken()

    const response = await fetch(`${this.baseURL}/projets/soumettre`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erreur soumission projet')
    }

    return data
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
  authService,
  projetService,
  voteService,
  commentaireService,
  contactService,
  galerieService,
  programmeService,
  accessControlService,
  projetSuiviService,
}

