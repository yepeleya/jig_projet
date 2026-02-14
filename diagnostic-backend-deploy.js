// 🔍 DIAGNOSTIC URGENT: Quel backend est déployé ?
console.log('🔍 DIAGNOSTIC: Version backend déployée sur Render');

// Test 1: Health check - doit lister les endpoints
fetch("https://jig-projet-1.onrender.com/api/projets/health")
  .then(r => r.json())
  .then(d => {
    console.log('📊 Health check:', d);
    if (d.endpoints) {
      console.log('🎯 Endpoints disponibles:', d.endpoints);
    }
  })
  .catch(e => console.error('❌ Erreur health:', e));

// Test 2: Route test backup
setTimeout(() => {
  fetch("https://jig-projet-1.onrender.com/api/projets/test", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({test: "vérification"})
  })
  .then(r => {
    console.log('🎯 Route test status:', r.status);
    return r.json();
  })
  .then(d => console.log('📊 Route test:', d))
  .catch(e => console.error('❌ Route test échoue:', e));
}, 1000);

// Test 3: Route complète RÉELLE (comme l'interface fait)
setTimeout(() => {
  console.log('\n🔐 Test route COMPLÈTE avec middlewares:');
  
  const token = localStorage.getItem("jig2026_token");
  const formData = new FormData();
  formData.append('titre', 'Test middleware complet');
  formData.append('description', 'Description test middlewares auth + upload');
  formData.append('categorie', 'INNOVATION');
  
  fetch("https://jig-projet-1.onrender.com/api/projets/soumettre", {
    method: "POST",
    headers: {"Authorization": "Bearer " + token},
    body: formData
  })
  .then(r => {
    console.log('🎯 Route complète status:', r.status);
    return r.text(); // text car peut être une erreur HTML
  })
  .then(d => {
    console.log('📊 Route complète réponse:', d);
    if (r.status === 404) {
      console.log('❌ PROBLÈME: Route complète pas déployée !');
    } else {
      console.log('✅ Route complète accessible');
    }
  })
  .catch(e => console.error('❌ Erreur complète:', e));
}, 2000);

console.log('\n⚠️ Si route test = 200 et route complète = 404:');
console.log('👉 Les middlewares bloquent le déploiement');
console.log('👉 Solution: temporairement désactiver middlewares complexes');