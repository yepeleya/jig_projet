// Serveur ultra-simple pour test
import express from "express";

const app = express();
const PORT = 5000;

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

console.log('🟢 Avant de démarrer le serveur...');

app.listen(PORT, () => {
  console.log(`🚀 Serveur ultra-simple sur http://localhost:${PORT}`);
  console.log('🟢 Serveur démarré avec succès !');
  
  // Garder le serveur vivant
  setInterval(() => {
    console.log('🔄 Serveur toujours actif:', new Date().toISOString());
  }, 5000);
});

console.log('🟢 Après avoir configuré le serveur...');