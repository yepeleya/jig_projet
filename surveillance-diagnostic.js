// 🔍 SURVEILLANCE DIAGNOSTIC RENDER
// =================================

console.log(`
🎯 VERSION DIAGNOSTIC DÉPLOYÉE !
===============================

🔧 Commit: 781bf7e
🎯 Objectif: Identifier le problème de build Render

📊 CETTE VERSION CONTIENT:
- Backend minimal (juste Express + CORS)
- Script diagnostic complet
- Logs détaillés BUILD + RUNTIME
- Variables d'environnement exposées
- Health checks basiques

⏱️ RENDER VA REDÉPLOYER...
=========================`);

// Script surveillance diagnostic
const surveillanceDiagnostic = `
//  ========= SURVEILLANCE DIAGNOSTIC RENDER =========
console.log("🔍 Surveillance version diagnostic...");

let attempts = 0;
const maxAttempts = 20; // 10 minutes

function checkDiagnostic() {
  attempts++;
  console.log(\`🔄 Check \${attempts}/\${maxAttempts} - Diagnostic Render...\`);
  
  // Test simple d'abord
  fetch("https://jig-projet-1.onrender.com/")
    .then(r => r.json())
    .then(data => {
      console.log("⭐ RENDER DIAGNOSTIC ACTIF!");
      console.log("📊 Infos:", data);
      
      if(data.version === "DIAGNOSTIC_1.0") {
        console.log("✅ Version diagnostic confirmée");
        
        // Test route diagnostic détaillée
        return fetch("https://jig-projet-1.onrender.com/api/test");
      } else {
        console.log("⚠️ Version inattendue:", data.version);
        return null;
      }
    })
    .then(r => r ? r.json() : null)
    .then(diagnosticData => {
      if(diagnosticData) {
        console.log("🔍 DIAGNOSTIC COMPLET:");
        console.log("=".repeat(40));
        console.log(JSON.stringify(diagnosticData, null, 2));
        console.log("=".repeat(40));
        
        // Analyser les résultats
        const { env } = diagnosticData;
        
        if(!env.database_url_present) {
          console.log("❌ PROBLÈME IDENTIFIÉ: DATABASE_URL manquante");
          console.log("💡 SOLUTION: Ajouter DATABASE_URL sur Render Dashboard");
          console.log("🔗 https://dashboard.render.com → Service → Environment Variables");
        }
        
        if(!env.jwt_secret_present) {
          console.log("❌ PROBLÈME IDENTIFIÉ: JWT_SECRET manquante");
          console.log("💡 SOLUTION: Ajouter JWT_SECRET sur Render Dashboard");
        }
        
        if(env.database_url_present && env.jwt_secret_present) {
          console.log("✅ Variables env OK - Problème ailleurs");
          console.log("🔄 Peut réactiver version complète");
        } else {
          console.log("🎯 SOLUTION PRIORITAIRE:");
          console.log("1. Dashboard Render → Environment Variables");
          console.log("2. Ajouter DATABASE_URL (PostgreSQL connection string)");
          console.log("3. Ajouter JWT_SECRET (random string)");
          console.log("4. Redéployer");
        }
        
        showDiagnosticResults(env);
      }
    })
    .catch(e => {
      if(attempts <= maxAttempts) {
        console.log(\`⏳ Build/Deploy en cours... Retry in 30s (\${attempts})\`);
        
        if(attempts === 10) {
          console.log("💡 Si le problème persiste:");
          console.log("📋 Vérifier https://dashboard.render.com logs");
          console.log("🔧 Possibles causes: Variables env, Node version, dépendances");
        }
        
        setTimeout(checkDiagnostic, 30000);
      } else {
        console.log("❌ TIMEOUT - Vérifier manuellement:");
        console.log("🔗 Render Dashboard: https://dashboard.render.com");
        console.log("📋 Build Logs pour erreur détaillée");
      }
    });
}

function showDiagnosticResults(env) {
  const notification = document.createElement('div');
  notification.style.cssText = \`
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    background: \${env.database_url_present && env.jwt_secret_present ? '#10b981' : '#f59e0b'};
    color: white; padding: 20px; border-radius: 8px; max-width: 400px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3); font-weight: bold;
  \`;
  
  if(env.database_url_present && env.jwt_secret_present) {
    notification.innerHTML = \`
      🎉 DIAGNOSTIC TERMINÉ!<br/>
      ✅ Variables d'env OK<br/>
      🔄 Peut réactiver backend complet
    \`;
  } else {
    const missing = [];
    if(!env.database_url_present) missing.push('DATABASE_URL');
    if(!env.jwt_secret_present) missing.push('JWT_SECRET');
    
    notification.innerHTML = \`
      🔍 DIAGNOSTIC: VARIABLES MANQUANTES<br/>
      ❌ \${missing.join(', ')}<br/>
      💡 Ajouter sur Render Dashboard
    \`;
  }
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 10000);
}

// Démarrer diagnostic
checkDiagnostic();
`;

console.log("🧪 CODE SURVEILLANCE DIAGNOSTIC:");
console.log("===============================");
console.log(surveillanceDiagnostic);

console.log(`
📋 INSTRUCTIONS DIAGNOSTIC:

1. 🌐 https://jig-projet-ea3m.vercel.app → F12 Console
2. 📋 Copier le code ci-dessus  
3. ▶️ Entrer pour lancer diagnostic
4. ⏱️ Attendre analyse complète (max 10 min)
5. 📊 Voir résultats détaillés

📊 RÉSULTATS POSSIBLES:

✅ "Variables d'env OK" = Réactiver version complète
❌ "DATABASE_URL manquante" = Ajouter sur Render Dashboard  
❌ "JWT_SECRET manquante" = Ajouter sur Render Dashboard
⏳ "Build en cours" = Attendre déploiement

🎯 APRÈS DIAGNOSTIC:
Une fois les variables ajoutées, je pourrai réactiver le backend complet
avec toutes les routes API fonctionnelles.

💪 CETTE APPROCHE GARANTIT LA RÉUSSITE !
`);