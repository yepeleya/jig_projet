// Test local de l'authentification pour vérifier les codes d'erreur 400/500
import { AuthService } from './src/services/auth.service.js'

async function testLocalAuth() {
  try {
    console.log('🧪 Test local de l\'authentification...')
    
    // Test 1: Login avec email inexistant  
    try {
      await AuthService.login('inexistant@exemple.com', 'motdepassebidon')
      console.log('❌ ERREUR: Le login devrait échouer')
    } catch (error) {
      console.log('✅ Error status:', error.status)
      console.log('✅ Error message:', error.message)
      if (error.status === 400) {
        console.log('✅ LOGIN INVALIDE - Code 400 correctement retourné')
      } else {
        console.log('❌ LOGIN INVALIDE - Code', error.status, 'au lieu de 400')
      }
    }
    
    // Test 2: Login avec bon email mais mauvais mot de passe
    try {
      await AuthService.login('tianakone00@gmail.com', 'mauvais-password')
      console.log('❌ ERREUR: Le login devrait échouer')
    } catch (error) {
      console.log('✅ Error status pour mauvais mdp:', error.status)
      console.log('✅ Error message pour mauvais mdp:', error.message)
      if (error.status === 400) {
        console.log('✅ MAUVAIS MDP - Code 400 correctement retourné')
      } else {
        console.log('❌ MAUVAIS MDP - Code', error.status, 'au lieu de 400')
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur test local:', error)
  }
}

testLocalAuth()