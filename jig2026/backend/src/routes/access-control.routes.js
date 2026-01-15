import express from 'express';
import { AccessControlService } from '../services/access-control.service.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * GET /api/access-control/status
 * Obtenir le statut complet du concours et les permissions d'accès
 */
router.get('/status', async (req, res) => {
  try {
    const status = await AccessControlService.getContestStatus();
    const phaseMessage = AccessControlService.getPhaseMessage(status.phase, status.dates);
    
    res.json({
      success: true,
      data: {
        ...status,
        phaseMessage
      }
    });
  } catch (error) {
    console.error('Erreur /access-control/status:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du statut',
      error: error.message
    });
  }
});

/**
 * GET /api/access-control/can-access/:page
 * Vérifier si une page spécifique est accessible
 */
router.get('/can-access/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const status = await AccessControlService.getContestStatus();
    
    let canAccess = false;
    let blockMessage = null;

    switch (page) {
      case 'submission':
        canAccess = status.canSubmit;
        break;
      case 'vote':
        canAccess = status.canVote;
        break;
      case 'ranking':
        canAccess = status.canViewRanking;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Page non reconnue'
        });
    }

    if (!canAccess) {
      blockMessage = AccessControlService.getPageBlockMessage(page, status.phase, status.dates);
    }

    res.json({
      success: true,
      data: {
        page,
        canAccess,
        phase: status.phase,
        blockMessage,
        phaseMessage: AccessControlService.getPhaseMessage(status.phase, status.dates)
      }
    });
  } catch (error) {
    console.error(`Erreur /access-control/can-access/${req.params.page}:`, error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification d\'accès',
      error: error.message
    });
  }
});

/**
 * POST /api/access-control/validate-ranking
 * Valider le classement (admin seulement)
 */
router.post('/validate-ranking', authenticateToken, async (req, res) => {
  try {
    // Vérifier les permissions admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Action réservée aux administrateurs'
      });
    }

    const result = await AccessControlService.validateRanking();
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erreur /access-control/validate-ranking:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la validation du classement',
      error: error.message
    });
  }
});

/**
 * GET /api/access-control/phase
 * Obtenir uniquement la phase actuelle (endpoint léger)
 */
router.get('/phase', async (req, res) => {
  try {
    const phase = await AccessControlService.getCurrentPhase();
    
    res.json({
      success: true,
      data: {
        phase,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur /access-control/phase:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la phase',
      error: error.message
    });
  }
});

export default router;