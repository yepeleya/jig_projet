import http from 'http';

async function testLogin() {
  console.log('🔍 Test de connexion admin...');
  console.log('📧 Email: tenenayeo@jig2026.ci');
  console.log('🔑 Mot de passe: admin123');
  console.log('');
  
  const loginData = JSON.stringify({
    email: "tenenayeo@jig2026.ci",
    motDePasse: "admin123"
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    console.log('📊 Status Code:', res.statusCode);
    console.log('📋 Headers:', res.headers);
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📝 Réponse brute:', data);
      
      try {
        const result = JSON.parse(data);
        console.log('✅ JSON parsé:', JSON.stringify(result, null, 2));
        
        if (res.statusCode === 200) {
          console.log('🎉 Connexion réussie !');
          if (result.data && result.data.user) {
            console.log('👤 Utilisateur:', result.data.user.prenom, result.data.user.nom);
            console.log('🏷️ Rôle:', result.data.user.role);
            console.log('🔑 Token présent:', !!result.data.token);
          }
        } else {
          console.log('❌ Échec de connexion');
        }
      } catch (error) {
        console.log('⚠️ Erreur de parsing JSON:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('🚨 Erreur de connexion:', error.message);
  });

  req.write(loginData);
  req.end();
}

testLogin();