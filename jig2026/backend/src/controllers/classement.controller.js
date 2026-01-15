import prisma from "../utils/prismaClient.js";
import { ConfigurationService } from "../services/configuration.service.js";

/**
 * Obtenir le classement des projets (pour l'administration)
 * Retourne tous les projets approuvés avec leurs votes
 */
export const getClassement = async (req, res) => {
  try {
    const { type = 'popular' } = req.query; // 'popular' ou 'final'
    
    const projets = await prisma.projet.findMany({
      where: { statut: 'APPROUVE' },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            niveau: true,
            ecole: true,
            filiere: true,
            email: true
          }
        },
        votes: {
          include: {
            user: {
              select: { nom: true, prenom: true, role: true }
            },
            jury: {
              select: { nom: true, prenom: true, specialite: true }
            }
          }
        },
        _count: {
          select: { votes: true }
        }
      }
    });

    const resultats = projets.map((projet) => {
      const votesJury = projet.votes.filter(v => v.typeVote === 'JURY');
      const votesEtudiants = projet.votes.filter(v => v.typeVote === 'ETUDIANT');
      const votesUtilisateurs = projet.votes.filter(v => v.typeVote === 'UTILISATEUR');
      const votesPublic = [...votesEtudiants, ...votesUtilisateurs];
      
      // Calcul des moyennes pour le score pondéré
      const moyenneJury = votesJury.length > 0 
        ? votesJury.reduce((sum, vote) => sum + vote.valeur, 0) / votesJury.length 
        : 0;
      
      const moyennePublic = votesPublic.length > 0 
        ? votesPublic.reduce((sum, vote) => sum + vote.valeur, 0) / votesPublic.length 
        : 0;

      // Score final pondéré (70% jury, 30% public)
      const scoreFinal = (moyenneJury * 0.7) + (moyennePublic * 0.3);

      return {
        id: projet.id,
        rang: 0, // Sera calculé après tri
        titre: projet.titre,
        description: projet.description,
        categorie: projet.categorie,
        image: projet.image,
        fichier: projet.fichier,
        auteur: {
          nom: projet.user?.nom || 'Anonyme',
          prenom: projet.user?.prenom || '',
          niveau: projet.user?.niveau || 'Non spécifié',
          ecole: projet.user?.ecole || '',
          filiere: projet.user?.filiere || '',
          email: projet.user?.email || ''
        },
        votes: {
          total: projet._count.votes,
          jury: votesJury.length,
          etudiants: votesEtudiants.length,
          utilisateurs: votesUtilisateurs.length,
          public: votesPublic.length
        },
        scores: {
          final: Number(scoreFinal.toFixed(2)),
          jury: Number(moyenneJury.toFixed(2)),
          public: Number(moyennePublic.toFixed(2))
        },
        createdAt: projet.createdAt,
        updatedAt: projet.updatedAt
      };
    });

    // Tri selon le type demandé
    if (type === 'final') {
      resultats.sort((a, b) => b.scores.final - a.scores.final);
    } else {
      resultats.sort((a, b) => b.votes.total - a.votes.total);
    }

    // Ajouter le rang
    resultats.forEach((projet, index) => {
      projet.rang = index + 1;
    });

    // Informations sur la configuration
    const isPublic = await ConfigurationService.isRankingPublic();
    const canActivate = await ConfigurationService.canActivateRanking();
    const dateLimiteVotes = await ConfigurationService.getConfig('date_limite_votes');
    const votesActifs = await ConfigurationService.areVotesActive();

    res.json({
      success: true,
      data: {
        projets: resultats,
        total: resultats.length,
        type: type,
        configuration: {
          isPublic,
          canActivate,
          dateLimiteVotes,
          votesActifs
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du classement:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Vérifier si le classement est visible publiquement
 */
export const getClassementVisibility = async (req, res) => {
  try {
    const isPublic = await ConfigurationService.isRankingPublic();
    const canActivate = await ConfigurationService.canActivateRanking();
    const dateLimiteVotes = await ConfigurationService.getConfig('date_limite_votes');
    const votesActifs = await ConfigurationService.areVotesActive();

    res.json({
      success: true,
      data: {
        isPublic,
        canActivate,
        dateLimiteVotes,
        votesActifs,
        message: isPublic 
          ? "Le classement est visible publiquement"
          : canActivate 
            ? "Le classement peut être activé"
            : "Les votes sont encore actifs, le classement ne peut pas être activé"
      }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification de la visibilité:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Activer/désactiver la visibilité publique du classement (Admin seulement)
 */
export const toggleClassementVisibility = async (req, res) => {
  try {
    const user = req.user;
    
    // Vérifier que l'utilisateur est admin
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: "Accès refusé. Seuls les administrateurs peuvent modifier la visibilité du classement."
      });
    }

    const { visible } = req.body;
    
    if (typeof visible !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: "Le paramètre 'visible' doit être un booléen"
      });
    }

    // Si on veut activer la visibilité, vérifier qu'on peut le faire
    if (visible) {
      const canActivate = await ConfigurationService.canActivateRanking();
      if (!canActivate) {
        const dateLimiteVotes = await ConfigurationService.getConfig('date_limite_votes');
        return res.status(400).json({
          success: false,
          error: `Le classement ne peut pas encore être activé. La période de votes se termine le ${new Date(dateLimiteVotes).toLocaleDateString('fr-FR')}.`
        });
      }
    }

    // Mettre à jour la configuration
    await ConfigurationService.toggleRankingVisibility(visible);

    const action = visible ? 'activé' : 'désactivé';
    
    res.json({
      success: true,
      data: { 
        isPublic: visible,
        message: `Le classement public a été ${action} avec succès.`
      }
    });

  } catch (error) {
    console.error('Erreur lors du changement de visibilité:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Obtenir le classement public (pour le frontend public)
 * Disponible seulement si la visibilité est activée
 */
export const getClassementPublic = async (req, res) => {
  try {
    const isPublic = await ConfigurationService.isRankingPublic();
    
    if (!isPublic) {
      return res.json({
        success: false,
        message: "Le classement final n'est pas encore disponible. Revenez après la clôture des votes.",
        data: null
      });
    }

    // Réutiliser la logique du classement admin mais avec moins de détails
    const { type = 'final' } = req.query;
    
    const projets = await prisma.projet.findMany({
      where: { statut: 'APPROUVE' },
      include: {
        user: {
          select: {
            nom: true,
            prenom: true,
            niveau: true,
            ecole: true,
            filiere: true
          }
        },
        votes: true,
        _count: {
          select: { votes: true }
        }
      }
    });

    const resultats = projets.map((projet) => {
      const votesJury = projet.votes.filter(v => v.typeVote === 'JURY');
      const votesPublic = projet.votes.filter(v => ['ETUDIANT', 'UTILISATEUR'].includes(v.typeVote));
      
      const moyenneJury = votesJury.length > 0 
        ? votesJury.reduce((sum, vote) => sum + vote.valeur, 0) / votesJury.length 
        : 0;
      
      const moyennePublicValue = votesPublic.length > 0 
        ? votesPublic.reduce((sum, vote) => sum + vote.valeur, 0) / votesPublic.length 
        : 0;

      const scoreFinal = (moyenneJury * 0.7) + (moyennePublicValue * 0.3);

      return {
        id: projet.id,
        rang: 0,
        titre: projet.titre,
        description: projet.description,
        categorie: projet.categorie,
        image: projet.image,
        auteur: {
          nom: projet.user?.nom || 'Anonyme',
          prenom: projet.user?.prenom || '',
          niveau: projet.user?.niveau || 'Non spécifié',
          ecole: projet.user?.ecole || '',
          filiere: projet.user?.filiere || ''
        },
        votes: {
          total: projet._count.votes,
          jury: votesJury.length,
          public: votesPublic.length
        },
        scores: {
          final: Number(scoreFinal.toFixed(2))
        }
      };
    });

    // Tri
    if (type === 'final') {
      resultats.sort((a, b) => b.scores.final - a.scores.final);
    } else {
      resultats.sort((a, b) => b.votes.total - a.votes.total);
    }

    // Ajouter le rang
    resultats.forEach((projet, index) => {
      projet.rang = index + 1;
    });

    res.json({
      success: true,
      data: {
        projets: resultats,
        total: resultats.length,
        type: type,
        message: "Classement officiel JIG 2026"
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du classement public:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Obtenir les configurations liées aux dates et délais
 */
export const getClassementConfiguration = async (req, res) => {
  try {
    const user = req.user;
    
    // Seuls les admins peuvent voir toutes les configurations
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: "Accès refusé."
      });
    }

    const dateLimiteVotes = await ConfigurationService.getConfig('date_limite_votes');
    const dateLimiteSoumission = await ConfigurationService.getConfig('date_limite_soumission');
    const isPublic = await ConfigurationService.isRankingPublic();
    const votesActifs = await ConfigurationService.areVotesActive();
    const canActivate = await ConfigurationService.canActivateRanking();
    const submissionOpen = await ConfigurationService.isSubmissionOpen();

    res.json({
      success: true,
      data: {
        dateLimiteVotes,
        dateLimiteSoumission,
        isPublic,
        votesActifs,
        canActivate,
        submissionOpen,
        now: new Date()
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Mettre à jour les dates limites (Admin seulement)
 */
export const updateDateLimites = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: "Accès refusé."
      });
    }

    const { dateLimiteSoumission, dateLimiteVotes } = req.body;

    if (dateLimiteSoumission) {
      await ConfigurationService.setConfig('date_limite_soumission', dateLimiteSoumission, 'date');
    }

    if (dateLimiteVotes) {
      await ConfigurationService.setConfig('date_limite_votes', dateLimiteVotes, 'date');
    }

    res.json({
      success: true,
      message: "Dates limites mises à jour avec succès"
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour des dates:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};