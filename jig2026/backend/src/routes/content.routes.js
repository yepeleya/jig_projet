import express from 'express';
import {
  getAllContent,
  getContentByPage,
  getContentByKey,
  createContent,
  updateContent,
  deleteContent,
  toggleContent,
  getAvailablePages,
  getPageSections,
  initializeDefaultContent
} from '../controllers/content.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes publiques (pour le frontend)
router.get('/page/:page', getContentByPage);
router.get('/key/:key', getContentByKey);
router.get('/pages', getAvailablePages);
router.get('/sections/:page', getPageSections);
// Initialisation temporaire sans auth pour setup initial
router.post('/initialize', initializeDefaultContent);

// Routes admin (nécessitent une authentification admin)
router.get('/', authenticateToken, isAdmin, getAllContent);
router.post('/', authenticateToken, isAdmin, createContent);
router.put('/:key', authenticateToken, isAdmin, updateContent);
router.delete('/:key', authenticateToken, isAdmin, deleteContent);
router.patch('/:key/toggle', authenticateToken, isAdmin, toggleContent);
// router.post('/initialize', authenticateToken, isAdmin, initializeDefaultContent); // Moved to public

export default router;