import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function creerVoteTest() {
  try {
    console.log('🧪 Création d\'un vote test pour générer un suivi');
    
    // 1. Trouver le projet de Jean daniel (ID 13)
    const projetJean = await prisma.projet.findFirst({
      where: { userId: 13 },
      select: { id: true, titre: true }
    });
    
    if (!projetJean) {
      console.log('❌ Aucun projet trouvé pour Jean daniel');
      return;
    }
    
    console.log('📋 Projet trouvé:', projetJean);
    
    // 2. Trouver un autre utilisateur (pas Jean daniel)
    const autreUser = await prisma.user.findFirst({
      where: { 
        id: { not: 13 },
        role: { in: ['UTILISATEUR', 'ETUDIANT'] }
      },
      select: { id: true, nom: true, prenom: true }
    });
    
    if (!autreUser) {
      console.log('❌ Aucun autre utilisateur trouvé');
      return;
    }
    
    console.log('👤 Autre utilisateur trouvé:', autreUser);
    
    // 3. Vérifier s'il a déjà voté
    const voteExistant = await prisma.vote.findFirst({
      where: {
        projetId: projetJean.id,
        userId: autreUser.id
      }
    });
    
    if (voteExistant) {
      console.log('⚠️ Cet utilisateur a déjà voté pour ce projet');
      console.log('📊 Vote existant:', voteExistant);
      return;
    }
    
    // 4. Créer un nouveau vote
    const nouveauVote = await prisma.vote.create({
      data: {
        valeur: 4.5,
        typeVote: 'ETUDIANT',
        projetId: projetJean.id,
        userId: autreUser.id,
        juryId: null
      }
    });
    
    console.log('✅ Vote créé:', nouveauVote);
    
    // 5. Importer et utiliser le service de suivi
    const { default: ProjetSuiviService } = await import('./src/services/projet-suivi.service.js');
    
    const resultatSuivi = await ProjetSuiviService.ajouterSuiviVote(
      projetJean.id,
      autreUser.id,
      null,
      4.5
    );
    
    console.log('📝 Résultat suivi:', resultatSuivi);
    
    // 6. Vérifier les suivis de Jean daniel
    const suivis = await prisma.projetSuivi.findMany({
      where: {
        projetId: projetJean.id,
        visible: true
      },
      include: {
        user: { select: { nom: true, prenom: true } },
        projet: { select: { titre: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('📋 Suivis après création:', suivis);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

creerVoteTest();