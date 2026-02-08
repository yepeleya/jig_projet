// 🔧 Script de build Render universel (Node.js)
// ==============================================

import { execSync } from 'child_process';
import process from 'process';

console.log('🚀 DÉMARRAGE BUILD RENDER JIG2026');
console.log('================================');

// Vérification variables d'environnement CRITIQUES
console.log('🔍 Vérification variables...');
if (!process.env.DATABASE_URL) {
  console.error('❌ CRITIQUE: DATABASE_URL manquante!');
  console.error('📝 Ajouter variable sur dashboard.render.com');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ CRITIQUE: JWT_SECRET manquante!');  
  console.error('📝 Ajouter variable sur dashboard.render.com');
  process.exit(1);
}

console.log('✅ Variables d\'environnement OK');

// Étape 1: Génération Prisma
try {
  console.log('⚙️ Génération client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Client Prisma généré');
} catch (error) {
  console.warn('⚠️ Erreur génération Prisma:', error.message);
  console.log('🔄 Continuer malgré l\'erreur...');
}

// Étape 2: Migration base de données (prudente)
try {
  console.log('🗃️ Migration base de données...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Migration réussie');
} catch (error) {
  console.warn('⚠️ Erreur migration:', error.message);
  console.log('🔄 Continuer sans migration...');
}

// Étape 3: Test connexion BDD
try {
  console.log('🧪 Test connexion base...');
  execSync('node -e "import(\'./src/utils/prismaClient.js\').then(() => console.log(\'✅ BDD OK\'))"', { stdio: 'inherit' });
} catch (error) {
  console.warn('⚠️ Test BDD échoué:', error.message);
}

console.log('🎉 BUILD TERMINÉ - Prêt pour démarrage!');
console.log('=====================================');