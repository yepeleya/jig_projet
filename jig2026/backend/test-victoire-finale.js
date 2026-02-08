// TEST FINAL DE VICTOIRE - Verification complète après nettoyage massif
async function testVictoireFinale() {
  try {
    console.log('🏆 TEST DE VICTOIRE FINALE - Backend JIG 2026')
    console.log('=' .repeat(60))
    
    // Test 1: Health Check basic
    console.log('\n🔍 Test 1: Health check basique...')
    const healthResponse = await fetch('https://jig-projet-1.onrender.com/health')
    console.log(`   Status: ${healthResponse.status}`)
    if (healthResponse.status === 200) {
      console.log('   ✅ Serveur operational')
    }
    
    // Test 2: Login avec données invalides (doit retourner 400, pas 500)
    console.log('\n🔍 Test 2: Login données invalides...')
    const loginInvalidResponse = await fetch('https://jig-projet-1.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@invalid.com', password: 'wrong' })
    })
    console.log(`   Status: ${loginInvalidResponse.status}`)
    
    if (loginInvalidResponse.status === 400) {
      console.log('   ✅ PARFAIT: 400 pour données invalides (attendu)')
    } else if (loginInvalidResponse.status === 500) {
      const errorText = await loginInvalidResponse.text()
      console.log('   ❌ ERREUR 500 PERSISTANTE:')
      console.log('   📧', errorText)
    } else {
      console.log(`   ⚠️ Status inattendu: ${loginInvalidResponse.status}`)
    }
    
    // Test 3: Register avec données valides
    console.log('\n🔍 Test 3: Register données valides...')
    const registerResponse = await fetch('https://jig-projet-1.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'TestUser',
        prenom: 'Final',  
        email: `test.final.${Date.now()}@victory.com`,
        password: 'victory123',
        role: 'VISITEUR'
      })
    })
    console.log(`   Status: ${registerResponse.status}`)
    
    if (registerResponse.status === 201) {
      console.log('   ✅ PARFAIT: Création utilisateur réussie')
    } else if (registerResponse.status === 500) {
      const errorText = await registerResponse.text()
      console.log('   ❌ ERREUR 500 register:')
      console.log('   📧', errorText)
    }
    
    // Test 4: Login champs manquants (validation Zod)
    console.log('\n🔍 Test 4: Validation Zod...')
    const validationResponse = await fetch('https://jig-projet-1.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com' }) // pas de password
    })
    console.log(`   Status: ${validationResponse.status}`)
    
    if (validationResponse.status === 400) {
      console.log('   ✅ PARFAIT: Validation Zod fonctionne')
    }
    
    console.log('\n' + '=' .repeat(60))
    console.log('🏆 RÉSUMÉ DU TEST DE VICTOIRE:')
    
  } catch (error) {
    console.error('❌ Erreur test:', error)
  }
}

testVictoireFinale()