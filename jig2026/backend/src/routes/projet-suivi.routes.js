import express from 'express'
import { authenticateToken } from '../middlewares/auth.middleware.js' // CORRECTION
import {
  ajouterSuivi,
  getSuiviProjet,
  getMesSuivis,
  masquerSuivi,
  supprimerSuivi
} from '../controllers/projet-suivi.controller.js'

const router = express.Router()

// Routes protégées (authentification requise)
router.use(authenticateToken) // CORRECTION

// POST /api/projet-suivi - Ajouter une nouvelle entrée de suivi (admin/jury seulement)
router.post('/', ajouterSuivi)

// GET /api/projet-suivi/mes-suivis - Récupérer tous les suivis de l'utilisateur connecté
router.get('/mes-suivis', getMesSuivis)

// GET /api/projet-suivi/:projetId - Récupérer le suivi d'un projet spécifique
router.get('/:projetId', getSuiviProjet)

// PUT /api/projet-suivi/:suiviId/masquer - Masquer une entrée de suivi (admin seulement)
router.put('/:suiviId/masquer', masquerSuivi)

// DELETE /api/projet-suivi/:suiviId - Supprimer une entrée de suivi (admin seulement)
router.delete('/:suiviId', supprimerSuivi)

export default router