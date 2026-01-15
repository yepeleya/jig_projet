import prisma from "../utils/prismaClient.js";

async function initializeConfiguration() {
  try {
    console.log('🔧 Initialisation des configurations...');

    // Configuration pour la visibilité du classement
    await prisma.configuration.upsert({
      where: { cle: 'classement_public_visible' },
      update: {},
      create: {
        cle: 'classement_public_visible',
        valeur: 'false',
        type: 'boolean'
      }
    });

    // Configuration pour la date limite de soumission des projets
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() + 30); // 30 jours à partir d'aujourd'hui par défaut
    
    await prisma.configuration.upsert({
      where: { cle: 'date_limite_soumission' },
      update: {},
      create: {
        cle: 'date_limite_soumission',
        valeur: dateLimite.toISOString(),
        type: 'date'
      }
    });

    // Configuration pour la date limite des votes
    const dateLimiteVotes = new Date();
    dateLimiteVotes.setDate(dateLimiteVotes.getDate() + 45); // 45 jours à partir d'aujourd'hui par défaut
    
    await prisma.configuration.upsert({
      where: { cle: 'date_limite_votes' },
      update: {},
      create: {
        cle: 'date_limite_votes',
        valeur: dateLimiteVotes.toISOString(),
        type: 'date'
      }
    });

    // Configuration pour le statut de la période de votes
    await prisma.configuration.upsert({
      where: { cle: 'votes_actifs' },
      update: {},
      create: {
        cle: 'votes_actifs',
        valeur: 'true',
        type: 'boolean'
      }
    });

    // Configuration pour l'activation automatique du classement après la date limite
    await prisma.configuration.upsert({
      where: { cle: 'activation_auto_classement' },
      update: {},
      create: {
        cle: 'activation_auto_classement',
        valeur: 'true',
        type: 'boolean'
      }
    });

    console.log('✅ Configurations initialisées avec succès');
    
    // Afficher les configurations actuelles
    const configs = await prisma.configuration.findMany();
    console.log('\n📋 Configurations actuelles:');
    configs.forEach(config => {
      console.log(`  ${config.cle}: ${config.valeur} (${config.type})`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des configurations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeConfiguration();
}

export default initializeConfiguration;