// Diagnostic final pour identifier l'erreur 500 persistante
async function diagnosticFinal() {
  try {
    console.log('🔍 Diagnostic final de l\'erreur 500...')
    
    const response = await fetch('https://jig-projet-1.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@invalid.com',
        password: 'wrong'
      })
    })
    
    console.log('📊 Status:', response.status)
    
    const responseText = await response.text()
    console.log('📧 Response Body:', responseText)
    
    if (response.status === 500) {
      try {
        const errorObj = JSON.parse(responseText)
        console.log('🎯 Erreur spécifique:', errorObj.message)
      } catch (e) {
        console.log('❌ Réponse non-JSON:', responseText)
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur de diagnostic:', error)
  }
}

diagnosticFinal()