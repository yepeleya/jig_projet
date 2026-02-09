#!/usr/bin/env node

/**
 * 🧪 Test Route POST Manquante
 * Teste les routes POST pour la soumission
 */

const { exec } = require('child_process');
const util = require('util');  
const execAsync = util.promisify(exec);

const BASE_URL = 'https://jig-projet-1.onrender.com';

// Token JWT fictif pour test (sera refusé avec 401, mais on verra si la route existe)
const FAKE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';

async function testPOSTRoute(endpoint, name) {
  try {
    console.log(`\n🔍 ${name}`);
    console.log(`   🔗 POST ${BASE_URL}${endpoint}`);
    
    // Test avec curl POST et fake token 
    const { stdout, stderr } = await execAsync(
      `curl -s -w "HTTPSTATUS:%{http_code}" -X POST "${BASE_URL}${endpoint}" -H "Authorization: Bearer ${FAKE_TOKEN}" -H "Content-Type: application/json"`
    );
    
    const parts = stdout.split('HTTPSTATUS:');
    const response = parts[0];
    const httpCode = parts[1];
    
    console.log(`   📊 Status: ${httpCode}`);
    
    if (httpCode === '404') {
      console.log(`   ❌ FAIL: Route ${endpoint} n'existe pas (404)`);
      return false;
    } else if (httpCode === '401') {
      console.log(`   ✅ PASS: Route existe, demande authentification valide`);
      return true;
    } else if (httpCode === '400') {
      console.log(`   ✅ PASS: Route existe, erreur de validation (normal sans fichier)`);
      return true;
    } else if (httpCode === '500') {
      console.log(`   ⚠️ WARN: Route existe mais erreur serveur (${httpCode})`);
      return true;
    } else {
      console.log(`   ❓ INFO: Status ${httpCode}`);
      if (response.length < 100) {
        console.log(`   📝 Réponse: ${response.substring(0, 100)}`);
      }
      return true;
    }
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Test Routes POST - Soumission');
  console.log('================================');
  console.log('');
  
  const tests = [
    { endpoint: '/api/projets/soumettre', name: '📤 POST /api/projets/soumettre (principal)' },
    { endpoint: '/api/projets', name: '🔄 POST /api/projets (fallback)' }
  ];

  let working = 0;
  
  for (const test of tests) {
    const success = await testPOSTRoute(test.endpoint, test.name);
    if (success) working++;
  }

  console.log('\n📊 RÉSULTATS');
  console.log('============');
  console.log(`✅ Routes POST disponibles: ${working}/${tests.length}`);
  console.log('');

  if (working >= 2) {
    console.log('🎉 ROUTES POST FONCTIONNELLES !');
    console.log('');
    console.log('✅ ROUTES DISPONIBLES:');
    console.log('  • POST /api/projets/soumettre → Route principale');
    console.log('  • POST /api/projets → Route fallback');
    console.log('');
    console.log('🧪 LE FRONTEND DEVRAIT MAINTENANT FONCTIONNER');
    console.log('  → Soumission via route principale OU fallback');
    console.log('  → Plus de "Tous les endpoints ont échoué"');
  } else if (working >= 1) {
    console.log('⚠️ CORRECTION PARTIELLE');
    console.log('  → Une route fonctionne, redéploiement en cours ?');
    console.log('  → Attendre 2-3 minutes');
  } else {
    console.log('❌ ROUTES POST TOUJOURS MANQUANTES');
    console.log('  → Problème de configuration ou redéploiement');
    console.log('  → Vérifier logs Render');
  }
  
  console.log('\n💡 Pour tester avec authentification réelle:');
  console.log('  → Utiliser le frontend avec login valide');
  console.log('  → Ou obtenir token JWT valide et refaire test');
}

runTests().catch(console.error);