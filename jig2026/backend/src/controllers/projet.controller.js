import prisma from "../utils/prismaClient.js";
import { NotificationService } from "../services/notification.service.js";
import { ConfigurationService } from "../services/configuration.service.js";
import path from "path";
import fs from "fs";

// Utilitaires de validation
const validateProjectData = (data) => {
  const errors = [];
  
  if (!data.titre || data.titre.trim().length < 3) {
    errors.push("Le titre doit contenir au moins 3 caractères");
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push("La description doit contenir au moins 10 caractères");
  }
  
  if (!data.categorie || data.categorie.trim().length === 0) {
    errors.push("La catégorie est obligatoire");
  }
  
  return errors;
};

const sanitizeData = (data) => {
  return {
    titre: data.titre?.trim().substring(0, 200) || '',
    description: data.description?.trim().substring(0, 2000) || '',
    categorie: data.categorie?.trim().substring(0, 100) || ''
  };
};

const validateFileType = (file) => {
  if (!file) return { valid: true };
  
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
    // Types vidéo
    'video/mp4',
    'video/avi',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm'
  ];
  
  const maxSize = 100 * 1024 * 1024; // 100MB
  
  if (!allowedTypes.includes(file.mimetype)) {
    return { 
      valid: false, 
      error: "Type de fichier non autorisé. Formats acceptés : PDF, Word, PowerPoint, Images (JPEG, PNG, GIF, WebP), Vidéos (MP4, AVI, MOV, WebM), ZIP" 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: "Le fichier est trop volumineux. Taille maximale : 100MB" 
    };
  }
  
  return { valid: true };
};

