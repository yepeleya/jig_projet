import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ProjetSuiviService {
  
  // Ajouter une nouvelle entrée de suivi
  static async ajouterSuivi(data) {
    try {
      const suivi = await prisma.projetSuivi.create({
        data: {
          projetId: data.projetId,
          userId: data.userId || null,
          juryId: data.juryId || null,
          typeReaction: data.typeReaction,
          message: data.message,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          visible: data.visible !== undefined ? data.visible : true
        },
        include: {
          user: {
            select: { nom: true, prenom: true, role: true }
          },
          jury: {
            select: { nom: true, prenom: true }
          },
          projet: {
            select: { titre: true, statut: true }
          }
        }
      })

      return {
        success: true,
        data: suivi
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du suivi:', error)
      return {
        success: false,
        message: 'Erreur lors de l\'ajout du suivi'
      }
    }
  }

  // Récupérer le suivi d'un projet
  static async getSuiviProjet(projetId, includeHidden = false) {
    try {
      const whereCondition = {
        projetId: parseInt(projetId)
      }

      if (!includeHidden) {
        whereCondition.visible = true
      }

      const suivi = await prisma.projetSuivi.findMany({
        where: whereCondition,
        include: {
          user: {
            select: { nom: true, prenom: true, role: true }
          },
          jury: {
            select: { nom: true, prenom: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return {
        success: true,
        data: suivi.map(item => ({
          ...item,
          metadata: item.metadata ? JSON.parse(item.metadata) : null,
          auteur: item.user || item.jury
        }))
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du suivi:', error)
      return {
        success: false,
        message: 'Erreur lors de la récupération du suivi'
      }
    }
  }

  // Récupérer le suivi de tous les projets d'un utilisateur
  static async getSuiviUtilisateur(userId) {
    try {
      console.log('🔍 getSuiviUtilisateur pour userId:', userId)
      const projetsUtilisateur = await prisma.projet.findMany({
        where: { userId: parseInt(userId) },
        select: { id: true, titre: true }
      })
      console.log('📋 Projets de l\'utilisateur:', projetsUtilisateur)

      const projetIds = projetsUtilisateur.map(p => p.id)

      // Si l'utilisateur n'a pas de projets, retourner un tableau vide
      if (projetIds.length === 0) {
        return {
          success: true,
          data: []
        }
      }

      console.log('🔍 Recherche suivis pour projets IDs:', projetIds)
      const suivi = await prisma.projetSuivi.findMany({
        where: {
          projetId: { in: projetIds },
          visible: true
        },
        include: {
          user: {
            select: { nom: true, prenom: true, role: true }
          },
          jury: {
            select: { nom: true, prenom: true }
          },
          projet: {
            select: { titre: true, statut: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      console.log('📊 Suivis trouvés:', suivi.length, suivi)
      return {
        success: true,
        data: suivi.map(item => ({
          ...item,
          metadata: item.metadata ? JSON.parse(item.metadata) : null,
          auteur: item.user || item.jury
        }))
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du suivi utilisateur:', error)
      return {
        success: false,
        message: 'Erreur lors de la récupération du suivi'
      }
    }
  }

  // Récupérer tous les suivis de tous les projets (pour admin/jury)
  static async getAllSuivis(includeHidden = false) {
    try {
      console.log('🔍 getAllSuivis - includeHidden:', includeHidden)
      
      const whereCondition = {}
      if (!includeHidden) {
        whereCondition.visible = true
      }

      const suivi = await prisma.projetSuivi.findMany({
        where: whereCondition,
        include: {
          user: {
            select: { nom: true, prenom: true, role: true }
          },
          jury: {
            select: { nom: true, prenom: true }
          },
          projet: {
            select: { titre: true, statut: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      console.log('📊 Tous les suivis trouvés:', suivi.length)
      return {
        success: true,
        data: suivi.map(item => ({
          ...item,
          metadata: item.metadata ? JSON.parse(item.metadata) : null,
          auteur: item.user || item.jury
        }))
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les suivis:', error)
      return {
        success: false,
        message: 'Erreur lors de la récupération de tous les suivis'
      }
    }
  }

  // Marquer une entrée comme non visible
  static async masquerSuivi(suiviId) {
    try {
      const suivi = await prisma.projetSuivi.update({
        where: { id: parseInt(suiviId) },
        data: { visible: false }
      })

      return {
        success: true,
        data: suivi
      }
    } catch (error) {
      console.error('Erreur lors du masquage du suivi:', error)
      return {
        success: false,
        message: 'Erreur lors du masquage du suivi'
      }
    }
  }

  // Supprimer une entrée de suivi
  static async supprimerSuivi(suiviId) {
    try {
      await prisma.projetSuivi.delete({
        where: { id: parseInt(suiviId) }
      })

      return {
        success: true,
        message: 'Entrée de suivi supprimée avec succès'
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du suivi:', error)
      return {
        success: false,
        message: 'Erreur lors de la suppression du suivi'
      }
    }
  }

  // Ajouter automatiquement un suivi lors d'un vote
  static async ajouterSuiviVote(projetId, userId, juryId, valeur) {
    try {
      // Vérifier si le votant est le propriétaire du projet
      const projet = await prisma.projet.findUnique({
        where: { id: parseInt(projetId) },
        select: { userId: true }
      })
      
      // Si le votant est le propriétaire du projet, ne pas créer de suivi
      if (userId && projet && projet.userId === userId) {
        console.log('🚫 Pas de suivi créé : l\'utilisateur vote pour son propre projet')
        return { success: true, data: null }
      }
      
      const auteur = userId ? 'un utilisateur' : 'un membre du jury'
      const message = `${auteur} a attribué une note de ${valeur}/5 à ce projet`
      
      return await this.ajouterSuivi({
        projetId,
        userId,
        juryId,
        typeReaction: 'VOTE',
        message,
        metadata: { score: valeur },
        visible: true
      })
    } catch (error) {
      console.error('Erreur lors de l\'ajout du suivi vote:', error)
      return {
        success: false,
        message: 'Erreur lors de l\'ajout du suivi vote'
      }
    }
  }

  // Ajouter automatiquement un suivi lors d'un commentaire
  static async ajouterSuiviCommentaire(projetId, juryId, contenu) {
    return await this.ajouterSuivi({
      projetId,
      juryId,
      typeReaction: 'COMMENTAIRE',
      message: 'Un membre du jury a ajouté un commentaire',
      metadata: { commentaire: contenu.substring(0, 100) + (contenu.length > 100 ? '...' : '') },
      visible: true
    })
  }

  // Ajouter automatiquement un suivi lors d'un changement de statut
  static async ajouterSuiviStatut(projetId, nouveauStatut, userId = null) {
    const statusMessages = {
      'EN_ATTENTE': 'Le projet est en attente d\'évaluation',
      'EN_COURS': 'L\'évaluation du projet a commencé',
      'EVALUE': 'Le projet a été évalué par le jury',
      'TERMINE': 'L\'évaluation du projet est terminée',
      'APPROUVE': 'Le projet a été approuvé !',
      'REJETE': 'Le projet a été rejeté',
      'SUSPENDU': 'Le projet a été suspendu'
    }

    return await this.ajouterSuivi({
      projetId,
      userId,
      typeReaction: 'MODIFICATION',
      message: statusMessages[nouveauStatut] || 'Le statut du projet a été modifié',
      metadata: { nouveauStatut },
      visible: true
    })
  }
}

export default ProjetSuiviService