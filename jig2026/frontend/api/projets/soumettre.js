// API Vercel pour la soumission de projets
// Équivalent de POST /api/projets/soumettre

import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import multiparty from 'multiparty'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export const config = {
  api: {
    bodyParser: false, // Désactiver le parser par défaut pour gérer les fichiers
  },
}

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
    // 1. Vérification de l'authentification
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token d\'authentification requis' 
      })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // 2. Parse du formulaire multipart
    const form = new multiparty.Form()
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })

    // 3. Extraction des données
    const titre = fields.titre?.[0]
    const description = fields.description?.[0]
    const categorie = fields.categorie?.[0]
    const niveau = fields.niveau?.[0] || decoded.niveau
    const fichier = files.fichier?.[0]

    // 4. Validation des données
    if (!titre || titre.trim().length < 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Le titre doit contenir au moins 3 caractères' 
      })
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ 
        success: false, 
        error: 'La description doit contenir au moins 10 caractères' 
      })
    }

    // 5. Vérification anti-doublon
    const projetExistant = await prisma.projet.findFirst({
      where: {
        userId: decoded.id,
        titre: titre.trim()
      }
    })

    if (projetExistant) {
      return res.status(409).json({ 
        success: false, 
        error: 'Un projet avec ce titre existe déjà' 
      })
    }

    // 6. Gestion du fichier (optionnel pour Vercel)
    let nomFichier = null
    if (fichier) {
      // Note: Dans Vercel, les fichiers ne persistent pas
      // Alternative: utiliser un service externe comme Cloudinary/S3
      nomFichier = `${Date.now()}_${fichier.originalFilename}`
      
      // Pour le développement, on sauvegarde juste le nom
      console.log('📁 Fichier reçu:', fichier.originalFilename)
    }

    // 7. Création du projet
    const nouveauProjet = await prisma.projet.create({
      data: {
        titre: titre.trim(),
        description: description.trim(),
        categorie: categorie?.trim() || 'Autre',
        fichier: nomFichier,
        userId: decoded.id,
        statut: 'EN_ATTENTE'
      },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    })

    console.log(`✅ Projet "${nouveauProjet.titre}" soumis via Vercel API`)

    res.status(201).json({ 
      success: true, 
      data: {
        id: nouveauProjet.id,
        titre: nouveauProjet.titre,
        description: nouveauProjet.description,
        categorie: nouveauProjet.categorie,
        statut: nouveauProjet.statut,
        createdAt: nouveauProjet.createdAt
      },
      message: 'Projet soumis avec succès !' 
    })

  } catch (error) {
    console.error('❌ Erreur soumission Vercel API:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token invalide' 
      })
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    })
  } finally {
    await prisma.$disconnect()
  }
}