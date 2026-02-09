// 🎯 TEST FINAL - Après correction du top-level await
console.log('🎯 TEST FINAL: Vérification routes après correction top-level await');

// ⏰ ATTENDRE QUE RENDER REDÉPLOIE (30-60 secondes)
setTimeout(() => {
  console.log('\n1️⃣ Test Health Check');
  
  fetch("https://jig-projet-1.onrender.com/api/projets/health")
    .then(r => {
      console.log('🎯 Health Status:', r.status);
      return r.json();
    })
    .then(data => {
      console.log('📊 Health Data:', data);
      if (data.success) {
        console.log('✅ ROUTES CHARGÉES avec succès !');
        console.log('🎯 Endpoints disponibles:', data.endpoints);
      }
    })
    .catch(e => console.error('❌ Erreur health:', e));
    
}, 2000);

setTimeout(() => {
  console.log('\n2️⃣ Test Route POST simplifiée /api/projets/soumettre');
  
  const token = localStorage.getItem("jig2026_token");
  if (!token) {
    console.error('❌ Pas de token - connectez-vous d\'abord');
    return;
  }
  
  fetch("https://jig-projet-1.onrender.com/api/projets/soumettre", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      titre: "Test route corrigée",
      description: "Test après correction top-level await"
    })
  })
  .then(r => {
    console.log('🎯 Soumettre Status:', r.status);
    return r.json();
  })
  .then(data => {
    console.log('📊 Soumettre Data:', data);
    
    if (r.status === 200) {
      console.log('🎉 SUCCÈS! La route /soumettre fonctionne !');
    } else if (r.status === 403 || r.status === 401) {
      console.log('⚠️ Auth/Permission - Route existe mais problème token');
    } else if (r.status === 404) {
      console.log('❌ ENCORE 404 - Render pas encore redéployé');
    }
  })
  .catch(e => console.error('❌ Erreur soumettre:', e));
  
}, 5000);

console.log('\n⚠️ IMPORTANT:');
console.log('- Attendre 60 secondes que Render redéploie');
console.log('- Si encore 404, réessayer dans quelques minutes');
console.log('- Status 401/403 = routes OK, problème auth seulement');
console.log('- Status 200 = TOUT FONCTIONNE ✅');