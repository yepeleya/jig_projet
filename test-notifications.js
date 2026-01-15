const API_BASE = 'http://localhost:5000/api';

// Fonction utilitaire pour faire des requêtes HTTP
async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Fonction pour créer des notifications de test
async function createTestNotifications() {
  console.log('🧪 Création de notifications de test...\n');

  const testNotifications = [
    {
      type: 'NEW_USER',
      title: 'Nouvel utilisateur inscrit',
      message: 'Jean Dupont s\'est inscrit sur la plateforme',
      entityId: '1',
      entityType: 'user'
    },
    {
      type: 'NEW_PROJET',
      title: 'Nouveau projet soumis',
      message: 'Le projet "Innovation IA" a été soumis par l\'équipe TechStars',
      entityId: '1',
      entityType: 'projet'
    },
    {
      type: 'NEW_VOTE',
      title: 'Nouveau vote',
      message: 'Un jury a voté pour le projet "EcoTech Solutions"',
      entityId: '1',
      entityType: 'vote'
    },
    {
      type: 'NEW_JURY',
      title: 'Nouveau jury ajouté',
      message: 'Marie Martin a été ajoutée comme membre du jury',
      entityId: '1',
      entityType: 'jury'
    },
    {
      type: 'NEW_CONTACT',
      title: 'Nouveau message de contact',
      message: 'Une nouvelle demande de contact a été reçue de la société ABC Corp',
      entityId: '1',
      entityType: 'contact'
    },
    {
      type: 'PROJECT_APPROVED',
      title: 'Projet approuvé',
      message: 'Le projet "GreenTech Innovation" a été approuvé par l\'administration',
      entityId: '2',
      entityType: 'projet'
    }
  ];

  try {
    for (const notification of testNotifications) {
      const response = await makeRequest(`${API_BASE}/notifications`, {
        method: 'POST',
        body: JSON.stringify(notification)
      });
      console.log(`✅ Notification créée: ${notification.title}`);
    }
    
    console.log('\n🎉 Toutes les notifications de test ont été créées !');
    console.log('📱 Vous pouvez maintenant les voir dans le Dashboard');
    
    // Afficher le nombre de notifications non lues
    const unreadResponse = await makeRequest(`${API_BASE}/notifications/unread-count`);
    console.log(`📊 Nombre de notifications non lues: ${unreadResponse.count}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des notifications:', error.message);
  }
}

// Fonction pour tester l'API des notifications
async function testNotificationAPI() {
  console.log('🔍 Test de l\'API des notifications...\n');
  
  try {
    // Test de récupération des notifications
    const response = await makeRequest(`${API_BASE}/notifications`);
    console.log(`✅ GET /notifications - ${response.notifications.length} notifications récupérées`);
    
    // Test du compteur
    const countResponse = await makeRequest(`${API_BASE}/notifications/unread-count`);
    console.log(`✅ GET /notifications/unread-count - ${countResponse.count} non lues`);
    
    console.log('\n🎉 API des notifications fonctionne correctement !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test de l\'API:', error.message);
  }
}

// Exécution du script
async function main() {
  console.log('🚀 Lancement des tests de notifications\n');
  
  await testNotificationAPI();
  console.log('\n' + '='.repeat(50) + '\n');
  await createTestNotifications();
  
  console.log('\n📋 Instructions:');
  console.log('1. Ouvrez votre Dashboard: http://localhost:3001');
  console.log('2. Connectez-vous en tant qu\'admin');
  console.log('3. Cliquez sur l\'icône 🔔 en haut à droite');
  console.log('4. Testez les fonctionnalités: marquer comme lu, supprimer, etc.');
}

main().catch(console.error);