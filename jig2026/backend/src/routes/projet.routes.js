import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../utils/prismaClient.js";
import { soumettreProjet, getProjets, getProjetsPublics } from "../controllers/projet.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Configuration multer avancée avec validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique et sécurisé
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${baseName}_${uniqueSuffix}${extension}`);
  }
});

// Filtre de fichiers avec validation de type
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/zip',
    'application/x-zip-compressed',
    // Ajout des types vidéo
    'video/mp4',
    'video/avi',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB pour supporter les vidéos
    files: 1 // Un seul fichier
  }
});

// Middleware de gestion des erreurs multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Fichier trop volumineux (max 100MB)',
        code: 'FILE_TOO_LARGE'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Trop de fichiers (max 1 fichier)',
        code: 'TOO_MANY_FILES'
      });
    }
  }
  if (err.message === 'Type de fichier non autorisé') {
    return res.status(400).json({
      success: false,
      error: 'Type de fichier non autorisé',
      code: 'INVALID_FILE_TYPE'
    });
  }
  next(err);
};

// Routes
router.post("/soumettre", 
  authenticateToken, 
  upload.single("fichier"), 
  handleMulterError,
  soumettreProjet
);

router.get("/", authenticateToken, getProjets); // Protégé par authentification

// Route publique pour les projets approuvés (pour le vote public)
router.get("/public", getProjetsPublics); // Accès public aux projets approuvés uniquement

// Route simplifiée pour récupérer MES projets (utilisateur connecté)
router.get("/mes-projets", authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Récupération MES projets pour user:', req.user.id, req.user.nom);
    
    const projets = await prisma.projet.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            role: true
          }
        }
      }
    });

    console.log(`✅ ${projets.length} projets trouvés pour mes-projets`);

    res.json({
      success: true,
      data: projets
    });

  } catch (error) {
    console.error('❌ Erreur récupération mes projets:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de vos projets"
    });
  }
});

// Route pour récupérer les projets d'un utilisateur spécifique
// Support à la fois /user/:id ET /user/:userId pour compatibilité frontend
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('🔍 Récupération projets pour user ID:', userId);
    
    // Vérifier que l'utilisateur demande ses propres projets ou est admin
    if (req.user.id !== parseInt(userId) && req.user.role !== 'ADMIN') {
      console.log('❌ Accès refusé - User ID:', req.user.id, 'demandé:', userId);
      return res.status(403).json({
        success: false,
        error: "Accès refusé"
      });
    }

    const projets = await prisma.projet.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            role: true,
            ecole: true,
            filiere: true,
            niveau: true
          }
        }
      }
    });

    console.log(`✅ ${projets.length} projets trouvés pour user ${userId}`);

    res.json({
      success: true,
      data: projets
    });

  } catch (error) {
    console.error('❌ Erreur récupération projets utilisateur:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des projets"
    });
  }
});

// Route alternative pour compatibilité frontend (même logique)
router.get("/user/:id", authenticateToken, async (req, res) => {
  // Rediriger vers la route principale avec userId
  req.params.userId = req.params.id;
  // Réutiliser la même logique que ci-dessus
  try {
    const { id } = req.params;
    console.log('🔍 Récupération projets pour user ID (route alternative):', id);
    
    // Vérifier que l'utilisateur demande ses propres projets ou est admin
    if (req.user.id !== parseInt(id) && req.user.role !== 'ADMIN') {
      console.log('❌ Accès refusé - User ID:', req.user.id, 'demandé:', id);
      return res.status(403).json({
        success: false,
        error: "Accès refusé"
      });
    }

    const projets = await prisma.projet.findMany({
      where: { userId: parseInt(id) },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            role: true,
            ecole: true,
            filiere: true,
            niveau: true
          }
        }
      }
    });

    console.log(`✅ ${projets.length} projets trouvés pour user ${id}`);

    res.json({
      success: true,
      data: projets
    });

  } catch (error) {
    console.error('❌ Erreur récupération projets utilisateur:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des projets"
    });
  }
});

// Route pour mettre à jour le statut d'un projet
router.patch("/:id/statut", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    console.log(`Mise à jour statut projet ${id} vers ${statut}`);

    // Validation du statut
    const statutsValides = ['EN_ATTENTE', 'EN_COURS', 'TERMINE', 'EVALUE', 'APPROUVE', 'REJETE'];
    if (!statut || !statutsValides.includes(statut)) {
      return res.status(400).json({
        success: false,
        error: "Statut invalide",
        statutsValides
      });
    }

    // Vérifier que le projet existe
    const projetExist = await prisma.projet.findUnique({
      where: { id: parseInt(id) }
    });

    if (!projetExist) {
      return res.status(404).json({
        success: false,
        error: "Projet non trouvé"
      });
    }

    // Mise à jour du statut avec Prisma
    const projetMisAJour = await prisma.projet.update({
      where: { id: parseInt(id) },
      data: { 
        statut: statut,
        updatedAt: new Date()
      }
    });

    console.log(`Statut projet ${id} mis à jour avec succès: ${statut}`);

    res.json({
      success: true,
      message: "Statut mis à jour avec succès",
      data: { 
        id: parseInt(id), 
        statut: statut,
        titre: projetMisAJour.titre
      }
    });

  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du statut"
    });
  }
});

// Route pour télécharger un fichier de projet (sécurisée)
router.get("/download/:filename", authenticateToken, (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validation du nom de fichier pour éviter les attaques de traversée de répertoire
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        error: "Nom de fichier invalide"
      });
    }
    
    const filePath = path.join(process.cwd(), "src", "uploads", filename);
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: "Fichier non trouvé"
      });
    }
    
    // Obtenir les informations du fichier
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    
    // Définir les headers appropriés
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Envoyer le fichier
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Erreur téléchargement fichier:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du téléchargement"
    });
  }
});

// Route OPTIONS pour CORS préflight sur les vidéos - utilise la config CORS globale
router.options("/video/:filename", (req, res) => {
  res.status(200).end();
});

// Route HEAD pour les métadonnées vidéo (utilisée par les navigateurs)
router.head("/video/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validation du nom de fichier
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).end();
    }
    
    const filePath = path.join(process.cwd(), "src", "uploads", filename);
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).end();
    }
    
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    
    // Définir le type MIME
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'video/mp4';
    
    switch (ext) {
      case '.mp4': contentType = 'video/mp4'; break;
      case '.avi': contentType = 'video/x-msvideo'; break;
      case '.mov': contentType = 'video/quicktime'; break;
      case '.webm': contentType = 'video/webm'; break;
    }
    
    // Headers CORS et métadonnées
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Accept-Ranges');
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Accept-Ranges', 'bytes');
    
    res.status(200).end();
    
  } catch (error) {
    console.error('Erreur HEAD vidéo:', error);
    res.status(500).end();
  }
});

// Route pour streaming vidéo optimisée avec CORS global
router.get("/video/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validation sécurisée du nom de fichier
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        error: "Nom de fichier invalide"
      });
    }
    
    const filePath = path.join(process.cwd(), "src", "uploads", filename);
    
    // Vérifier l'existence du fichier
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: "Fichier vidéo non trouvé"
      });
    }
    
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    // Types MIME supportés
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.webm': 'video/webm',
      '.mkv': 'video/x-matroska'
    };
    const contentType = mimeTypes[ext] || 'video/mp4';
    
    // Headers spécifiques au streaming (CORS géré globalement)
    res.setHeader('Content-Type', contentType);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    if (range) {
      // Traitement des requêtes Range pour le streaming progressif
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      // Validation des plages
      if (start >= fileSize || end >= fileSize || start > end) {
        res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
        return res.end();
      }
      
      const chunksize = (end - start) + 1;
      const stream = fs.createReadStream(filePath, { start, end });
      
      // Headers pour réponse partielle
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', chunksize);
      
      // Gestion des erreurs de stream
      stream.on('error', (err) => {
        console.error('Erreur stream vidéo projet:', err);
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
      
      stream.pipe(res);
    } else {
      // Réponse complète sans Range
      res.setHeader('Content-Length', fileSize);
      const stream = fs.createReadStream(filePath);
      
      stream.on('error', (err) => {
        console.error('Erreur stream vidéo complet projet:', err);
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
      
      stream.pipe(res);
    }
    
  } catch (error) {
    console.error('Erreur streaming vidéo:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du streaming vidéo"
    });
  }
});

// 🚨 ROUTE TEMPORAIRE : Auto-approuver tous les projets EN_ATTENTE pour activer le vote
router.post("/auto-approve-all", async (req, res) => {
  try {
    const projetsEnAttente = await prisma.projet.updateMany({
      where: {
        statut: 'EN_ATTENTE'
      },
      data: {
        statut: 'APPROUVE'
      }
    });
    
    console.log(`✅ ${projetsEnAttente.count} projets auto-approuvés`);
    
    res.json({
      success: true,
      message: `${projetsEnAttente.count} projets ont été approuvés automatiquement`,
      count: projetsEnAttente.count
    });
  } catch (error) {
    console.error('Erreur auto-approbation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;