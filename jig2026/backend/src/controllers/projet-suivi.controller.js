import ProjetSuiviService from '../services/projet-suivi.service.js'
import verifyToken from '../middlewares/verifyToken.js'

// Ajouter une nouvelle entrée de suivi (admin/jury seulement)
export const ajouterSuivi = async (req, res) => {
  try {
    const { projetId, typeReaction, message, metadata, visible } = req.body
    const userId = req.user?.role === 'ADMIN' ? req.user.id : null
    const juryId = req.user?.role === 'JURY' ? req.user.id : null

    if (!projetId || !typeReaction || !message) {
      return res.status(400).json({
        success: false,
        message: 'Projet ID, type de réaction et message sont requis'
      })
    }

    const result = await ProjetSuiviService.ajouterSuivi({
      projetId: parseInt(projetId),
      userId,
      juryId,
      typeReaction,
      message,
      metadata,
      visible
    })

    if (result.success) {
      res.status(201).json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (error) {
    console.error('Erreur dans ajouterSuivi:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'ajout du suivi'
    })
  }
}

// Récupérer le suivi d'un projet
export const getSuiviProjet = async (req, res) => {
  try {
    const { projetId } = req.params
    const includeHidden = req.user?.role === 'ADMIN' || req.user?.role === 'JURY'

    if (!projetId) {
      return res.status(400).json({
        success: false,
        message: 'ID du projet requis'
      })
    }

    const result = await ProjetSuiviService.getSuiviProjet(projetId, includeHidden)

    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (error) {
    console.error('Erreur dans getSuiviProjet:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du suivi'
    })
  }
}

// Récupérer le suivi de tous les projets d'un utilisateur
export const getMesSuivis = async (req, res) => {
  try {
    console.log('🔍 getMesSuivis appelé pour user:', req.user?.id, req.user?.nom, req.user?.prenom)
    const userId = req.user.id

    const result = await ProjetSuiviService.getSuiviUtilisateur(userId)
    console.log('📊 Résultat getSuiviUtilisateur:', result)

    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (error) {
    console.error('Erreur dans getMesSuivis:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de vos suivis'
    })
  }
}

// Masquer une entrée de suivi (admin seulement)
export const masquerSuivi = async (req, res) => {
  try {
    const { suiviId } = req.params

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      })
    }

    const result = await ProjetSuiviService.masquerSuivi(suiviId)

    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (error) {
    console.error('Erreur dans masquerSuivi:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du masquage du suivi'
    })
  }
}

// Supprimer une entrée de suivi (admin seulement)
export const supprimerSuivi = async (req, res) => {
  try {
    const { suiviId } = req.params

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      })
    }

    const result = await ProjetSuiviService.supprimerSuivi(suiviId)

    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (error) {
    console.error('Erreur dans supprimerSuivi:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du suivi'
    })
  }
}