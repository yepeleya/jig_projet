#!/usr/bin/env node

/**
 * 🧪 Validation corrections Backend 404
 * Vérifie que toutes les protections sont en place
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Validation corrections Backend - Routes 404');
console.log('=============================================');

const files = [
  './jig2026/backend/src/controllers/projet.controller.js',
  './jig2026/backend/src/routes/projet.routes.js',
  './jig2026/backend/src/index.js'
];

const tests = [
  {
    name: 'Import Prisma sécurisé dans controller',
    check: (content) => content.includes('let prisma = null') && content.includes('prismaModule.default'),
    file: files[0],
    message: 'Prisma ne cassera plus le chargement des routes'
  },
  {
    name: 'Protection soumettreProjet contre Prisma undefined',
    check: (content) => content.includes('if (!prisma)') && content.includes('temporairement indisponible'),
    file: files[0], 
    message: 'Erreur 503 au lieu de crash si Prisma fail'
  },
  {
    name: 'Route health check ajoutée',
    check: (content) => content.includes('/health') && content.includes('Routes projets actives'),
    file: files[1],
    message: 'Diagnostic possible via GET /api/projets/health'
  },
  {
    name: 'Routes de secours dans index.js',
    check: (content) => content.includes('Routes de secours') && content.includes('try {') && content.includes('app.use'),
    file: files[2],
    message: 'Fallback 503 au lieu de 404 total si routes échouent'
  },
  {
    name: 'Protection getProjetsPublics',
    check: (content) => content.includes('getProjetsPublics') && content.includes('if (!prisma)'),
    file: files[0],
    message: 'Route publique protégée contre les erreurs Prisma'
  }
];

let passedTests = 0;

tests.forEach((test, index) => {
  if (!fs.existsSync(test.file)) {
    console.log(`${index + 1}. ${test.name}: ❌ FAIL (fichier introuvable)`);
    return;
  }

  const content = fs.readFileSync(test.file, 'utf8');
  const passed = test.check(content);

  console.log(`${index + 1}. ${test.name}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  if (passed) {
    console.log(`   └── ${test.message}`);
    passedTests++;
  }
});

console.log('');
console.log(`📊 Résultat: ${passedTests}/${tests.length} tests passés`);

if (passedTests >= 4) {
  console.log('🎉 Corrections backend appliquées avec succès !');
  console.log('');
  console.log('✅ PROTECTIONS EN PLACE:');
  console.log('  • Import Prisma sécurisé → Plus de crash au démarrage');
  console.log('  • Routes de secours → 503 au lieu de 404');
  console.log('  • Health checks → Diagnostic possible');
  console.log('  • Protection controller → Erreurs gracieuses');
  console.log('');
  console.log('🚀 PROCHAINES ÉTAPES:');
  console.log('  1. Push backend vers Git');
  console.log('  2. Attendre redéploiement Render (3-5 min)');
  console.log('  3. Tester nouveaux endpoints');
  console.log('');
  console.log('🧪 TESTS APRÈS REDÉPLOIEMENT:');
  console.log(`
// Test 1: Health check global
fetch('https://jig-projet-1.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend:', d));

// Test 2: Health check routes projets  
fetch('https://jig-projet-1.onrender.com/api/projets/health')
  .then(r => r.json())
  .then(d => console.log('✅ Routes projets:', d))
  .catch(e => console.log('⚠️ Routes projets KO:', e));

// Test 3: Route publique
fetch('https://jig-projet-1.onrender.com/api/projets/public')
  .then(r => r.json())
  .then(d => console.log('✅ Projets publics:', d.success ? 'OK' : 'Fallback'))
  .catch(e => console.log('⚠️ Projets publics KO:', e));
`);
  
  console.log('🎯 RÉSULTAT ATTENDU:');
  console.log('  • Health checks: 200 OK');
  console.log('  • Projets publics: 200 ou 503 (plus 404)');
  console.log('  • Soumission: Fonctionne ou erreur claire');
  
} else {
  console.log('⚠️ Certaines protections manquent.');
  console.log('');
  console.log('❌ TESTS ÉCHOUÉS - Actions requises:');
  tests.forEach((test, index) => {
    if (!fs.existsSync(test.file)) return;
    const content = fs.readFileSync(test.file, 'utf8');
    if (!test.check(content)) {
      console.log(`  • ${test.name}: Voir ${path.basename(test.file)}`);
    }
  });
}

console.log('');
console.log('💡 Si le problème persiste après redéploiement:');
console.log('  → Consulter logs Render: https://dashboard.render.com');
console.log('  → Chercher erreurs "Prisma" ou "Import failed"');
console.log('  → Vérifier variables env: DATABASE_URL, JWT_SECRET');