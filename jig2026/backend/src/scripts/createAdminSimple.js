import http from 'http';

// Données pour créer l'utilisateur admin
const userData = JSON.stringify({
  nom: "yeo",
  prenom: "tenena", 
  email: "tenenayeo@jig2026.ci",
  motDePasse: "admin123",
  role: "ADMIN"
});

// Options pour la requête HTTP
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(userData)
  }
};

console.log('🔄 Création d\'un utilisateur admin via l\'API...');
console.log('📧 Email:', 'tenenayeo@jig2026.ci');

// Effectuer la requête
const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (res.statusCode === 201) {
        console.log('🎉 Utilisateur admin créé avec succès !');
        console.log('👤 Nom complet:', result.data.user.prenom, result.data.user.nom);
        console.log('📧 Email:', result.data.user.email);
        console.log('🏷️  Rôle:', result.data.user.role);
        console.log('🔑 Token généré:', result.data.token ? 'Oui' : 'Non');
        console.log('ℹ️  Le mot de passe a été automatiquement haché');
      } else {
        console.log('❌ Erreur lors de la création:');
        console.log('Status:', res.statusCode);
        console.log('Réponse:', result);
      }
    } catch (error) {
      console.log('❌ Erreur de parsing JSON:', error.message);
      console.log('Réponse brute:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erreur de connexion:', error.message);
});

// Envoyer les données
req.write(userData);
req.end();