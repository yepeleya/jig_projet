import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient()

export class VoteService {
  // Créer un vote
  static async createVote(voteData) {
    const { projetId, valeur, userId, juryId } = voteData
    
    // Déterminer le type de vote
    const typeVote = juryId ? 'JURY' : 'ETUDIANT'
    
    // Vérifier si le projet existe
    const projet = await prisma.projet.findUnique({
      where: { id: parseInt(projetId) }
    })
    
    if (!projet) {
      throw new Error('Projet non trouvé')
    }

    // Vérifier si l'utilisateur a déjà voté pour ce projet
    const existingVote = await prisma.vote.findFirst({
      where: {
        projetId: parseInt(projetId),
        ...(userId && { userId: parseInt(userId) }),
        ...(juryId && { juryId: parseInt(juryId) })
      }
    })

    if (existingVote) {
      throw new Error('Vous avez déjà voté pour ce projet')
    }

    // Créer le vote
    const vote = await prisma.vote.create({
      data: {
        projetId: parseInt(projetId),
        valeur: parseFloat(valeur),
        typeVote,
        ...(userId && { userId: parseInt(userId) }),
        ...(juryId && { juryId: parseInt(juryId) })
      },
      include: {
        projet: {
          select: {
            id: true,
            titre: true
          }
        },
        ...(userId && {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true
            }
          }
        }),
        ...(juryId && {
          jury: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              specialite: true
            }
          }
        })
      }
    })

    // Recalculer les statistiques du projet
    await this.updateProjetStats(parseInt(projetId))

    return vote
  }

  // Mettre à jour un vote
  static async updateVote(id, voteData) {
    const { valeur } = voteData
    
    const vote = await prisma.vote.update({
      where: { id: parseInt(id) },
      data: {
        valeur: parseFloat(valeur)
      },
      include: {
        projet: {
          select: {
            id: true,
            titre: true
          }
        }
      }
    })

    // Recalculer les statistiques du projet
    await this.updateProjetStats(vote.projetId)

    return vote
  }

  // Récupérer tous les votes
  static async getAllVotes(filters = {}) {
    const { projetId, userId, juryId, typeVote } = filters
    
    const where = {}
    if (projetId) where.projetId = parseInt(projetId)
    if (userId) where.userId = parseInt(userId)
    if (juryId) where.juryId = parseInt(juryId)
    if (typeVote) where.typeVote = typeVote

    const votes = await prisma.vote.findMany({
      where,
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
            filiere: true
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
      },
      orderBy: { createdAt: 'desc' }
    })

    return votes
  }

  // Récupérer les votes d'un projet
  static async getVotesByProjet(projetId) {
    const votes = await prisma.vote.findMany({
      where: { projetId: parseInt(projetId) },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            filiere: true
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
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculer les statistiques
    const stats = await this.calculateVoteStats(parseInt(projetId))

    return {
      votes,
      stats
    }
  }

  // Récupérer les votes d'un utilisateur
  static async getVotesByUser(userId, userType = 'user') {
    try {
      // D'abord récupérer les votes sans inclusion des projets
      const baseWhere = userType === 'jury' 
        ? { juryId: parseInt(userId) }
        : { userId: parseInt(userId) }

      const votes = await prisma.vote.findMany({
        where: baseWhere,
        orderBy: { createdAt: 'desc' }
      })

      // Ensuite récupérer les projets existants pour chaque vote
      const votesWithProjects = []
      
      for (const vote of votes) {
        try {
          const projet = await prisma.projet.findUnique({
            where: { id: vote.projetId },
            select: {
              id: true,
              titre: true,
              description: true,
              categorie: true,
              image: true
            }
          })
          
          if (projet) {
            votesWithProjects.push({
              ...vote,
              projet
            })
          } else {
            console.log(`Vote ${vote.id} référence un projet supprimé (${vote.projetId})`)
          }
        } catch (err) {
          console.log(`Erreur lors de la récupération du projet ${vote.projetId}:`, err.message)
        }
      }
      
      return votesWithProjects
    } catch (error) {
      console.error('Erreur lors de la récupération des votes utilisateur:', error)
      throw error
    }
  }

  // Récupérer les votes par userId (utilisateurs avec rôle JURY)
  static async getVotesByUserId(userId) {
    return this.getVotesByUser(userId, 'user')
  }

  // Récupérer les votes par juryId (table Jury)
  static async getVotesByJuryId(juryId) {
    return this.getVotesByUser(juryId, 'jury')
  }

  // Supprimer un vote
  static async deleteVote(id) {
    const vote = await prisma.vote.findUnique({
      where: { id: parseInt(id) }
    })

    if (!vote) {
      throw new Error('Vote non trouvé')
    }

    await prisma.vote.delete({
      where: { id: parseInt(id) }
    })

    // Recalculer les statistiques du projet
    await this.updateProjetStats(vote.projetId)

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
        scoreTotal: 0,
        distribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
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

    // Distribution des notes
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    votes.forEach(vote => {
      const note = Math.round(vote.valeur)
      if (distribution[note] !== undefined) {
        distribution[note]++
      }
    })

    return {
      moyenneGenerale: Math.round(moyenneGenerale * 10) / 10,
      moyenneJury: Math.round(moyenneJury * 10) / 10,
      moyenneEtudiants: Math.round(moyenneEtudiants * 10) / 10,
      totalVotes: votes.length,
      votesJury: votesJury.length,
      votesEtudiants: votesEtudiants.length,
      scoreTotal: Math.round(scoreTotal * 10) / 10,
      distribution
    }
  }

  // Mettre à jour les statistiques d'un projet
  static async updateProjetStats(projetId) {
    const stats = await this.calculateVoteStats(projetId)
    
    await prisma.projet.update({
      where: { id: parseInt(projetId) },
      data: {
        moyenneVote: stats.scoreTotal,
        totalVotes: stats.totalVotes
      }
    })

    return stats
  }

  // Obtenir le classement des projets
  static async getClassement(categorie = null) {
    const where = {}
    if (categorie) where.categorie = categorie

    const projets = await prisma.projet.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            filiere: true
          }
        },
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: [
        { moyenneVote: 'desc' },
        { totalVotes: 'desc' },
        { createdAt: 'asc' }
      ]
    })

    // Ajouter le rang et les statistiques détaillées
    const classement = await Promise.all(
      projets.map(async (projet, index) => {
        const stats = await this.calculateVoteStats(projet.id)
        return {
          ...projet,
          rang: index + 1,
          ...stats
        }
      })
    )

    return classement
  }

  // Vérifier si un utilisateur peut voter
  static async canUserVote(projetId, userId, userType = 'user') {
    const where = {
      projetId: parseInt(projetId)
    }

    if (userType === 'jury') {
      where.juryId = parseInt(userId)
    } else {
      where.userId = parseInt(userId)
    }

    const existingVote = await prisma.vote.findFirst({ where })
    
    return !existingVote
  }
}