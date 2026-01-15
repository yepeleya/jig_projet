import prisma from "../utils/prismaClient.js";

export const createNotification = async (type, titre, message, entityId = null, entityType = null, metadata = null) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        titre,
        message,
        entityId,
        entityType,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });
    return notification;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { limit = 20, offset = 0, unreadOnly = false } = req.query;
    
    const whereClause = {};
    if (unreadOnly === 'true') {
      whereClause.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Compter les notifications non lues
    const unreadCount = await prisma.notification.count({
      where: { isRead: false }
    });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        total: notifications.length
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    });

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const result = await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    });

    res.json({ 
      success: true, 
      data: { 
        updatedCount: result.count 
      } 
    });
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'Notification supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { isRead: false }
    });

    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Erreur lors du comptage des notifications non lues:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};