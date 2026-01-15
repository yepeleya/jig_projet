import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkNotifications() {
  try {
    console.log('=== VÉRIFICATION DES NOTIFICATIONS ===\n');
    
    // Compter toutes les notifications
    const totalNotifications = await prisma.notification.count();
    console.log(`📊 Total notifications en DB: ${totalNotifications}`);
    
    // Récupérer les 5 dernières notifications
    const recentNotifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('\n📋 5 dernières notifications:');
    recentNotifications.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.type}] ${notif.titre}`);
      console.log(`   Message: ${notif.message}`);
      console.log(`   Créée: ${notif.createdAt}`);
      console.log(`   Lue: ${notif.isRead ? 'Oui' : 'Non'}\n`);
    });
    
    // Vérifier les derniers utilisateurs inscrits
    console.log('=== DERNIERS UTILISATEURS INSCRITS ===');
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    recentUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.prenom} ${user.nom} (${user.role})`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Inscrit: ${user.createdAt}\n`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNotifications();