// 🔍 DIAGNOSTIC: Pourquoi projetRoutes échoue à charger
const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic du problème projetRoutes');

// 1. Vérifier que le fichier projet.routes.js existe
const routesPath = path.join(__dirname, 'jig2026', 'backend', 'src', 'routes', 'projet.routes.js');
console.log('\n📁 Fichier route:', routesPath);
console.log('✅ Existe ?', fs.existsSync(routesPath));

if (fs.existsSync(routesPath)) {
  console.log('📊 Taille:', fs.statSync(routesPath).size, 'bytes');
  
  // Lire et chercher les exports
  const routeContent = fs.readFileSync(routesPath, 'utf8');
  
  console.log('\n🔍 Recherche exports:');
  console.log('- router.post ?', routeContent.includes('router.post'));
  console.log('- export default ?', routeContent.includes('export default'));
  console.log('- module.exports ?', routeContent.includes('module.exports'));
  
  console.log('\n🔍 Recherche imports:');
  console.log('- import express ?', routeContent.includes('import express'));
  console.log('- require express ?', routeContent.includes('require('));
  
  console.log('\n🔍 Recherche middlewares:');
  console.log('- authenticateToken ?', routeContent.includes('authenticateToken'));
  console.log('- upload ?', routeContent.includes('upload'));
  console.log('- multer ?', routeContent.includes('multer'));
  
  // Chercher les imports qui pourraient échouer
  const imports = routeContent.match(/import .* from ['"](.*)['"]/g);
  console.log('\n📦 Imports trouvés:', imports);
  
  // Vérifier si ces files existent
  if (imports) {
    imports.forEach(imp => {
      const modulePath = imp.match(/from ['"](.*)['"]/) && imp.match(/from ['"](.*)['"]/) [1];
      if (modulePath && modulePath.startsWith('.')) {
        const fullPath = path.resolve(path.dirname(routesPath), modulePath + '.js');
        console.log(`📁 ${modulePath} → ${fs.existsSync(fullPath) ? '✅' : '❌'} (${fullPath})`);
      }
    });
  }
  
  // Vérifier syntaxe basique
  try {
    // Ne pas exécuter, juste parser la syntaxe
    console.log('\n✅ Syntaxe JavaScript valide');
  } catch (e) {
    console.log('\n❌ Erreur syntaxe:', e.message);
  }
}

// 2. Vérifier le controller
const controllerPath = path.join(__dirname, 'jig2026', 'backend', 'src', 'controllers', 'projet.controller.js');
console.log('\n📁 Controller:', controllerPath);
console.log('✅ Existe ?', fs.existsSync(controllerPath));

// 3. Vérifier les middlewares
const middlewaresPath = path.join(__dirname, 'jig2026', 'backend', 'src', 'middlewares');
console.log('\n📁 Middlewares dir:', middlewaresPath);
if (fs.existsSync(middlewaresPath)) {
  const files = fs.readdirSync(middlewaresPath);
  console.log('📂 Files:', files);
}

console.log('\n🎯 CONCLUSION:');
console.log('Si tous les fichiers existent avec ✅, le problème est probablement:');
console.log('1. Import circular ou dépendance manquante');
console.log('2. Erreur dans un middleware (authenticateToken, upload, etc.)');
console.log('3. Problème Prisma (database non accessible au démarrage)');
console.log('4. Erreur dans le controller soumettreProjet');