// Serveur de test minimal pour diagnostiquer le problème
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002'
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API JIG2026 is running',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// Test de connexion Prisma
app.get('/test-db', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const userCount = await prisma.user.count();
    await prisma.$disconnect();
    
    res.json({
      success: true,
      message: 'Base de données accessible',
      userCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur base de données',
      error: error.message
    });
  }
});

// Test route admin
app.get('/api/admin/stats', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const [
      totalUsers,
      totalProjets,
      totalVotes
    ] = await Promise.all([
      prisma.user.count(),
      prisma.projet.count(),
      prisma.vote.count()
    ]);
    
    await prisma.$disconnect();
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalProjets,
        totalVotes,
        totalJurys: 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur de test JIG2026 lancé sur http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test DB: http://localhost:${PORT}/test-db`);
  console.log(`📊 Test Stats: http://localhost:${PORT}/api/admin/stats`);
  
  // Test automatique après démarrage
  setTimeout(() => {
    console.log('🔍 Test de connectivité interne...');
  }, 1000);
});

server.on('error', (error) => {
  console.error('❌ Erreur serveur:', error);
});

server.on('close', () => {
  console.log('🔴 Serveur fermé');
});

// Gestionnaire d'erreurs global
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Promesse rejetée:', reason);
  process.exit(1);
});

export default app;