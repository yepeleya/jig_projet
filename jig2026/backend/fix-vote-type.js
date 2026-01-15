import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixVoteType() {
  try {
    console.log('🔧 Correction du type de vote pour les utilisateurs...');
    
    // Corriger le vote ID 54 et tous les votes d'utilisateurs similaires
    const result = await prisma.vote.updateMany({
      where: {
        typeVote: 'UTILISATEUR'
      },
      data: {
        typeVote: 'ETUDIANT'
      }
    });
    
    console.log(`✅ ${result.count} votes corrigés de UTILISATEUR vers ETUDIANT`);
    
    // Vérifier les votes corrigés
    const votes = await prisma.vote.findMany({
      where: {
        id: 54
      },
      include: {
        user: true
      }
    });
    
    console.log('Vote ID 54 après correction:', votes[0]);
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixVoteType();