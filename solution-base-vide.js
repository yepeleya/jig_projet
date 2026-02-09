/**
 * Script simple pour peupler la base PostgreSQL sur Render
 * SOLUTION DIRECTE: Auto-approuver d'abord puis créer via frontend
 */

console.log('🔧 SOLUTION RAPIDE POUR BASE VIDE')
console.log('')

console.log('📘 PROBLÈME IDENTIFIÉ:')
console.log('✅ Backend Render fonctionne (statut 200)')  
console.log('✅ Endpoint /api/projets/public fonctionne')
console.log('❌ Base PostgreSQL complètement vide (totalInDB: 0)')
console.log('')

console.log('🎯 SOLUTIONS IMMÉDIATES:')
console.log('')

console.log('=== SOLUTION 1: VIA INTERFACE FRONTEND ===')
console.log('1. 🌐 Aller sur: https://jig-projet-ea3m.vercel.app/inscription')
console.log('2. 👤 Créer un compte utilisateur ou admin')  
console.log('3. 📝 Aller sur: https://jig-projet-ea3m.vercel.app/soumettre')
console.log('4. 🚀 Soumettre des projets via le formulaire')
console.log('5. 🔄 Retourner voir /vote pour vérifier')
console.log('')

console.log('=== SOLUTION 2: CRÉATION ADMIN ET PROJETS ===')
console.log('Script pour créer un admin et peupler automatiquement:')
console.log('')

// Script de création d'admin
console.log(`📋 Créer admin (copier dans le navigateur):
fetch('https://jig-projet-1.onrender.com/api/auth/register', {
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
}).then(r => r.json()).then(console.log)`)
console.log('')

console.log(`📋 Puis créer un projet test (après connexion):
fetch('https://jig-projet-1.onrender.com/api/projets/soumettre', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    "titre": "Projet Test JIG2026",
    "description": "Premier projet pour tester l'API et le système de vote",
    "categorie": "WEB_DEVELOPMENT"
  })
}).then(r => r.json()).then(console.log)`)
console.log('')

console.log(`📋 Et enfin auto-approuver:
fetch('https://jig-projet-1.onrender.com/api/projets/auto-approve-all', {
  method: 'POST'
}).then(r => r.json()).then(console.log)`)
console.log('')

console.log('=== VÉRIFICATION ===')
console.log('🔍 Puis vérifier que /api/projets/public retourne les projets:')
console.log('https://jig-projet-1.onrender.com/api/projets/public')
console.log('')

console.log('🚀 Une fois fait, la page vote affichera les projets!')
console.log('📱 Test final: https://jig-projet-ea3m.vercel.app/vote')