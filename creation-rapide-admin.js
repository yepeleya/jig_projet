/**
 * 🚀 SCRIPT RAPIDE - Créer Admin et Projets de Test
 * Solution immédiate pour base vide qui bloque l'affichage des projets
 */

console.log('🚀 SCRIPT RAPIDE - PEUPLEMENT BASE JIG2026')
console.log('')

console.log('📋 INSTRUCTIONS POUR CRÉER ADMIN + PROJETS:')
console.log('')

console.log('1️⃣  OUVRIR LA CONSOLE DU NAVIGATEUR')
console.log('   - Aller sur: https://jig-projet-ea3m.vercel.app')
console.log('   - Ouvrir F12 → Console')
console.log('   - Copier/coller les commandes ci-dessous')
console.log('')

console.log('2️⃣  CRÉER UN COMPTE ADMIN')
console.log(`fetch('https://jig-projet-1.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    "nom": "Admin",
    "prenom": "JIG",
    "email": "admin@jig2026.fr", 
    "motDePasse": "Admin123!",
    "role": "ADMIN",
    "ecole": "JIG2026",
    "filiere": "Administration",
    "niveau": "Master"
  })
}).then(r => r.json()).then(data => {
  console.log('✅ Admin créé:', data);
  if(data.token) localStorage.setItem('token', data.token);
})`)
console.log('')

console.log('3️⃣  CRÉER DES PROJETS TEST (après admin créé)')
console.log(`// Projet 1
fetch('https://jig-projet-1.onrender.com/api/projets/soumettre', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    "titre": "Application de Gestion Intelligente",
    "description": "Système complet de gestion universitaire avec dashboard temps réel, analytics avancés et interface intuitive pour étudiants et administration.",
    "categorie": "WEB_DEVELOPMENT"
  })
}).then(r => r.json()).then(data => console.log('✅ Projet 1:', data))

// Projet 2  
fetch('https://jig-projet-1.onrender.com/api/projets/soumettre', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    "titre": "Assistant IA Éducatif",
    "description": "Chatbot intelligent utilisant l'IA pour personnaliser l'apprentissage, avec analyse des performances et recommandations adaptatives.",
    "categorie": "INTELLIGENCE_ARTIFICIELLE"
  })
}).then(r => r.json()).then(data => console.log('✅ Projet 2:', data))

// Projet 3
fetch('https://jig-projet-1.onrender.com/api/projets/soumettre', {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    "titre": "App Mobile Éco-Responsable",
    "description": "Application mobile gamifiée pour promouvoir les pratiques durables avec système de points, défis et communauté engagée.",
    "categorie": "MOBILE_DEVELOPMENT"
  })
}).then(r => r.json()).then(data => console.log('✅ Projet 3:', data))`)
console.log('')

console.log('4️⃣  APPROUVER AUTOMATIQUEMENT TOUS LES PROJETS')
console.log(`fetch('https://jig-projet-1.onrender.com/api/projets/auto-approve-all', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.json()).then(data => {
  console.log('🎉 Projets approuvés:', data);
  console.log('✅ Vérifiez maintenant /vote - les projets doivent être visibles!');
})`)
console.log('')

console.log('5️⃣  VÉRIFICATION FINALE')
console.log(`fetch('https://jig-projet-1.onrender.com/api/projets/public')
.then(r => r.json())
.then(data => {
  console.log('📊 Projets publics:', data.data?.length || 0);
  if(data.data?.length > 0) {
    console.log('🎉 SUCCÈS - Les projets sont maintenant visibles!');
    console.log('✅ Allez sur https://jig-projet-ea3m.vercel.app/vote');
  }
})`)
console.log('')

console.log('🎯 RÉSULTAT ATTENDU:')
console.log('   ✅ Admin créé avec succès')
console.log('   ✅ 3 projets créés et approuvés automatiquement')
console.log('   ✅ API /projets/public retourne les projets')
console.log('   ✅ Page vote affiche les projets pour voting')
console.log('   ✅ Page mes-suivis fonctionnelle')
console.log('')

console.log('⚡ TEMPS TOTAL: ~2 minutes')
console.log('🎉 Problème de base vide définitivement résolu!')

// Instructions de validation
console.log('')
console.log('🔍 VALIDATION FINALE:')
console.log('   1. https://jig-projet-ea3m.vercel.app/vote → Projets visibles')
console.log('   2. https://jig-projet-ea3m.vercel.app/mes-suivis → Interface complète')
console.log('   3. https://jig-projet-1.onrender.com/api/projets/public → Données API')