export const soumettreProjet = async (req, res) => {
  try {
    console.log('🚀 Début soumission projet:', {
      body: req.body,
      filePresent: !!req.file,
      userPresent: !!req.user
    });
    
    const { titre, description, categorie } = req.body;
    const fichier = req.file;
    const user = req.user;

    // 🛡️ VALIDATION DE SÉCURITÉ NIVEAU 1 : Authentification
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: "Authentification requise",
        code: "AUTH_REQUIRED" 
      });
    }

    // 🛡️ VALIDATION DE SÉCURITÉ NIVEAU 2 : Rôles autorisés
    const rolesAutorises = ['ETUDIANT', 'UTILISATEUR'];
    if (!rolesAutorises.includes(user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Accès refusé. Rôle ${user.role} non autorisé pour soumettre des projets.`,
        code: "ROLE_FORBIDDEN" 
      });
    }

    // 🛡️ VALIDATION DE SÉCURITÉ NIVEAU 3 : Vérification des dates limites
    const dateLimiteConfig = await ConfigurationService.getConfig('DATE_LIMITE_SOUMISSION');
    if (dateLimiteConfig) {
      const dateLimite = new Date(dateLimiteConfig);
      const maintenant = new Date();
      
      if (maintenant > dateLimite) {
        return res.status(423).json({ 
          success: false, 
          error: `La période de soumission est fermée. Date limite dépassée : ${dateLimite.toLocaleDateString('fr-FR')}`,
          code: "DEADLINE_PASSED",
          dateLimite: dateLimite.toISOString()
        });
      }
    }

    // 🛡️ VALIDATION DE SÉCURITÉ NIVEAU 4 : Limitation par utilisateur
    const projetsExistants = await prisma.projet.count({
      where: { userId: user.id }
    });
    
    const limiteProjetsParUtilisateur = 3; // Configurable
    if (projetsExistants >= limiteProjetsParUtilisateur) {
      return res.status(429).json({ 
        success: false, 
        error: `Limite de projets atteinte (${limiteProjetsParUtilisateur} projets maximum par utilisateur)`,
        code: "PROJECT_LIMIT_EXCEEDED" 
      });
    }

    // 🛡️ VALIDATION DE SÉCURITÉ NIVEAU 5 : Validation des données
    const donneesSanitisees = sanitizeData({ titre, description, categorie });
    const erreursValidation = validateProjectData(donneesSanitisees);
    
    if (erreursValidation.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Données invalides",
        details: erreursValidation,
        code: "VALIDATION_ERROR"
      });
    }

    // 🛡️ VALIDATION DE SÉCURITÉ NIVEAU 6 : Validation du fichier
    console.log('📁 Fichier reçu:', {
      filename: fichier?.filename,
      originalname: fichier?.originalname,
      mimetype: fichier?.mimetype,
      size: fichier?.size ? `${(fichier.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'
    });
    
    const validationFichier = validateFileType(fichier);
    if (!validationFichier.valid) {
      console.error('❌ Validation fichier échouée:', validationFichier.error);
      
      // Supprimer le fichier uploadé s'il est invalide
      if (fichier && fichier.path) {
        try {
          fs.unlinkSync(fichier.path);
        } catch (err) {
          console.error('Erreur suppression fichier invalide:', err);
        }
      }
      
      return res.status(400).json({ 
        success: false, 
        error: validationFichier.error,
        code: "INVALID_FILE" 
      });
    }
    
    console.log('✅ Validation fichier réussie');

    // 🛡️ VALIDATION DE SÉCURITÉ NIVEAU 7 : Vérification anti-doublon
    const projetSimilaire = await prisma.projet.findFirst({
      where: {
        userId: user.id,
        titre: {
          equals: donneesSanitisees.titre
        }
      }
    });
    
    if (projetSimilaire) {
      return res.status(409).json({ 
        success: false, 
        error: "Un projet avec ce titre existe déjà",
        code: "DUPLICATE_PROJECT" 
      });
    }

    // 🚀 CRÉATION DU PROJET (Transaction sécurisée)
    const result = await prisma.$transaction(async (tx) => {
      // Créer le projet
      const nouveauProjet = await tx.projet.create({
        data: { 
          titre: donneesSanitisees.titre,
          description: donneesSanitisees.description,
          categorie: donneesSanitisees.categorie,
          fichier: fichier ? fichier.filename : null,
          userId: user.id,
          statut: 'EN_ATTENTE'
        },
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

      return nouveauProjet;
    });

    // 🔔 NOTIFICATIONS ET LOGS
    try {
      await NotificationService.onNewProjet(result, user);
      console.log(`✅ Projet "${result.titre}" soumis par ${user.prenom} ${user.nom} (${user.email})`);
    } catch (notifError) {
      console.error('Erreur notification:', notifError);
      // N'interrompt pas le processus
    }

    // 🎯 RÉPONSE SUCCESS
    res.status(201).json({ 
      success: true, 
      data: {
        id: result.id,
        titre: result.titre,
        description: result.description,
        categorie: result.categorie,
        statut: result.statut,
        fichier: result.fichier,
        createdAt: result.createdAt,
        user: result.user
      }, 
      message: "✅ Projet soumis avec succès ! Il sera examiné par l'équipe d'administration.",
      meta: {
        projetId: result.id,
        utilisateurId: user.id,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erreur critique lors de la soumission:', error);
    
    // Nettoyer le fichier en cas d'erreur
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Erreur nettoyage fichier:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
      timestamp: new Date().toISOString()
    });
  }
};

// Fonction utilitaire pour enrichir les projets avec les données utilisateur et votes
const enrichirProjets = async (projets) => {
  const projetsEnrichis = [];
  
  for (const projet of projets) {
    // Récupérer l'utilisateur
    let utilisateur = null;
    if (projet.userId) {
      utilisateur = await prisma.user.findUnique({
        where: { id: projet.userId },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          ecole: true,
          filiere: true,
          niveau: true
        }
      });
    }

    // Récupérer les votes
    const votes = await prisma.vote.findMany({
      where: { projetId: projet.id }
    });

    const totalVotes = votes.length;
    const moyenneVote = totalVotes > 0 
      ? votes.reduce((sum, vote) => sum + vote.valeur, 0) / totalVotes
      : 0;

    projetsEnrichis.push({
      ...projet,
      statut: projet.statut || 'EN_ATTENTE', // Valeur par défaut si statut manquant
      user: utilisateur,
      votes: votes, // Inclure les votes pour les statistiques détaillées
      totalVotes,
      moyenneVote: parseFloat(moyenneVote.toFixed(2)),
      _count: {
        votes: totalVotes
      }
    });
  }
  
  return projetsEnrichis;
};

export const getProjets = async (req, res) => {
  try {
    const { statut } = req.query;
    
    const whereClause = {};
    if (statut) {
      whereClause.statut = statut;
    }
    
    // Si c'est un accès public (pas d'utilisateur authentifié), ne montrer que les projets approuvés
    if (!req.user) {
      whereClause.statut = 'APPROUVE';
    } else if (req.user.role === 'JURY') {
      // Les jurys voient les projets approuvés ET ceux qu'ils ont déjà évalués
      whereClause.statut = {
        in: ['APPROUVE', 'EVALUE', 'TERMINE', 'EN_COURS']
      };
    }

    // Requête simplifiée sans relations problématiques
    const projets = await prisma.projet.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Enrichir avec les données utilisateur et les votes
    const projetsEnrichis = await enrichirProjets(projets);

    res.json({ success: true, data: projetsEnrichis });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Route publique pour les projets approuvés (utilisée pour le vote public)
export const getProjetsPublics = async (req, res) => {
  try {
    console.log('📋 Récupération des projets publics');
    
    const { categorie } = req.query;
    const whereClause = {
      // CORRECTION : Filtrer uniquement les projets approuvés/terminés
      statut: {
        in: ['APPROUVE', 'TERMINE']
      }
    };
    
    if (categorie) {
      whereClause.categorie = categorie;
      console.log('🔍 Filtre par catégorie:', categorie);
    }

    // DEBUG: Vérifier d'abord tous les projets
    const totalProjets = await prisma.projet.count();
    const projetsApprouves = await prisma.projet.count({
      where: {
        statut: {
          in: ['APPROUVE', 'TERMINE']  
        }
      }
    });
    console.log(`🔍 Total projets en BDD: ${totalProjets}, Approuvés: ${projetsApprouves}`);

    // Récupération avec filtre de statut pour vote public
    const projets = await prisma.projet.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            prenom: true, 
            nom: true,
            email: true,
            ecole: true,
            filiere: true,
            niveau: true
          }
        },
        votes: {
          select: {
            id: true,
            valeur: true,
            typeVote: true
          }
        }
      }
    });

    console.log(`✅ ${projets.length} projets publics trouvés (APPROUVÉS/TERMINÉS)`);
    
    const projetsEnrichis = await enrichirProjets(projets);

    res.json({ 
      success: true, 
      data: projetsEnrichis,
      debug: {
        totalInDB: totalProjets,
        approved: projetsApprouves,
        returned: projets.length
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des projets publics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};