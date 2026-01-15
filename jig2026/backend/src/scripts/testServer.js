import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Test simple
app.get('/health', (req, res) => {
  console.log('✅ Health check demandé');
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Test login avec l'utilisateur réel
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('📝 Tentative de connexion:', req.body);
    
    const { email, motDePasse } = req.body;
    
    if (!email || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }
    
    // Vérification pour notre utilisateur admin
    if (email === 'tenenayeo@jig2026.ci') {
      // Le mot de passe haché que nous avons créé
      const hashedPassword = '$2b$12$hItlVHYRj7V1xCaoC50RiOTsMMAgEktN0ENbp9TibAMlVJiMHXJ4S';
      const isValid = await bcrypt.compare(motDePasse, hashedPassword);
      
      console.log('🔐 Vérification mot de passe:', isValid);
      
      if (isValid) {
        const token = jwt.sign(
          { id: 24, email, role: 'ADMIN' },
          'jig2026_super_secret_key_dev',
          { expiresIn: '7d' }
        );
        
        console.log('🎉 Connexion réussie pour', email);
        
        res.json({
          success: true,
          message: 'Connexion réussie',
          data: {
            user: {
              id: 24,
              nom: 'yeo',
              prenom: 'tenena',
              email: 'tenenayeo@jig2026.ci',
              role: 'ADMIN'
            },
            token
          }
        });
      } else {
        console.log('❌ Mot de passe invalide');
        res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }
    } else {
      console.log('❌ Email non trouvé:', email);
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`🧪 Serveur de test lancé sur http://localhost:${PORT}`);
  console.log(`🔗 API disponible sur http://localhost:${PORT}/api`);
});

// Gestion des erreurs
server.on('error', (error) => {
  console.error('❌ Erreur serveur:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée:', reason);
});