import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 10000;

// CORS très simple
app.use(cors({
  origin: ['https://jig-projet-ea3m.vercel.app'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes d'urgence
app.get('/', (req, res) => {
  res.json({
    status: 'EMERGENCY MODE - JIG2026 Backend',
    version: '1.0-EMERGENCY',
    timestamp: new Date().toISOString(),
    message: 'Backend minimal fonctionnel'
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'emergency_ok', timestamp: new Date() });
});

// Route simple pour soumettre (simulation)
app.post('/api/projets/soumettre', (req, res) => {
  console.log('📥 Soumission reçue (mode urgence):', req.body);
  res.json({
    success: true,
    message: 'EMERGENCY: Projet reçu mais pas sauvegardé',
    data: { 
      titre: req.body.titre || 'Projet d\'urgence',
      status: 'emergency_received'
    }
  });
});

// Routes basiques
app.get('/api/projets/public', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Mode urgence - aucun projet stocké'
  });
});

app.post('/api/projets/auto-approve-all', (req, res) => {
  res.json({
    success: true,
    count: 0,
    message: 'Mode urgence - aucune opération'
  });
});

// Middleware d'erreur simple
app.use((err, req, res, next) => {
  console.error('Erreur emergency backend:', err);
  res.status(500).json({
    success: false,
    error: 'Erreur mode urgence',
    message: err.message
  });
});

// Route 404 par défaut
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée en mode urgence',
    path: req.originalUrl,
    message: 'Backend en mode urgence - fonctionnalités limitées'
  });
});

app.listen(PORT, () => {
  console.log(`🚨 EMERGENCY Backend JIG2026 sur port ${PORT}`);
  console.log('⚡ Mode urgence - fonctionnalités basiques seulement');
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;