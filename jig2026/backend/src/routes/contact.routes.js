import express from 'express'
import { ContactController } from '../controllers/contact.controller.js'
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Routes publiques
router.post('/', ContactController.createContact)

// Routes protégées admin
router.get('/', authenticateToken, requireAdmin, ContactController.getAllContacts)
router.get('/:id', authenticateToken, requireAdmin, ContactController.getContactById)
router.patch('/:id', authenticateToken, requireAdmin, ContactController.updateContact)
router.delete('/:id', authenticateToken, requireAdmin, ContactController.deleteContact)

export default router