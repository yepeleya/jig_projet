import prisma from "./prismaClient.js";

/**
 * Détermine automatiquement le statut d'un projet basé sur l'évaluation du jury
 * @param {number} projetId - ID du projet
 * @param {number} juryId - ID du jury qui évalue
 * @returns {Promise<string>} - Nouveau statut du projet
 */
export async function determinerStatutAutomatique(projetId, juryId) {
  try {
    // Vérifier si le jury a voté pour ce projet
    const voteExistant = await prisma.vote.findFirst({
      where: {
        projetId: projetId,
        juryId: juryId
      }
    });

    // Vérifier si le jury a commenté ce projet
    const commentaireExistant = await prisma.commentaire.findFirst({
      where: {
        projetId: projetId,
        juryId: juryId
      }
    });

    // Logique de détermination du statut
    if (voteExistant && commentaireExistant) {
      // Le jury a voté ET commenté → Évaluation complète
      return 'TERMINE';
    } else if (voteExistant || commentaireExistant) {
      // Le jury a voté OU commenté → Évaluation partielle
      return 'EVALUE';
    } else {
      // Aucune évaluation → reste en attente
      return 'EN_ATTENTE';
    }
  } catch (error) {
    console.error('Erreur lors de la détermination du statut:', error);
    return 'EN_ATTENTE'; // Statut par défaut en cas d'erreur
  }
}

/**
 * Met à jour automatiquement le statut d'un projet après une action du jury
 * @param {number} projetId - ID du projet
 * @param {number} juryId - ID du jury
 * @returns {Promise<string>} - Nouveau statut appliqué
 */
export async function mettreAJourStatutAutomatique(projetId, juryId) {
  try {
    const nouveauStatut = await determinerStatutAutomatique(projetId, juryId);
    
    // Mettre à jour le statut du projet
    const projetMisAJour = await prisma.projet.update({
      where: { id: projetId },
      data: { 
        statut: nouveauStatut,
        updatedAt: new Date()
      }
    });

    console.log(`✅ Statut projet ${projetId} mis à jour automatiquement: ${nouveauStatut}`);
    return nouveauStatut;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour automatique du statut:', error);
    throw error;
  }
}

/**
 * Obtient un résumé de l'état d'évaluation d'un projet par tous les jurys
 * @param {number} projetId - ID du projet
 * @returns {Promise<Object>} - Résumé des évaluations
 */
export async function obtenirResumeEvaluation(projetId) {
  try {
    const votes = await prisma.vote.findMany({
      where: { projetId: projetId },
      include: { jury: { select: { nom: true, prenom: true } } }
    });

    const commentaires = await prisma.commentaire.findMany({
      where: { projetId: projetId },
      include: { jury: { select: { nom: true, prenom: true } } }
    });

    const jurysAyantVote = votes.map(v => v.juryId);
    const jurysAyantCommente = commentaires.map(c => c.juryId);
    const jurysAyantToutFait = jurysAyantVote.filter(id => jurysAyantCommente.includes(id));

    return {
      totalVotes: votes.length,
      totalCommentaires: commentaires.length,
      jurysComplets: jurysAyantToutFait.length,
      moyenneVotes: votes.length > 0 ? votes.reduce((sum, v) => sum + v.valeur, 0) / votes.length : 0
    };
  } catch (error) {
    console.error('Erreur lors de l\'obtention du résumé d\'évaluation:', error);
    throw error;
  }
}