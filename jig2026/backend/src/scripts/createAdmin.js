import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createDefaultAdmin() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('✅ Un administrateur existe déjà:', existingAdmin.email)
      return
    }

    // Créer l'administrateur par défaut
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        nom: 'Administrateur',
        prenom: 'JIG2026',
        email: 'admin@jig2026.ci',
        motDePasse: hashedPassword,
        role: 'ADMIN'
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true
      }
    })

    console.log('🎉 Administrateur créé avec succès!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Mot de passe: admin123')
    console.log('⚠️  Changez le mot de passe après la première connexion!')
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultAdmin()