'use client'

import { useState, useEffect, useCallback } from 'react';
import { accessControlService } from '../services/api';

/**
 * Hook personnalisé pour gérer le contrôle d'accès automatique
 */
export const useAccessControl = (pageName) => {
  const [accessState, setAccessState] = useState({
    // États de base
    canAccess: true,
    isLoading: true,
    error: null,
    
    // Informations sur la phase
    phase: null,
    contestStatus: null,
    
    // Messages pour l'utilisateur
    phaseMessage: null,
    blockMessage: null,
    
    // Timestamps pour le cache
    lastCheck: null,
    cacheExpiry: null
  });

  // Cache de 30 secondes pour éviter trop de requêtes
  const CACHE_DURATION = 30 * 1000; // 30 secondes

  /**
   * Vérifier l'accès à une page spécifique
   */
  const checkPageAccess = useCallback(async (page) => {
    try {
      const result = await accessControlService.canAccessPage(page);
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la vérification d\'accès');
      }

      return result.data;
    } catch (error) {
      console.error(`Erreur lors de la vérification d'accès pour ${page}:`, error);
      throw error;
    }
  }, []);

  /**
   * Récupérer le statut complet du concours
   */
  const getContestStatus = useCallback(async () => {
    try {
      const result = await accessControlService.getContestStatus();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la récupération du statut');
      }

      return result.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      throw error;
    }
  }, []);

  /**
   * Valider le classement (admin uniquement)
   */
  const validateRanking = useCallback(async (token) => {
    try {
      const result = await accessControlService.validateRanking(token);
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la validation');
      }

      // Forcer la mise à jour du cache après validation
      setAccessState(prev => ({
        ...prev,
        cacheExpiry: null,
        lastCheck: null
      }));

      return result.data;
    } catch (error) {
      console.error('Erreur lors de la validation du classement:', error);
      throw error;
    }
  }, []);

  /**
   * Rafraîchir les données d'accès
   */
  const refreshAccess = useCallback(async (forceFresh = false) => {
    const now = Date.now();
    
    // Vérifier le cache sauf si forceFresh
    if (!forceFresh && accessState.cacheExpiry && now < accessState.cacheExpiry) {
      return; // Utiliser le cache
    }

    setAccessState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (pageName) {
        // Vérifier l'accès pour une page spécifique
        const pageAccessData = await checkPageAccess(pageName);
        
        setAccessState(prev => ({
          ...prev,
          canAccess: pageAccessData.canAccess,
          phase: pageAccessData.phase,
          phaseMessage: pageAccessData.phaseMessage,
          blockMessage: pageAccessData.blockMessage,
          isLoading: false,
          error: null,
          lastCheck: now,
          cacheExpiry: now + CACHE_DURATION
        }));
      } else {
        // Récupérer le statut complet
        const statusData = await getContestStatus();
        
        setAccessState(prev => ({
          ...prev,
          contestStatus: statusData,
          phase: statusData.phase,
          phaseMessage: statusData.phaseMessage,
          canAccess: true, // Pas de page spécifique = accès autorisé
          blockMessage: null,
          isLoading: false,
          error: null,
          lastCheck: now,
          cacheExpiry: now + CACHE_DURATION
        }));
      }
    } catch (error) {
      setAccessState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
        // En cas d'erreur, autoriser l'accès par défaut
        canAccess: true,
        lastCheck: now,
        cacheExpiry: now + CACHE_DURATION
      }));
    }
  }, [pageName, checkPageAccess, getContestStatus, accessState.cacheExpiry, CACHE_DURATION]);

  /**
   * Effet pour charger les données au montage et rafraîchir périodiquement
   */
  useEffect(() => {
    refreshAccess();

    // Rafraîchissement automatique toutes les 2 minutes
    const interval = setInterval(() => {
      refreshAccess();
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [refreshAccess]);

  /**
   * Effet pour écouter les changements de visibilité de la page
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // La page redevient visible, rafraîchir les données
        refreshAccess(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshAccess]);

  /**
   * Utilitaires pour les composants
   */
  const utils = {
    /**
     * Obtenir l'icône appropriée pour la phase actuelle
     */
    getPhaseIcon: (phase) => {
      switch (phase) {
        case 'submission': return '📝';
        case 'voting': return '🗳️';
        case 'results': return '⏳';
        case 'finished': return '🏆';
        default: return '📋';
      }
    },

    /**
     * Obtenir le nom convivial de la phase
     */
    getPhaseName: (phase) => {
      switch (phase) {
        case 'submission': return 'Soumissions';
        case 'voting': return 'Votes';
        case 'results': return 'Résultats en préparation';
        case 'finished': return 'Concours terminé';
        default: return 'Phase inconnue';
      }
    },

    /**
     * Formater une date en français
     */
    formatDate: (date) => {
      if (!date) return 'Non définie';
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return {
    // États principaux
    ...accessState,
    
    // Actions
    refreshAccess,
    validateRanking,
    
    // Utilitaires
    utils,
    
    // Raccourcis pour les permissions courantes
    permissions: {
      canSubmit: accessState.contestStatus?.canSubmit || false,
      canVote: accessState.contestStatus?.canVote || false,
      canViewRanking: accessState.contestStatus?.canViewRanking || false,
      canAdminValidateRanking: accessState.contestStatus?.canAdminValidateRanking || false
    }
  };
};