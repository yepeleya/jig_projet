// API Vercel pour récupérer les projets publics
// Équivalent de GET /api/projets/public

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  // Configuration CORS pour les API Vercel
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      console.log('📋 Récupération des projets publics via Vercel API')
      
      const { categorie } = req.query
      const whereClause = {}
      
      if (categorie) {
        whereClause.categorie = categorie
      }

      // Récupération des projets avec données utilisateur
      const projets = await prisma.projet.findMany({
        where: {
          ...whereClause,
          statut: 'VALIDE' // Seulement les projets validés
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              id: true,
              prenom: true,
              nom: true,
              email: true
            }
          }
        }
      })

      console.log(`✅ ${projets.length} projets publics trouvés`)

      res.json({ 
        success: true, 
        data: projets,
        total: projets.length
      })
      
    } else {
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ error: 'Méthode non autorisée' })
    }
    
  } catch (error) {
    console.error('❌ Erreur API Vercel projets:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    })
  } finally {
    await prisma.$disconnect()
  }
}