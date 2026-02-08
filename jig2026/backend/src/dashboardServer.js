// Serveur minimal avec toutes les routes nécessaires pour le dashboard
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;;

dotenv.config();

const prisma = new PrismaClient();

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002'
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API JIG2026 Dashboard is running',
    timestamp: new Date().toISOString()
  });
});

// Middleware d'auth simulé (bypasse pour les tests)
const mockAuth = (req, res, next) => {
  req.user = { id: 24, role: 'ADMIN' };
  next();
};

// Route de connexion admin
app.post('/api/auth/admin/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Simulation de connexion réussie pour tenenayeo@jig2026.ci
  if (email === 'tenenayeo@jig2026.ci' && password === 'admin123') {
    res.json({
      success: true,
      data: {
        user: {
          id: 24,
          nom: 'TENENA',
          prenom: 'yeo',
          email: 'tenenayeo@jig2026.ci',
          role: 'ADMIN'
        },
        token: 'mock-jwt-token-for-testing'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });
  }
});

// Route des statistiques pour le dashboard
app.get('/api/admin/stats', async (req, res) => {
  try {
    // Récupération des vraies données depuis la base
    const totalUsers = await prisma.user.count();
    const etudiantCount = await prisma.user.count({ where: { role: 'ETUDIANT' } });
    const utilisateurCount = await prisma.user.count({ where: { role: 'UTILISATEUR' } });
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    const juryCount = await prisma.jury.count();
    
    const projetCount = await prisma.projet.count();
    const projetApprouveCount = await prisma.projet.count({ where: { statut: 'APPROUVE' } });
    const projetEnAttenteCount = await prisma.projet.count({ where: { statut: 'EN_ATTENTE' } });
    const projetRejeteCount = await prisma.projet.count({ where: { statut: 'REJETE' } });
    
    const voteCount = await prisma.vote.count();
    const commentaireCount = await prisma.commentaire.count();
    
    // Calcul de la moyenne des votes
    const votesAverage = await prisma.vote.aggregate({
      _avg: {
        valeur: true
      }
    });
    const moyenneVotes = votesAverage._avg.valeur ? Number(votesAverage._avg.valeur.toFixed(2)) : 0;
    
    // Projets par catégorie
    const projetsByCategorie = await prisma.projet.groupBy({
      by: ['categorie'],
      _count: {
        id: true
      }
    });

    console.log(`📊 Stats calculées: ${voteCount} votes, ${projetCount} projets, ${totalUsers} utilisateurs`);

    res.json({
      success: true,
      data: {
        totalUsers,
        etudiantCount,
        utilisateurCount,
        adminCount,
        juryCount,
        projetCount,
        projetApprouveCount,
        projetEnAttenteCount,
        projetRejeteCount,
        voteCount,
        commentaireCount,
        moyenneVotes,
        projetsByCategorie,
        inscriptionsLastWeek: [3, 5, 2, 8, 4, 6, 1], // Donnée simulée pour le graphique
        lastUpdate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Erreur stats:', error);
    // Fallback vers les données simulées en cas d'erreur
    res.json({
      success: true,
      data: {
        totalUsers: 25,
        etudiantCount: 12,
        utilisateurCount: 8,
        adminCount: 1,
        juryCount: 4,
        projetCount: 5,
        projetApprouveCount: 2,
        projetEnAttenteCount: 2,
        projetRejeteCount: 1,
        voteCount: 0,
        commentaireCount: 17,
        moyenneVotes: 0,
        projetsByCategorie: [],
        inscriptionsLastWeek: [3, 5, 2, 8, 4, 6, 1],
        error: 'Données simulées - Erreur DB'
      }
    });
  }
});

// Route des utilisateurs
app.get('/api/admin/users', mockAuth, (req, res) => {
  const { role, search } = req.query;
  
  // Données simulées d'utilisateurs
  let users = [
    {
      id: 24,
      nom: 'TENENA',
      prenom: 'yeo',
      email: 'tenenayeo@jig2026.ci',
      role: 'ADMIN',
      telephone: '+225 07 00 00 00',
      ecole: null,
      filiere: null,
      niveau: null,
      createdAt: '2025-10-29T21:22:08.000Z'
    },
    {
      id: 25,
      nom: 'Kouadio',
      prenom: 'Jean',
      email: 'jean.kouadio@etudiant.ci',
      role: 'ETUDIANT',
      telephone: '+225 01 02 03 04',
      ecole: 'ESATIC',
      filiere: 'Informatique',
      niveau: 'L3',
      createdAt: '2025-10-30T08:15:00.000Z'
    },
    {
      id: 26,
      nom: 'Kone',
      prenom: 'Marie',
      email: 'marie.kone@utilisateur.ci',
      role: 'UTILISATEUR',
      telephone: '+225 05 06 07 08',
      ecole: null,
      filiere: null,
      niveau: null,
      createdAt: '2025-10-30T10:30:00.000Z'
    },
    {
      id: 27,
      nom: 'Diallo',
      prenom: 'Amadou',
      email: 'amadou.diallo@jury.ci',
      role: 'JURY',
      telephone: '+225 09 10 11 12',
      ecole: null,
      filiere: null,
      niveau: null,
      createdAt: '2025-10-30T12:00:00.000Z'
    }
  ];
  
  // Filtrage par rôle
  if (role && role !== 'ALL') {
    users = users.filter(user => user.role === role);
  }
  
  // Filtrage par recherche
  if (search) {
    users = users.filter(user => 
      user.nom.toLowerCase().includes(search.toLowerCase()) ||
      user.prenom.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({ success: true, data: users });
});

// Route des jurys
app.get('/api/admin/jury', mockAuth, (req, res) => {
  const jurys = [
    {
      id: 1,
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'pierre.martin@jury.fr',
      specialite: 'Développement Web',
      bio: 'Expert en technologies web avec 10 ans d\'expérience.',
      photo: null,
      createdAt: '2025-10-30T14:00:00.000Z',
      _count: {
        commentaires: 12,
        votes: 8
      }
    },
    {
      id: 2,
      nom: 'Dubois',
      prenom: 'Sarah',
      email: 'sarah.dubois@jury.fr',
      specialite: 'UX/UI Design',
      bio: 'Spécialiste en expérience utilisateur et design d\'interface.',
      photo: null,
      createdAt: '2025-10-30T15:30:00.000Z',
      _count: {
        commentaires: 8,
        votes: 6
      }
    }
  ];
  
  res.json({ success: true, data: jurys });
});

// Route des projets
app.get('/api/admin/projects', mockAuth, (req, res) => {
  const { statut, search } = req.query;
  
  let projets = [
    {
      id: 1,
      titre: 'Application de gestion de tâches',
      description: 'Une application web pour gérer les tâches d\'équipe avec interface moderne et fonctionnalités collaboratives.',
      categorie: 'Web Development',
      fichier: 'projet_1_gestion_taches.zip',
      statut: 'APPROUVE',
      createdAt: '2025-10-28T10:00:00.000Z',
      user: {
        id: 25,
        nom: 'Kouadio',
        prenom: 'Jean',
        email: 'jean.kouadio@etudiant.ci',
        ecole: 'ESATIC',
        filiere: 'Informatique',
        niveau: 'L3'
      },
      votes: [],
      _count: {
        votes: 12,
        commentaires: 5
      }
    },
    {
      id: 2,
      titre: 'Application Mobile UI/UX',
      description: 'Interface et expérience utilisateur pour une application de covoiturage local. Recherche utilisateur, wireframes et prototypage.',
      categorie: 'Design UI/UX',
      fichier: 'projet_2_mobile_uiux.figma',
      statut: 'EN_ATTENTE',
      createdAt: '2025-10-29T22:31:00.000Z',
      user: {
        id: 26,
        nom: 'Kouassi',
        prenom: 'Aya',
        email: 'aya.kouassi@istc.ci',
        ecole: 'ISTC',
        filiere: 'Design Graphique',
        niveau: 'M1'
      },
      votes: [],
      _count: {
        votes: 0,
        commentaires: 0
      }
    },
    {
      id: 3,
      titre: 'Bot Discord pour communauté',
      description: 'Bot automatisé pour modération Discord avec commandes personnalisées et système de niveaux.',
      categorie: 'Bot Development',
      fichier: 'projet_3_discord_bot.zip',
      statut: 'EN_ATTENTE',
      createdAt: '2025-10-29T14:30:00.000Z',
      user: {
        id: 27,
        nom: 'Kone',
        prenom: 'Marie',
        email: 'marie.kone@etudiant.ci',
        ecole: 'INPHB',
        filiere: 'Informatique',
        niveau: 'L2'
      },
      votes: [],
      _count: {
        votes: 3,
        commentaires: 1
      }
    },
    {
      id: 4,
      titre: 'Système de gestion de bibliothèque',
      description: 'Application de gestion complète pour bibliothèque universitaire avec système de réservation en ligne.',
      categorie: 'Web Development',
      fichier: 'projet_4_bibliotheque.zip',
      statut: 'REJETE',
      createdAt: '2025-10-27T09:15:00.000Z',
      user: {
        id: 28,
        nom: 'Diallo',
        prenom: 'Amadou',
        email: 'amadou.diallo@etudiant.ci',
        ecole: 'ESATIC',
        filiere: 'Informatique',
        niveau: 'L3'
      },
      votes: [],
      _count: {
        votes: 2,
        commentaires: 3
      }
    },
    {
      id: 5,
      titre: 'Application de suivi sportif',
      description: 'Application mobile pour suivi des performances sportives avec analyse des données et conseils personnalisés.',
      categorie: 'Mobile Development',
      fichier: 'projet_5_sport_tracker.apk',
      statut: 'APPROUVE',
      createdAt: '2025-10-26T16:45:00.000Z',
      user: {
        id: 29,
        nom: 'Yao',
        prenom: 'Christelle',
        email: 'christelle.yao@etudiant.ci',
        ecole: 'ISTC',
        filiere: 'Développement Mobile',
        niveau: 'M2'
      },
      votes: [],
      _count: {
        votes: 18,
        commentaires: 8
      }
    }
  ];
  
  // Filtrage par statut
  if (statut && statut !== 'ALL') {
    projets = projets.filter(projet => projet.statut === statut);
  }
  
  // Filtrage par recherche
  if (search) {
    projets = projets.filter(projet => 
      projet.titre.toLowerCase().includes(search.toLowerCase()) ||
      projet.description.toLowerCase().includes(search.toLowerCase()) ||
      projet.categorie.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({ success: true, data: projets });
});

// Routes CRUD simulées
app.delete('/api/admin/users/:id', mockAuth, (req, res) => {
  res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
});

app.put('/api/admin/users/:id', mockAuth, (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  
  res.json({ 
    success: true, 
    data: { id: parseInt(id), ...userData, updatedAt: new Date().toISOString() }
  });
});

app.post('/api/admin/jury', mockAuth, (req, res) => {
  const { nom, prenom, email, password, specialite, bio } = req.body;
  
  res.status(201).json({
    success: true,
    data: {
      id: Date.now(), // Simulation d'ID
      nom,
      prenom,
      email,
      specialite,
      bio,
      createdAt: new Date().toISOString()
    }
  });
});

app.delete('/api/admin/jury/:id', mockAuth, (req, res) => {
  res.json({ success: true, message: 'Jury supprimé avec succès' });
});

// Routes pour la gestion des projets
app.delete('/api/admin/projects/:id', mockAuth, (req, res) => {
  res.json({ success: true, message: 'Projet supprimé avec succès' });
});

app.patch('/api/admin/projects/:id/status', mockAuth, (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  
  res.json({ 
    success: true, 
    data: { 
      id: parseInt(id), 
      statut,
      updatedAt: new Date().toISOString() 
    },
    message: `Projet ${statut === 'APPROUVE' ? 'approuvé' : 'rejeté'} avec succès`
  });
});

// Routes spécifiques pour approuver/rejeter
app.patch('/api/projects/:id/approve', mockAuth, (req, res) => {
  const { id } = req.params;
  res.json({ 
    success: true, 
    message: 'Projet approuvé avec succès'
  });
});

app.patch('/api/projects/:id/reject', mockAuth, (req, res) => {
  const { id } = req.params;
  res.json({ 
    success: true, 
    message: 'Projet rejeté avec succès'
  });
});

// Route pour télécharger un fichier projet
app.get('/api/projects/:id/download', mockAuth, (req, res) => {
  const { id } = req.params;
  
  // Simulation d'un téléchargement de fichier
  res.setHeader('Content-Disposition', `attachment; filename="projet_${id}.zip"`);
  res.setHeader('Content-Type', 'application/zip');
  res.json({ 
    success: true,
    message: 'Fichier téléchargé avec succès',
    filename: `projet_${id}.zip`
  });
});

// ===== ROUTES VOTES AVEC DONNÉES RÉELLES =====

// Route pour récupérer tous les votes
app.get('/votes', async (req, res) => {
  try {
    const votes = await prisma.vote.findMany({
      include: {
        projet: {
          select: {
            id: true,
            titre: true,
            categorie: true
          }
        },
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transformer les données pour correspondre au format attendu par le dashboard
    const formattedVotes = votes.map(vote => ({
      id: vote.id,
      projetId: vote.projetId,
      valeur: vote.valeur,
      typeVote: vote.typeVote,
      createdAt: vote.createdAt,
      projet: vote.projet,
      votant: vote.user || vote.jury,
      votantType: vote.typeVote === 'JURY' ? 'Jury' : 
                  vote.typeVote === 'ETUDIANT' ? 'Étudiant' : 'Utilisateur'
    }));

    console.log(`📊 Votes récupérés: ${formattedVotes.length} votes trouvés`);
    
    res.json({
      success: true,
      data: formattedVotes,
      total: formattedVotes.length
    });
  } catch (error) {
    console.error('❌ Erreur récupération votes:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erreur lors de la récupération des votes'
    });
  }
});

// Route pour récupérer les scores finaux avec calculs pondérés
app.get('/votes/scores', async (req, res) => {
  try {
    const projets = await prisma.projet.findMany({
      include: {
        votes: true,
        user: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    });

    const scores = projets.map(projet => {
      const votesJury = projet.votes.filter(v => v.typeVote === 'JURY');
      // Grouper ETUDIANT et UTILISATEUR dans la catégorie "Public" (30%)
      const votesPublic = projet.votes.filter(v => v.typeVote === 'ETUDIANT' || v.typeVote === 'UTILISATEUR');

      const moyenneJury = votesJury.length > 0 
        ? votesJury.reduce((sum, vote) => sum + vote.valeur, 0) / votesJury.length 
        : 0;

      const moyennePublic = votesPublic.length > 0 
        ? votesPublic.reduce((sum, vote) => sum + vote.valeur, 0) / votesPublic.length 
        : 0;

      // Calcul pondéré: 70% jury, 30% public (étudiants + utilisateurs)
      const scoreFinal = (moyenneJury * 0.7) + (moyennePublic * 0.3);

      return {
        projetId: projet.id,
        titre: projet.titre,
        categorie: projet.categorie,
        auteur: `${projet.user.prenom} ${projet.user.nom}`,
        moyenneJury: Number(moyenneJury.toFixed(2)),
        moyennePublic: Number(moyennePublic.toFixed(2)),
        moyenneEtudiant: Number(moyennePublic.toFixed(2)), // Alias pour compatibilité
        scoreFinal: Number(scoreFinal.toFixed(2)),
        totalVotesJury: votesJury.length,
        totalVotesPublic: votesPublic.length,
        totalVotesEtudiants: votesPublic.length, // Alias pour compatibilité
        totalVotes: projet.votes.length
      };
    });

    // Tri par score final décroissant
    scores.sort((a, b) => b.scoreFinal - a.scoreFinal);

    console.log(`🏆 Scores calculés: ${scores.length} projets classés`);

    res.json({
      success: true,
      data: scores,
      systemePonderé: "70% Jury / 30% Public"
    });
  } catch (error) {
    console.error('❌ Erreur calcul scores:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erreur lors du calcul des scores'
    });
  }
});

// Route pour les statistiques de votes (utilisée par le dashboard)
app.get('/api/admin/vote-stats', async (req, res) => {
  try {
    const totalVotes = await prisma.vote.count();
    const votesJury = await prisma.vote.count({
      where: { typeVote: 'JURY' }
    });
    const votesEtudiants = await prisma.vote.count({
      where: { typeVote: 'ETUDIANT' }
    });
    const votesUtilisateurs = await prisma.vote.count({
      where: { typeVote: 'UTILISATEUR' }
    });
    
    // Regrouper étudiants + utilisateurs = public
    const votesPublic = votesEtudiants + votesUtilisateurs;

    const stats = {
      totalVotes,
      votesJury,
      votesEtudiants,
      votesUtilisateurs,
      votesPublic,
      pourcentageJury: totalVotes > 0 ? Math.round((votesJury / totalVotes) * 100) : 0,
      pourcentageEtudiants: totalVotes > 0 ? Math.round((votesEtudiants / totalVotes) * 100) : 0,
      pourcentageUtilisateurs: totalVotes > 0 ? Math.round((votesUtilisateurs / totalVotes) * 100) : 0,
      pourcentagePublic: totalVotes > 0 ? Math.round((votesPublic / totalVotes) * 100) : 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Erreur stats votes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur Dashboard JIG2026 lancé sur http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Dashboard stats: http://localhost:${PORT}/api/admin/stats`);
  console.log(`👥 Users: http://localhost:${PORT}/api/admin/users`);
  console.log(`⚖️ Jurys: http://localhost:${PORT}/api/admin/jury`);
  console.log(`📁 Projects: http://localhost:${PORT}/api/admin/projects`);
  console.log(`🗳️ Votes: http://localhost:${PORT}/votes`);
  console.log(`🏆 Scores: http://localhost:${PORT}/votes/scores`);
  
  // Garder le serveur vivant
  setInterval(() => {
    console.log(`🟢 Serveur actif: ${new Date().toLocaleTimeString()}`);
  }, 30000);
});

server.on('error', (error) => {
  console.error('❌ Erreur serveur:', error);
});

export default app;