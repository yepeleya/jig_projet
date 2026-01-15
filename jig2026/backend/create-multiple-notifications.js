import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createMultipleTestNotifications() {
  const notifications = [
    {
      type: 'NOUVEAU_UTILISATEUR',
      titre: 'Nouvel utilisateur inscrit',
      message: 'Jean Dupont s\'est inscrit sur la plateforme JIG 2026',
      entityId: 1,
      entityType: 'user'
    },
    {
      type: 'NOUVEAU_PROJET',
      titre: 'Nouveau projet soumis',
      message: 'Le projet "Innovation IA pour l\'éducation" a été soumis par l\'équipe TechStars',
      entityId: 2,
      entityType: 'projet'
    },
    {
      type: 'NOUVEAU_VOTE',
      titre: 'Nouveau vote enregistré',
      message: 'Le jury Marie Martin a voté pour le projet "EcoTech Solutions"',
      entityId: 3,
      entityType: 'vote'
    },
    {
      type: 'NOUVEAU_JURY',
      titre: 'Nouveau membre du jury',
      message: 'Dr. Pierre Dubois a été ajouté comme membre du jury pour la catégorie Innovation',
      entityId: 4,
      entityType: 'jury'
    },
    {
      type: 'NOUVEAU_CONTACT',
      titre: 'Nouveau message de contact',
      message: 'Une demande de partenariat a été reçue de la société ABC Corp',
      entityId: 5,
      entityType: 'contact'
    },
    {
      type: 'PROJET_APPROUVE',
      titre: 'Projet approuvé',
      message: 'Le projet "GreenTech Revolution" a été approuvé et passe en phase finale',
      entityId: 6,
      entityType: 'projet'
    },
    {
      type: 'NOUVEAU_COMMENTAIRE',
      titre: 'Nouveau commentaire',
      message: 'Un jury a commenté le projet "Smart City Solutions"',
      entityId: 7,
      entityType: 'commentaire'
    },
    {
      type: 'PROJET_REJETE',
      titre: 'Projet nécessite des modifications',
      message: 'Le projet "Robot Assistant" nécessite des ajustements avant validation',
      entityId: 8,
      entityType: 'projet'
    }
  ];

  try {
    console.log('🧪 Création de plusieurs notifications de test...\n');
    
    for (const notification of notifications) {
      const created = await prisma.notification.create({
        data: notification
      });
      console.log(`✅ ${notification.titre}`);
    }
    
    // Compter les notifications
    const totalCount = await prisma.notification.count();
    const unreadCount = await prisma.notification.count({
      where: { isRead: false }
    });
    
    console.log('\n🎉 Toutes les notifications ont été créées !');
    console.log(`📊 Total: ${totalCount} notifications`);
    console.log(`📮 Non lues: ${unreadCount} notifications`);
    console.log('\n📱 Ouvrez votre Dashboard: http://localhost:3001');
    console.log('🔔 Cliquez sur l\'icône cloche pour voir les notifications');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMultipleTestNotifications();