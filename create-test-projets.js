/**
 * Script pour créer des projets de test dans la base PostgreSQL
 * Résout le problème de base vide qui cause l'API projets/public à retourner []
 */

// Configuration  
const BACKEND_URL = 'https://jig-projet-1.onrender.com'

// Projets de test à créer
const projetsTest = [
  {
    titre: "Système de gestion intelligent",
    description: "Application web pour optimiser la gestion des ressources universitaires avec tableaux de bord en temps réel.",
    categorie: "WEB_DEVELOPMENT"
  },
  {
    titre: "Assistant IA pour l'apprentissage",
    description: "Chatbot éducatif utilisant l'IA pour personnaliser l'apprentissage de chaque étudiant selon son niveau.",
    categorie: "INTELLIGENCE_ARTIFICIELLE" 
  },
  {
    titre: "Application mobile éco-responsable",
    description: "App mobile pour promouvoir les pratiques durables avec système de points et challenges communautaires.",
    categorie: "MOBILE_DEVELOPMENT"
  },
  {
    titre: "Plateforme de collaboration virtuelle",
    description: "Outil collaboratif avec espaces de travail virtuels, vidéoconférence intégrée et gestion de projets.",
    categorie: "WEB_DEVELOPMENT"
  },
  {
    titre: "Système de réalité augmentée éducative",
    description: "Application AR pour apprentissage immersif des sciences avec modèles 3D interactifs.",
    categorie: "REALITE_AUGMENTEE"
  }
]

// Créer un utilisateur test si nécessaire
async function createTestUser() {
  console.log('👤 Création d\'un utilisateur test...')
  try {
    const userData = {
      nom: "TestUser",
      prenom: "Demo", 
      email: `demo-test-${Date.now()}@example.com`,
      motDePasse: "Test123!",
      role: "STUDENT",
      ecole: "École Test",
      filiere: "Informatique",
      niveau: "Master"
    }
    
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Utilisateur test créé:', result.user?.email)
      return result.token
    } else {
      console.log('⚠️  Utilisateur test non créé (probablement déjà existant)')
      return null
    }
  } catch (error) {
    console.error('❌ Erreur création utilisateur:', error.message)
    return null
  }
}

// Se connecter avec des identifiants admin par défaut
async function getAdminToken() {
  console.log('🔐 Tentative de connexion admin...')
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "admin@jig2026.fr",
        motDePasse: "Admin123!"
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Connexion admin réussie')
      return result.token
    } else {
      console.log('⚠️  Connexion admin échouée, utilisation user test')
      return await createTestUser()
    }
  } catch (error) {
    console.error('❌ Erreur connexion admin:', error.message)
    return await createTestUser()
  }
}

// Créer un projet de test
async function createProjet(projetData, token) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/projets/soumettre`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projetData)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Projet créé: "${projetData.titre}"`)
      return result.data
    } else {
      const error = await response.text()
      console.log(`❌ Erreur création projet "${projetData.titre}":`, error)
      return null
    }
  } catch (error) {
    console.error(`❌ Erreur réseau projet "${projetData.titre}":`, error.message)
    return null
  }
}

// Approuver tous les projets
async function approveAllProjects() {
  console.log('🚀 Approbation de tous les projets...')
  try {
    const response = await fetch(`${BACKEND_URL}/api/projets/auto-approve-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log(`✅ ${result.count} projets approuvés automatiquement`)
      return true
    } else {
      console.log('❌ Erreur approbation:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Erreur approbation:', error.message)
    return false
  }
}

// Vérifier le résultat final
async function checkFinalResult() {
  console.log('🔍 Vérification finale de l\'API projets/public...')
  try {
    const response = await fetch(`${BACKEND_URL}/api/projets/public`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`🎉 API projets/public retourne maintenant ${data.data?.length || 0} projets`)
      return data.data?.length || 0
    } else {
      console.log('❌ API toujours en erreur')
      return 0
    }
  } catch (error) {
    console.error('❌ Erreur vérification finale:', error.message)
    return 0
  }
}

// Script principal
async function populateDatabase() {
  console.log('🔧 PEUPLEMENT DE LA BASE DE DONNÉES\n')
  
  // 1. Obtenir un token d'authentification
  console.log('=== ÉTAPE 1: AUTHENTIFICATION ===')
  const token = await getAdminToken()
  
  if (!token) {
    console.log('❌ ÉCHEC: Impossible d\'obtenir un token d\'authentification')
    return
  }
  console.log('')
  
  // 2. Créer les projets de test
  console.log('=== ÉTAPE 2: CRÉATION DES PROJETS ===')
  let createdCount = 0
  
  for (const projetData of projetsTest) {
    const result = await createProjet(projetData, token)
    if (result) {
      createdCount++
    }
    await new Promise(resolve => setTimeout(resolve, 500)) // Pause entre requêtes
  }
  
  console.log(`📊 ${createdCount} projets créés avec succès`)
  console.log('')
  
  // 3. Approuver tous les projets
  console.log('=== ÉTAPE 3: APPROBATION AUTOMATIQUE ===')
  await approveAllProjects()
  console.log('')
  
  // 4. Vérification finale
  console.log('=== ÉTAPE 4: VÉRIFICATION FINALE ===')
  const finalCount = await checkFinalResult()
  console.log('')
  
  if (finalCount > 0) {
    console.log('🎉 SUCCÈS COMPLET!')
    console.log(`✅ L'API /projets/public retourne maintenant ${finalCount} projets`)
    console.log('✅ La page vote devrait maintenant afficher les projets')
    console.log('✅ Le problème de tableau vide est résolu')
  } else {
    console.log('⚠️  Le problème persiste - investigation manuelle nécessaire')
  }
}

// Exécution
populateDatabase().catch(console.error)