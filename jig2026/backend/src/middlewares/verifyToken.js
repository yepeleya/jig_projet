import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const verifyToken = async (req, res, next) => {
  console.log('🔐 verifyToken middleware appelé pour:', req.method, req.path)
  const header = req.headers['authorization'];
  console.log('🔑 Header authorization:', header ? 'Présent' : 'Absent')
  if (!header) return res.status(401).json({ message: 'Token manquant' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload => { id, email, role, iat, exp }
    
    let user = null;
    
    // Si le rôle est JURY, chercher dans la table Jury
    if (payload.role === 'JURY') {
      // Vérifier d'abord dans la table User (utilisateurs avec rôle JURY)
      user = await prisma.user.findUnique({ 
        where: { id: payload.id },
        select: { id: true, email: true, role: true, nom: true, prenom: true }
      });
      
      // Si pas trouvé dans User, chercher dans la table Jury
      if (!user) {
        const jury = await prisma.jury.findUnique({ 
          where: { id: payload.id },
          select: { id: true, email: true, nom: true, prenom: true }
        });
        if (jury) {
          user = { ...jury, role: 'JURY' };
        }
      }
    } else {
      // Pour les autres rôles, chercher dans la table User
      user = await prisma.user.findUnique({ 
        where: { id: payload.id },
        select: { id: true, email: true, role: true, nom: true, prenom: true }
      });
    }
    
    if (!user) return res.status(401).json({ message: 'Utilisateur invalide' });
    
    console.log('✅ Utilisateur authentifié:', user.id, user.nom, user.prenom, user.role)
    req.user = { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      nom: user.nom,
      prenom: user.prenom
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide', error: err.message });
  }
};

export default verifyToken;
