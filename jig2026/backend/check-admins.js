import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });
    
    console.log('=== ADMINISTRATEURS DANS LA DB ===');
    console.log(JSON.stringify(admins, null, 2));
    
    if (admins.length === 0) {
      console.log('\n❌ Aucun administrateur trouvé !');
    } else {
      console.log(`\n✅ ${admins.length} administrateur(s) trouvé(s)`);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmins();