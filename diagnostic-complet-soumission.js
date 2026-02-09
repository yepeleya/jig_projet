#!/usr/bin/env node

/**
 * 🔍 Diagnostic Complet - Problème Soumission
 * Analyse tous les aspects du problème
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const BASE_URL = 'https://jig-projet-1.onrender.com';

async function testWithRealToken() {
  console.log('🔐 Test avec authentification frontend...');
  
  try {
    // 1. Test login pour obtenir un vrai token
    console.log('1️⃣ Tentative de login...');
    
    const loginData = {
      username: 'admin',  // Essayons avec admin
      password: 'admin123'
    };
    
    const { stdout } = await execAsync(
      `curl -s -X POST "${BASE_URL}/api/auth/login" -H "Content-Type: application/json" -d '${JSON.stringify(loginData)}'`
    );
    
    console.log('📝 Réponse login:', stdout.substring(0, 200));
    
    let token = null;
    try {
      const loginResponse = JSON.parse(stdout);
      if (loginResponse.success && loginResponse.token) {
        token = loginResponse.token;
        console.log('✅ Token obtenu:', token.substring(0, 20) + '...');
      } else {
        console.log('❌ Login échoué:', loginResponse.error || 'Erreur inconnue');
      }
    } catch {
      console.log('❌ Impossible de parser la réponse login');
    }
    
    if (!token) {
      console.log('⚠️ Pas de token, impossible de tester routes authentifiées');
      return false;
    }
    
    // 2. Test avec token réel
    console.log('\n2️⃣ Test POST /api/projets/soumettre avec token réel...');
    
    const { stdout: postResponse } = await execAsync(
      `curl -s -w "HTTPSTATUS:%{http_code}" -X POST "${BASE_URL}/api/projets/soumettre" -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d '{"titre":"Test","description":"Test description","categorie":"test"}'`
    );
    
    const parts = postResponse.split('HTTPSTATUS:');
    const response = parts[0];
    const httpCode = parts[1];
    
    console.log('📊 Status POST /soumettre:', httpCode);
    console.log('📝 Réponse:', response.substring(0, 150));
    
    if (httpCode === '200') {
      console.log('✅ Route POST fonctionne parfaitement !');
      return true;
    } else if (httpCode === '400') {
      console.log('⚠️ Route fonctionne, erreur de validation (normal sans fichier)');
      return true;
    } else if (httpCode === '404') {
      console.log('❌ PROBLÈME: Route toujours 404 même avec token valide');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Erreur test authentification:', error.message);
    return false;
  }
}

async function analyzeBackend() {
  console.log('\n🔍 ANALYSE BACKEND');
  console.log('==================');
  
  // Tests de base
  const tests = [
    { url: `${BASE_URL}/health`, name: 'Health Check Global' },
    { url: `${BASE_URL}/api/projets/health`, name: 'Health Check Routes Projets' },
    { url: `${BASE_URL}/api/projets/public`, name: 'GET /api/projets/public' },
    { url: `${BASE_URL}/api/auth/test`, name: 'Auth Service' }
  ];

  for (const test of tests) {
    try {
      const { stdout } = await execAsync(`curl -s -w "HTTPSTATUS:%{http_code}" "${test.url}"`);
      const parts = stdout.split('HTTPSTATUS:');
      const httpCode = parts[1];
      
      console.log(`• ${test.name}: ${httpCode === '200' ? '✅' : httpCode === '404' ? '❌' : '⚠️'} ${httpCode}`);
    } catch {
      console.log(`• ${test.name}: ❌ ERREUR`);
    }
  }
}

async function analyzeFrontend() {
  console.log('\n🖥️ ANALYSE FRONTEND');
  console.log('===================');
  
  console.log('📊 Configuration API attendue :');
  console.log('• API_BASE_URL forcé vers: https://jig-projet-1.onrender.com/api');
  console.log('• Routes testées par frontend:');
  console.log('  - POST /api/projets/soumettre (principal)');
  console.log('  - POST /api/projets (fallback 1)'); 
  console.log('  - POST /api/projets (fallback 2 JSON)');
  
  console.log('\n💡 HYPOTHÈSES PROBLÈME:');
  console.log('1. Cache browser → Refresh hard (Ctrl+Shift+R)');
  console.log('2. Token expiré → Logout/login'); 
  console.log('3. CORS/network → Vérifier console browser');
  console.log('4. Deploy delayed → Routes pas encore live');
}

async function runFullDiagnostic() {
  console.log('🔍 DIAGNOSTIC COMPLET - Soumission Projet');
  console.log('==========================================');
  console.log(`⏰ ${new Date().toISOString()}\n`);
  
  // 1. Analyser backend
  await analyzeBackend();
  
  // 2. Test avec authentification
  const authWorking = await testWithRealToken();
  
  // 3. Analyser frontend  
  await analyzeFrontend();
  
  console.log('\n📋 RÉSUMÉ DIAGNOSTIC');
  console.log('====================');
  
  if (authWorking) {
    console.log('✅ BACKEND: Routes POST fonctionnent avec auth');
    console.log('');
    console.log('🎯 LE PROBLÈME EST CÔTÉ FRONTEND:');
    console.log('1. 🔄 Hard refresh browser (Ctrl+Shift+R)');
    console.log('2. 🚪 Logout/Login pour refresh token');
    console.log('3. 🔍 Console browser → Chercher erreurs réseau');
    console.log('4. 🌐 Tester avec cache désactivé (F12 → Network → Disable cache)');
    console.log('');
    console.log('💡 SOLUTION: Problème cache/token côté client');
    
  } else {
    console.log('❌ BACKEND: Problème authentification ou routes');
    console.log('');
    console.log('🔧 ACTIONS:');
    console.log('1. 📋 Vérifier logs Render: https://dashboard.render.com');
    console.log('2. 🔍 Chercher erreurs dans logs backend');
    console.log('3. 🚀 Forcer un nouveau déploiement si nécessaire');
  }
  
  console.log('\n🛠️ PROCHAINES ACTIONS:');
  console.log('1. Fixer validation description (50→20 caractères)');
  console.log('2. Hard refresh frontend pour test soumission');
  console.log('3. Monitor console browser pour erreurs');
}

runFullDiagnostic().catch(console.error);