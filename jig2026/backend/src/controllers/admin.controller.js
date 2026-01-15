import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Liste des utilisateurs avec filtres et recherche
export const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    
    const whereClause = {
      AND: [
        role ? { role } : {},
        search ? {
          OR: [
            { nom: { contains: search, mode: 'insensitive' } },
            { prenom: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ]
        } : {}
      ]
    };

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        telephone: true,
        ecole: true,
        filiere: true,
        niveau: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération des utilisateurs." 
    });
  }
};

// Liste des projets avec auteurs
export const getAllProjects = async (req, res) => {
  try {
    const { statut, search } = req.query;
    
    const whereClause = {
      AND: [
        statut ? { statut } : {},
        search ? {
          OR: [
            { titre: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { categorie: { contains: search, mode: 'insensitive' } }
          ]
        } : {}
      ]
    };

    const projets = await prisma.projet.findMany({
      where: whereClause,
      include: { 
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            ecole: true,
            filiere: true,
            niveau: true
          }
        },
        votes: {
          select: {
            id: true,
            valeur: true,
            typeVote: true
          }
        },
        _count: {
          select: {
            votes: true,
            commentaires: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: projets });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération des projets." 
    });
  }
};

// Liste des jurys
export const getAllJury = async (req, res) => {
  try {
    const jury = await prisma.jury.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        specialite: true,
        bio: true,
        photo: true,
        createdAt: true,
        _count: {
          select: {
            commentaires: true,
            votes: true
          }
        }
      }
    });

    res.json({ success: true, data: jury });
  } catch (error) {
    console.error('Erreur lors de la récupération des jurys:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération des jurys." 
    });
  }
};

// Statistiques globales
export const getStats = async (req, res) => {
  try {
    // Comptages de base
    const [
      totalUsers,
      etudiantCount,
      utilisateurCount,
      adminCount,
      juryCount,
      projetCount,
      projetApprouveCount,
      voteCount,
      commentaireCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ETUDIANT" } }),
      prisma.user.count({ where: { role: "UTILISATEUR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.jury.count(),
      prisma.projet.count(),
      prisma.projet.count({ where: { statut: "APPROUVE" } }),
      prisma.vote.count(),
      prisma.commentaire.count()
    ]);

    // Moyenne des votes
    const votesAvg = await prisma.vote.aggregate({
      _avg: {
        valeur: true
      }
    });

    // Statistiques par catégorie de projets
    const projetsByCategorie = await prisma.projet.groupBy({
      by: ['categorie'],
      _count: {
        id: true
      }
    });

    // Évolution des inscriptions (7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const inscriptionsLastWeek = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        createdAt: true
      }
    });

    // Grouper par jour
    const inscriptionsByDay = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      inscriptionsByDay[dateKey] = 0;
    }

    inscriptionsLastWeek.forEach(user => {
      const dateKey = user.createdAt.toISOString().split('T')[0];
      if (inscriptionsByDay[dateKey] !== undefined) {
        inscriptionsByDay[dateKey]++;
      }
    });

    const stats = {
      totalUsers,
      etudiantCount,
      utilisateurCount,
      adminCount,
      juryCount,
      projetCount,
      projetApprouveCount,
      voteCount,
      commentaireCount,
      moyenneVotes: votesAvg._avg.valeur || 0,
      projetsByCategorie,
      inscriptionsLastWeek: Object.values(inscriptionsByDay)
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération des statistiques." 
    });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la suppression de l'utilisateur." 
    });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        telephone: true,
        ecole: true,
        filiere: true,
        niveau: true,
        updatedAt: true
      }
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la mise à jour de l'utilisateur." 
    });
  }
};

// Créer un membre du jury
export const createJury = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, specialite, bio } = req.body;

    // Vérifier si l'email existe déjà
    const existingJury = await prisma.jury.findUnique({
      where: { email }
    });

    if (existingJury) {
      return res.status(400).json({ 
        success: false, 
        message: "Cet email est déjà utilisé." 
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 12);

    const jury = await prisma.jury.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        specialite,
        bio
      }
    });

    res.status(201).json({ success: true, data: jury });
  } catch (error) {
    console.error('Erreur lors de la création du jury:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la création du membre du jury." 
    });
  }
};

