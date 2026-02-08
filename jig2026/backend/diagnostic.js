// 🔍 Script de diagnostic Node.js pour Render
// ==========================================

import fs from 'fs';
import path from 'path';

console.log('🔍 DIAGNOSTIC RENDER - JIG2026');
console.log('==============================');
console.log('Date:', new Date().toISOString());
console.log('Node version:', process.version);
console.log('Platform:', process.platform);

// Variables d'environnement
console.log('\n🌍 Variables d\'environnement:');
console.log('PORT:', process.env.PORT || 'undefined');
console.log('DATABASE_URL présente:', !!process.env.DATABASE_URL ? '✅ OUI' : '❌ NON');
console.log('JWT_SECRET présente:', !!process.env.JWT_SECRET ? '✅ OUI' : '❌ NON');
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');

// Test des fichiers
console.log('\n📁 Test fichiers:');
const files = ['package.json', 'src/index-minimal.js'];

files.forEach(file => {
  try {
    fs.accessSync(file);
    console.log(`✅ ${file} - existe`);
  } catch (error) {
    console.log(`❌ ${file} - manquant`);
  }
});

// Test syntaxe plus simple
console.log('\n🔧 Test disponibilité index-minimal.js:');
try {
  const stats = fs.statSync('src/index-minimal.js');
  console.log(`✅ index-minimal.js - ${stats.size} bytes`);
} catch (error) {
  console.log('❌ Erreur lecture fichier:', error.message);
}

console.log('\n🚀 Diagnostic terminé - Variables manquantes relevées');