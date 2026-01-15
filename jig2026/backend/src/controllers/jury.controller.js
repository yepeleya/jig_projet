import { VoteService } from '../services/vote.service.js'
import { CommentaireService } from '../services/commentaire.service.js'

import prisma from "../utils/prismaClient.js";

export class JuryController {
  // Récupérer les votes d'un jury
  static async getMyVotes(req, res, next) {
    try {
      // L'utilisateur connecté peut être un User avec role JURY ou un Jury
      const userId = req.user.id
      const userRole = req.user.role
      
      let votes = []
      
      if (userRole === 'JURY') {
        // Si c'est un User avec rôle JURY, chercher les votes avec userId
        votes = await VoteService.getVotesByUserId(userId)
      } else {
        // Si c'est un Jury (table séparée), chercher les votes avec juryId  
        votes = await VoteService.getVotesByJuryId(userId)
      }
      
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

  // Récupérer les commentaires d'un jury
  static async getMyComments(req, res, next) {
    try {
      const userId = req.user.id
      const userRole = req.user.role
      
      let comments = []
      
      if (userRole === 'JURY') {
        // Si c'est un User avec rôle JURY, chercher les commentaires avec juryId = userId
        comments = await CommentaireService.getCommentairesByJuryId(userId)
      } else {
        // Si c'est un Jury (table séparée), chercher les commentaires avec juryId
        comments = await CommentaireService.getCommentairesByJuryId(userId)
      }
      
      res.json({
        success: true,
        data: comments
      })
    } catch (error) {
      next(error)
    }
  }
}