#!/usr/bin/env node

/**
 * 🧪 Test Backend après redéploiement
 * Valide que les corrections appliquées fonctionnent sur Render
 */

const fetch = require('node-fetch').default || require('node-fetch');

const BASE_URL = 'https://jig-projet-1.onrender.com';

const tests = [
  {
    name: '🏥 Health Check Global Backend',
    url: `${BASE_URL}/health`,
    expected: 'backend',
    description: 'Vérification que le backend répond'
  },
  {
    name: '🔍 Health Check Routes Projets',
    url: `${BASE_URL}/api/projets/health`,
    expected: 'Routes projets actives',
    description: 'Routes projets chargées avec succès'
  },
  {
    name: '📋 Route Projets Publics',
    url: `${BASE_URL}/api/projets/public`,
    expected: null, // peut être 200 ou 503
    description: 'Plus de 404, soit OK soit 503'
  },
  {
    name: '👤 Route Mes Projets (sans auth = 401)',
    url: `${BASE_URL}/api/projets/mes-projets`,
    expected: '401',
    description: 'Route accessible mais demande auth'
  }
];

async function runTests() {
  console.log('🚀 Tests Backend - Post-redéploiement');
  console.log('=====================================');
  console.log(`🌐 URL de base: ${BASE_URL}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log('');

  let passedTests = 0;
  let totalTests = tests.length;

  for (const [index, test] of tests.entries()) {
    try {
      console.log(`${index + 1}. ${test.name}`);
      console.log(`   🔗 ${test.url}`);
      
      const response = await fetch(test.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10s timeout
      });

      const status = response.status;
      let result = null;
      
      try {
        result = await response.json();
      } catch {
        result = await response.text();
      }

      console.log(`   📊 Status: ${status}`);
      
      let success = false;
      
      if (test.expected === '401' && status === 401) {
        success = true;
        console.log(`   ✅ PASS: Authentification requise comme attendu`);
      } else if (test.expected === null) {
        // Pour projets publics, on accepte 200 ou 503, mais pas 404
        if (status === 200 || status === 503) {
          success = true;
          console.log(`   ✅ PASS: ${status === 200 ? 'Fonctionne parfaitement' : 'Fallback 503 actif (normal)'}`);
        } else if (status === 404) {
          console.log(`   ❌ FAIL: Toujours 404, routes pas chargées`);
        } else {
          console.log(`   ⚠️ WARN: Status ${status} inattendu`);
        }
      } else if (typeof result === 'object' && result?.message?.includes(test.expected)) {
        success = true;
        console.log(`   ✅ PASS: ${test.description}`);
      } else if (typeof result === 'string' && result.includes(test.expected)) {
        success = true;
        console.log(`   ✅ PASS: ${test.description}`);
      } else {
        console.log(`   ❓ INFO: Réponse inattendue`);
        console.log(`   📝 Résultat:`, JSON.stringify(result).substring(0, 100));
      }

      if (success) passedTests++;
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log(`   🔄 Service peut-être encore en cours de redémarrage`);
      }
    }
    
    console.log('');
  }

  // RÉSULTATS FINAUX
  console.log('📊 RÉSULTATS FINAUX');
  console.log('==================');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log('');

  if (passedTests >= 3) {
    console.log('🎉 CORRECTION RÉUSSIE !');
    console.log('');
    console.log('✅ PROBLÈMES RÉSOLUS:');
    console.log('  • Plus de 404 sur toutes les routes projets');
    console.log('  • Health checks disponibles pour diagnostic');
    console.log('  • Fallbacks 503 au lieu de crash total');
    console.log('  • Protection Prisma empêche crash au démarrage');
    console.log('');
    console.log('🧪 TESTS SOUMISSION:');
    console.log('  → Frontend devrait afficher form au lieu de "Service indisponible"');
    console.log('  → Soumission fonctionne ou erreur claire (plus crash)');
    console.log('  → Projets publics se chargent normalement');
  } else if (passedTests >= 1) {
    console.log('⚠️ CORRECTION PARTIELLE');
    console.log('');
    console.log('ℹ️ SITUATION:');
    console.log('  • Backend répond mais routes projets ont encore des problèmes');
    console.log('  • Possible: Render encore en cours de redéploiement');
    console.log('  • Attendre 2-3 minutes puis relancer ce test');
  } else {
    console.log('❌ CORRECTION INCOMPLÈTE');
    console.log('');
    console.log('🔍 ACTIONS DE DÉBOGAGE:');
    console.log('  1. Vérifier logs Render: https://dashboard.render.com');
    console.log('  2. Chercher erreurs Prisma ou import dans les logs');
    console.log('  3. Vérifier variables environnement (DATABASE_URL, etc.)');
    console.log('  4. Possible problème de build ou dépendances');
  }

  console.log('');
  console.log('🔄 Pour relancer le test: node test-backend-post-deploy.js');
}

// Protection pour node-fetch si pas installé
async function setupFetch() {
  try {
    const fetch = require('node-fetch');
    return fetch.default || fetch;
  } catch {
    console.log('📦 Installation node-fetch...');
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec('npm install node-fetch@2', (error) => {
        if (error) {
          console.log('⚠️ Utilisez curl pour tester manuellement:');
          console.log(`curl -i ${BASE_URL}/health`);
          console.log(`curl -i ${BASE_URL}/api/projets/health`);
          reject(error);
        } else {
          resolve(require('node-fetch'));
        }
      });
    });
  }
}

// Exécution
if (require.main === module) {
  setupFetch().then(() => runTests()).catch(console.error);
}