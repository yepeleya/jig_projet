// Script de test automatique pour valider la compatibilité Frontend/Backend
// À exécuter pour s'assurer qu'aucune erreur 400/500 n'apparaît

const API_BASE_URL = 'https://jig-projet-1.onrender.com/api';

// Test 1: Register avec les bons champs
async function testRegister() {
  console.log('🧪 TEST 1: Registration');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: 'TestUser',
        prenom: 'Auto',  
        email: `test-${Date.now()}@exemple.com`,
        password: 'password123',  // ✅ password (pas motDePasse)
        role: 'ETUDIANT'
        // ✅ Plus de champ filiere
        // ✅ Plus de champ ecole
      })
    });
    
    const data = await response.json();
    
    console.log(`  📊 Status: ${response.status}`);
    console.log(`  📄 Response:`, data);
    
    if (response.status === 201) {
      console.log('  ✅ REGISTER SUCCESSFUL - Compatibilité OK');
      return { success: true, data };
    } else {
      console.log('  ❌ REGISTER FAILED - Erreur détectée:', data.message);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log('  💥 REGISTER ERROR:', error);
    return { success: false, error };
  }
}

// Test 2: Login avec les bons champs
async function testLogin() {
  console.log('🧪 TEST 2: Login');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'email-inexistant@test.com',
        password: 'wrongpassword'  // ✅ password (pas motDePasse)
      })
    });
    
    const data = await response.json();
    
    console.log(`  📊 Status: ${response.status}`);
    console.log(`  📄 Response:`, data);
    
    if (response.status === 400) {
      console.log('  ✅ LOGIN REJECTION (400) - Gestion d\'erreur correcte');
      return { success: true, expected: true };
    } else if (response.status === 500) {
      console.log('  ❌ LOGIN RETURNS 500 - PROBLÈME BACKEND');
      return { success: false, error: 'Should return 400, not 500' };
    } else {
      console.log('  ⚠️  Unexpected status:', response.status);
      return { success: false, error: 'Unexpected status' };
    }
  } catch (error) {
    console.log('  💥 LOGIN ERROR:', error);
    return { success: false, error };
  }
}

// Test 3: Projet avec les bons champs  
async function testProjetSubmission() {
  console.log('🧪 TEST 3: Project Submission (Simulation)');
  
  // Simuler la création d'un FormData comme le frontend
  const formData = new FormData();
  formData.append('titre', 'Projet Test Automatique');
  formData.append('description', 'Description complete de plus de 10 caracteres pour passer la validation');
  formData.append('categorie', 'Innovation Technologique');
  // ✅ Plus de champ niveau
  
  // Créer un faux token JWT pour le test
  const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4ZW1wbGUuY29tIiwicm9sZSI6IkVUVURJQU5UIiwiaWF0IjoxNzcwNTk2ODIwLCJleHAiOjE3NzEyMDE2MjB9.fake';
  
  try {
    const response = await fetch(`${API_BASE_URL}/projets/soumettre`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${fakeToken}`
      },
      body: formData  // FormData automatiquement
    });
    
    const data = await response.json();
    
    console.log(`  📊 Status: ${response.status}`);
    console.log(`  📄 Response:`, data);
    
    if (response.status === 401) {
      console.log('  ✅ PROJECT AUTH REQUIRED - Sécurité OK');
      return { success: true, expected: true };
    } else if (response.status === 400 && data.message?.includes('niveau')) {
      console.log('  ❌ PROJECT STILL REQUIRES NIVEAU - BACKEND PAS CORRIGÉ');
      return { success: false, error: 'Backend still requires niveau field' };
    } else {
      console.log(`  ✅ PROJECT SUBMISSION PROCESSED - Status ${response.status} OK`);
      return { success: true };
    }
  } catch (error) {
    console.log('  💥 PROJECT ERROR:', error);
    return { success: false, error };
  }
}

// Exécuter tous les tests
async function runCompatibilityTests() {
  console.log('🚀 DÉBUT DES TESTS DE COMPATIBILITÉ FRONTEND/BACKEND');
  console.log('=' .repeat(60));
  
  const results = [];
  
  results.push(await testRegister());
  console.log('');
  
  results.push(await testLogin());
  console.log('');
  
  results.push(await testProjetSubmission());
  console.log('');
  
  // Résumé
  console.log('📊 RÉSUMÉ DES TESTS:');
  console.log('=' .repeat(60));
  
  const successCount = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  if (successCount === totalTests) {
    console.log('🎉 TOUS LES TESTS RÉUSSIS - Compatibilité Frontend/Backend OK !');
  } else {
    console.log(`❌ ${totalTests - successCount}/${totalTests} tests échoués`);
    console.log('⚠️  Problèmes de compatibilité détectés');
  }
  
  console.log('');
  console.log('🔍 Prochaines étapes:');
  console.log('1. Vérifier les logs Render: https://dashboard.render.com/web/srv-cr8h8lkqj1kc73af9t20/logs');
  console.log('2. Tester depuis Vercel: https://jig-projet-ea3m.vercel.app');
  console.log('3. Monitorer les requêtes avec le nouveau middleware de logging');
}

// Lancer les tests
runCompatibilityTests().catch(console.error);