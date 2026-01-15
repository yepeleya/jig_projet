import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function cleanDatabase() {
  console.log('🗑️ Nettoyage de la base de données...')

  try {
    // Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
    await prisma.projetSuivi.deleteMany({})
    console.log('✅ ProjetSuivi supprimés')

    await prisma.vote.deleteMany({})
    console.log('✅ Votes supprimés')

    await prisma.commentaire.deleteMany({})
    console.log('✅ Commentaires supprimés')

    await prisma.projet.deleteMany({})
    console.log('✅ Projets supprimés')

    await prisma.contact.deleteMany({})
    console.log('✅ Messages de contact supprimés')

    await prisma.galerie.deleteMany({})
    console.log('✅ Images de galerie supprimées')

    await prisma.programme.deleteMany({})
    console.log('✅ Programmes supprimés')

    await prisma.notification.deleteMany({})
    console.log('✅ Notifications supprimées')

    // Supprimer tous les utilisateurs SAUF l'admin
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: {
          not: 'admin@jig2026.com'
        }
      }
    })
    console.log(`✅ ${deletedUsers.count} utilisateurs supprimés (admin conservé)`)

    // Supprimer tous les jurys
    await prisma.jury.deleteMany({})
    console.log('✅ Jurys supprimés')

    // Vérifier que l'admin existe, sinon le créer
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@jig2026.com' }
    })

    if (!admin) {
      console.log('⚠️ Admin non trouvé, création...')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      await prisma.user.create({
        data: {
          nom: 'Administrateur',
          prenom: 'JIG 2026',
          email: 'admin@jig2026.com',
          motDePasse: hashedPassword,
          role: 'ADMIN',
          telephone: '0123456789',
          ecole: 'Administration',
          filiere: 'Gestion',
          niveau: 'Admin'
        }
      })
      console.log('✅ Administrateur créé avec succès')
      console.log('📧 Email: admin@jig2026.com')
      console.log('🔑 Mot de passe: admin123')
    } else {
      console.log('✅ Administrateur conservé')
      console.log('📧 Email: admin@jig2026.com')
    }

    console.log('')
    console.log('🎉 Base de données nettoyée avec succès!')
    console.log('💡 Seul l\'administrateur a été conservé')
    console.log('🚀 Le projet est prêt pour l\'hébergement')
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })