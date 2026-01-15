// Script pour vérifier toutes les configurations
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifierConfigurations() {
  try {
    console.log('🔍 Vérification des configurations actuelles...\n')

    const configs = await prisma.configuration.findMany()
    
    console.log('📋 Toutes les configurations:')
    configs.forEach(config => {
      if (config.type === 'date') {
        const date = new Date(config.valeur)
        const maintenant = new Date()
        const estPasse = date < maintenant
        
        console.log(`  ${config.cle}: ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR')}`)
        console.log(`    Status: ${estPasse ? '🔴 PASSÉ' : '🟢 À VENIR'}`)
      } else {
        console.log(`  ${config.cle}: ${config.valeur} (${config.type})`)
      }
      console.log('')
    })

    // Logique métier
    const dateLimiteVotes = configs.find(c => c.cle === 'date_limite_votes')
    const dateLimiteSoumission = configs.find(c => c.cle === 'date_limite_soumission')
    const votesActifs = configs.find(c => c.cle === 'votes_actifs')
    const classementVisible = configs.find(c => c.cle === 'classement_public_visible')

    console.log('🤖 Analyse de la logique métier:')
    
    if (dateLimiteSoumission) {
      const dateLimit = new Date(dateLimiteSoumission.valeur)
      const maintenant = new Date()
      console.log(`  📝 Soumissions: ${dateLimit < maintenant ? '🔴 FERMÉES' : '🟢 OUVERTES'}`)
    }

    if (dateLimiteVotes && votesActifs) {
      const dateLimit = new Date(dateLimiteVotes.valeur)
      const maintenant = new Date()
      const votesOuverts = votesActifs.valeur === 'true' && dateLimit > maintenant
      console.log(`  🗳️ Votes: ${votesOuverts ? '🟢 ACTIFS' : '🔴 FERMÉS'}`)
    }

    if (classementVisible) {
      console.log(`  🏆 Classement public: ${classementVisible.valeur === 'true' ? '🟢 VISIBLE' : '🔴 MASQUÉ'}`)
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifierConfigurations()