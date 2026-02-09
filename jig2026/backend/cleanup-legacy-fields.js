// Script de nettoyage automatique des champs inexistants dans le backend
// À exécuter pour corriger toutes les références aux champs non-existants

const fs = require('fs');
const path = require('path');

// Champs à supprimer de tous les select/references
const CHAMPS_INEXISTANTS = ['ecole', 'filiere', 'niveau', 'specialite'];

// Fichiers à traiter
const FILES_TO_CLEAN = [
  'src/controllers/projet.controller.js',
  'src/controllers/admin.controller.js', 
  'src/controllers/classement.controller.js',
  'src/routes/projet.routes.js',
  'src/services/notification.service.js'
];

function cleanFile(filePath) {
  console.log(`🧹 Nettoyage: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Supprimer les propriétés des select Prisma
  CHAMPS_INEXISTANTS.forEach(champ => {
    // Patterns à rechercher et supprimer
    const patterns = [
      new RegExp(`\\s*${champ}:\\s*true,?\\s*`, 'g'),
      new RegExp(`\\s*${champ}ld\\s*,\\s*`, 'g'),
      new RegExp(`\\s*user\\.${champ}[^,;\\n]*[,;]?`, 'g'),
      new RegExp(`\\s*projet\\.user\\?\\.${champ}[^,;\\n]*[,;]?`, 'g')
    ];
    
    patterns.forEach(pattern => {
      const before = content.length;
      content = content.replace(pattern, '');
      if (content.length !== before) {
        modified = true;
        console.log(`  ✅ Supprimé références à: ${champ}`);
      }
    });
  });

  // Sauvegarder si modifié
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Fichier sauvegardé: ${filePath}`);
  } else {
    console.log(`  ⚪ Aucune modification nécessaire: ${filePath}`);
  }
}

// Exécuter le nettoyage
console.log('🚀 Début du nettoyage automatique des champs inexistants...');

FILES_TO_CLEAN.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    try {
      cleanFile(fullPath);
    } catch (error) {
      console.error(`❌ Erreur lors du traitement de ${file}:`, error);
    }
  } else {
    console.log(`⚠️  Fichier non trouvé: ${fullPath}`);
  }
});

console.log('✅ Nettoyage terminé !');