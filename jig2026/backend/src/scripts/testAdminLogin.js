// Test de connexion admin
import http from 'http';

const loginData = JSON.stringify({
  email: 'tenenayeo@jig2026.ci',
  motDePasse: 'admin123'
});

console.log('🔐 Test de connexion admin...');
console.log('📧 Email:', 'tenenayeo@jig2026.ci');
console.log('🔑 Mot de passe:', 'admin123');

const req = http.request({
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
}, (res) => {
  console.log('📊 Status Code:', res.statusCode);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('📝 Réponse:', data);
    try {
      const result = JSON.parse(data);
      if (res.statusCode === 200) {
        console.log('✅ Connexion réussie !');
        console.log('👤 Utilisateur:', result.data.user.prenom, result.data.user.nom);
        console.log('🏷️ Rôle:', result.data.user.role);
      } else {
        console.log('❌ Connexion échouée');
      }
    } catch (e) {
      console.log('⚠️ Erreur parsing JSON:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erreur de connexion:', error.message);
});

req.write(loginData);
req.end();