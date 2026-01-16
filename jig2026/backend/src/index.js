import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";

// Middlewares personnalisés
import { handleStreamingErrors, addSecurityHeaders, optimizeFileResponse } from "./middlewares/streamingHandler.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import projetRoutes from "./routes/projet.routes.js";
import voteRoutes from "./routes/vote.routes.js";
import commentaireRoutes from "./routes/commentaire.routes.js";
import galerieRoutes from "./routes/galerie.routes.js";
import programmeRoutes from "./routes/programme.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import classementRoutes from "./routes/classement.routes.js";
import accessControlRoutes from "./routes/access-control.routes.js";
import contentRoutes from "./routes/content.routes.js";
import juryRoutes from "./routes/jury.routes.js";
import projetSuiviRoutes from "./routes/projet-suivi.routes.js";

// Middlewares
import { errorHandler, notFound } from "./middlewares/errorHandler.middleware.js";

dotenv.config();

const app = express();

// Middlewares de sécurité et utilitaires
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('combined'));

// Middlewares pour gérer les erreurs de streaming et les téléchargements
app.use(handleStreamingErrors);
app.use(addSecurityHeaders);
app.use(optimizeFileResponse);

// Configuration CORS complète pour le streaming vidéo
const allowedOrigins = [
  'http://localhost:3000',  // Interface jury
  'http://localhost:3001',  // Interface admin
  'http://localhost:3002',  // Interface participant
  process.env.FRONTEND_URL,  // URL frontend depuis .env
  process.env.DASHBOARD_URL,  // URL dashboard depuis .env
  process.env.JURY_URL,  // URL jury depuis .env
  'https://jig-projet-fa2u.vercel.app',  // Ancien Vercel
  'https://jig-projet-ea3m.vercel.app',  // Nouveau Vercel
  'https://jig-projet-fa2u-git-main-yepeleyas-projects.vercel.app',  // Vercel Git deployments
].filter(Boolean);  // Retirer les valeurs undefined

console.log('✅ CORS - Origines autorisées:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    console.log('🔍 CORS - Requête depuis:', origin);
    
    // Permettre les requêtes sans origine (mobile apps, curl, Postman, etc.)
    if (!origin) {
      console.log('✅ CORS - Requête sans origine autorisée');
      return callback(null, true);
    }
    
    // Vérifier si l'origine est dans la liste ou correspond au pattern Vercel
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      console.log('✅ CORS - Origine autorisée:', origin);
      callback(null, true);
    } else {
      console.warn('❌ CORS - Origine bloquée:', origin);
      // TEMPORAIRE : Autoriser toutes les origines Vercel en production
      if (process.env.NODE_ENV === 'production' && origin.includes('vercel.app')) {
        console.log('⚠️ CORS - Origine Vercel autorisée temporairement:', origin);
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  exposedHeaders: [
    'Content-Range', 
    'Accept-Ranges', 
    'Content-Length', 
    'Content-Type',
    'Content-Disposition'
  ],
  allowedHeaders: [
    'Origin', 
    'X-Requested-With', 
    'Content-Type', 
    'Accept', 
    'Range', 
    'Authorization',
    'Cache-Control'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  optionsSuccessStatus: 200
}));

// Handler explicite pour preflight CORS (OPTIONS)
app.options('*', cors());

// Middleware global pour ajouter Accept-Ranges sur toutes les réponses
app.use((req, res, next) => {
  res.header('Accept-Ranges', 'bytes');
  next();
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Middleware pour le streaming vidéo avec gestion CORS complète et anti-blocage
const handleVideoStreaming = (req, res) => {
  try {
    const filename = req.params.filename;
    const videoPath = path.join(process.cwd(), "src/uploads", filename);
    
    // Validation sécurisée du nom de fichier
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Nom de fichier invalide' });
    }
    
    // Vérifier l'existence du fichier
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: 'Vidéo non trouvée' });
    }

    // Gérer la fermeture prématurée de la connexion
    let streamClosed = false;
    req.on('close', () => {
      streamClosed = true;
      console.log('Connexion fermée pendant le streaming de:', filename);
    });

    req.on('aborted', () => {
      streamClosed = true;
      console.log('Streaming annulé pour:', filename);
    });
    
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    // Déterminer le type MIME
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.webm': 'video/webm',
      '.mkv': 'video/x-matroska'
    };
    const contentType = mimeTypes[ext] || 'video/mp4';
    
    // Headers CORS et streaming
    res.setHeader('Content-Type', contentType);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    if (range) {
      // Traitement des requêtes Range pour le streaming
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      // Validation des plages
      if (start >= fileSize || end >= fileSize || start > end) {
        res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
        return res.end();
      }
      
      const chunksize = (end - start) + 1;
      const stream = fs.createReadStream(videoPath, { start, end });
      
      // Headers pour réponse partielle
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', chunksize);
      
      // Gestion des erreurs de stream avec détection de fermeture
      stream.on('error', (err) => {
        console.error('Erreur stream vidéo:', err);
        if (!streamClosed && !res.headersSent) {
          res.status(500).end();
        }
      });

      stream.on('end', () => {
        if (!streamClosed) {
          console.log('Stream terminé avec succès:', filename);
        }
      });

      // Nettoyer le stream si la connexion est fermée
      req.on('close', () => {
        if (stream && !stream.destroyed) {
          stream.destroy();
        }
      });
      
      stream.pipe(res);
    } else {
      // Réponse complète du fichier
      res.setHeader('Content-Length', fileSize);
      const stream = fs.createReadStream(videoPath);
      
      stream.on('error', (err) => {
        console.error('Erreur stream vidéo complet:', err);
        if (!streamClosed && !res.headersSent) {
          res.status(500).end();
        }
      });

      stream.on('end', () => {
        if (!streamClosed) {
          console.log('Stream complet terminé avec succès:', filename);
        }
      });

      // Nettoyer le stream si la connexion est fermée
      req.on('close', () => {
        if (stream && !stream.destroyed) {
          stream.destroy();
        }
      });
      
      stream.pipe(res);
    }
  } catch (error) {
    console.error('Erreur streaming vidéo:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

// Routes vidéo avec gestion OPTIONS automatique par CORS
app.get("/uploads/:filename", handleVideoStreaming);

// Servir les fichiers statiques non-vidéo avec CORS (images, PDFs, etc.)
app.use("/uploads", (req, res, next) => {
  // Skip les fichiers vidéo car déjà gérés par handleVideoStreaming
  const ext = path.extname(req.path).toLowerCase();
  const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv'];
  
  if (videoExtensions.includes(ext)) {
    return next('route'); // Passer au handler suivant
  }
  
  // Headers CORS pour les autres fichiers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
  next();
}, express.static(path.join(process.cwd(), "src/uploads")));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API JIG2026 is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0' // Version avec CORS amélioré
  });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projets", projetRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/commentaires", commentaireRoutes);
app.use("/api/galerie", galerieRoutes);
app.use("/api/programmes", programmeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/classement", classementRoutes);
app.use("/api/access-control", accessControlRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/jury", juryRoutes);
app.use("/api/projet-suivi", projetSuiviRoutes);

// Middleware de gestion des erreurs
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Gestionnaires d'erreurs globaux
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée:', reason);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur backend JIG2026 lancé sur http://localhost:${PORT}`);
  console.log(`📁 Uploads disponibles sur http://localhost:${PORT}/uploads`);
  console.log(`🏥 Health check disponible sur http://localhost:${PORT}/health`);
});

server.on('error', (error) => {
  console.error('❌ Erreur serveur:', error);
});
