import express from 'express'
import { JuryController } from '../controllers/jury.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

// Middleware pour vérifier l'authentification
router.use(verifyToken)

// Routes spécifiques aux jurys
router.get('/votes', JuryController.getMyVotes)
router.get('/comments', JuryController.getMyComments)
router.patch('/projets/:projetId/statut', JuryController.updateProjetStatut)

export default router