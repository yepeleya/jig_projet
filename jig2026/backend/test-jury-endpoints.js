import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

async function testJuryEndpoints() {
  console.log('=== TEST DES ENDPOINTS JURY ===\n');
  
  try {
    // Test login du jury
    console.log('1. Test de connexion du jury...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'juryun@jig2026.ci',
      motDePasse: 'jury1'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Connexion réussie');
    console.log('Token:', token.substring(0, 20) + '...');
    
    // Headers pour les requêtes authentifiées
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test des endpoints que l'interface jury utilise
    const endpoints = [
      '/jury/votes',
      '/jury/comments', 
      '/votes',
      '/commentaires',
      '/projets'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n2. Test de ${endpoint}...`);
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers: authHeaders
        });
        console.log(`✅ ${endpoint}: ${response.status} - ${Array.isArray(response.data) ? response.data.length : 'OK'} éléments`);
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.response?.status || 'ERREUR'} - ${error.response?.data?.message || error.message}`);
      }
    }
    
    // Test de création d'un vote
    console.log('\n3. Test de création d\'un vote...');
    try {
      const voteResponse = await axios.post(`${API_BASE_URL}/votes`, {
        projetId: 6,
        juryId: 5,
        valeur: 8.5,
        typeVote: 'JURY'
      }, {
        headers: authHeaders
      });
      console.log('✅ Vote créé:', voteResponse.data);
    } catch (error) {
      console.log('❌ Erreur vote:', error.response?.data?.message || error.message);
    }
    
    // Test de création d'un commentaire
    console.log('\n4. Test de création d\'un commentaire...');
    try {
      const commentResponse = await axios.post(`${API_BASE_URL}/commentaires`, {
        contenu: 'Test commentaire depuis script',
        projetId: 6,
        juryId: 5
      }, {
        headers: authHeaders
      });
      console.log('✅ Commentaire créé:', commentResponse.data);
    } catch (error) {
      console.log('❌ Erreur commentaire:', error.response?.data?.message || error.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testJuryEndpoints();