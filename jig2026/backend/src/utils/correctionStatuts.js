import prisma from "./prismaClient.js";
import { determinerStatutAutomatique, mettreAJourStatutAutomatique } from "./statutProjet.js";

/**
 * Script de correction pour mettre à jour rétroactivement 
 * les statuts des projets déjà évalués
 */
export async function corrigerStatutsProjetsExistants() {
  try {
    console.log("🔄 Début de la correction des statuts des projets existants...");

    // Récupérer tous les projets avec leurs votes et commentaires
    const projets = await prisma.projet.findMany({
      include: {
        votes: {
          where: { juryId: { not: null } }, // Seulement les votes des jurys
          select: { juryId: true, valeur: true, createdAt: true }
        },
        commentaires: {
          select: { juryId: true, contenu: true, createdAt: true }
        }
      }
    });

    let projetsModifies = 0;
    let erreurs = 0;

    for (const projet of projets) {
      try {
        const statutActuel = projet.statut;
        
        // Obtenir les jurys uniques qui ont évalué ce projet
        const jurysAyantVote = [...new Set(projet.votes.map(v => v.juryId))];
        const jurysAyantCommente = [...new Set(projet.commentaires.map(c => c.juryId))];
        const tousLesJurys = [...new Set([...jurysAyantVote, ...jurysAyantCommente])];

        if (tousLesJurys.length === 0) {
          // Aucune évaluation, le projet reste EN_ATTENTE
          continue;
        }

        // Déterminer le nouveau statut basé sur l'évaluation la plus complète
        let nouveauStatut = 'EN_ATTENTE';
        
        // Vérifier s'il y a au moins un jury qui a fait vote + commentaire
        const jurysComplets = jurysAyantVote.filter(juryId => jurysAyantCommente.includes(juryId));
        
        if (jurysComplets.length > 0) {
          nouveauStatut = 'TERMINE';
        } else if (jurysAyantVote.length > 0 || jurysAyantCommente.length > 0) {
          nouveauStatut = 'EVALUE';
        }

        // Mettre à jour seulement si le statut a changé
        if (statutActuel !== nouveauStatut) {
          await prisma.projet.update({
            where: { id: projet.id },
            data: { 
              statut: nouveauStatut,
              updatedAt: new Date()
            }
          });

          console.log(`✅ Projet "${projet.titre}" (ID: ${projet.id}): ${statutActuel} → ${nouveauStatut}`);
          projetsModifies++;
        }

      } catch (error) {
        console.error(`❌ Erreur lors de la correction du projet ${projet.id}:`, error.message);
        erreurs++;
      }
    }

    console.log(`🎉 Correction terminée !`);
    console.log(`📊 Projets modifiés: ${projetsModifies}`);
    console.log(`⚠️ Erreurs: ${erreurs}`);
    console.log(`📋 Total projets traités: ${projets.length}`);

    return {
      projetsTraites: projets.length,
      projetsModifies,
      erreurs
    };

  } catch (error) {
    console.error("❌ Erreur lors de la correction des statuts:", error);
    throw error;
  }
}

/**
 * Affiche un résumé des statuts actuels des projets
 */
export async function afficherResumeStatuts() {
  try {
    const statutsCount = await prisma.projet.groupBy({
      by: ['statut'],
      _count: {
        statut: true
      }
    });

    console.log("📊 Résumé des statuts actuels:");
    statutsCount.forEach(({ statut, _count }) => {
      console.log(`   ${statut}: ${_count.statut} projet(s)`);
    });

    return statutsCount;
  } catch (error) {
    console.error("Erreur lors de l'affichage du résumé:", error);
    throw error;
  }
}