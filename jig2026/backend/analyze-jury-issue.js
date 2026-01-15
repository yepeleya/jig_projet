import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeJuryVotesIssue() {
  try {
    console.log('=== ANALYSE COMPLÈTE DU PROBLÈME JURY ===\n');
    
    // 1. Utilisateurs avec rôle JURY
    console.log('1. UTILISATEURS AVEC RÔLE JURY:');
    const juryUsers = await prisma.user.findMany({
      where: { role: 'JURY' },
      select: { id: true, nom: true, prenom: true, email: true, role: true }
    });
    console.log(JSON.stringify(juryUsers, null, 2));
    
    // 2. Entités Jury (table séparée)
    console.log('\n2. ENTITÉS JURY (TABLE JURY):');
    const actualJuries = await prisma.jury.findMany({
      select: { id: true, nom: true, prenom: true, email: true }
    });
    console.log(JSON.stringify(actualJuries, null, 2));
    
    // 3. Votes avec juryId (référence table Jury)
    console.log('\n3. VOTES AVEC JURY_ID:');
    const votesWithJuryId = await prisma.vote.findMany({
      where: { juryId: { not: null } },
      include: {
        jury: { select: { nom: true, prenom: true, email: true } },
        projet: { select: { titre: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    console.log(JSON.stringify(votesWithJuryId, null, 2));
    
    // 4. Votes avec userId (utilisateurs avec rôle JURY)
    console.log('\n4. VOTES D\'UTILISATEURS AVEC RÔLE JURY:');
    const votesFromJuryUsers = await prisma.vote.findMany({
      where: { 
        user: { role: 'JURY' }
      },
      include: {
        user: { select: { nom: true, prenom: true, email: true, role: true } },
        projet: { select: { titre: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    console.log(JSON.stringify(votesFromJuryUsers, null, 2));
    
    // 5. Commentaires avec juryId
    console.log('\n5. COMMENTAIRES AVEC JURY_ID:');
    const commentsWithJuryId = await prisma.commentaire.findMany({
      include: {
        jury: { select: { nom: true, prenom: true, email: true } },
        projet: { select: { titre: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    console.log(JSON.stringify(commentsWithJuryId, null, 2));
    
    console.log('\n=== DIAGNOSTIC ===');
    console.log(`Utilisateurs avec rôle JURY: ${juryUsers.length}`);
    console.log(`Entités Jury (table séparée): ${actualJuries.length}`);
    console.log(`Votes avec juryId: ${votesWithJuryId.length}`);
    console.log(`Votes d'utilisateurs JURY: ${votesFromJuryUsers.length}`);
    console.log(`Commentaires avec juryId: ${commentsWithJuryId.length}`);
    
  } catch(error) {
    console.error('Erreur lors de l\'analyse:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeJuryVotesIssue();