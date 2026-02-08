import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient()

export class ProjetService {
  // Créer un nouveau projet
  static async createProjet(projetData, files = {}) {
    const { titre, description, categorie, userId } = projetData
    
    const data = {
      titre,
      description,
      categorie,
      userId: parseInt(userId)
    }

    // Ajouter les fichiers s'ils existent
    if (files.projet && files.projet[0]) {
      data.fichier = files.projet[0].filename
    }
    
    if (files.image && files.image[0]) {
      data.image = files.image[0].filename
    }

    const projet = await prisma.projet.create({
      data,
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
        votes: true,
        commentaires: {
          include: {
            user: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                role: true
              }
            }
          }
        }
      }
    })

    return projet
  }

  // Récupérer tous les projets
  static async getAllProjets(filters = {}) {
    const { categorie, statut, userId, page = 1, limit = 10 } = filters
    
    const where = {}
    
    if (categorie) where.categorie = categorie
    if (statut) where.statut = statut
    if (userId) where.userId = parseInt(userId)

    const skip = (page - 1) * limit

    const [projets, total] = await Promise.all([
      prisma.projet.findMany({
        where,
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
          votes: true,
          commentaires: {
            include: {
              user: {
                select: {
                  id: true,
                  nom: true,
                  prenom: true,
                  role: true
                }
              }
            }
          },
          _count: {
            select: {
              votes: true,
              commentaires: true
            }
          }
        },
        orderBy: { id: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.projet.count({ where })
    ])

    // Calculer les moyennes des votes
    const projetsWithStats = await Promise.all(
      projets.map(async (projet) => {
        const stats = await this.calculateVoteStats(projet.id)
        return {
          ...projet,
          ...stats
        }
      })
    )

    return {
      projets: projetsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Récupérer un projet par ID
  static async getProjetById(id) {
    const projet = await prisma.projet.findUnique({
      where: { id: parseInt(id) },
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
        votes: {
          include: {
            user: {
              select: {
                id: true,
                nom: true,
                prenom: true
              }
            },
            user: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                role: true
              }
            }
          }
        },
        commentaires: {
          include: {
            user: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                role: true
              }
            }
          },
          orderBy: { id: 'desc' }
        }
      }
    })

    if (!projet) {
      throw new Error('Projet non trouvé')
    }

    // Calculer les statistiques de vote
    const stats = await this.calculateVoteStats(projet.id)
    
    return {
      ...projet,
      ...stats
    }
  }

  // Mettre à jour un projet
  static async updateProjet(id, projetData, files = {}) {
    const { titre, description, categorie, statut } = projetData
    
    const data = {}
    if (titre) data.titre = titre
    if (description) data.description = description
    if (categorie) data.categorie = categorie
    if (statut) data.statut = statut

    // Ajouter les nouveaux fichiers s'ils existent
    if (files.projet && files.projet[0]) {
      data.fichier = files.projet[0].filename
    }
    
    if (files.image && files.image[0]) {
      data.image = files.image[0].filename
    }

    const projet = await prisma.projet.update({
      where: { id: parseInt(id) },
      data,
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
        votes: true,
        commentaires: {
          include: {
            user: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                role: true
              }
            }
          }
        }
      }
    })

    return projet
  }

  // Supprimer un projet
  static async deleteProjet(id) {
    const projet = await prisma.projet.findUnique({
      where: { id: parseInt(id) }
    })

    if (!projet) {
      throw new Error('Projet non trouvé')
    }

    await prisma.projet.delete({
      where: { id: parseInt(id) }
    })

    return true
  }

  // Calculer les statistiques de vote d'un projet
  static async calculateVoteStats(projetId) {
    const votes = await prisma.vote.findMany({
      where: { projetId: parseInt(projetId) }
    })

    if (votes.length === 0) {
      return {
        moyenneGenerale: 0,
        moyenneJury: 0,
        moyenneEtudiants: 0,
        totalVotes: 0,
        votesJury: 0,
        votesEtudiants: 0,
        scoreTotal: 0
      }
    }

    const votesJury = votes.filter(v => v.typeVote === 'JURY')
    const votesEtudiants = votes.filter(v => v.typeVote === 'ETUDIANT')

    const moyenneJury = votesJury.length > 0 
      ? votesJury.reduce((sum, v) => sum + v.valeur, 0) / votesJury.length 
      : 0

    const moyenneEtudiants = votesEtudiants.length > 0 
      ? votesEtudiants.reduce((sum, v) => sum + v.valeur, 0) / votesEtudiants.length 
      : 0

    // Calcul de la moyenne pondérée (70% jury, 30% étudiants)
    const scoreTotal = (moyenneJury * 0.7) + (moyenneEtudiants * 0.3)
    const moyenneGenerale = votes.reduce((sum, v) => sum + v.valeur, 0) / votes.length

    // Mettre à jour les stats dans la base
    await prisma.projet.update({
      where: { id: parseInt(projetId) },
      data: {
        moyenneVote: scoreTotal,
        totalVotes: votes.length
      }
    })

    return {
      moyenneGenerale: Math.round(moyenneGenerale * 10) / 10,
      moyenneJury: Math.round(moyenneJury * 10) / 10,
      moyenneEtudiants: Math.round(moyenneEtudiants * 10) / 10,
      totalVotes: votes.length,
      votesJury: votesJury.length,
      votesEtudiants: votesEtudiants.length,
      scoreTotal: Math.round(scoreTotal * 10) / 10
    }
  }

  // Récupérer les catégories disponibles
  static async getCategories() {
    const categories = await prisma.projet.findMany({
      select: { categorie: true },
      distinct: ['categorie']
    })

    return categories.map(c => c.categorie).filter(Boolean)
  }

  // Récupérer les projets par utilisateur
  static async getProjetsByUser(userId) {
    const projets = await prisma.projet.findMany({
      where: { userId: parseInt(userId) },
      include: {
        votes: true,
        commentaires: {
          include: {
            jury: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                specialite: true
              }
            }
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
    })

    // Ajouter les statistiques de vote
    const projetsWithStats = await Promise.all(
      projets.map(async (projet) => {
        const stats = await this.calculateVoteStats(projet.id)
        return {
          ...projet,
          ...stats
        }
      })
    )

    return projetsWithStats
  }
}