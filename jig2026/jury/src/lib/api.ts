'use client'

import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Types pour les données API
interface Vote {
  id: number
  valeur: number  // Note du vote (backend utilise 'valeur' pas 'note')
  typeVote: string
  projetId: number
  userId?: number
  juryId?: number
  createdAt: string
  projet: {
    id: number
    titre: string
    description: string
    categorie: string
    image?: string
    statut: string
  } | null
}

interface Comment {
  id: string
  contenu: string
  dateCreation: string
  dateModification?: string
  projet: {
    id: string
    titre: string
    description: string
    user: {
      prenom: string
      nom: string
      email: string
    }
    statut: string
  }
  jury: {
    prenom: string
    nom: string
  }
}

// Instance Axios avec configuration de base
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter automatiquement le token JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const juryStorage = localStorage.getItem('jury-storage')
    if (juryStorage) {
      const { state } = JSON.parse(juryStorage)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    }
  }
  return config
})

// Services API pour le jury
export const juryApi = {
  // Authentification
  login: async (email: string, motDePasse: string) => {
    const response = await api.post('/auth/login', { email, motDePasse })
    // L'API retourne { success: true, data: { user, token } }
    return response.data.data || response.data
  },

  // Profil
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data.data || response.data
  },

  updateProfile: async (profileData: {
    nom?: string
    prenom?: string
    email?: string
    specialite?: string
    bio?: string
  }) => {
    const response = await api.put('/auth/profile', profileData)
    return response.data.data || response.data
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword
    })
    return response.data.data || response.data
  },

  // Projets
  getProjets: async () => {
    const response = await api.get('/projets')
    // L'API retourne { success: true, data: [...] }
    return response.data.data || response.data
  },

  // Votes
  getMyVotes: async (): Promise<Vote[]> => {
    const response = await api.get('/jury/votes')
    return response.data.data || response.data || []
  },

  voter: async (voteData: {
    projetId: number
    juryId: number
    valeur: number
    typeVote: string
  }) => {
    const response = await api.post('/votes', voteData)
    return response.data.data || response.data
  },

  // Commentaires
  getMyComments: async (): Promise<Comment[]> => {
    const response = await api.get('/jury/comments')
    return response.data.data || response.data || []
  },

  updateComment: async (commentId: string, contenu: string) => {
    const response = await api.put(`/comments/${commentId}`, { contenu })
    return response.data.data || response.data
  },

  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data.data || response.data
  },

  getVotesByProjet: async (projetId: number) => {
    const response = await api.get(`/votes/${projetId}`)
    return response.data.data || response.data
  },

  getScores: async () => {
    const response = await api.get('/votes/scores/all')
    return response.data.data || response.data
  },

  // Commentaires
  ajouterCommentaire: async (commentaireData: {
    contenu: string
    projetId: number
    juryId: number
  }) => {
    const response = await api.post('/commentaires', commentaireData)
    return response.data.data || response.data
  },

  getCommentairesByProjet: async (projetId: number) => {
    const response = await api.get(`/commentaires/${projetId}`)
    return response.data.data || response.data
  },

  // Mise à jour du statut du projet (route spécifique jury)
  updateProjetStatut: async (projetId: number, statut: string) => {
    const response = await api.patch(`/jury/projets/${projetId}/statut`, { statut })
    return response.data.data || response.data
  }
}