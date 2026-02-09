#!/usr/bin/env node

/**
 * 🔧 Diagnostic Backend - Routes 404 sur Render
 * Vérifie pourquoi toutes les routes /api/projets retournent 404
 */

console.log('🔧 DIAGNOSTIC BACKEND - Routes 404');
console.log('==================================');

console.log('❌ PROBLÈME IDENTIFIÉ:');
console.log('  • /api/projets/soumettre → 404');
console.log('  • /api/projets → 404');  
console.log('  • Tous les fallbacks échouent');
console.log('');

console.log('🔍 CAUSES POSSIBLES:');
console.log('  1. Erreur import prismaClient.js sur Render');
console.log('  2. Variables env manquantes → serveur crash');
console.log('  3. Routes projets non chargées à cause d\'erreur');
console.log('  4. Ancienne version déployée sans corrections');
console.log('');

console.log('✅ SOLUTIONS À APPLIQUER:');

// Solution 1: Sécuriser les imports Prisma
console.log('1. 🛠️ SÉCURISER IMPORTS PRISMA');
console.log('   Problème: Si prismaClient.js fails → routes ne se chargent pas');
console.log('   Solution: Try/catch sur les imports critiques');
console.log('');

// Solution 2: Créer route simple de test
console.log('2. 🧪 ROUTE DE TEST SIMPLE');
console.log('   Ajouter une route /health-projets simple');
console.log('   Pour diagnostiquer si le problème est Prisma ou routes');
console.log('');

// Solution 3: Vérifier les logs Render
console.log('3. 📊 VÉRIFICATION LOGS RENDER');
console.log('   URL logs: https://dashboard.render.com/');
console.log('   Chercher: "Error loading routes" ou erreurs Prisma');
console.log('');

console.log('🚀 FIXES À APPLIQUER:');

console.log(`
1. IMPORT SÉCURISÉ PRISMA (projet.controller.js):
   
// ❌ AVANT: Import direct qui peut faire crash
import prisma from "../utils/prismaClient.js";

// ✅ APRÈS: Import avec fallback
let prisma = null;
try {
  const prismaModule = await import("../utils/prismaClient.js");
  prisma = prismaModule.default;
  console.log('✅ Prisma chargé avec succès');
} catch (error) {
  console.error('❌ Erreur Prisma:', error.message);
  // Utiliser un mock ou skip les routes
}

2. ROUTE HEALTH SIMPLE (projet.routes.js):

router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Routes projets OK',
    timestamp: new Date().toISOString()
  });
});

3. GESTION D'ERREURS IMPORTS (index.js):

try {
  app.use("/api/projets", projetRoutes);
  console.log('✅ Routes projets chargées');
} catch (error) {
  console.error('❌ Erreur routes projets:', error);
  // Route de secours
  app.use("/api/projets", (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Service temporairement indisponible'
    });
  });
}
`);

console.log('🎯 TEST IMMÉDIAT:');
console.log('');
console.log('Code à exécuter dans la console navigateur:');
console.log(`
// Test health check backend
fetch('https://jig-projet-1.onrender.com/health')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Backend global:', data);
    
    // Test spécifique routes projets
    return fetch('https://jig-projet-1.onrender.com/api/projets/health');
  })
  .then(r => r.json())
  .then(data => console.log('✅ Routes projets:', data))
  .catch(e => console.log('❌ Erreur routes projets - Confirme le diagnostic'));
`);

console.log('💡 DIAGNOSTIC RAPIDE:');
console.log('  • Si /health fonctionne → Problème spécifique aux routes projets');
console.log('  • Si /health échoue → Backend totalement down');
console.log('  • Si erreurs Prisma dans logs → Problème DATABASE_URL');
console.log('');

console.log('⚡ ACTION PRIORITAIRE:');
console.log('  1. Vérifier logs Render pour erreurs import');
console.log('  2. Appliquer les fixes d\'import sécurisé');  
console.log('  3. Ajouter route health pour debug');
console.log('  4. Push + redéployer backend');
console.log('');

console.log('📋 Si le problème persiste:');
console.log('  → Utiliser indexFixed.js comme serveur principal');
console.log('  → Ou créer routes projet simplifiées sans Prisma complexe');