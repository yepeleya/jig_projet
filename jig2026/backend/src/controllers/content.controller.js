import { ContentService } from '../services/content.service.js';

// Récupérer tout le contenu (admin)
export const getAllContent = async (req, res) => {
  try {
    const content = await ContentService.getAllContent();
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu',
      error: error.message
    });
  }
};

// Récupérer le contenu d'une page spécifique
export const getContentByPage = async (req, res) => {
  try {
    const { page } = req.params;
    const content = await ContentService.getContentByPage(page);
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu de la page:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu de la page',
      error: error.message
    });
  }
};

// Récupérer un contenu par sa clé
export const getContentByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const content = await ContentService.getContentByKey(key);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu',
      error: error.message
    });
  }
};

// Créer un nouveau contenu
export const createContent = async (req, res) => {
  try {
    const content = await ContentService.createContent(req.body);
    res.status(201).json({
      success: true,
      message: 'Contenu créé avec succès',
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la création du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du contenu',
      error: error.message
    });
  }
};

// Mettre à jour un contenu
export const updateContent = async (req, res) => {
  try {
    const { key } = req.params;
    const content = await ContentService.updateContent(key, req.body);
    res.json({
      success: true,
      message: 'Contenu mis à jour avec succès',
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du contenu',
      error: error.message
    });
  }
};

// Supprimer un contenu
export const deleteContent = async (req, res) => {
  try {
    const { key } = req.params;
    await ContentService.deleteContent(key);
    res.json({
      success: true,
      message: 'Contenu supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du contenu',
      error: error.message
    });
  }
};

// Activer/désactiver un contenu
export const toggleContent = async (req, res) => {
  try {
    const { key } = req.params;
    const content = await ContentService.toggleContent(key);
    res.json({
      success: true,
      message: `Contenu ${content.actif ? 'activé' : 'désactivé'} avec succès`,
      data: content
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de statut du contenu',
      error: error.message
    });
  }
};

// Récupérer les pages disponibles
export const getAvailablePages = async (req, res) => {
  try {
    const pages = await ContentService.getAvailablePages();
    res.json({
      success: true,
      data: pages
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des pages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des pages',
      error: error.message
    });
  }
};

// Récupérer les sections d'une page
export const getPageSections = async (req, res) => {
  try {
    const { page } = req.params;
    const sections = await ContentService.getPageSections(page);
    res.json({
      success: true,
      data: sections
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des sections:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des sections',
      error: error.message
    });
  }
};

// Initialiser le contenu par défaut
export const initializeDefaultContent = async (req, res) => {
  try {
    await ContentService.initializeDefaultContent();
    res.json({
      success: true,
      message: 'Contenu par défaut initialisé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'initialisation du contenu',
      error: error.message
    });
  }
};