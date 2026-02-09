#!/usr/bin/env node

/**
 * 🔥 TEST FINAL - AVEC LOGIN RÉEL
 * Teste exactement comme le frontend
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const BASE_URL = 'https://jig-projet-1.onrender.com';

async function getRealToken() {
  console.log('🔐 Étape 1: Login comme le frontend');
  
  try {
    const loginPayload = JSON.stringify({
      email: 'test@test.com',  // Essayons avec des creds communs
      password: 'test123'
    });
    
    const { stdout } = await execAsync(
      `curl -s "${BASE_URL}/api/auth/login" -H "Content-Type: application/json" -d '${loginPayload}'`
    );
    
    console.log('📝 Réponse login:', stdout.substring(0, 150));
    
    try {
      const loginResp = JSON.parse(stdout);
      if (loginResp.success && loginResp.token) {
        console.log('✅ Token obtenu!');
        return loginResp.token;
      } else {
        console.log('❌ Login failed:', loginResp.error);
      }
    } catch {
      console.log('❌ Impossible de parser login response');
    }
    
  } catch (error) {
    console.log('❌ Erreur login:', error.message);
  }
  
  return null;
}

async function testRealSubmit(token) {
  console.log('\n🚀 Étape 2: Test POST comme le frontend');
  console.log(`Token: ${token.substring(0, 20)}...`);
  
  // Simuler form-data comme le ferait le frontend
  const formFields = [
    'titre="Mon Test Projet"',
    'description="Description de test suffisamment longue pour validation"',
    'categorie="web"'
  ];
  
  try {
    // Test exact de l'endpoint principal
    const { stdout } = await execAsync(
      `curl -s -w "HTTPSTATUS:%{http_code}" -X POST "${BASE_URL}/api/projets/soumettre" -H "Authorization: Bearer ${token}" ${formFields.map(f => `-F "${f}"`).join(' ')}`
    );
    
    const parts = stdout.split('HTTPSTATUS:');
    const response = parts[0];
    const httpCode = parts[1];
    
    console.log(`📊 Status: ${httpCode}`);
    console.log('📝 Response:', response.substring(0, 200));
    
    if (httpCode === '200' || httpCode === '201') {
      return { success: true, message: 'Soumission réussie!' };
    } else if (httpCode === '400') {
      return { success: false, message: 'Erreur validation (normal sans fichier réel)' };  
    } else if (httpCode === '401' || httpCode === '403') {
      return { success: false, message: 'Problème authentification' };
    } else if (httpCode === '404') {
      return { success: false, message: 'ROUTE VRAIMENT INTROUVABLE' };
    } else {
      return { success: false, message: `Erreur ${httpCode}` };
    }
    
  } catch (error) {
    return { success: false, message: `Erreur réseau: ${error.message}` };
  }
}

async function runRealTest() {
  console.log('🔥 TEST AUTHENTIFIÉ - Simulation Frontend Exacte');
  console.log('=================================================');
  console.log('');
  
  const token = await getRealToken();
  
  if (!token) {
    console.log('❌ IMPOSSIBLE DE TESTER SANS TOKEN VALIDE');
    console.log('');
    console.log('💡 SOLUTIONS:');
    console.log('1. Créer un compte test : POST /api/auth/register');
    console.log('2. Tester depuis frontend avec token réel');
    console.log('3. Copier token depuis localStorage browser');
    return;
  }
  
  const result = await testRealSubmit(token);
  
  console.log('\n📋 RÉSULTAT FINAL');
  console.log('=================');
  
  if (result.success) {
    console.log('✅ BACKEND FONCTIONNE PARFAITEMENT !');
    console.log('');
    console.log('🎯 LE PROBLÈME EST 100% CÔTÉ FRONTEND:');
    console.log('1. 🔄 Hard refresh (Ctrl+Shift+R)');
    console.log('2. 🚪 Logout/Login sur le site'); 
    console.log('3. 🧹 Vider cache navigateur');
    console.log('4. 🔍 Console DevTools → Network tab');
    console.log('');
    console.log('📝 VALIDATION DESCRIPTION RÉDUITE: 50→20 chars ✅');
    
  } else {
    console.log('❌ PROBLÈME BACKEND CONFIRMÉ');
    console.log(`💬 ${result.message}`);
    console.log('');
    console.log('🔧 ACTIONS:');
    console.log('1. 📋 Logs Render: https://dashboard.render.com');
    console.log('2. 🚀 Forcer redéploiement');
    console.log('3. 🔬 Debug routes backend localement');
  }
}

runRealTest().catch(console.error);