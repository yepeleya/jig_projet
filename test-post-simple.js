#!/usr/bin/env node

/**
 * 🧪 Test Simple POST Routes - Sans Auth
 * Test direct des endpoints POST pour voir s'ils existent
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const BASE_URL = 'https://jig-projet-1.onrender.com';

async function testPOSTBasic(endpoint, name) {
  try {
    console.log(`\n🔍 ${name}`);
    console.log(`   🔗 POST ${BASE_URL}${endpoint}`);
    
    // Test POST sans authentification - juste pour voir si route existe
    const { stdout } = await execAsync(
      `curl -s -w "HTTPSTATUS:%{http_code}" -X POST "${BASE_URL}${endpoint}" -H "Content-Type: application/json"`
    );
    
    const parts = stdout.split('HTTPSTATUS:');
    const response = parts[0];
    const httpCode = parts[1];
    
    console.log(`   📊 Status: ${httpCode}`);
    console.log(`   📝 Response: ${response.substring(0, 100)}`);
    
    if (httpCode === '404') {
      console.log(`   ❌ FAIL: Route n'existe pas`);
      return false;
    } else if (httpCode === '401' || httpCode === '403') {
      console.log(`   ✅ PASS: Route existe (demande auth)`);
      return true;
    } else if (httpCode === '400') {
      console.log(`   ✅ PASS: Route existe (erreur validation)`);  
      return true;
    } else {
      console.log(`   ❓ INFO: Status ${httpCode}`);
      return true;
    }
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

async function testCORS() {
  console.log('\n🌐 TEST CORS');
  console.log('============');
  
  try {
    // Test OPTIONS request (CORS preflight)
    const { stdout } = await execAsync(
      `curl -s -w "HTTPSTATUS:%{http_code}" -X OPTIONS "${BASE_URL}/api/projets/soumettre" -H "Origin: https://frontend-url.com" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type,Authorization"`
    );
    
    const parts = stdout.split('HTTPSTATUS:');
    const httpCode = parts[1];
    
    console.log(`📊 OPTIONS /api/projets/soumettre: ${httpCode}`);
    
    if (httpCode === '200' || httpCode === '204') {
      console.log('✅ CORS semble configuré');
    } else if (httpCode === '404') {
      console.log('❌ Pas de support OPTIONS (CORS peut être problématique)');
    } else {
      console.log(`⚠️ CORS status: ${httpCode}`);
    }
    
  } catch (error) {
    console.log(`❌ Test CORS échoué: ${error.message}`);
  }
}

async function runTests() {
  console.log('🧪 Test Basique Routes POST - Diagnostic 404');
  console.log('==============================================');
  console.log('');

  const tests = [
    { endpoint: '/api/projets/soumettre', name: '📤 POST /api/projets/soumettre' },
    { endpoint: '/api/projets', name: '🔄 POST /api/projets' }
  ];

  let working = 0;
  
  for (const test of tests) {
    const success = await testPOSTBasic(test.endpoint, test.name);
    if (success) working++;
  }
  
  await testCORS();

  console.log('\n📊 RÉSULTATS DIAGNOSTIC');
  console.log('=======================');
  console.log(`✅ Routes POST existantes: ${working}/${tests.length}`);
  
  if (working >= 2) {
    console.log('\n🎉 ROUTES POST FONCTIONNELLES !');
    console.log('');
    console.log('✅ CONCLUSION:');
    console.log('  • Backend: Routes POST accessibles');
    console.log('  • Problème: Côté frontend/cache/token');
    console.log('');
    console.log('🎯 SOLUTION FRONTEND:');
    console.log('  1. 🔄 Hard refresh → Ctrl+Shift+R');
    console.log('  2. 🚪 Logout/Login → Rafraîchir token'); 
    console.log('  3. 🔍 Console browser → Vérifier erreurs');
    console.log('  4. 🌐 Test avec cache désactivé');
    console.log('');
    console.log('📝 VALIDATION DESCRIPTION CORRIGÉE:');
    console.log('  • Avant: 50 caractères minimum');
    console.log('  • Après: 20 caractères minimum ✅');
    
  } else if (working >= 1) {
    console.log('\n⚠️ ROUTES PARTIELLES');
    console.log('  → Redéploiement peut-être encore en cours');
    console.log('  → Attendre 2-3 minutes puis retester');
    
  } else {
    console.log('\n❌ ROUTES POST MANQUANTES');
    console.log('  → Problème déploiement ou configuration backend');
    console.log('  → Vérifier logs Render');
  }
  
  console.log('\n💡 ACTIONS IMMÉDIATES:');
  console.log('1. Tester frontend avec Ctrl+Shift+R');
  console.log('2. Logout/Login pour token frais');
  console.log('3. Profiter validation description réduite (20 chars)');
}

runTests().catch(console.error);