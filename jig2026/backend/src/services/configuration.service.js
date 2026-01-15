import prisma from "../utils/prismaClient.js";

/**
 * Service pour gérer les configurations globales de l'application
 */
export class ConfigurationService {
  
  /**
   * Récupérer une configuration par clé
   */
  static async getConfig(key) {
    try {
      const config = await prisma.configuration.findUnique({
        where: { cle: key }
      });
      
      if (!config) return null;
      
      // Convertir la valeur selon le type
      switch (config.type) {
        case 'boolean':
          return config.valeur === 'true';
        case 'number':
          return parseFloat(config.valeur);
        case 'date':
          return new Date(config.valeur);
        default:
          return config.valeur;
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération de la config ${key}:`, error);
      return null;
    }
  }

  /**
   * Définir une configuration
   */
  static async setConfig(key, value, type = 'string') {
    try {
      let stringValue;
      
      // Convertir la valeur en string selon le type
      switch (type) {
        case 'boolean':
          stringValue = value ? 'true' : 'false';
          break;
        case 'date':
          stringValue = value instanceof Date ? value.toISOString() : value;
          break;
        default:
          stringValue = String(value);
      }

      const config = await prisma.configuration.upsert({
        where: { cle: key },
        update: { 
          valeur: stringValue,
          type: type 
        },
        create: { 
          cle: key,
          valeur: stringValue,
          type: type 
        }
      });

      return config;
    } catch (error) {
      console.error(`Erreur lors de la définition de la config ${key}:`, error);
      throw error;
    }
  }

  /**
   * Vérifier si les soumissions sont encore ouvertes
   */
  static async isSubmissionOpen() {
    const dateLimite = await this.getConfig('date_limite_soumission');
    if (!dateLimite) return true; // Par défaut ouvert si pas de limite
    
    return new Date() < dateLimite;
  }

  /**
   * Vérifier si les votes sont encore actifs
   */
  static async areVotesActive() {
    const votesActifs = await this.getConfig('votes_actifs');
    const dateLimiteVotes = await this.getConfig('date_limite_votes');
    
    if (votesActifs === false) return false;
    if (!dateLimiteVotes) return true; // Par défaut actif si pas de limite
    
    return new Date() < dateLimiteVotes;
  }

  /**
   * Vérifier si le classement peut être activé (après la date limite des votes)
   */
  static async canActivateRanking() {
    const dateLimiteVotes = await this.getConfig('date_limite_votes');
    if (!dateLimiteVotes) return true; // Peut être activé si pas de limite
    
    return new Date() >= dateLimiteVotes;
  }

  /**
   * Vérifier si le classement est visible publiquement
   */
  static async isRankingPublic() {
    return await this.getConfig('classement_public_visible') || false;
  }

  /**
   * Activer/désactiver la visibilité publique du classement
   */
  static async toggleRankingVisibility(visible) {
    return await this.setConfig('classement_public_visible', visible, 'boolean');
  }
}