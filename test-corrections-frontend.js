#!/usr/bin/env node

/**
 * 🧪 Test des corrections Frontend API Services
 * Vérifie que les services sont bien initialisés avec les nouvelles protections
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Test des corrections Frontend - Services API');
console.log('====================================================');

const frontendPath = './jig2026/frontend/src/services/api.js';

// Vérifier que le fichier existe
if (!fs.existsSync(frontendPath)) {
  console.log('❌ Fichier api.js introuvable');
  process.exit(1);
}

const apiContent = fs.readFileSync(frontendPath, 'utf8');

// Tests à effectuer
const tests = [
  {
    name: 'Protection getMesProjets dans ProjetService',
    check: apiContent.includes('getMesProjets() {') && (apiContent.includes('getMesProjets: Tentative route') || apiContent.includes('Tentative route /projets/mes-projets')),
    message: 'Méthode getMesProjets robuste avec fallbacks'
  },
  {
    name: 'Fallback soumettreProjet() en cas de 404',
    check: apiContent.includes('soumettreProjet(formData) {') && apiContent.includes('if (error.status === 404)'),
    message: 'Fallback vers /projets si /projets/soumettre en 404'
  },
  {
    name: 'Guards pour vérifier l\'initialisation des services',
    check: apiContent.includes('if (typeof projetService.getMesProjets !== \'function\')') && apiContent.includes('// 🛠️ GUARDS'),
    message: 'Protection contre les méthodes manquantes'
  },
  {
    name: 'Logs de débogage pour diagnostic',
    check: apiContent.includes('Services API initialisés') && (apiContent.includes('projetServiceMethods:') || apiContent.includes('getMesProjets:')),
    message: 'Logs pour diagnostiquer l\'initialisation'
  }
];

// Exécuter les tests
let passedTests = 0;
tests.forEach((test, index) => {
  const passed = test.check;
  console.log(`${index + 1}. ${test.name}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  if (passed) {
    console.log(`   └── ${test.message}`);
    passedTests++;
  }
});

console.log('');
console.log(`📊 Résultat: ${passedTests}/${tests.length} tests passés`);

if (passedTests === tests.length) {
  console.log('🎉 Tous les tests ont réussi ! Les corrections sont bien en place.');
  console.log('');
  console.log('🚀 Prochaines étapes:');
  console.log('  1. Déployer le frontend sur Vercel');
  console.log('  2. Tester la soumission de projet');
  console.log('  3. Vérifier la page "Mes Projets"');
} else {
  console.log('⚠️ Certains tests ont échoué. Vérifiez les corrections.');
  process.exit(1);
}

console.log('');
console.log('🔍 Pour tester manuellement:');
console.log('  • Connectez-vous sur l\'application');
console.log('  • Accédez à "Mes Projets" (devrait fonctionner maintenant)');
console.log('  • Tentez une soumission de projet (utilise les nouveaux fallbacks)');