import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient()

async function fixInvalidDates() {
  try {
    console.log('🔧 Correction des dates invalides dans la base de données...')
    
    // Date par défaut : 1er janvier 2024
    const defaultDate = '2024-01-01 00:00:00'
    
    // Corriger les dates dans la table User
    console.log('📅 Correction des dates dans la table User...')
    const userResult = await prisma.$executeRaw`
      UPDATE User 
      SET 
        createdAt = ${defaultDate},
        updatedAt = ${defaultDate}
      WHERE 
        createdAt = '0000-00-00 00:00:00' 
        OR updatedAt = '0000-00-00 00:00:00'
        OR createdAt IS NULL 
        OR updatedAt IS NULL
    `
    console.log(`✅ ${userResult} utilisateurs mis à jour`)

    // Corriger les dates dans la table Jury (si elle existe)
    console.log('📅 Correction des dates dans la table Jury...')
    try {
      const juryResult = await prisma.$executeRaw`
        UPDATE Jury 
        SET 
          createdAt = ${defaultDate},
          updatedAt = ${defaultDate}
        WHERE 
          createdAt = '0000-00-00 00:00:00' 
          OR updatedAt = '0000-00-00 00:00:00'
          OR createdAt IS NULL 
          OR updatedAt IS NULL
      `
      console.log(`✅ ${juryResult} jurys mis à jour`)
    } catch (error) {
      console.log('ℹ️  Table Jury non trouvée ou pas de données à corriger')
    }

    // Corriger les dates dans la table Projet (si elle existe)
    console.log('📅 Correction des dates dans la table Projet...')
    try {
      const projetResult = await prisma.$executeRaw`
        UPDATE Projet 
        SET 
          createdAt = ${defaultDate},
          updatedAt = ${defaultDate}
        WHERE 
          createdAt = '0000-00-00 00:00:00' 
          OR updatedAt = '0000-00-00 00:00:00'
          OR createdAt IS NULL 
          OR updatedAt IS NULL
      `
      console.log(`✅ ${projetResult} projets mis à jour`)
    } catch (error) {
      console.log('ℹ️  Table Projet non trouvée ou pas de données à corriger')
    }

    // Corriger les dates dans la table Vote (si elle existe)
    console.log('📅 Correction des dates dans la table Vote...')
    try {
      const voteResult = await prisma.$executeRaw`
        UPDATE Vote 
        SET createdAt = ${defaultDate}
        WHERE 
          createdAt = '0000-00-00 00:00:00' 
          OR createdAt IS NULL
      `
      console.log(`✅ ${voteResult} votes mis à jour`)
    } catch (error) {
      console.log('ℹ️  Table Vote non trouvée ou pas de données à corriger')
    }

    // Corriger les dates dans la table Commentaire (si elle existe)
    console.log('📅 Correction des dates dans la table Commentaire...')
    try {
      const commentaireResult = await prisma.$executeRaw`
        UPDATE Commentaire 
        SET createdAt = ${defaultDate}
        WHERE 
          createdAt = '0000-00-00 00:00:00' 
          OR createdAt IS NULL
      `
      console.log(`✅ ${commentaireResult} commentaires mis à jour`)
    } catch (error) {
      console.log('ℹ️  Table Commentaire non trouvée ou pas de données à corriger')
    }

    console.log('🎉 Toutes les dates invalides ont été corrigées !')
    console.log('📅 Date par défaut utilisée:', defaultDate)
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction des dates:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

fixInvalidDates()