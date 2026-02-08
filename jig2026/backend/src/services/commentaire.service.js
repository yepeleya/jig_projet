import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient()

export class CommentaireService {
  // Créer un commentaire (maintenant tous les utilisateurs sont dans User)
  static async createCommentaire(commentaireData) {
    const { contenu, projetId, userId } = commentaireData
    
    // Vérifier si le projet existe
    const projet = await prisma.projet.findUnique({
      where: { id: parseInt(projetId) }
    })
    
    if (!projet) {
      throw new Error('Projet non trouvé')
    }

    // Vérifier si l'utilisateur existe et a les permissions appropriées
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })
    
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    // Créer le commentaire
    const commentaire = await prisma.commentaire.create({
      data: {
        contenu,
        projetId: parseInt(projetId),
        userId: parseInt(userId)
      },
      include: {
        projet: {
          select: {
            id: true,
            titre: true
          }
        },
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            role: true,
            specialite: true
          }
        }
      }
    })

    return commentaire
  }

  // Mettre à jour un commentaire
  static async updateCommentaire(id, commentaireData) {
    const { contenu } = commentaireData
    
    const commentaire = await prisma.commentaire.update({
      where: { id: parseInt(id) },
      data: { contenu },
      include: {
        projet: {
          select: {
            id: true,
            titre: true
          }
        },
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            role: true,
            specialite: true
          }
        }
      }
    })

    return commentaire
  }

  // Récupérer tous les commentaires
  static async getAllCommentaires() {
    const commentaires = await prisma.commentaire.findMany({
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
            role: true,
            specialite: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return commentaires
  }

  // Récupérer les commentaires d'un projet
  static async getCommentairesByProjet(projetId) {
    const commentaires = await prisma.commentaire.findMany({
      where: { projetId: parseInt(projetId) },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            role: true,
            specialite: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return commentaires
  }

  // Récupérer les commentaires d'un jury
  static async getCommentairesByJuryId(juryId) {
    try {
      // D'abord récupérer les commentaires sans include
      const commentaires = await prisma.commentaire.findMany({
        where: { juryId: parseInt(juryId) },
        orderBy: { createdAt: 'desc' }
      });

      // Ensuite récupérer les projets séparément pour éviter les erreurs avec projets supprimés
      const commentairesAvecProjets = await Promise.all(
        commentaires.map(async (commentaire) => {
          let projet = null;
          if (commentaire.projetId) {
            try {
              projet = await prisma.projet.findUnique({
                where: { id: commentaire.projetId },
                select: {
                  id: true,
                  titre: true,
                  description: true,
                  categorie: true,
                  image: true
                }
              });
            } catch (error) {
              console.log(`Commentaire ${commentaire.id} référence un projet supprimé (${commentaire.projetId})`);
            }
          }
          return {
            ...commentaire,
            projet
          };
        })
      );

      return commentairesAvecProjets;
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      throw error;
    }
  }

  // Supprimer un commentaire
  static async deleteCommentaire(id) {
    const commentaire = await prisma.commentaire.findUnique({
      where: { id: parseInt(id) }
    })

    if (!commentaire) {
      throw new Error('Commentaire non trouvé')
    }

    await prisma.commentaire.delete({
      where: { id: parseInt(id) }
    })

    return true
  }

  // Vérifier si un utilisateur peut commenter un projet
  static async canUserComment(projetId, userId) {
    const projet = await prisma.projet.findUnique({
      where: { id: parseInt(projetId) }
    })

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })

    // Tous les utilisateurs connectés peuvent commenter
    // On pourrait ajouter des restrictions par rôle plus tard
    return !!(projet && user)
  }

  // Méthode de compatibilité (ancienne API)
  static async canJuryComment(projetId, userId) {
    return this.canUserComment(projetId, userId)
  }

  // Récupérer les commentaires par utilisateur (remplace getCommentairesByJuryId)
  static async getCommentairesByUserId(userId) {
    const commentaires = await prisma.commentaire.findMany({
      where: { userId: parseInt(userId) },
      include: {
        projet: {
          select: {
            id: true,
            titre: true,
            categorie: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return commentaires
  }
}