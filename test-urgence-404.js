#!/usr/bin/env node

/**
 * 🚨 TEST URGENCE - Route POST Status Actuel
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function testNow() {
  console.log('🚨 TEST URGENCE - Status Route POST Maintenant');
  console.log('===============================================');
  console.log(`⏰ ${new Date().toISOString()}`);
  console.log('');

  try {
    // Test sans auth
    const { stdout } = await execAsync(
      'curl -s -w "HTTPSTATUS:%{http_code}" -X POST "https://jig-projet-1.onrender.com/api/projets/soumettre"'
    );
    
    const parts = stdout.split('HTTPSTATUS:');
    const response = parts[0];
    const httpCode = parts[1];
    
    console.log(`📊 POST /api/projets/soumettre: ${httpCode}`);
    console.log(`📝 Response: ${response.substring(0, 100)}`);
    
    if (httpCode === '404') {
      console.log('');
      console.log('🚨 ALERTE: ROUTE VRAIMENT 404 !');
      console.log('');
      console.log('❌ PROBLÈMES POSSIBLES:');
      console.log('1. 🔄 Render pas encore redéployé nos changes');
      console.log('2. 💥 Build error sur Render');
      console.log('3. 🔌 Route mounting échoue');
      console.log('4. 📁 Imports controller cassés');
      console.log('');
      console.log('🔧 ACTIONS IMMÉDIATES:');
      console.log('1. Vérifier logs Render: https://dashboard.render.com');
      console.log('2. Forcer redéploiement backend');
      console.log('3. Vérifier /api/projets/health existe');
      
      // Test health route
      console.log('');
      console.log('🔍 Test route health...');
      
      try {
        const { stdout: healthOut } = await execAsync(
          'curl -s -w "HTTPSTATUS:%{http_code}" "https://jig-projet-1.onrender.com/api/projets/health"'
        );
        
        const healthParts = healthOut.split('HTTPSTATUS:');
        const healthCode = healthParts[1];
        
        console.log(`📊 GET /api/projets/health: ${healthCode}`);
        
        if (healthCode === '200') {
          console.log('✅ Routes projets chargées, problème spécifique POST');
        } else {
          console.log('❌ Routes projets complètement cassées');
        }
        
      } catch (e) {
        console.log('❌ Health test failed:', e.message);
      }
      
    } else if (httpCode === '401' || httpCode === '403') {
      console.log('');
      console.log('✅ ROUTE EXISTE (demande auth)');
      console.log('❓ Mais frontend voit 404...');
      console.log('');
      console.log('🤔 HYPOTHÈSES:');
      console.log('• Cache DNS/CDN');
      console.log('• Frontend pas redéployé');
      console.log('• Timing issue');
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
  
  console.log('');
  console.log('🎯 PROCHAINE ACTION:');
  console.log('Selon résultat → adapter stratégie');
}

testNow().catch(console.error);