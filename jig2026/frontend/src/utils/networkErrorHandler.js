import { useState, useEffect } from 'react';

// Utilitaire pour gérer les erreurs réseau et les retry automatiques
export class NetworkErrorHandler {
  static async fetchWithRetry(url, options = {}, maxRetries = 3) {
    const defaultOptions = {
      timeout: 30000, // 30 secondes
      ...options
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Créer un controller pour gérer le timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), defaultOptions.timeout);

        const response = await fetch(url, {
          ...defaultOptions,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Si la réponse est OK, retourner
        if (response.ok) {
          return response;
        }

        // Si c'est une erreur 5xx, retry
        if (response.status >= 500 && attempt < maxRetries) {
          console.warn(`Tentative ${attempt} échouée (${response.status}), retry dans ${attempt * 1000}ms`);
          await this.delay(attempt * 1000);
          continue;
        }

        // Pour les autres erreurs, les lancer immédiatement
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        // Erreurs réseau (ERR_BLOCKED_BY_RESPONSE, CORS, etc.)
        if (this.isNetworkError(error) && attempt < maxRetries) {
          console.warn(`Erreur réseau tentative ${attempt}:`, error.message);
          await this.delay(attempt * 2000); // Délai plus long pour les erreurs réseau
          continue;
        }

        // Dernière tentative ou erreur non-récupérable
        if (attempt === maxRetries) {
          throw new NetworkError(error.message, error.name, attempt);
        }

        throw error;
      }
    }
  }

  static isNetworkError(error) {
    const networkErrors = [
      'ERR_BLOCKED_BY_RESPONSE',
      'ERR_NETWORK',
      'ERR_INTERNET_DISCONNECTED',
      'ERR_NAME_NOT_RESOLVED',
      'ERR_CONNECTION_REFUSED',
      'ERR_CONNECTION_TIMED_OUT',
      'ERR_CONNECTION_RESET',
      'CORS error',
      'AbortError',
      'TimeoutError',
      'Failed to fetch'
    ];

    return networkErrors.some(errorType => 
      error.message?.includes(errorType) || 
      error.name?.includes(errorType)
    );
  }

  static async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Méthode spéciale pour les vidéos et médias
  static async loadMediaWithFallback(mediaElement, primaryUrl, fallbackUrl = null) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = fallbackUrl ? 2 : 1;

      const tryLoad = (url) => {
        attempts++;
        
        const onLoad = () => {
          cleanup();
          resolve(mediaElement);
        };

        const onError = (error) => {
          cleanup();
          console.warn(`Échec chargement média (tentative ${attempts}):`, error);
          
          if (attempts < maxAttempts && fallbackUrl) {
            console.log('Tentative avec URL de fallback:', fallbackUrl);
            setTimeout(() => tryLoad(fallbackUrl), 1000);
          } else {
            reject(new Error(`Impossible de charger le média après ${attempts} tentatives`));
          }
        };

        const cleanup = () => {
          mediaElement.removeEventListener('loadeddata', onLoad);
          mediaElement.removeEventListener('canplay', onLoad);
          mediaElement.removeEventListener('error', onError);
        };

        mediaElement.addEventListener('loadeddata', onLoad);
        mediaElement.addEventListener('canplay', onLoad);
        mediaElement.addEventListener('error', onError);
        
        mediaElement.src = url;
        mediaElement.load();
      };

      tryLoad(primaryUrl);
    });
  }
}

// Classe d'erreur personnalisée
export class NetworkError extends Error {
  constructor(message, type, attempts) {
    super(message);
    this.name = 'NetworkError';
    this.type = type;
    this.attempts = attempts;
  }
}

// Hook React pour gérer les erreurs réseau
export function useNetworkErrorHandler() {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);
  const [networkError, setNetworkError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setNetworkError(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkError('Connexion internet perdue');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleError = (error) => {
    if (NetworkErrorHandler.isNetworkError(error)) {
      setNetworkError(error.message);
      return true; // Erreur gérée
    }
    return false; // Erreur non gérée
  };

  const clearError = () => setNetworkError(null);

  return {
    isOnline,
    networkError,
    handleError,
    clearError,
    fetchWithRetry: NetworkErrorHandler.fetchWithRetry
  };
}