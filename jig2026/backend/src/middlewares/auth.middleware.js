import jwt from 'jsonwebtoken'
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient()

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token d\'accès requis' 
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Exception pour les tokens d'admin dashboard (email admin@jig2026.com)
    if (decoded.email === 'admin@jig2026.com' && decoded.role === 'ADMIN') {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        nom: decoded.nom,
        prenom: decoded.prenom
      }
      return next()
    }
    
    // Vérifier si l'utilisateur existe encore
    let user = null
    if (decoded.role === 'JURY') {
      user = await prisma.jury.findUnique({
        where: { id: decoded.id }
      })
    } else {
      user = await prisma.user.findUnique({
        where: { id: decoded.id }
      })
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      })
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      nom: user.nom,
      prenom: user.prenom
    }
    
    next()
  } catch (error) {
    console.error('Erreur d\'authentification:', error)
    return res.status(403).json({ 
      success: false, 
      message: 'Token invalide' 
    })
  }
}

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentification requise' 
      })
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Privilèges insuffisants' 
      })
    }

    next()
  }
}

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      success: false, 
      message: 'Accès administrateur requis' 
    })
  }
  next()
}

export const requireAdmin = requireRole('ADMIN')
export const requireJuryOrAdmin = requireRole('JURY', 'ADMIN')