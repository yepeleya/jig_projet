// Test simple pour créer une notification
const notificationData = {
  type: 'NOUVEAU_UTILISATEUR',
  title: 'Nouveau test',
  message: 'Test de création de notification via l\'API',
  entityId: 1,
  entityType: 'test'
};

// Utiliser la fonction createNotification directement
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestNotification() {
  try {
    const notification = await prisma.notification.create({
      data: {
        type: notificationData.type,
        titre: notificationData.title,
        message: notificationData.message,
        entityId: notificationData.entityId,
        entityType: notificationData.entityType,
        isRead: false
      }
    });
    
    console.log('✅ Notification créée:', notification);
    
    // Compter les notifications non lues
    const unreadCount = await prisma.notification.count({
      where: { isRead: false }
    });
    
    console.log(`📊 Nombre de notifications non lues: ${unreadCount}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestNotification();