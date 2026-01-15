// Test simple sans Prisma
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true
}));

app.use(express.json());

// Test simple
app.get('/health', (req, res) => {
  console.log('📍 Health check appelé');
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Test API login simple
app.post('/api/auth/login', (req, res) => {
  console.log('📍 Login appelé avec:', req.body);
  
  const { email, motDePasse } = req.body;
  
  if (email === 'tenenayeo@jig2026.ci' && motDePasse === 'admin123') {
    res.json({
      success: true,
      data: {
        user: {
          id: 1,
          email: 'tenenayeo@jig2026.ci',
          role: 'ADMIN',
          nom: 'yeo',
          prenom: 'tenena'
        },
        token: 'test-token-123'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });
  }
});

const PORT = 5001; // Port différent pour éviter les conflits

app.listen(PORT, () => {
  console.log(`🚀 Serveur de test lancé sur http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
});