'use client'

import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'https://jig-projet-1.onrender.com/api' // FORCE RENDER API

// Configuration Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = Cookies.get('jig-token')
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
      Cookies.remove('jig-token')
      Cookies.remove('jig-user')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Types
export interface User {
  id: number
  nom: string
  prenom: string
  email: string
  role: 'ADMIN' | 'JURY' | 'ETUDIANT'
  filiere?: string
  createdAt: string
}

export interface Projet {
  id: number
  titre: string
  description: string
  fichier: string
  createdAt: string
  user: User
  _count?: {
    votes: number
    commentaires: number
  }
}

export interface Vote {
  id: number
  valeur: number
  typeVote: 'JURY' | 'ETUDIANT'
  createdAt: string
  user: User
  projet: Projet
}

export interface Commentaire {
  id: number
  contenu: string
  createdAt: string
  user: User
  projet: Projet
}

// API Frontend
export const frontendApi = {
  // Authentification
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password })
    return response.data
  },

  register: async (userData: {
    nom: string
    prenom: string
    email: string
    password: string
  }) => {
    const response = await api.post('/users/register', {
      ...userData,
      role: 'ETUDIANT'
    })
    return response.data
  },

  // Projets
  getProjets: async (): Promise<Projet[]> => {
    const response = await api.get('/projets')
    return response.data
  },

  getProjet: async (id: number): Promise<Projet> => {
    const response = await api.get(`/projets/${id}`)
    return response.data
  },

  createProjet: async (projetData: FormData) => {
    const response = await api.post('/projets', projetData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Votes public
  voterPublic: async (projetId: number, userId: number) => {
    const response = await api.post('/votes', {
      projetId,
      userId,
      valeur: 1, // Vote simple du public
      typeVote: 'ETUDIANT'
    })
    return response.data
  },

  // Votes jury
  voterJury: async (voteData: {
    projetId: number
    juryId: number
    valeur: number
  }) => {
    const response = await api.post('/votes', {
      ...voteData,
      typeVote: 'JURY'
    })
    return response.data
  },

  // Commentaires
  ajouterCommentaire: async (commentData: {
    contenu: string
    projetId: number
    userId: number
  }) => {
    const response = await api.post('/commentaires', commentData)
    return response.data
  },

  getCommentaires: async (projetId: number): Promise<Commentaire[]> => {
    const response = await api.get(`/commentaires/projet/${projetId}`)
    return response.data
  },

  // Scores et résultats
  getScores: async () => {
    const response = await api.get('/votes/scores')
    return response.data
  },

  // Statistiques publiques
  getStatsPubliques: async () => {
    const response = await api.get('/stats/public')
    return response.data
  },

  // Contact
  envoyerContact: async (contactData: {
    nom: string
    email: string
    sujet: string
    message: string
  }) => {
    const response = await api.post('/contact', contactData)
    return response.data
  }
}

export default frontendApi