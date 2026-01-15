import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export class ContentService {
  // Récupérer tout le contenu pour une page
  static async getContentByPage(page) {
    return await prisma.contenuSite.findMany({
      where: { 
        page,
        actif: true
      },
      orderBy: [
        { section: 'asc' },
        { ordre: 'asc' }
      ]
    });
  }

  // Récupérer un contenu spécifique par sa clé
  static async getContentByKey(cle) {
    return await prisma.contenuSite.findUnique({
      where: { cle }
    });
  }

  // Récupérer tout le contenu (pour l'admin)
  static async getAllContent() {
    return await prisma.contenuSite.findMany({
      orderBy: [
        { page: 'asc' },
        { section: 'asc' },
        { ordre: 'asc' }
      ]
    });
  }

  // Créer un nouveau contenu
  static async createContent(data) {
    return await prisma.contenuSite.create({
      data: {
        cle: data.cle,
        titre: data.titre,
        contenu: data.contenu,
        type: data.type || 'TEXT',
        page: data.page,
        section: data.section,
        description: data.description,
        ordre: data.ordre || 0,
        actif: data.actif !== undefined ? data.actif : true
      }
    });
  }

  // Mettre à jour un contenu
  static async updateContent(cle, data) {
    return await prisma.contenuSite.update({
      where: { cle },
      data: {
        ...(data.titre && { titre: data.titre }),
        ...(data.contenu !== undefined && { contenu: data.contenu }),
        ...(data.type && { type: data.type }),
        ...(data.page && { page: data.page }),
        ...(data.section && { section: data.section }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.ordre !== undefined && { ordre: data.ordre }),
        ...(data.actif !== undefined && { actif: data.actif })
      }
    });
  }

  // Supprimer un contenu
  static async deleteContent(cle) {
    return await prisma.contenuSite.delete({
      where: { cle }
    });
  }

  // Désactiver/activer un contenu
  static async toggleContent(cle) {
    const content = await prisma.contenuSite.findUnique({
      where: { cle }
    });
    
    if (!content) {
      throw new Error('Contenu non trouvé');
    }

    return await prisma.contenuSite.update({
      where: { cle },
      data: { actif: !content.actif }
    });
  }

  // Récupérer les pages disponibles
  static async getAvailablePages() {
    const pages = await prisma.contenuSite.groupBy({
      by: ['page'],
      orderBy: { page: 'asc' }
    });
    
    return pages.map(p => p.page);
  }

  // Récupérer les sections d'une page
  static async getPageSections(page) {
    const sections = await prisma.contenuSite.groupBy({
      by: ['section'],
      where: { page },
      orderBy: { section: 'asc' }
    });
    
    return sections.map(s => s.section);
  }

  // Initialiser le contenu par défaut
  static async initializeDefaultContent() {
    const defaultContent = [
      // Page d'accueil
      {
        cle: 'hero-title',
        titre: 'Titre principal',
        contenu: 'Journée de l\'Innovation et de la Gestion 2026',
        type: 'TEXT',
        page: 'home',
        section: 'hero',
        description: 'Titre principal de la page d\'accueil',
        ordre: 1
      },
      {
        cle: 'hero-subtitle',
        titre: 'Sous-titre hero',
        contenu: 'Concours d\'innovation technologique pour les étudiants d\'Afrique de l\'Ouest',
        type: 'TEXT',
        page: 'home',
        section: 'hero',
        description: 'Sous-titre de la section hero',
        ordre: 2
      },
      {
        cle: 'hero-description',
        titre: 'Description hero',
        contenu: 'Participez au plus grand concours d\'innovation technologique d\'Afrique de l\'Ouest. Présentez vos projets, rencontrez des experts et gagnez des prix exceptionnels.',
        type: 'TEXT',
        page: 'home',
        section: 'hero',
        description: 'Description de la section hero',
        ordre: 3
      },
      
      // Section À propos
      {
        cle: 'about-title',
        titre: 'Titre à propos',
        contenu: 'À propos de JIG 2026',
        type: 'TEXT',
        page: 'home',
        section: 'about',
        description: 'Titre de la section à propos',
        ordre: 1
      },
      {
        cle: 'about-content',
        titre: 'Contenu à propos',
        contenu: 'La Journée de l\'Innovation et de la Gestion (JIG) est un événement annuel qui rassemble les meilleurs talents technologiques d\'Afrique de l\'Ouest. Notre mission est de promouvoir l\'innovation, favoriser les échanges entre étudiants et professionnels, et récompenser l\'excellence académique.',
        type: 'HTML',
        page: 'home',
        section: 'about',
        description: 'Contenu principal de la section à propos',
        ordre: 2
      },

      // Page de contact
      {
        cle: 'contact-title',
        titre: 'Titre contact',
        contenu: 'Contactez-nous',
        type: 'TEXT',
        page: 'contact',
        section: 'main',
        description: 'Titre de la page de contact',
        ordre: 1
      },
      {
        cle: 'contact-description',
        titre: 'Description contact',
        contenu: 'N\'hésitez pas à nous contacter pour toute question concernant JIG 2026. Notre équipe est là pour vous accompagner.',
        type: 'TEXT',
        page: 'contact',
        section: 'main',
        description: 'Description de la page de contact',
        ordre: 2
      },

      // Footer
      {
        cle: 'footer-copyright',
        titre: 'Copyright footer',
        contenu: '© 2026 JIG - Journée de l\'Innovation et de la Gestion. Tous droits réservés.',
        type: 'TEXT',
        page: 'global',
        section: 'footer',
        description: 'Copyright dans le footer',
        ordre: 1
      },
      {
        cle: 'footer-description',
        titre: 'Description footer',
        contenu: 'Concours d\'innovation technologique pour les étudiants d\'Afrique de l\'Ouest organisé par l\'ISTC Polytechnique.',
        type: 'TEXT',
        page: 'global',
        section: 'footer',
        description: 'Description dans le footer',
        ordre: 2
      }
    ];

    // Vérifier si le contenu existe déjà
    const existingContent = await prisma.contenuSite.count();
    if (existingContent > 0) {
      console.log('Le contenu par défaut existe déjà');
      return;
    }

    // Créer le contenu par défaut
    for (const content of defaultContent) {
      try {
        await prisma.contenuSite.create({ data: content });
      } catch (error) {
        console.error(`Erreur lors de la création du contenu ${content.cle}:`, error);
      }
    }

    console.log('✅ Contenu par défaut initialisé');
  }
}