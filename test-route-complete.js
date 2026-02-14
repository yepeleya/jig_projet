// 🎯 TEST ROUTE COMPLÈTE avec middlewares auth + upload
console.log('🎯 TEST ROUTE COMPLÈTE - Attendre 60s que Render redéploie...');

setTimeout(() => {
  console.log('\n🧪 Test 1: Route /test (backup, doit toujours marcher)');
  
  fetch("https://jig-projet-1.onrender.com/api/projets/test", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({test: "backup route"})
  })
  .then(r => r.json())
  .then(d => console.log('📊 Route test:', d))
  .catch(e => console.error('❌ Erreur test:', e));
  
}, 2000);

setTimeout(() => {
  console.log('\n🔐 Test 2: Route /soumettre COMPLÈTE (avec auth + upload)');
  
  const token = localStorage.getItem("jig2026_token");
  if (!token) {
    console.error('❌ Pas de token - connectez-vous d\'abord');
    return;
  }
  
  // Test avec FormData (comme soumission réelle)
  const formData = new FormData();
  formData.append('titre', 'Test route complète');
  formData.append('description', 'Description avec minimum 20 caractères pour validation');
  formData.append('categorie', 'INNOVATION');
  
  fetch("https://jig-projet-1.onrender.com/api/projets/soumettre", {
    method: "POST",
    headers: {"Authorization": "Bearer " + token},
    body: formData
  })
  .then(r => {
    console.log('🎯 Status:', r.status);
    return r.json();
  })
  .then(d => {
    console.log('📊 Route complète:', d);
    
    if (d.success && d.projet) {
      console.log('🎉 SUCCÈS TOTAL ! Projet créé avec ID:', d.projet.id);
    } else if (d.error === 'Fichier requis') {
      console.log('⚠️ Route OK mais fichier requis - normal pour upload');
    } else {
      console.log('ℹ️ Réponse:', d);
    }
  })
  .catch(e => console.error('❌ Erreur complète:', e));
  
}, 5000);

console.log('\n⚠️ Instructions:');
console.log('1. Attendre 60 secondes que Render redéploie');
console.log('2. Exécuter ce script dans la console frontend');
console.log('3. Vérifier que status = 200 ou 400 (= route accessible)');
console.log('4. Status 404 = pas encore redéployé, réessayer');