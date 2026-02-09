/**
 * Script d'urgence pour auto-approuver les projets EN_ATTENTE
 * À exécuter UNE SEULE FOIS après redéploiement backend
 */

async function autoApprouverProjets() {
  console.log('🚀 Démarrage auto-approbation...')
  
  try {
    const response = await fetch('https://jig-projet-1.onrender.com/api/projets/auto-approve-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const result = await response.json()
    console.log('✅ Résultat:', result)
    
    if (result.success) {
      console.log(`🎉 ${result.count} projets approuvés automatiquement`)
      console.log('✅ Vous devriez maintenant voir les projets sur:')
      console.log('  - https://jig-projet-ea3m.vercel.app/voter')
      console.log('  - https://jig-projet-ea3m.vercel.app/mes-projets')
    } else {
      console.error('❌ Erreur:', result.error)
    }
  } catch (error) {
    console.error('❌ Erreur réseau:', error)
  }
}

// Attendre 3 minutes puis exécuter
setTimeout(() => {
  console.log('⏰ 3 minutes écoulées, lancement auto-approbation...')
  autoApprouverProjets()
}, 3 * 60 * 1000)

console.log('⏱️ Script configuré - auto-approbation dans 3 minutes...')
console.log('💡 Ou exécutez autoApprouverProjets() manuellement')