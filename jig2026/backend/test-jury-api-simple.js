import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

async function testJuryAPI() {
  console.log('=== TEST API JURY - DIAGNOSTIC ===\n');
  
  try {
    // 1. Test de santé du serveur
    console.log('1. Test de santé du serveur...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Serveur OK:', healthResponse.data);
    
    // 2. Test de connexion avec le jury existant
    console.log('\n2. Test de connexion jury...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'juryun@jig2026.ci',
      motDePasse: 'jury123'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Connexion réussie');
      const token = loginResponse.data.data.token;
      console.log('Token reçu:', token ? 'OK' : 'MANQUANT');
      
      // 3. Test des endpoints avec token
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Test /projets
      console.log('\n3. Test /projets...');
      try {
        const projetsResponse = await axios.get(`${API_BASE_URL}/projets`, { headers });
        console.log('✅ /projets OK -', projetsResponse.data.length || 'N/A', 'projets');
      } catch (error) {
        console.log('❌ /projets erreur:', error.response?.status, error.response?.data?.message);
      }
      
      // Test /jury/votes
      console.log('\n4. Test /jury/votes...');
      try {
        const votesResponse = await axios.get(`${API_BASE_URL}/jury/votes`, { headers });
        console.log('✅ /jury/votes OK -', votesResponse.data.data?.length || 'N/A', 'votes');
      } catch (error) {
        console.log('❌ /jury/votes erreur:', error.response?.status, error.response?.data?.message);
      }
      
      // Test /jury/comments
      console.log('\n5. Test /jury/comments...');
      try {
        const commentsResponse = await axios.get(`${API_BASE_URL}/jury/comments`, { headers });
        console.log('✅ /jury/comments OK -', commentsResponse.data.data?.length || 'N/A', 'commentaires');
      } catch (error) {
        console.log('❌ /jury/comments erreur:', error.response?.status, error.response?.data?.message);
      }
      
    } else {
      console.log('❌ Échec de connexion:', loginResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.response?.data || error.message);
  }
}

testJuryAPI();