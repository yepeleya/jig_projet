// API Vercel pour l'authentification - Login
// Équivalent de POST /api/auth/login

import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  try {
    const { email, password } = req.body

    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email et mot de passe requis' 
      })
    }

    // Recherche de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email ou mot de passe incorrect' 
      })
    }

    // Vérification du mot de passe
    const isValidPassword = await bcryptjs.compare(password, user.password)
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email ou mot de passe incorrect' 
      })
    }

    // Création du token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log(`✅ Connexion réussie pour ${user.email}`)

    // Retour des données utilisateur (sans mot de passe)
    const { password: _, ...userSafe } = user

    res.json({ 
      success: true, 
      data: {
        token,
        user: userSafe
      },
      message: 'Connexion réussie' 
    })

  } catch (error) {
    console.error('❌ Erreur login Vercel API:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    })
  } finally {
    await prisma.$disconnect()
  }
}