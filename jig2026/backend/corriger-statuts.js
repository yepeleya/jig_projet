import { corrigerStatutsProjetsExistants, afficherResumeStatuts } from './src/utils/correctionStatuts.js';

console.log("🚀 Script de correction des statuts des projets");
console.log("===============================================");

async function executerCorrection() {
  try {
    // Afficher l'état actuel
    console.log("\n📊 État AVANT correction:");
    await afficherResumeStatuts();
    
    // Exécuter la correction
    console.log("\n🔄 Lancement de la correction...");
    const resultat = await corrigerStatutsProjetsExistants();
    
    // Afficher l'état après correction
    console.log("\n📊 État APRÈS correction:");
    await afficherResumeStatuts();
    
    console.log("\n🎉 Correction terminée avec succès !");
    console.log(`📈 Résultat: ${resultat.projetsModifies} projet(s) modifié(s) sur ${resultat.projetsTraites} traité(s)`);
    
    if (resultat.erreurs > 0) {
      console.log(`⚠️ ${resultat.erreurs} erreur(s) rencontrée(s)`);
    }
    
  } catch (error) {
    console.error("❌ Erreur lors de l'exécution:", error);
  } finally {
    process.exit(0);
  }
}

executerCorrection();