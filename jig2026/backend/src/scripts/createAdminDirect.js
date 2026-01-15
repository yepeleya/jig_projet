import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🔄 Création de l\'utilisateur admin...')
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: 'tenenayeo@jig2026.ci' }
    })
    
    if (existingUser) {
      console.log('✅ L\'utilisateur existe déjà!')
      console.log('📧 Email:', existingUser.email)
      console.log('🏷️  Rôle:', existingUser.role)
      console.log('🔑 Mot de passe haché:', existingUser.motDePasse.substring(0, 20) + '...')
      return
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Créer l'utilisateur
    const admin = await prisma.user.create({
      data: {
        nom: 'yeo',
        prenom: 'tenena',
        email: 'tenenayeo@jig2026.ci',
        motDePasse: hashedPassword,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    console.log('🎉 Utilisateur admin créé avec succès!')
    console.log('👤 ID:', admin.id)
    console.log('👤 Nom complet:', admin.prenom, admin.nom)
    console.log('📧 Email:', admin.email)
    console.log('🏷️  Rôle:', admin.role)
    console.log('📅 Créé le:', admin.createdAt)
    console.log('🔑 Mot de passe: admin123 (haché automatiquement)')
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()