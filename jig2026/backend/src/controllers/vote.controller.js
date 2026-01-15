import prisma from "../utils/prismaClient.js";
import { NotificationService } from "../services/notification.service.js";
import { mettreAJourStatutAutomatique } from "../utils/statutProjet.js";
import ProjetSuiviService from "../services/projet-suivi.service.js";

/**
 * Un utilisateur (jury ou étudiant) peut voter une seule fois par projet.
 * - Les votes étudiants comptent pour 30%
 * - Les votes jury comptent pour 70%
 */
export const voter = async (req, res) => {
  try {
    const { projetId, valeur, typeVote, userId, juryId } = req.body;
    const user = req.user; // Ajouté par le middleware d'authentification

    console.log('--- DEBUT VOTE DEBUG ---');
    console.log('Body reçu:', req.body);
    console.log('User authentifié:', user);
    console.log('ProjetId:', projetId, 'Valeur:', valeur);

    // Validation des données requises
    if (!projetId || valeur === undefined) {
      console.log('Erreur: Données manquantes - projetId ou valeur');
      return res.status(400).json({ 
        success: false, 
        message: "projetId et valeur sont requis",
        received: { projetId, valeur, typeVote, userId, juryId }
      });
    }

    // Vérifier que le projet existe
    const projet = await prisma.projet.findUnique({ where: { id: parseInt(projetId) } });
    if (!projet) {
      console.log('Erreur: Projet non trouvé pour ID:', projetId);
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    // Déterminer l'ID utilisateur selon le token d'auth
    const finalUserId = userId || (user.role !== 'JURY' ? user.id : null);
    const finalJuryId = juryId || (user.role === 'JURY' ? user.id : null);

    console.log('IDs finaux:', { finalUserId, finalJuryId });

    // Déterminer le type de vote selon le rôle
    const finalTypeVote = typeVote || (() => {
      switch (user.role) {
        case 'JURY':
          return 'JURY';
        case 'ETUDIANT':
          return 'ETUDIANT';
        case 'UTILISATEUR':
          return 'ETUDIANT'; // Les utilisateurs publics votent comme des étudiants
        default:
          return 'ETUDIANT';
      }
    })();

    // Vérifier si le vote existe déjà
    const existingVote = await prisma.vote.findFirst({
      where: {
        projetId: parseInt(projetId),
        ...(finalUserId ? { userId: finalUserId } : {}),
        ...(finalJuryId ? { juryId: finalJuryId } : {}),
      },
    });
    
    console.log('Vote existant trouvé:', existingVote);
    
    if (existingVote) {
      console.log('Erreur: Vote déjà enregistré');
      return res.status(400).json({ 
        success: false, 
        message: "Vote déjà enregistré pour ce projet" 
      });
    }

    console.log('Création du vote avec les données:', {
      valeur: parseFloat(valeur),
      typeVote: finalTypeVote,
      projetId: parseInt(projetId),
      userId: finalUserId,
      juryId: finalJuryId,
    });

    const vote = await prisma.vote.create({
      data: {
        valeur: parseFloat(valeur),
        typeVote: finalTypeVote,
        projetId: parseInt(projetId),
        userId: finalUserId,
        juryId: finalJuryId,
      },
      include: {
        user: true,
        jury: true,
        projet: true
      }
    });

    console.log('Vote créé avec succès:', vote);

    // Ajouter automatiquement au suivi du projet
    try {
      await ProjetSuiviService.ajouterSuiviVote(
        parseInt(projetId),
        finalUserId,
        finalJuryId,
        parseFloat(valeur)
      );
      console.log('✅ Suivi vote ajouté automatiquement');
    } catch (suiviError) {
      console.error('⚠️ Erreur ajout suivi vote (non bloquante):', suiviError.message);
    }

    // Créer une notification pour le nouveau vote
    const voter = vote.user || vote.jury || user
    await NotificationService.onNewVote(vote, vote.projet, voter)

    // Mettre à jour automatiquement le statut du projet
    if (finalJuryId) {
      try {
        const nouveauStatut = await mettreAJourStatutAutomatique(parseInt(projetId), finalJuryId);
        console.log(`🔄 Statut projet mis à jour automatiquement: ${nouveauStatut}`);
      } catch (statutError) {
        console.error('⚠️ Erreur mise à jour statut (non bloquante):', statutError.message);
        // Ne pas faire échouer le vote pour un problème de statut
      }
    }

    console.log('--- FIN VOTE DEBUG ---');
    res.status(201).json({ success: true, data: vote, message: "Vote enregistré avec succès" });
  } catch (error) {
    console.error('=== ERREUR VOTE ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Body reçu:', req.body);
    console.error('User:', req.user);
    console.error('===================');
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Récupérer les votes de l'utilisateur connecté
 */
export const getMyVotes = async (req, res) => {
  try {
    const user = req.user; // Ajouté par le middleware d'authentification

    const votes = await prisma.vote.findMany({
      where: {
        ...(user.role === 'JURY' ? { juryId: user.id } : { userId: user.id }),
      },
      include: {
        projet: true,
        user: true,
        jury: true
      }
    });

    res.json({ success: true, data: votes });
  } catch (error) {
    console.error('Erreur lors de la récupération des votes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


/**
 * Récupérer tous les votes d'un projet
 */
export const getVotesByProjet = async (req, res) => {
  try {
    const projetId = parseInt(req.params.projetId);
    const votes = await prisma.vote.findMany({
      where: { projetId },
      include: { user: true, jury: true },
    });
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Calcul des scores pondérés (jury = 70%, étudiants = 30%)
 */
export const calculerScores = async (req, res) => {
  try {
    const projets = await prisma.projet.findMany({
      include: { votes: true },
    });

    const resultats = projets.map((projet) => {
      const votesJury = projet.votes.filter((v) => v.typeVote === "JURY");
      const votesEtudiants = projet.votes.filter((v) => v.typeVote === "ETUDIANT");

      const moyenneJury = votesJury.length ? votesJury.reduce((a, b) => a + b.valeur, 0) / votesJury.length : 0;
      const moyenneEtudiant = votesEtudiants.length ? votesEtudiants.reduce((a, b) => a + b.valeur, 0) / votesEtudiants.length : 0;

      const scoreFinal = (moyenneJury * 0.7) + (moyenneEtudiant * 0.3);

      return {
        projetId: projet.id,
        titre: projet.titre,
        moyenneJury: Number(moyenneJury.toFixed(2)),
        moyenneEtudiant: Number(moyenneEtudiant.toFixed(2)),
        scoreFinal: Number(scoreFinal.toFixed(2)),
        totalVotesJury: votesJury.length,
        totalVotesEtudiants: votesEtudiants.length,
      };
    });

    // Tri par score final décroissant
    resultats.sort((a, b) => b.scoreFinal - a.scoreFinal);

    res.json(resultats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupérer tous les votes (pour admin dashboard)
 */
export const getAllVotes = async (req, res) => {
  try {
    const votes = await prisma.vote.findMany({
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            niveau: true,
            role: true
          }
        },
        jury: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            specialite: true
          }
        },
        projet: {
          select: {
            id: true,
            titre: true,
            categorie: true,
            statut: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: votes });
  } catch (error) {
    console.error('Erreur lors de la récupération des votes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Résultats des votes : projets triés par nombre de votes total
 */
export const getVoteResults = async (req, res) => {
  try {
    const projets = await prisma.projet.findMany({
      where: { statut: 'APPROUVE' }, // Seulement les projets approuvés
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            niveau: true,
            ecole: true,
            filiere: true
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
      
      return {
        id: projet.id,
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
          etudiants: votesEtudiants.length,
          utilisateurs: votesUtilisateurs.length
        },
        createdAt: projet.createdAt
      };
    });

    // Tri par nombre total de votes décroissant
    resultats.sort((a, b) => b.votes.total - a.votes.total);

    res.json({ success: true, data: resultats });
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Résultats finaux avec pondération (70% jury, 30% public)
 */
export const getFinalResults = async (req, res) => {
  try {
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
            filiere: true
          }
        },
        votes: true
      }
    });

    const resultats = projets.map((projet) => {
      const votesJury = projet.votes.filter(v => v.typeVote === 'JURY');
      const votesPublic = projet.votes.filter(v => ['ETUDIANT', 'UTILISATEUR'].includes(v.typeVote));

      // Calcul des moyennes
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
        scores: {
          final: Number(scoreFinal.toFixed(2)),
          jury: Number(moyenneJury.toFixed(2)),
          public: Number(moyennePublic.toFixed(2))
        },
        votes: {
          total: projet.votes.length,
          jury: votesJury.length,
          public: votesPublic.length
        },
        createdAt: projet.createdAt
      };
    });

    // Tri par score final décroissant
    resultats.sort((a, b) => b.scores.final - a.scores.final);

    res.json({ success: true, data: resultats });
  } catch (error) {
    console.error('Erreur lors du calcul des résultats finaux:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
