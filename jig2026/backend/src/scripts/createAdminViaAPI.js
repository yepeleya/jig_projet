// Script pour créer un utilisateur admin via l'API
// Usage: node src/scripts/createAdminViaAPI.js

import fetch from 'node-fetch';

async function createAdminUser() {
  try {
    console.log('🔄 Création d\'un utilisateur admin via l\'API...');
    
    const userData = {
      nom: 'Super',
      prenom: 'Admin',
      email: 'superadmin@jig2026.ci',
      motDePasse: 'superadmin123',
      role: 'ADMIN',
      telephone: '+225 01 02 03 04 05'
    };

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('🎉 Utilisateur admin créé avec succès !');
      console.log('📧 Email:', result.data.user.email);
      console.log('👤 Rôle:', result.data.user.role);
      console.log('🔑 Token:', result.data.token);
      console.log('ℹ️  Le mot de passe a été automatiquement haché');
      console.log('📅 Les dates ont été automatiquement définies');
    } else {
      console.log('❌ Erreur lors de la création:', result);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createAdminUser();