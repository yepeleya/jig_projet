import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const files = [
  'src/middlewares/auth.middleware.js',
  'src/services/projet.service.js', 
  'src/services/vote.service.js',
  'src/controllers/contact.controller.js',
  'prisma/seed.js',
  'src/scripts/createAdmin.js',
  'src/scripts/updateAdminPassword.js',
  'src/scripts/fixDates.js',
  'src/dashboardServer.js',
  'src/scripts/createAdminDirect.js'
];

files.forEach(file => {
  try {
    const filePath = resolve(file);
    const content = readFileSync(filePath, 'utf8');
    
    const newContent = content.replace(
      /import\s*\{\s*PrismaClient\s*\}\s*from\s*['"]@prisma\/client['"]/g,
      "import pkg from '@prisma/client';\nconst { PrismaClient } = pkg;"
    );
    
    if (content !== newContent) {
      writeFileSync(filePath, newContent);
      console.log(`✅ Corrigé: ${file}`);
    } else {
      console.log(`⏭️ Déjà correct: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Erreur avec ${file}:`, error.message);
  }
});

console.log('🎉 Correction terminée!');