import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugSuivis() {
  try {
    console.log('🔍 Debug des suivis pour Jean daniel Koné (ID 13)');
    
    // 1. Vérifier les projets de l'utilisateur 13
    const projets = await prisma.projet.findMany({
      where: { userId: 13 },
      select: { id: true, titre: true, userId: true, createdAt: true }
    });
    console.log('📋 Projets de l\'utilisateur 13:', projets);
    
    if (projets.length === 0) {
      console.log('❌ Aucun projet trouvé pour l\'utilisateur 13');
      return;
    }
    
    const projetIds = projets.map(p => p.id);
    console.log('🎯 IDs des projets:', projetIds);
    
    // 2. Vérifier tous les suivis dans la table (peu importe la visibilité)
    const tousLesSuivis = await prisma.projetSuivi.findMany({
      where: {
        projetId: { in: projetIds }
      },
      include: {
        user: { select: { nom: true, prenom: true } },
        jury: { select: { nom: true, prenom: true } },
        projet: { select: { titre: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log('📊 Tous les suivis (visible + cachés):', tousLesSuivis);
    
    // 3. Vérifier seulement les suivis visibles
    const suivisVisibles = await prisma.projetSuivi.findMany({
      where: {
        projetId: { in: projetIds },
        visible: true
      },
      include: {
        user: { select: { nom: true, prenom: true } },
        jury: { select: { nom: true, prenom: true } },
        projet: { select: { titre: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log('👁️ Suivis visibles seulement:', suivisVisibles);
    
    // 4. Vérifier les votes sur les projets
    const votes = await prisma.vote.findMany({
      where: {
        projetId: { in: projetIds }
      },
      include: {
        user: { select: { nom: true, prenom: true } },
        projet: { select: { titre: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log('🗳️ Votes sur les projets:', votes);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSuivis();