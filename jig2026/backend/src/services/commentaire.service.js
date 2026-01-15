import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient()

export class CommentaireService {
  // Créer un commentaire
  static async createCommentaire(commentaireData) {
    const { contenu, projetId, juryId } = commentaireData
    
    // Vérifier si le projet existe
    const projet = await prisma.projet.findUnique({
      where: { id: parseInt(projetId) }
    })
    
    if (!projet) {
      throw new Error('Projet non trouvé')
    }

    // Vérifier si le jury existe
    const jury = await prisma.jury.findUnique({
      where: { id: parseInt(juryId) }
    })
    
    if (!jury) {
      throw new Error('Jury non trouvé')
    }

    // Créer le commentaire
    const commentaire = await prisma.commentaire.create({
      data: {
        contenu,
        projetId: parseInt(projetId),
        juryId: parseInt(juryId)
      },
      include: {
        projet: {
          select: {
            id: true,
            titre: true
          }
        },
        jury: {
          select: {
            id: true,
            nom: true,
            prenom: true,
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
        jury: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            specialite: true
          }
        }
      }
    })

    return commentaire
  }

  // Récupérer tous les commentaires
  static async getAllCommentaires() {
    // Récupérer tous les commentaires sans forcer la relation jury
    const commentaires = await prisma.commentaire.findMany({
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

    // Ensuite, enrichir avec les données du jury si disponible
    const commentairesEnrichis = await Promise.all(
      commentaires.map(async (commentaire) => {
        let jury = null
        if (commentaire.juryId) {
          try {
            jury = await prisma.jury.findUnique({
              where: { id: commentaire.juryId },
              select: {
                id: true,
                nom: true,
                prenom: true,
                specialite: true
              }
            })
          } catch (error) {
            console.warn(`Jury ${commentaire.juryId} non trouvé`)
          }
        }
        
        return {
          ...commentaire,
          jury
        }
      })
    )

    return commentairesEnrichis
  }

  // Récupérer les commentaires d'un projet
  static async getCommentairesByProjet(projetId) {
    const commentaires = await prisma.commentaire.findMany({
      where: { projetId: parseInt(projetId) },
      include: {
        jury: {
          select: {
            id: true,
            nom: true,
            prenom: true,
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

  // Vérifier si un jury peut commenter un projet
  static async canJuryComment(projetId, juryId) {
    // Pour l'instant, un jury peut faire plusieurs commentaires
    // On pourrait ajouter des restrictions plus tard
    const projet = await prisma.projet.findUnique({
      where: { id: parseInt(projetId) }
    })

    const jury = await prisma.jury.findUnique({
      where: { id: parseInt(juryId) }
    })

    return !!(projet && jury)
  }
}