import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export class AuthService {
  // Inscription utilisateur
  static async register(userData) {
    const { nom, prenom, email, motDePasse, role = 'UTILISATEUR', telephone, ecole, filiere, niveau } = userData
    
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé')
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        role,
        telephone,
        ecole,
        filiere,
        niveau
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        telephone: true,
        ecole: true,
        filiere: true,
        niveau: true,
        createdAt: true
      }
    })

    // Générer le token
    const token = this.generateToken(user)

    return { user, token }
  }

  // Connexion utilisateur
  static async login(email, motDePasse) {
    // Chercher dans les utilisateurs
    let user = await prisma.user.findUnique({
      where: { email }
    })

    let userType = 'user'

    // Si pas trouvé, chercher dans les jurys
    if (!user) {
      user = await prisma.jury.findUnique({
        where: { email }
      })
      userType = 'jury'
    }

    if (!user) {
      throw new Error('Email ou mot de passe incorrect')
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(motDePasse, user.motDePasse)
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect')
    }

    // Préparer les données utilisateur
    const userData = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: userType === 'jury' ? 'JURY' : (user.role || 'UTILISATEUR'),
      telephone: user.telephone,
      ecole: user.ecole,
      filiere: user.filiere,
      niveau: user.niveau
    }

    // Générer le token
    const token = this.generateToken(userData)

    return { user: userData, token }
  }

  // Créer un jury
  static async createJury(juryData) {
    const { nom, prenom, email, motDePasse, specialite, bio } = juryData
    
    // Vérifier si l'email existe déjà
    const existingJury = await prisma.jury.findUnique({
      where: { email }
    })
    
    if (existingJury) {
      throw new Error('Cet email est déjà utilisé')
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 12)

    // Créer le jury
    const jury = await prisma.jury.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        specialite,
        bio
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        specialite: true,
        bio: true,
        createdAt: true
      }
    })

    return jury
  }

  // Générer un token JWT
  static generateToken(user) {
    const secret = process.env.JWT_SECRET || 'jig2026_super_secret_key_production_railway_xyz123ABC'
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      secret,
      { expiresIn: '7d' }
    )
  }

  // Vérifier un token
  static verifyToken(token) {
    const secret = process.env.JWT_SECRET || 'jig2026_super_secret_key_production_railway_xyz123ABC'
    return jwt.verify(token, secret)
  }

  // Changer le mot de passe
  static async changePassword(userId, oldPassword, newPassword, userType = 'user') {
    const table = userType === 'jury' ? prisma.jury : prisma.user
    
    const user = await table.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    // Vérifier l'ancien mot de passe
    const isValidPassword = await bcrypt.compare(oldPassword, user.motDePasse)
    if (!isValidPassword) {
      throw new Error('Ancien mot de passe incorrect')
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Mettre à jour
    await table.update({
      where: { id: userId },
      data: { motDePasse: hashedPassword }
    })

    return true
  }

  // Mettre à jour le profil
  static async updateProfile(userId, profileData, userType = 'user') {
    const table = userType === 'jury' ? prisma.jury : prisma.user
    
    // Nettoyer les données (enlever les champs vides)
    const cleanData = {}
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null && profileData[key] !== '') {
        cleanData[key] = profileData[key]
      }
    })

    // Si email changé, vérifier qu'il n'existe pas déjà
    if (cleanData.email) {
      const existingUser = await table.findFirst({
        where: {
          email: cleanData.email,
          id: { not: userId }
        }
      })
      
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé')
      }
    }

    // Mettre à jour le profil
    const updatedUser = await table.update({
      where: { id: userId },
      data: cleanData,
      select: userType === 'jury' ? {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        specialite: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      } : {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        telephone: true,
        ecole: true,
        filiere: true,
        niveau: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return updatedUser
  }
}