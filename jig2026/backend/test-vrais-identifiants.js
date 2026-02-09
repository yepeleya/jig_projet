// Test avec des identifiants existants pour voir si ça marche
async function testAvecVraisIdentifiants() {
  try {
    console.log('🧪 Test avec identifiants existants...')
    
    // Test 1: Login avec un utilisateur qui pourrait exister
    const response = await fetch('https://jig-projet-1.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'tianakone00@gmail.com', // Email qui existe dans la base
        password: 'wrongpassword'
      })
    })
    
    console.log('📊 Status avec email existant:', response.status)
    const responseText = await response.text()
    console.log('📧 Response:', responseText)
    
    // Test 2: Register avec nouvelles données 
    const registerResponse = await fetch('https://jig-projet-1.onrender.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: 'Test',
        prenom: 'User',
        email: `test${Date.now()}@exemple.com`,
        password: 'password123',
        role: 'ETUDIANT'
      })
    })
    
    console.log('📊 Status register:', registerResponse.status)
    const registerText = await registerResponse.text()
    console.log('📧 Register response:', registerText)
    
  } catch (error) {
    console.error('❌ Erreur test:', error)
  }
}

testAvecVraisIdentifiants()