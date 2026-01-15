import React from 'react';
import { useAccessControl } from '../hooks/useAccessControl';

/**
 * Composant pour bloquer l'accès aux pages selon les phases du concours
 */
export const AccessGuard = ({ 
  children, 
  pageName, 
  fallback = null,
  showPhaseInfo = true,
  className = ""
}) => {
  const { 
    canAccess, 
    isLoading, 
    error, 
    phase, 
    phaseMessage, 
    blockMessage,
    utils 
  } = useAccessControl(pageName);

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className={`access-guard loading ${className}`}>
        <div className="access-guard-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Vérification des accès en cours...</p>
        </div>
        
        <style jsx>{`
          .access-guard {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
            padding: 2rem;
          }
          
          .access-guard-content {
            text-align: center;
            max-width: 500px;
          }
          
          .loading-spinner {
            margin-bottom: 1rem;
          }
          
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Affichage en cas d'erreur (on autorise l'accès par défaut)
  if (error) {
    console.warn(`Erreur AccessGuard pour ${pageName}:`, error);
    return (
      <>
        {showPhaseInfo && (
          <div className="access-guard error-banner">
            <div className="banner-content">
              <span className="banner-icon">⚠️</span>
              <span>Impossible de vérifier les accès. Affichage par défaut.</span>
            </div>
            
            <style jsx>{`
              .error-banner {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 4px;
                padding: 0.75rem 1rem;
                margin-bottom: 1rem;
                color: #856404;
              }
              
              .banner-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
              }
              
              .banner-icon {
                font-size: 1.2rem;
              }
            `}</style>
          </div>
        )}
        {children}
      </>
    );
  }

  // Si l'accès est autorisé, afficher le contenu avec info de phase optionnelle
  if (canAccess) {
    return (
      <>
        {showPhaseInfo && phaseMessage && (
          <div className={`access-guard phase-info ${phaseMessage.type}`}>
            <div className="banner-content">
              <span className="banner-icon">{utils.getPhaseIcon(phase)}</span>
              <div className="banner-text">
                <strong>{phaseMessage.title}</strong>
                <p>{phaseMessage.message}</p>
              </div>
            </div>
            
            <style jsx>{`
              .phase-info {
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1.5rem;
                border-left: 4px solid;
              }
              
              .phase-info.info {
                background-color: #e3f2fd;
                border-left-color: #2196f3;
                color: #0d47a1;
              }
              
              .phase-info.warning {
                background-color: #fff8e1;
                border-left-color: #ff9800;
                color: #e65100;
              }
              
              .phase-info.success {
                background-color: #e8f5e8;
                border-left-color: #4caf50;
                color: #1b5e20;
              }
              
              .banner-content {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
              }
              
              .banner-icon {
                font-size: 1.5rem;
                margin-top: 0.125rem;
              }
              
              .banner-text strong {
                display: block;
                margin-bottom: 0.25rem;
                font-size: 1.1rem;
              }
              
              .banner-text p {
                margin: 0;
                opacity: 0.9;
              }
            `}</style>
          </div>
        )}
        {children}
      </>
    );
  }

  // Accès bloqué - afficher le message de blocage ou le fallback
  if (fallback) {
    return fallback;
  }

  return (
    <div className={`access-guard blocked ${className}`}>
      <div className="access-guard-content">
        {blockMessage ? (
          <div className="block-message">
            <div className="block-icon">{blockMessage.icon}</div>
            <h2 className="block-title">{blockMessage.title}</h2>
            <p className="block-description">{blockMessage.message}</p>
            {blockMessage.suggestion && (
              <p className="block-suggestion">
                <strong>💡 Suggestion :</strong> {blockMessage.suggestion}
              </p>
            )}
          </div>
        ) : (
          <div className="block-message">
            <div className="block-icon">🚫</div>
            <h2 className="block-title">Accès non autorisé</h2>
            <p className="block-description">
              Cette page n&apos;est pas accessible dans la phase actuelle du concours.
            </p>
          </div>
        )}
        
        {showPhaseInfo && phaseMessage && (
          <div className="current-phase">
            <h3>Phase actuelle : {utils.getPhaseName(phase)}</h3>
            <p>{phaseMessage.message}</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .access-guard.blocked {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          padding: 2rem;
          background-color: #f8f9fa;
        }
        
        .access-guard-content {
          text-align: center;
          max-width: 600px;
          background: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .block-message {
          margin-bottom: 2rem;
        }
        
        .block-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .block-title {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .block-description {
          color: #5a6c7d;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .block-suggestion {
          background-color: #e8f4fd;
          padding: 1rem;
          border-radius: 6px;
          color: #2980b9;
          font-size: 0.95rem;
          margin-top: 1.5rem;
        }
        
        .current-phase {
          padding-top: 2rem;
          border-top: 1px solid #dee2e6;
        }
        
        .current-phase h3 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }
        
        .current-phase p {
          color: #6c757d;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
};

/**
 * HOC pour protéger une page entière
 */
export const withAccessControl = (WrappedComponent, pageName, options = {}) => {
  const AccessControlledComponent = (props) => (
    <AccessGuard pageName={pageName} {...options}>
      <WrappedComponent {...props} />
    </AccessGuard>
  );
  
  AccessControlledComponent.displayName = `withAccessControl(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AccessControlledComponent;
};