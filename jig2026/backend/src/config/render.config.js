// 🚨 Render : Configuration d'urgence
// ===================================

export const renderConfig = {
  // Variables d'environnement OBLIGATOIRES
  requiredEnvVars: [
    'DATABASE_URL',
    'JWT_SECRET'
  ],
  
  // Port dynamique Render
  port: process.env.PORT || 10000,
  
  // CORS simplifié pour Render
  corsOrigins: [
    'https://jig-projet-ea3m.vercel.app',
    'https://jig-projet-ea3m-git-main-yepeleyas-projects.vercel.app',
    'https://jig-projet-ea3m-ame0785h2-yepeleyas-projects.vercel.app'
  ],
  
  // Build settings
  buildSettings: {
    skipMigrationOnError: true,
    skipPrismaGenerateOnError: false,
    exitOn: {
      missingDatabase: true,
      missingJWT: true
    }
  }
};

// Validation d'environnement pour Render
export function validateRenderEnvironment() {
  console.log('🔍 VALIDATION ENVIRONNEMENT RENDER');
  console.log('=================================');
  
  const missing = renderConfig.requiredEnvVars.filter(
    envVar => !process.env[envVar]
  );
  
  if (missing.length > 0) {
    console.error('❌ VARIABLES MANQUANTES:', missing);
    console.error('💡 Ajouter sur https://dashboard.render.com');
    console.error('   → Service → Environment Variables');
    
    if (process.env.NODE_ENV === 'production') {
      console.error('💥 ARRÊT - Variables critiques manquantes');
      process.exit(1);
    }
    
    return false;
  }
  
  console.log('✅ Toutes variables présentes');
  return true;
}

// Health check simple pour Render
export function createHealthCheck(app) {
  app.get('/', (req, res) => {
    res.json({
      status: 'JIG2026 Backend Online',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  });
  
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  });
}