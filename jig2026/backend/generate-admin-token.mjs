import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Générer un token d'admin pour le dashboard
// Le token doit correspondre au format attendu par le middleware
const adminPayload = {
  id: 1,
  nom: 'Administrateur',
  prenom: 'Dashboard',
  email: 'admin@jig2026.com',
  role: 'ADMIN'
};

const token = jwt.sign(
  adminPayload, // Directement les données, pas dans un objet 'user'
  process.env.JWT_SECRET || 'jig2026_secret_key',
  { expiresIn: '24h' }
);

console.log('🔑 Token d\'authentification admin généré:');
console.log('');
console.log('Token:', token);
console.log('');
console.log('📋 Instructions:');
console.log('1. Copiez le token ci-dessus');
console.log('2. Ouvrez le dashboard dans votre navigateur');
console.log('3. Ouvrez les outils de développement (F12)');
console.log('4. Allez dans la console et tapez:');
console.log(`   localStorage.setItem('adminToken', '${token}')`);
console.log('5. Rafraîchissez la page');
console.log('');
console.log('⏰ Ce token expire dans 24 heures');
console.log('🌐 Valide pour: http://localhost:3001');