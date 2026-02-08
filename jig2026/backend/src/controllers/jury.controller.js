import { VoteService } from '../services/vote.service.js'
import { CommentaireService } from '../services/commentaire.service.js'
import prisma from "../utils/prismaClient.js";

export class JuryController {
  // Récupérer les votes d'un jury (maintenant tous les utilisateurs sont dans User)
  static async getMyVotes(req, res, next) {
    try {
      const userId = req.user.id
      const userRole = req.user.role
      
      // Vérifier que l'utilisateur a des permissions de jury
      const rolesJury = ['JURY', 'EXPERT', 'ORGANISATEUR', 'ADMIN']
      if (!rolesJury.includes(userRole)) {
        return res.status(403).json({
          success: false,
          error: "Accès refusé - permissions de jury requises"
        })
      }
      
      // Tous les votes sont maintenant liés à userId dans la table User unifiée
      const votes = await VoteService.getVotesByUserId(userId)
      
      res.json({
        success: true,
        data: votes
      })
    } catch (error) {
      next(error)
    }
  }

  // Mettre à jour le statut d'un projet (spécifique jury)
  static async updateProjetStatut(req, res, next) {
    try {
      const { projetId } = req.params;
      const { statut } = req.body;
      const userId = req.user.id;

      console.log(`Jury ${userId} met à jour le statut du projet ${projetId} vers ${statut}`);

      // Validation du statut (jurys ont plus de liberté maintenant)
      const statutsAutorises = ['EN_ATTENTE', 'EN_COURS', 'EVALUE', 'TERMINE', 'SUSPENDU'];
      if (!statut || !statutsAutorises.includes(statut)) {
        return res.status(400).json({
          success: false,
          error: "Statut invalide pour un jury",
          statutsAutorises
        });
      }

      // Vérifier que le projet existe
      const projet = await prisma.projet.findUnique({
        where: { id: parseInt(projetId) }
      });

      if (!projet) {
        return res.status(404).json({
          success: false,
          error: "Projet non trouvé"
        });
      }

      // Mise à jour du statut
      const projetMisAJour = await prisma.projet.update({
        where: { id: parseInt(projetId) },
        data: { 
          statut: statut,
          updatedAt: new Date()
        }
      });

      console.log(`Statut projet ${projetId} mis à jour avec succès par jury ${userId}: ${statut}`);

      res.json({
        success: true,
        message: "Statut mis à jour avec succès",
        data: { 
          id: parseInt(projetId), 
          statut: statut,
          titre: projetMisAJour.titre
        }
      });

    } catch (error) {
      console.error('Erreur mise à jour statut par jury:', error);
      next(error);
    }
  }

  // Récupérer les commentaires d'un jury (tous les utilisateurs sont maintenant dans User)
  static async getMyComments(req, res, next) {
    try {
      const userId = req.user.id
      const userRole = req.user.role
      
      // Vérifier que l'utilisateur a des permissions de jury
      const rolesJury = ['JURY', 'EXPERT', 'ORGANISATEUR', 'ADMIN']
      if (!rolesJury.includes(userRole)) {
        return res.status(403).json({
          success: false,
          error: "Accès refusé - permissions de jury requises"
        })
      }
      
      // Tous les commentaires sont maintenant liés à userId dans la table User unifiée
      const comments = await CommentaireService.getCommentairesByUserId(userId)
      
      res.json({
        success: true,
        data: comments
      })
    } catch (error) {
      next(error)
    }
  }
}