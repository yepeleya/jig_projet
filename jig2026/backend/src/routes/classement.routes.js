import express from 'express';
import { 
  getClassement,
  getClassementVisibility,
  toggleClassementVisibility,
  getClassementPublic,
  getClassementConfiguration,
  updateDateLimites
} from '../controllers/classement.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes publiques
/**
 * @route   GET /api/classement/public
 * @desc    Obtenir le classement public (si activé)
 * @access  Public
 */
router.get('/public', getClassementPublic);

/**
 * @route   GET /api/classement/visible
 * @desc    Vérifier si le classement est visible publiquement
 * @access  Public
 */
router.get('/visible', getClassementVisibility);

// Routes protégées (Admin seulement)
/**
 * @route   GET /api/classement
 * @desc    Obtenir le classement complet (pour admin)
 * @access  Private (Admin)
 */
router.get('/', authenticateToken, getClassement);

/**
 * @route   POST /api/classement/toggle
 * @desc    Activer/désactiver la visibilité publique du classement
 * @access  Private (Admin)
 */
router.post('/toggle', authenticateToken, toggleClassementVisibility);

/**
 * @route   GET /api/classement/configuration
 * @desc    Obtenir la configuration des dates et paramètres
 * @access  Private (Admin)
 */
router.get('/configuration', authenticateToken, getClassementConfiguration);

/**
 * @route   PUT /api/classement/dates
 * @desc    Mettre à jour les dates limites
 * @access  Private (Admin)
 */
router.put('/dates', authenticateToken, updateDateLimites);

export default router;