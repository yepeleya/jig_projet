import express from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Routes publiques
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

// Routes protégées
router.get('/profile', authenticateToken, AuthController.getProfile)
router.put('/profile', authenticateToken, AuthController.updateProfile)
router.get('/me', authenticateToken, AuthController.getProfile)
router.post('/change-password', authenticateToken, AuthController.changePassword)
router.post('/logout', authenticateToken, AuthController.logout)
router.get('/verify', authenticateToken, AuthController.verifyToken)

// Routes admin
router.post('/jury', authenticateToken, requireAdmin, AuthController.createJury)

export default router
