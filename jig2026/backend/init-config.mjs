// Script simple pour initialiser les configurations de base
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function initConfigurations() {
  try {
    console.log('🔧 Initialisation des configurations...')

    // Configuration pour la visibilité du classement (par défaut fermé)
    await prisma.configuration.upsert({
      where: { cle: 'classement_public_visible' },
      update: {},
      create: {
        cle: 'classement_public_visible',
        valeur: 'false',
        type: 'boolean'
      }
    })
    console.log('✅ Configuration classement_public_visible créée')

    // Date limite des votes (30 jours à partir d'aujourd'hui)
    const dateLimiteVotes = new Date()
    dateLimiteVotes.setDate(dateLimiteVotes.getDate() + 30)
    
    await prisma.configuration.upsert({
      where: { cle: 'date_limite_votes' },
      update: {},
      create: {
        cle: 'date_limite_votes',
        valeur: dateLimiteVotes.toISOString(),
        type: 'date'
      }
    })
    console.log('✅ Configuration date_limite_votes créée')

    // Date limite de soumission (15 jours à partir d'aujourd'hui)
    const dateLimiteSoumission = new Date()
    dateLimiteSoumission.setDate(dateLimiteSoumission.getDate() + 15)
    
    await prisma.configuration.upsert({
      where: { cle: 'date_limite_soumission' },
      update: {},
      create: {
        cle: 'date_limite_soumission',
        valeur: dateLimiteSoumission.toISOString(),
        type: 'date'
      }
    })
    console.log('✅ Configuration date_limite_soumission créée')

    // Votes actifs (par défaut true)
    await prisma.configuration.upsert({
      where: { cle: 'votes_actifs' },
      update: {},
      create: {
        cle: 'votes_actifs',
        valeur: 'true',
        type: 'boolean'
      }
    })
    console.log('✅ Configuration votes_actifs créée')

    // Afficher toutes les configurations
    const configs = await prisma.configuration.findMany()
    console.log('\n📋 Configurations actuelles:')
    configs.forEach(config => {
      console.log(`  ${config.cle}: ${config.valeur} (${config.type})`)
    })

    console.log('\n🎉 Initialisation terminée avec succès!')

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initConfigurations()