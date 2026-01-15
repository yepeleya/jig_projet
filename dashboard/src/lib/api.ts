import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Configuration Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin-token')
      localStorage.removeItem('admin-user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

interface User {
  id: number
  nom: string
  prenom: string
  email: string
  role: 'ADMIN' | 'JURY' | 'ETUDIANT' | 'UTILISATEUR'
  telephone?: string
  ecole?: string
  filiere?: string
  niveau?: string
  createdAt: string
}

interface Jury {
  id: number
  nom: string
  prenom: string
  email: string
  specialite?: string
  bio?: string
  photo?: string
  createdAt: string
  _count?: {
    commentaires: number
    votes: number
  }
}

interface Projet {
  id: number
  titre: string
  description: string
  categorie: string
  fichier: string
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE'
  createdAt: string
  user: User
  votes: Vote[]
  _count: {
    votes: number
    commentaires: number
  }
}

interface Vote {
  id: number
  valeur: number
  typeVote: 'JURY' | 'ETUDIANT' | 'UTILISATEUR'
  createdAt: string
  user?: User
  projet?: Projet
}

interface Commentaire {
  id: number
  contenu: string
  createdAt: string
  jury: {
    id: number
    nom: string
    prenom: string
  }
  projet: Projet
}

interface Stats {
  totalUsers: number
  etudiantCount: number
  utilisateurCount: number
  adminCount: number
  juryCount: number
  projetCount: number
  projetApprouveCount: number
  voteCount: number
  commentaireCount: number
  moyenneVotes: number
  projetsByCategorie: Array<{
    categorie: string
    _count: { id: number }
  }>
  inscriptionsLastWeek: number[]
}

interface Score {
  projetId: number
  titre: string
  auteur: string
  scoreFinal: number
  scoreJury: number
  scorePublic: number
}

// API Admin
export const adminApi = {
  // Authentification
  login: async (email: string, motDePasse: string) => {
    const response = await api.post('/auth/login', { email, motDePasse })
    return response.data.data // Accéder à data.data car la réponse est { success, data: { user, token } }
  },

  // Gestion des utilisateurs avec filtres dynamiques
  getUsers: async (filters?: { role?: string; search?: string }): Promise<User[]> => {
    const params = new URLSearchParams()
    if (filters?.role) params.append('role', filters.role)
    if (filters?.search) params.append('search', filters.search)
    
    const response = await api.get(`/admin/users?${params.toString()}`)
    return response.data.data || []
  },

  createUser: async (userData: {
    nom: string
    prenom: string
    email: string
    motDePasse: string
    role: 'ADMIN' | 'JURY' | 'ETUDIANT' | 'UTILISATEUR'
  }): Promise<User> => {
    const response = await api.post('/auth/register', userData)
    return response.data.data
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, userData)
    return response.data.data
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`)
  },

  // Gestion des jurys spécifiquement
  getJurys: async (): Promise<Jury[]> => {
    const response = await api.get('/admin/jury')
    return response.data.data || []
  },

  createJury: async (juryData: {
    nom: string
    prenom: string
    email: string
    motDePasse: string
    specialite?: string
    bio?: string
  }): Promise<Jury> => {
    const response = await api.post('/admin/jury', juryData)
    return response.data.data
  },

  deleteJury: async (id: number): Promise<void> => {
    await api.delete(`/admin/jury/${id}`)
  },

  // Gestion des projets avec filtres
  getProjets: async (filters?: { statut?: string; search?: string }): Promise<Projet[]> => {
    const params = new URLSearchParams()
    if (filters?.statut) params.append('statut', filters.statut)
    if (filters?.search) params.append('search', filters.search)
    
    const response = await api.get(`/admin/projects?${params.toString()}`)
    return response.data.data || []
  },

  deleteProjet: async (id: number): Promise<void> => {
    await api.delete(`/admin/projects/${id}`)
  },

  approveProjet: async (id: number): Promise<void> => {
    await api.patch(`/admin/projects/${id}/status`, { statut: 'APPROUVE' })
  },

  rejectProjet: async (id: number): Promise<void> => {
    await api.patch(`/admin/projects/${id}/status`, { statut: 'REJETE' })
  },

  // Gestion des votes (utilise les routes admin)
  getVotes: async (): Promise<Vote[]> => {
    const response = await api.get('/admin/votes')
    return response.data.data || []
  },

  deleteVote: async (id: number): Promise<void> => {
    await api.delete(`/admin/votes/${id}`)
  },

  // Gestion des commentaires (utilise les routes existantes)
  getCommentaires: async (): Promise<Commentaire[]> => {
    const response = await api.get('/commentaires')
    return response.data.data || []
  },

  deleteCommentaire: async (id: number): Promise<void> => {
    await api.delete(`/commentaires/${id}`)
  },

  // Statistiques globales - VRAIES DONNÉES
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/admin/stats')
    return response.data.data || {
      totalUsers: 0,
      totalJury: 0,
      totalEtudiants: 0,
      totalProjets: 0,
      totalVotes: 0,
      totalCommentaires: 0,
      moyenneNotes: 0,
      projetsByCategorie: [],
      inscriptionsLastWeek: []
    }
  },

  // Scores finaux
  getScores: async () => {
    const response = await api.get('/votes/scores')
    return response.data.data || []
  },

  // Export des données
  exportData: async (type: 'users' | 'projets' | 'votes' | 'scores') => {
    const response = await api.get(`/admin/export/${type}`, {
      responseType: 'blob'
    })
    return response.data
  },

  // Méthodes génériques pour les appels API
  get: async (url: string) => {
    const response = await api.get(url)
    return response
  },

  post: async (url: string, data: unknown) => {
    const response = await api.post(url, data)
    return response
  },

  put: async (url: string, data: unknown) => {
    const response = await api.put(url, data)
    return response
  },

  patch: async (url: string, data?: unknown) => {
    const response = await api.patch(url, data)
    return response
  },

  delete: async (url: string) => {
    const response = await api.delete(url)
    return response
  }
}

export type { User, Jury, Projet, Vote, Commentaire, Stats, Score }