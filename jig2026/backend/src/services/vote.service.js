import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient()

export class VoteService {
  // Créer un vote (maintenant tous les utilisateurs sont dans User)
  static async createVote(voteData) {
    const { projetId, valeur, userId, typeVote } = voteData
    
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
        userId: parseInt(userId)
      }
    })

    if (existingVote) {
      throw new Error('Vous avez déjà voté pour ce projet')
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    // Déterminer le type de vote selon le rôle de l'utilisateur si non spécifié
    let finalTypeVote = typeVote
    if (!finalTypeVote) {
      const rolesJury = ['JURY', 'EXPERT', 'ORGANISATEUR']
      const rolesEtudiant = ['ETUDIANT_LICENCE', 'ETUDIANT_MASTER', 'ETUDIANT_DOCTORAT', 'ELEVE_LYCEE', 'ELEVE_COLLEGE']
      const rolesProfessionnel = ['PROFESSIONNEL', 'ENTREPRISE', 'STARTUP', 'FREELANCE', 'ENSEIGNANT', 'CHERCHEUR']
      
      if (rolesJury.includes(user.role)) {
        finalTypeVote = 'JURY_TECHNIQUE'
      } else if (rolesEtudiant.includes(user.role)) {
        finalTypeVote = 'ETUDIANT'
      } else if (rolesProfessionnel.includes(user.role)) {
        finalTypeVote = 'PROFESSIONNEL'
      } else {
        finalTypeVote = 'PUBLIC_GENERAL'
      }
    }

    // Créer le vote
    const vote = await prisma.vote.create({
      data: {
        projetId: parseInt(projetId),
        valeur: parseFloat(valeur),
        typeVote: finalTypeVote,
        userId: parseInt(userId)
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

  // Récupérer les votes d'un utilisateur (maintenant tous dans User)
  static async getVotesByUser(userId) {
    try {
      // Récupérer les votes de l'utilisateur
      const votes = await prisma.vote.findMany({
        where: { userId: parseInt(userId) },
        include: {
          projet: {
            select: {
              id: true,
              titre: true,
              description: true,
              categorie: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Filtrer les votes dont les projets existent encore
      const validVotes = votes.filter(vote => vote.projet !== null)
      
      if (validVotes.length !== votes.length) {
        console.log(`${votes.length - validVotes.length} vote(s) référence(nt) des projets supprimés`)
      }
      
      return validVotes
    } catch (error) {
      console.error('Erreur lors de la récupération des votes utilisateur:', error)
      throw error
    }
  }

  // Récupérer les votes par userId (méthode simplifiée)
  static async getVotesByUserId(userId) {
    return this.getVotesByUser(userId)
  }

  // Méthode de compatibilité pour l'ancienne API jury
  static async getVotesByJuryId(userId) {
    return this.getVotesByUser(userId)
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