#!/usr/bin/env node

/**
 * 🔍 SCANNER BACKEND ACTUEL - État Réel Routes
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function scanBackend() {
  console.log('🔍 SCAN BACKEND RENDER - État Réel');
  console.log('==================================');
  console.log(`⏰ ${new Date().toISOString()}\n`);
  
  const routes = [
    // Health checks
    { method: 'GET', path: '/health', name: '🏥 Global Health' },
    { method: 'GET', path: '/api/projets/health', name: '🩺 Routes Health' },
    
    // Routes GET qui fonctionnent
    { method: 'GET', path: '/api/projets/public', name: '📋 GET Public' },
    { method: 'GET', path: '/api/projets/mes-projets', name: '👤 GET Mes-Projets' },
    
    // Routes POST qui sont 404
    { method: 'POST', path: '/api/projets/soumettre', name: '🎯 POST Soumettre' },
    { method: 'POST', path: '/api/projets', name: '🔄 POST Projets' },
    
    // Autres tests
    { method: 'GET', path: '/api/projets', name: '📂 GET Projets (list)' }
  ];

  console.log('📊 ROUTES SCAN RESULTS:');
  console.log('========================');
  
  for (const route of routes) {
    try {
      const { stdout } = await execAsync(
        `curl -s -w "HTTPSTATUS:%{http_code}" -X ${route.method} "https://jig-projet-1.onrender.com${route.path}"`
      );
      
      const parts = stdout.split('HTTPSTATUS:');
      const status = parts[1];
      
      let emoji = '';
      if (status === '200' || status === '201') emoji = '✅';
      else if (status === '401' || status === '403') emoji = '🔐';
      else if (status === '400') emoji = '⚠️';
      else if (status === '404') emoji = '❌';
      else emoji = '❓';
      
      console.log(`${emoji} ${status} | ${route.method} ${route.path} | ${route.name}`);
      
    } catch (error) {
      console.log(`💥 ERR | ${route.method} ${route.path} | ${route.name}`);
    }
  }
  
  console.log('\n📋 ANALYSE RÉSULTATS:');
  console.log('=====================');
  console.log('✅ 200/201 = Route fonctionne');
  console.log('🔐 401/403 = Route EXISTE, demande auth');
  console.log('⚠️ 400 = Route EXISTE, erreur validation');
  console.log('❌ 404 = Route N\'EXISTE PAS');
  console.log('');
  
  console.log('🎯 CONCLUSION ATTENDUE:');
  console.log('• GET routes: ✅ Fonctionnent');
  console.log('• POST routes: ❌ N\'existent pas (404)');
  console.log('');
  console.log('➡️ SOLUTION: Créer routes POST manquantes dans backend');
}

scanBackend().catch(console.error);