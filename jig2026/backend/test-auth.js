import axios from 'axios'

const testAuth = async () => {
  try {
    console.log('🧪 Test de l\'authentification admin...')
    
    // Test login admin
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'tenenayeo@jig2026.ci',
      motDePasse: 'admin123'
    })
    
    console.log('✅ Connexion admin réussie:', response.data)
    
    // Test avec le token
    const token = response.data.data.token
    const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    console.log('✅ Profil récupéré:', profileResponse.data)
    
    // Test d'un endpoint admin
    const statsResponse = await axios.get('http://localhost:5000/api/admin/stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    console.log('✅ Stats admin récupérées:', statsResponse.data)
    
  } catch (error) {
    console.error('❌ Erreur complète:', error)
    console.error('❌ Message:', error.message)
    if (error.response) {
      console.error('❌ Status:', error.response.status)
      console.error('❌ Data:', error.response.data)
    }
  }
}

testAuth()