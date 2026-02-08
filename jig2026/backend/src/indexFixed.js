// Version corrigée du serveur principal avec gestion d'erreur Prisma
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();

// Middlewares de sécurité et utilitaires
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check simple
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API JIG2026 is running',
    timestamp: new Date().toISOString()
  });
});

// Routes d'authentification simplifiées
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('📍 Tentative de connexion:', req.body);
    
    const { email, password } = req.body;
    
    // Import dynamique de Prisma pour éviter les crashes
    let user = null;
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      // Requête SQL brute pour éviter les problèmes de dates
      const users = await prisma.$queryRaw`
        SELECT id, nom, prenom, email, motDePasse, role
        FROM User 
        WHERE email = ${email}
      `;
      
      if (users.length > 0) {
        user = users[0];
        
        // Vérification du mot de passe avec bcrypt
        const bcrypt = await import('bcryptjs');
        const isValid = await bcrypt.default.compare(password, user.motDePasse);
        
        if (isValid && user.role === 'ADMIN') {
          const jwt = await import('jsonwebtoken');
          const token = jwt.default.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          res.json({
            success: true,
            data: {
              user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
              },
              token
            }
          });
          return;
        }
      }
      
      await prisma.$disconnect();
    } catch (dbError) {
      console.error('❌ Erreur base de données:', dbError.message);
    }
    
    res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });
    
  } catch (error) {
    console.error('❌ Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// Import et utilisation des routes seulement si Prisma fonctionne
async function loadRoutes() {
  try {
    const authRoutes = await import("./routes/auth.routes.js");
    const adminRoutes = await import("./routes/admin.routes.js");
    
    app.use("/api/auth", authRoutes.default);
    app.use("/api/admin", adminRoutes.default);
    
    console.log('✅ Routes chargées avec succès');
  } catch (error) {
    console.error('⚠️ Erreur chargement routes:', error.message);
    console.log('🔄 Utilisation des routes simplifiées');
  }
}

// Gestionnaires d'erreurs globaux
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée:', reason);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`🚀 Serveur backend JIG2026 lancé sur http://localhost:${PORT}`);
  console.log(`🏥 Health check disponible sur http://localhost:${PORT}/health`);
  
  // Charger les routes en différé
  await loadRoutes();
});

server.on('error', (error) => {
  console.error('❌ Erreur serveur:', error);
});