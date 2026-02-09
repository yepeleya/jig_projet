// 🧪 TEST ROUTES POST SIMPLIFIÉES
console.log('🧪 TEST ROUTES POST - Versions simplifiées');

// Test 1 : Route simple POST /api/projets
console.log('\n1️⃣ Test POST /api/projets (route simple)');

fetch("https://jig-projet-1.onrender.com/api/projets", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("jig2026_token")
  },
  body: JSON.stringify({test: "data"})
})
.then(r => {
  console.log('🎯 Status:', r.status);
  return r.json();
})
.then(data => console.log('📊 Réponse POST /api/projets:', data))
.catch(e => console.error('❌ Erreur POST /api/projets:', e));

// Test 2 : Route /soumettre simplifiée
setTimeout(() => {
  console.log('\n2️⃣ Test POST /api/projets/soumettre (route simplifiée)');
  
  fetch("https://jig-projet-1.onrender.com/api/projets/soumettre", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jig2026_token")
    },
    body: JSON.stringify({
      titre: "Test soumission",
      description: "Description de test pour validation"
    })
  })
  .then(r => {
    console.log('🎯 Status:', r.status);
    return r.json();
  })
  .then(data => console.log('📊 Réponse POST /soumettre:', data))
  .catch(e => console.error('❌ Erreur POST /soumettre:', e));
}, 2000);

// Test 3 : Health check
setTimeout(() => {
  console.log('\n3️⃣ Test GET /api/projets/health');
  
  fetch("https://jig-projet-1.onrender.com/api/projets/health")
  .then(r => {
    console.log('🎯 Status:', r.status);
    return r.json();
  })
  .then(data => console.log('📊 Health check:', data))
  .catch(e => console.error('❌ Erreur health:', e));
}, 4000);

console.log('\n⚠️ ATTENDRE 30-60 SECONDES que Render redéploie...');
console.log('👀 Puis exécuter ces tests dans la console du frontend');