// Supprimer un membre du jury
export const deleteJury = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.jury.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Jury supprimé avec succès." });
  } catch (error) {
    console.error('Erreur lors de la suppression du jury:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la suppression du jury." 
    });
  }
};

// Supprimer un projet
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.projet.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Projet supprimé avec succès." });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la suppression du projet." 
    });
  }
};

// Mettre à jour le statut d'un projet
export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const projet = await prisma.projet.update({
      where: { id: parseInt(id) },
      data: { statut }
    });

    res.json({ success: true, data: projet });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut du projet:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la mise à jour du statut du projet." 
    });
  }
};

// ===== GESTION DU PROFIL ADMINISTRATEUR =====

/**
 * Récupérer le profil de l'administrateur connecté
 */
export const getAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const admin = await prisma.user.findUnique({
      where: { 
        id: userId,
        role: 'ADMIN'
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrateur non trouvé'
      })
    }

    res.json({
      success: true,
      data: admin
    })
  } catch (error) {
    console.error('Erreur récupération profil admin:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * Mettre à jour le profil de l'administrateur
 */
export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { nom, prenom, email, telephone, currentPassword, newPassword } = req.body

    // Vérifier que l'utilisateur est admin
    const admin = await prisma.user.findUnique({
      where: { 
        id: userId,
        role: 'ADMIN'
      }
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrateur non trouvé'
      })
    }

    // Préparer les données à mettre à jour
    const updateData = {}
    
    if (nom) updateData.nom = nom
    if (prenom) updateData.prenom = prenom
    if (telephone) updateData.telephone = telephone

    // Gestion du changement d'email
    if (email && email !== admin.email) {
      // Vérifier si l'email n'est pas déjà utilisé
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        })
      }
      
      updateData.email = email
    }

    // Gestion du changement de mot de passe
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe actuel est requis pour le modifier'
        })
      }

      // Vérifier le mot de passe actuel
      const isValidPassword = await bcrypt.compare(currentPassword, admin.motDePasse)
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Mot de passe actuel incorrect'
        })
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      updateData.motDePasse = hashedPassword
    }

    // Mettre à jour le profil
    const updatedAdmin = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        avatar: true,
        updatedAt: true
      }
    })

    res.json({
      success: true,
      data: updatedAdmin,
      message: 'Profil mis à jour avec succès'
    })

  } catch (error) {
    console.error('Erreur mise à jour profil admin:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * Upload d'avatar pour l'administrateur
 */
export const uploadAdminAvatar = async (req, res) => {
  try {
    const userId = req.user.id

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      })
    }

    // Vérifier que l'utilisateur est admin
    const admin = await prisma.user.findUnique({
      where: { 
        id: userId,
        role: 'ADMIN'
      }
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrateur non trouvé'
      })
    }

    // Supprimer l'ancien avatar s'il existe
    if (admin.avatar) {
      const oldAvatarPath = path.join(process.cwd(), 'src/uploads/avatars', admin.avatar)
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath)
      }
    }

    // Mettre à jour avec le nouveau avatar
    const updatedAdmin = await prisma.user.update({
      where: { id: userId },
      data: { avatar: req.file.filename },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        avatar: true,
        updatedAt: true
      }
    })

    res.json({
      success: true,
      data: updatedAdmin,
      message: 'Avatar mis à jour avec succès',
      avatarUrl: `/uploads/avatars/${req.file.filename}`
    })

  } catch (error) {
    console.error('Erreur upload avatar admin:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * Supprimer l'avatar de l'administrateur
 */
export const deleteAdminAvatar = async (req, res) => {
  try {
    const userId = req.user.id

    const admin = await prisma.user.findUnique({
      where: { 
        id: userId,
        role: 'ADMIN'
      }
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrateur non trouvé'
      })
    }

    // Supprimer le fichier avatar s'il existe
    if (admin.avatar) {
      const avatarPath = path.join(process.cwd(), 'src/uploads/avatars', admin.avatar)
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath)
      }
    }

    // Mettre à jour en base
    const updatedAdmin = await prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        avatar: true,
        updatedAt: true
      }
    })

    res.json({
      success: true,
      data: updatedAdmin,
      message: 'Avatar supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur suppression avatar admin:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// Récupérer tous les votes avec détails utilisateur et projet
export const getAllVotes = async (req, res) => {
  try {
    const { typeVote, search } = req.query;
    
    const whereClause = {
      AND: [
        typeVote ? { typeVote } : {},
        search ? {
          OR: [
            { projet: { titre: { contains: search, mode: 'insensitive' } } },
            { user: { nom: { contains: search, mode: 'insensitive' } } },
            { user: { prenom: { contains: search, mode: 'insensitive' } } },
            { user: { email: { contains: search, mode: 'insensitive' } } }
          ]
        } : {}
      ]
    };

    const votes = await prisma.vote.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
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
        },
        projet: {
          select: {
            id: true,
            titre: true,
            categorie: true,
            statut: true
          }
        }
      }
    });

    res.json({ success: true, data: votes });
  } catch (error) {
    console.error('Erreur lors de la récupération des votes:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération des votes." 
    });
  }
};

// Supprimer un vote (admin seulement)
export const deleteVote = async (req, res) => {
  try {
    const voteId = parseInt(req.params.id);

    const vote = await prisma.vote.findUnique({
      where: { id: voteId }
    });

    if (!vote) {
      return res.status(404).json({ 
        success: false, 
        message: "Vote non trouvé." 
      });
    }

    await prisma.vote.delete({
      where: { id: voteId }
    });

    res.json({ 
      success: true, 
      message: "Vote supprimé avec succès." 
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du vote:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la suppression du vote." 
    });
  }
};

// Export Excel des données
export const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];
    let fileName = '';
    let headers = [];

    switch (type) {
      case 'projets':
        const projets = await prisma.projet.findMany({
          include: {
            user: {
              select: {
                nom: true,
                prenom: true,
                email: true,
                ecole: true,
                filiere: true,
                niveau: true
              }
            },
            _count: {
              select: {
                votes: true,
                commentaires: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        headers = [
          'ID', 'Titre', 'Description', 'Catégorie', 'Statut', 'Fichier',
          'Auteur', 'Email', 'École', 'Filière', 'Niveau', 
          'Nombre de votes', 'Nombre de commentaires', 'Date de soumission'
        ];

        data = projets.map(projet => [
          projet.id,
          projet.titre,
          projet.description,
          projet.categorie,
          projet.statut,
          projet.fichier || 'Aucun',
          `${projet.user.prenom} ${projet.user.nom}`,
          projet.user.email,
          projet.user.ecole || 'Non spécifié',
          projet.user.filiere || 'Non spécifié',
          projet.user.niveau || 'Non spécifié',
          projet._count.votes,
          projet._count.commentaires,
          new Date(projet.createdAt).toLocaleDateString('fr-FR')
        ]);
        fileName = 'projets_export';
        break;

      case 'users':
        const users = await prisma.user.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });

        headers = [
          'ID', 'Nom', 'Prénom', 'Email', 'Rôle', 'Téléphone',
          'École', 'Filière', 'Niveau', 'Date d\'inscription'
        ];

        data = users.map(user => [
          user.id,
          user.nom,
          user.prenom,
          user.email,
          user.role,
          user.telephone || 'Non spécifié',
          user.ecole || 'Non spécifié',
          user.filiere || 'Non spécifié',
          user.niveau || 'Non spécifié',
          new Date(user.createdAt).toLocaleDateString('fr-FR')
        ]);
        fileName = 'utilisateurs_export';
        break;

      case 'votes':
        const votes = await prisma.vote.findMany({
          include: {
            user: {
              select: {
                nom: true,
                prenom: true,
                email: true
              }
            },
            projet: {
              select: {
                titre: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        headers = [
          'ID', 'Valeur', 'Type de vote', 'Projet', 'Votant',
          'Email du votant', 'Date du vote'
        ];

        data = votes.map(vote => [
          vote.id,
          vote.valeur,
          vote.typeVote,
          vote.projet.titre,
          `${vote.user.prenom} ${vote.user.nom}`,
          vote.user.email,
          new Date(vote.createdAt).toLocaleDateString('fr-FR')
        ]);
        fileName = 'votes_export';
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Type d'export non supporté"
        });
    }

    // Créer le workbook Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Ajuster la largeur des colonnes
    const colWidths = headers.map(() => ({ wch: 20 }));
    ws['!cols'] = colWidths;

    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Export');

    // Générer le fichier Excel
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Configurer les headers de réponse
    const timestamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}_${timestamp}.xlsx"`);

    // Envoyer le fichier
    res.send(buffer);

  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'export Excel"
    });
  }
};