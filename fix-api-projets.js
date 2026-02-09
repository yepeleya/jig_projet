/**
 * Script pour diagnostiquer et corriger l'API projets/public
 * 1. Vérifie les projets en base
 * 2. Auto-approuve tous les projets EN_ATTENTE 
 * 3. Test l'endpoint /projets/public
 */

// Configuration
const BACKEND_URL = 'https://jig-projet-1.onrender.com'

// Test de l'état actuel des projets
async function checkProjetsStatus() {
  console.log('🔍 Vérification du statut des projets...')
  try {
    const response = await fetch(`${BACKEND_URL}/api/projets/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('📊 Résultat API projets/public:', data)
      console.log(`📈 Projets publics retournés: ${data.data?.length || 0}`)
      
      if (data.debug) {
        console.log(`📋 Debug info:
          - Total en BDD: ${data.debug.totalInDB}
          - Approuvés: ${data.debug.approved}  
          - Retournés: ${data.debug.returned}`)
      }
      
      return data
    } else {
      console.log('❌ Erreur API projets/public:', response.status, response.statusText)
      return null
    }
  } catch (error) {
    console.error('❌ Erreur connexion API:', error.message)
    return null
  }
}

// Auto-approuver tous les projets en attente
async function autoApproveProjets() {
  console.log('🚀 Auto-approbation des projets en attente...')
  try {
    const response = await fetch(`${BACKEND_URL}/api/projets/auto-approve-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Auto-approbation réussie:', data)
      return data
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.log('❌ Erreur auto-approbation:', response.status, errorData)
      return null
    }
  } catch (error) {
    console.error('❌ Erreur auto-approbation:', error.message)
    return null
  }
}

// Script principal
async function fixProjetsAPI() {
  console.log('🔧 DIAGNOSTIC ET CORRECTION API PROJETS PUBLIC\n')
  
  // 1. Vérifier l'état actuel
  console.log('=== ÉTAPE 1: DIAGNOSTIC ===')
  const statusBefore = await checkProjetsStatus()
  console.log('')
  
  // 2. Si aucun projet public, auto-approuver
  if (statusBefore && statusBefore.data?.length === 0) {
    console.log('=== ÉTAPE 2: AUTO-APPROBATION ===')
    const approveResult = await autoApproveProjets()
    console.log('')
    
    if (approveResult && approveResult.success) {
      // 3. Revérifier après approbation
      console.log('=== ÉTAPE 3: VÉRIFICATION POST-CORRECTION ===')
      const statusAfter = await checkProjetsStatus()
      console.log('')
      
      if (statusAfter && statusAfter.data?.length > 0) {
        console.log('🎉 SUCCÈS: L\'API projets/public fonctionne maintenant!')
        console.log(`✅ ${statusAfter.data.length} projets sont maintenant visibles pour le vote`)
      } else {
        console.log('⚠️  Problème persiste - vérifiez manuellement les statuts en base')
      }
    }
  } else if (statusBefore && statusBefore.data?.length > 0) {
    console.log('✅ L\'API fonctionne déjà correctement!')
    console.log(`📊 ${statusBefore.data.length} projets publics disponibles`)
  }
  
  console.log('\n🎯 RÉSUMÉ:')
  console.log('- Si des projets sont maintenant visibles → Problème résolu')
  console.log('- Si toujours aucun projet → Vérifiez qu\'il y a des projets en base')
  console.log('- L\'endpoint /projets/public devrait maintenant fonctionner pour la page vote')
}

// Exécution
fixProjetsAPI().catch(console.error)