import express from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} from '../controllers/notification.controller.js';

const router = express.Router();

// Récupérer toutes les notifications
router.get('/', getNotifications);

// Créer une nouvelle notification
router.post('/', createNotification);

// Récupérer le nombre de notifications non lues
router.get('/unread-count', getUnreadCount);

// Marquer une notification comme lue
router.patch('/:id/read', markAsRead);

// Marquer toutes les notifications comme lues
router.patch('/mark-all-read', markAllAsRead);

// Supprimer une notification
router.delete('/:id', deleteNotification);

export default router;