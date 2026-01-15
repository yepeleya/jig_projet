// Script de test de connectivité backend
import http from 'http';

console.log('🧪 Test de connectivité backend...');

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET'
}, (res) => {
  console.log('✅ Backend accessible !');
  console.log('📊 Status:', res.statusCode);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('📝 Réponse:', data);
  });
});

req.on('error', (error) => {
  console.error('❌ Erreur de connexion:', error.message);
});

req.end();