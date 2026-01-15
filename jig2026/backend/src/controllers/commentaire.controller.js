import { CommentaireService } from "../services/commentaire.service.js";
import { mettreAJourStatutAutomatique } from "../utils/statutProjet.js";
import ProjetSuiviService from "../services/projet-suivi.service.js";

/**
 * Le jury ajoute un commentaire sur un projet.
 */
export const ajouterCommentaire = async (req, res) => {
  try {
    const { contenu, projetId, juryId } = req.body;

    const commentaire = await CommentaireService.createCommentaire({
      contenu,
      projetId,
      juryId
    });

    // Ajouter automatiquement au suivi du projet
    if (commentaire.success && juryId && projetId) {
      try {
        await ProjetSuiviService.ajouterSuiviCommentaire(
          parseInt(projetId),
          parseInt(juryId),
          contenu
        );
        console.log('✅ Suivi commentaire ajouté automatiquement');
      } catch (suiviError) {
        console.error('⚠️ Erreur ajout suivi commentaire (non bloquante):', suiviError.message);
      }
    }

    // Mettre à jour automatiquement le statut du projet
    if (juryId && projetId) {
      try {
        const nouveauStatut = await mettreAJourStatutAutomatique(parseInt(projetId), parseInt(juryId));
        console.log(`🔄 Statut projet mis à jour automatiquement après commentaire: ${nouveauStatut}`);
      } catch (statutError) {
        console.error('⚠️ Erreur mise à jour statut (non bloquante):', statutError.message);
        // Ne pas faire échouer le commentaire pour un problème de statut
      }
    }

    res.status(201).json({
      success: true,
      data: commentaire
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * Récupérer tous les commentaires
 */
export const getCommentaires = async (req, res) => {
  try {
    const commentaires = await CommentaireService.getAllCommentaires();
    res.json({
      success: true,
      data: commentaires
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * Récupérer les commentaires liés à un projet
 */
export const getCommentairesByProjet = async (req, res) => {
  try {
    const projetId = parseInt(req.params.projetId);
    const commentaires = await CommentaireService.getCommentairesByProjet(projetId);
    res.json({
      success: true,
      data: commentaires
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};