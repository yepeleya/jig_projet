// Script pour modifier la date limite des votes
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateDateLimiteVotes() {
  try {
    console.log('🗓️ Mise à jour de la date limite des votes...')

    // Nouvelle date limite : 5 février 2026
    const nouvelleDateLimite = new Date('2026-02-05T23:59:59.999Z')
    
    // Mettre à jour la configuration
    const config = await prisma.configuration.upsert({
      where: { cle: 'date_limite_votes' },
      update: { 
        valeur: nouvelleDateLimite.toISOString(),
      },
      create: {
        cle: 'date_limite_votes',
        valeur: nouvelleDateLimite.toISOString(),
        type: 'date'
      }
    })

    console.log('✅ Date limite des votes mise à jour avec succès!')
    console.log(`📅 Nouvelle date limite: ${nouvelleDateLimite.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`)

    // Afficher toutes les configurations mises à jour
    const configs = await prisma.configuration.findMany({
      where: {
        cle: {
          in: ['date_limite_votes', 'date_limite_soumission', 'classement_public_visible', 'votes_actifs']
        }
      }
    })
    
    console.log('\n📋 Configurations actuelles:')
    configs.forEach(config => {
      if (config.type === 'date') {
        const date = new Date(config.valeur)
        console.log(`  ${config.cle}: ${date.toLocaleDateString('fr-FR')} (${config.type})`)
      } else {
        console.log(`  ${config.cle}: ${config.valeur} (${config.type})`)
      }
    })

    console.log('\n🎉 Mise à jour terminée!')

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateDateLimiteVotes()