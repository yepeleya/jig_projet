#!/usr/bin/env node

/**
 * 🚨 DIAGNOSTIC CRITIQUE - Routes Render
 * Test exhaustif des routes pour comprendre le 404
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const BASE_URL = 'https://jig-projet-1.onrender.com';

async function testRoute(method, endpoint, headers = {}) {
  try {
    const headerFlags = Object.entries(headers)
      .map(([key, value]) => `-H "${key}: ${value}"`)
      .join(' ');
      
    const { stdout } = await execAsync(
      `curl -s -w "HTTPSTATUS:%{http_code}" -X ${method} "${BASE_URL}${endpoint}" ${headerFlags}`
    );
    
    const parts = stdout.split('HTTPSTATUS:');
    const response = parts[0];
    const httpCode = parts[1];
    
    return {
      endpoint,
      status: httpCode,
      response: response.length > 150 ? response.substring(0, 150) + '...' : response
    };
  } catch (error) {
    return {
      endpoint,
      status: 'ERROR',
      response: error.message
    };
  }
}

async function runDiagnostic() {
  console.log('🚨 DIAGNOSTIC CRITIQUE - Routes POST Render');
  console.log('============================================');
  console.log('');
  
  const routes = [
    // Tests de base pour vérifier que Render répond
    { method: 'GET', endpoint: '/health', name: '🏥 Health Check Global' },
    { method: 'GET', endpoint: '/api/projets/health', name: '🔍 Health Routes Projets' },
    { method: 'GET', endpoint: '/api/projets/public', name: '📋 GET Projets Public' },
    
    // Tests POST SANS authentification (pour voir si routes existent)
    { method: 'POST', endpoint: '/api/projets/soumettre', name: '🎯 POST /projets/soumettre (NO AUTH)' },
    { method: 'POST', endpoint: '/api/projets', name: '🔄 POST /projets (NO AUTH)' },
    
    // Tests avec faux token (pour différencier 401 vs 404)
    { 
      method: 'POST', 
      endpoint: '/api/projets/soumettre', 
      name: '🔑 POST /projets/soumettre (FAKE TOKEN)',
      headers: { 'Authorization': 'Bearer fake.token.test' }
    },
    {
      method: 'POST',
      endpoint: '/api/projets',
      name: '🔑 POST /projets (FAKE TOKEN)',
      headers: { 'Authorization': 'Bearer fake.token.test' }
    }
  ];

  console.log('📊 TESTS EXHAUSTIFS:');
  console.log('===================');
  
  for (const route of routes) {
    const result = await testRoute(route.method, route.endpoint, route.headers || {});
    
    let status_emoji = '';
    if (result.status === '200' || result.status === '201') {
      status_emoji = '✅';
    } else if (result.status === '401' || result.status === '403') {
      status_emoji = '🔐'; // Route existe, demande auth
    } else if (result.status === '400') {
      status_emoji = '⚠️';  // Route existe, erreur validation
    } else if (result.status === '404') {
      status_emoji = '❌'; // Route n'existe PAS
    } else {
      status_emoji = '❓';
    }
    
    console.log(`${status_emoji} ${result.status} | ${route.name}`);
    if (result.response && result.status !== '200') {
      console.log(`   📝 ${result.response.substring(0, 80)}`);
    }
    console.log('');
  }

  console.log('📋 INTERPRÉTATION:');
  console.log('==================');
  console.log('✅ 200/201 = Route fonctionne');
  console.log('🔐 401/403 = Route EXISTE mais demande authentification');  
  console.log('⚠️ 400 = Route EXISTE mais erreur validation');
  console.log('❌ 404 = Route N\'EXISTE PAS (problème déploiement)');
  console.log('');
  
  console.log('🎯 SI TOUTES LES ROUTES POST SONT 404:');
  console.log('• Problème mounting routes sur Render');
  console.log('• Erreur build/déploiement backend');
  console.log('• Router Express pas correctement initialisé');
  console.log('');
  
  console.log('🎯 SI ROUTES POST SONT 401/403:');
  console.log('• Routes existent, problème authentification frontend');
  console.log('• Hard refresh + logout/login requis');
  console.log('');
  
  console.log('🔧 NEXT STEPS:');
  console.log('1. Analyser résultats ci-dessus');
  console.log('2. Si 404 → Vérifier logs backend Render');
  console.log('3. Si 401 → Problème frontend/token');
}

runDiagnostic().catch(console.error);