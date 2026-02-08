// Test complet de l'API auth après corrections
async function testAuthAPI() {
  try {
    console.log('🧪 Test complet de l\'API authentification...')
    
    // Test 1: Login avec données invalides (doit retourner 400)
    const loginResponse = await fetch('https://jig-projet-1.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@invalid.com', password: 'wrong' })
    })
    
    console.log('📊 Test login invalid - Status:', loginResponse.status)
    if (loginResponse.status === 400) {
      console.log('✅ OK: Erreur 400 pour données invalides')
    } else {
      const errorText = await loginResponse.text()
      console.log('❌ Status inattendu:', loginResponse.status)
      console.log('📧 Réponse:', errorText)
    }
    
    // Test 2: Register avec données minimales (doit fonctionner) 
    const registerResponse = await fetch('https://jig-projet-1.onrender.com/api/auth/register', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Test',
        prenom: 'User',
        email: `test${Date.now()}@test.com`,
        password: 'password123'
      })
    })
    
    console.log('📊 Test register - Status:', registerResponse.status)
    if (registerResponse.status === 201) {
      console.log('✅ OK: Création utilisateur réussie')
    } else {
      const errorText = await registerResponse.text()
      console.log('❌ Erreur register:', registerResponse.status)
      console.log('📧 Réponse:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Erreur test:', error)
  }
}

testAuthAPI()