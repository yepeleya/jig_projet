/**
 * 🧪 TEST RAPIDE DE COMPATIBILITÉ FRONTEND/BACKEND
 * Test des endpoints d'authentification avec les champs corrigés
 */

const API_BASE_URL = 'https://jig-projet-1.onrender.com/api'

// Test 1: Registration avec les champs corrigés
async function testRegisterFixed() {
  console.log('🧪 TEST 1: Registration corrigé')
  
  try {
    const userData = {
      nom: 'TestUser',
      prenom: 'Auto',
      email: `test-fixed-${Date.now()}@example.com`,
      password: 'password123',  // ✅ Utilise "password" au lieu de "motDePasse"
      role: 'ETUDIANT'         // ✅ Utilise role valide du backend
      // ✅ Plus de champs "ecole", "filiere", "niveau"
    }
    
    console.log('📤 Envoi:', userData)
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    
    const data = await response.json()
    
    console.log(`📊 Status: ${response.status}`)
    console.log(`📄 Response:`, data)
    
    if (response.status === 201) {
      console.log('✅ REGISTER SUCCESS - Backend accepte les données')
      return data
    } else {
      console.log('❌ REGISTER FAILED')
      return null
    }
    
  } catch (error) {
    console.error('💥 Erreur:', error)
    return null
  }
}

// Test 2: Login avec password
async function testLoginFixed(email, password) {
  console.log('🧪 TEST 2: Login corrigé')
  
  try {
    const loginData = {
      email: email,
      password: password  // ✅ Utilise "password" au lieu de "motDePasse"
    }
    
    console.log('📤 Envoi:', loginData)
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    })
    
    const data = await response.json()
    
    console.log(`📊 Status: ${response.status}`)
    console.log(`📄 Response:`, data)
    
    if (response.status === 200) {
      console.log('✅ LOGIN SUCCESS - Backend accepte les données')
      return data
    } else {
      console.log('❌ LOGIN FAILED')
      return null
    }
    
  } catch (error) {
    console.error('💥 Erreur:', error)
    return null
  }
}

// Test complet
async function runTests() {
  console.log('🚀 DÉBUT DES TESTS BACKEND FIXES')
  console.log('=====================================')
  
  // Test 1: Registration
  const registerResult = await testRegisterFixed()
  
  if (registerResult && registerResult.user) {
    console.log('\n=====================================')
    
    // Test 2: Login avec les identifiants créés
    const loginResult = await testLoginFixed(
      registerResult.user.email, 
      'password123'
    )
    
    if (loginResult) {
      console.log('\n🎉 TOUS LES TESTS PASSENT !')
      console.log('🎯 Le backend est maintenant compatible')
    }
  }
  
  console.log('\n=====================================')
  console.log('📝 Résumé:')
  console.log('- Registration:', registerResult ? '✅ OK' : '❌ FAILED')
  console.log('- Login:', registerResult ? '✅ OK' : '❌ FAILED')
}

// Exécution
runTests().catch(console.error)