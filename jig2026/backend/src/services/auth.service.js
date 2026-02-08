import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export class AuthService {
  // Inscription utilisateur
  static async register(userData) {
    const { nom, prenom, email, password, role = 'VISITEUR' } = userData
    
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé')
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur avec champs de base uniquement
    const user = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        role
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true
      }
    })

    // Générer le token
    const token = this.generateToken(user)

    return { user, token }
  }

  // Connexion utilisateur
  static async login(email, password) {
    // Chercher l'utilisateur (tous types confondus via le rôle)
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('Email ou mot de passe incorrect')
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.motDePasse)
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect')
    }

    // Préparer les données utilisateur
    const userData = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role || 'VISITEUR'
    }

    // Générer le token
    const token = this.generateToken(userData)

    return { user: userData, token }
  }

  // Créer un jury - utilise le modèle User avec role=JURY
  static async createJury(juryData) {
    const { nom, prenom, email, password } = juryData
    
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé')
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur avec rôle JURY
    const jury = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        role: 'JURY'
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true
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
  static async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({
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
    await prisma.user.update({
      where: { id: userId },
      data: { motDePasse: hashedPassword }
    })

    return true
  }

  // Mettre à jour le profil
  static async updateProfile(userId, profileData) {
    // Nettoyer les données (enlever les champs vides)
    const cleanData = {}
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null && profileData[key] !== '') {
        // Ne garder que les champs existants dans le modèle
        if (['nom', 'prenom', 'email'].includes(key)) {
          cleanData[key] = profileData[key]
        }
      }
    })

    // Si email changé, vérifier qu'il n'existe pas déjà
    if (cleanData.email) {
      const existingUser = await prisma.user.findFirst({
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
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: cleanData,
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true
      }
    })

    return updatedUser
  }
}
