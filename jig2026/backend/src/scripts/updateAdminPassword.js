import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function updateAdminPassword() {
  try {
    // Utiliser une requête SQL brute pour éviter les problèmes de validation de dates
    const adminResult = await prisma.$queryRaw`
      SELECT id, nom, prenom, email, motDePasse, role 
      FROM User 
      WHERE email = 'tenenayeo@jig2026.ci'
    `

    if (adminResult.length === 0) {
      console.log('❌ Aucun admin trouvé avec cet email')
      return
    }

    const admin = adminResult[0]
    console.log('✅ Admin trouvé:', admin.email, 'Role:', admin.role)
    console.log('🔑 Mot de passe actuel:', admin.motDePasse)

    // Vérifier si le mot de passe est déjà haché
    const isHashed = admin.motDePasse.startsWith('$2b$') || admin.motDePasse.startsWith('$2a$')
    
    if (isHashed) {
      console.log('✅ Le mot de passe semble déjà être haché')
      
      // Tester la vérification
      const isValid = await bcrypt.compare('admin123', admin.motDePasse)
      console.log('🔍 Test de vérification du mot de passe:', isValid ? '✅ VALIDE' : '❌ INVALIDE')
      
      if (isValid) {
        console.log('🎉 Le mot de passe fonctionne correctement!')
        return
      }
    } else {
      console.log('⚠️  Le mot de passe n\'est pas haché (texte clair détecté)')
    }

    // Hacher le nouveau mot de passe
    console.log('🔄 Mise à jour du mot de passe...')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Utiliser une requête SQL brute pour la mise à jour
    await prisma.$executeRaw`
      UPDATE User 
      SET motDePasse = ${hashedPassword}
      WHERE email = 'tenenayeo@jig2026.ci'
    `

    console.log('🎉 Mot de passe mis à jour avec succès!')
    console.log('📧 Email: tenenayeo@jig2026.ci')
    console.log('🔑 Mot de passe: admin123')
    console.log('🔒 Hash:', hashedPassword)
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminPassword()