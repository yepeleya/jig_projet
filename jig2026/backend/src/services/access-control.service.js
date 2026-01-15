import { ConfigurationService } from "./configuration.service.js";

/**
 * Service pour gérer les accès automatiques aux pages selon les phases du concours
 */
export class AccessControlService {
  
  // Constantes pour les phases du concours
  static PHASES = {
    SUBMISSION: 'submission',
    VOTING: 'voting', 
    RESULTS: 'results',
    FINISHED: 'finished'
  };

  static DAYS_BEFORE_DEADLINE = 7; // Nombre de jours avant la date limite pour fermer les soumissions

  /**
   * Obtenir la phase actuelle du concours
   */
  static async getCurrentPhase() {
    try {
      const now = new Date();
      
      // Récupérer les dates clés
      const dateLimiteVotes = await ConfigurationService.getConfig('DATE_LIMITE_VOTES');
      const classementPublic = await ConfigurationService.getConfig('CLASSEMENT_PUBLIC_VISIBLE');
      
      if (!dateLimiteVotes) {
        return this.PHASES.SUBMISSION; // Par défaut, phase de soumission
      }

      const dateLimite = new Date(dateLimiteVotes);
      const dateFermetureSubmission = new Date(dateLimite);
      dateFermetureSubmission.setDate(dateFermetureSubmission.getDate() - this.DAYS_BEFORE_DEADLINE);

      // Logique des phases
      if (now < dateFermetureSubmission) {
        return this.PHASES.SUBMISSION;
      } else if (now < dateLimite) {
        return this.PHASES.VOTING;
      } else if (classementPublic) {
        return this.PHASES.FINISHED;
      } else {
        return this.PHASES.RESULTS; // Attente validation admin
      }

    } catch (error) {
      console.error('Erreur lors de la détermination de la phase:', error);
      return this.PHASES.SUBMISSION; // Par défaut
    }
  }

  /**
   * Vérifier si les soumissions sont autorisées
   */
  static async canSubmit() {
    const phase = await this.getCurrentPhase();
    return phase === this.PHASES.SUBMISSION;
  }

  /**
   * Vérifier si les votes sont autorisés
   */
  static async canVote() {
    const phase = await this.getCurrentPhase();
    return phase === this.PHASES.VOTING;
  }

  /**
   * Vérifier si le classement est visible publiquement
   */
  static async canViewRanking() {
    const phase = await this.getCurrentPhase();
    return phase === this.PHASES.FINISHED;
  }

  /**
   * Vérifier si l'admin peut valider le classement
   */
  static async canAdminValidateRanking() {
    const phase = await this.getCurrentPhase();
    return phase === this.PHASES.RESULTS;
  }

  /**
   * Obtenir les informations détaillées sur l'état du concours
   */
  static async getContestStatus() {
    try {
      const phase = await this.getCurrentPhase();
      const dateLimiteVotes = await ConfigurationService.getConfig('DATE_LIMITE_VOTES');
      const classementPublic = await ConfigurationService.getConfig('CLASSEMENT_PUBLIC_VISIBLE');
      
      let dateFermetureSubmission = null;
      if (dateLimiteVotes) {
        dateFermetureSubmission = new Date(dateLimiteVotes);
        dateFermetureSubmission.setDate(dateFermetureSubmission.getDate() - this.DAYS_BEFORE_DEADLINE);
      }

      return {
        phase,
        canSubmit: await this.canSubmit(),
        canVote: await this.canVote(),
        canViewRanking: await this.canViewRanking(),
        canAdminValidateRanking: await this.canAdminValidateRanking(),
        dates: {
          submissionDeadline: dateFermetureSubmission,
          voteDeadline: dateLimiteVotes ? new Date(dateLimiteVotes) : null,
          now: new Date()
        },
        isRankingPublic: Boolean(classementPublic),
        daysBeforeDeadline: this.DAYS_BEFORE_DEADLINE
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      throw error;
    }
  }

  /**
   * Obtenir le message approprié pour chaque phase
   */
  static getPhaseMessage(phase, dates = {}) {
    switch (phase) {
      case this.PHASES.SUBMISSION:
        if (dates.submissionDeadline) {
          const daysLeft = Math.ceil((dates.submissionDeadline - dates.now) / (1000 * 60 * 60 * 24));
          return {
            type: 'info',
            title: 'Période de soumission active',
            message: `Vous pouvez soumettre vos projets jusqu'au ${dates.submissionDeadline.toLocaleDateString('fr-FR')} (${daysLeft} jours restants).`
          };
        }
        return {
          type: 'info',
          title: 'Soumissions ouvertes',
          message: 'La période de soumission des projets est actuellement ouverte.'
        };

      case this.PHASES.VOTING:
        if (dates.voteDeadline) {
          const daysLeft = Math.ceil((dates.voteDeadline - dates.now) / (1000 * 60 * 60 * 24));
          return {
            type: 'warning',
            title: 'Période de soumission terminée - Votes ouverts',
            message: `La soumission des projets est fermée. Les votes sont ouverts jusqu'au ${dates.voteDeadline.toLocaleDateString('fr-FR')} (${daysLeft} jours restants).`
          };
        }
        return {
          type: 'warning',
          title: 'Période de votes',
          message: 'La période de soumission est terminée. Les votes sont maintenant ouverts.'
        };

      case this.PHASES.RESULTS:
        return {
          type: 'success',
          title: 'Votes terminés',
          message: 'La période de votes est terminée. L\'équipe d\'administration prépare les résultats finaux.'
        };

      case this.PHASES.FINISHED:
        return {
          type: 'success',
          title: 'Concours terminé',
          message: 'Le concours JIG 2026 est terminé ! Découvrez les résultats finaux.'
        };

      default:
        return {
          type: 'info',
          title: 'Concours JIG 2026',
          message: 'Bienvenue au concours JIG 2026.'
        };
    }
  }

  /**
   * Valider le classement (action admin)
   */
  static async validateRanking() {
    try {
      const canValidate = await this.canAdminValidateRanking();
      if (!canValidate) {
        throw new Error('Le classement ne peut pas être validé dans la phase actuelle');
      }

      // Activer la visibilité publique du classement
      await ConfigurationService.setConfig('CLASSEMENT_PUBLIC_VISIBLE', true, 'boolean');
      
      // Désactiver définitivement les votes
      await ConfigurationService.setConfig('VOTES_ACTIFS', false, 'boolean');
      
      // Log de l'action
      console.log(`🏆 Classement validé et rendu public à ${new Date().toISOString()}`);
      
      return {
        success: true,
        message: 'Classement validé avec succès et rendu public',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de la validation du classement:', error);
      throw error;
    }
  }

  /**
   * Obtenir les messages de blocage pour chaque page
   */
  static getPageBlockMessage(pageName, phase, dates = {}) {
    switch (pageName) {
      case 'submission':
        if (phase === this.PHASES.VOTING || phase === this.PHASES.RESULTS || phase === this.PHASES.FINISHED) {
          return {
            icon: '📝',
            title: 'Période de soumission terminée',
            message: 'La période de soumission des projets est désormais fermée. Merci à tous les participants !',
            suggestion: phase === this.PHASES.VOTING ? 'Vous pouvez maintenant voter pour vos projets préférés.' : 'Découvrez les résultats du concours.'
          };
        }
        break;

      case 'vote':
        if (phase === this.PHASES.SUBMISSION) {
          return {
            icon: '🗳️',
            title: 'Votes pas encore ouverts',
            message: 'La période de votes n\'est pas encore commencée. Les soumissions sont actuellement en cours.',
            suggestion: 'Revenez après la fermeture des soumissions pour voter.'
          };
        } else if (phase === this.PHASES.RESULTS || phase === this.PHASES.FINISHED) {
          return {
            icon: '🗳️',
            title: 'Période de votes terminée',
            message: 'Le vote est désormais fermé. Merci pour votre participation !',
            suggestion: phase === this.PHASES.FINISHED ? 'Découvrez les résultats finaux du concours.' : 'Les résultats seront bientôt disponibles.'
          };
        }
        break;

      case 'ranking':
        if (phase !== this.PHASES.FINISHED) {
          return {
            icon: '🏆',
            title: 'Classement non disponible',
            message: 'Le classement n\'est pas encore disponible publiquement.',
            suggestion: phase === this.PHASES.SUBMISSION ? 'Les soumissions sont en cours.' : 
                       phase === this.PHASES.VOTING ? 'Les votes sont en cours.' : 
                       'L\'équipe d\'administration prépare les résultats.'
          };
        }
        break;
    }

    return null; // Pas de blocage
  }
}