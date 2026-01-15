'use client'

import React, { useState } from 'react';
import { useAccessControl } from '../hooks/useAccessControl';

/**
 * Composant pour le bouton de validation du classement (admin)
 */
export const AdminValidationButton = ({ 
  onValidationSuccess, 
  onValidationError,
  className = "",
  buttonText = "Publier le classement final"
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { 
    permissions, 
    validateRanking, 
    refreshAccess,
    phase,
    utils 
  } = useAccessControl();

  /**
   * Gérer la validation du classement
   */
  const handleValidation = async () => {
    setIsValidating(true);
    
    try {
      // Récupérer le token admin depuis le localStorage ou autre
      const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const result = await validateRanking(token);
      
      // Rafraîchir les données d'accès
      await refreshAccess(true);
      
      // Callback de succès
      if (onValidationSuccess) {
        onValidationSuccess(result);
      }
      
      setShowConfirmation(false);
      
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      
      // Callback d'erreur
      if (onValidationError) {
        onValidationError(error);
      }
    } finally {
      setIsValidating(false);
    }
  };

  // Ne pas afficher si pas dans la bonne phase
  if (!permissions.canAdminValidateRanking) {
    return null;
  }

  return (
    <>
      <div className={`admin-validation ${className}`}>
        <div className="validation-info">
          <div className="info-header">
            <span className="phase-icon">{utils.getPhaseIcon(phase)}</span>
            <h3>Validation du classement</h3>
          </div>
          <p className="info-description">
            Les votes sont terminés. Vous pouvez maintenant publier le classement final 
            qui sera visible par tous les participants.
          </p>
          <div className="warning-box">
            <span className="warning-icon">⚠️</span>
            <div className="warning-text">
              <strong>Action irréversible :</strong> Une fois publié, le classement ne pourra plus être modifié 
              et sera visible publiquement.
            </div>
          </div>
        </div>

        <div className="validation-actions">
          {!showConfirmation ? (
            <button
              className="validate-button"
              onClick={() => setShowConfirmation(true)}
              disabled={isValidating}
            >
              <span className="button-icon">🏆</span>
              {buttonText}
            </button>
          ) : (
            <div className="confirmation-panel">
              <h4>Confirmer la publication</h4>
              <p>Êtes-vous sûr de vouloir publier le classement final ?</p>
              
              <div className="confirmation-actions">
                <button
                  className="confirm-button"
                  onClick={handleValidation}
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <>
                      <div className="spinner"></div>
                      Publication en cours...
                    </>
                  ) : (
                    <>
                      <span className="button-icon">✅</span>
                      Oui, publier maintenant
                    </>
                  )}
                </button>
                
                <button
                  className="cancel-button"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isValidating}
                >
                  <span className="button-icon">❌</span>
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-validation {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          margin: 2rem 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .validation-info {
          margin-bottom: 2rem;
        }
        
        .info-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .phase-icon {
          font-size: 2rem;
        }
        
        .info-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .info-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          opacity: 0.95;
        }
        
        .warning-box {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .warning-icon {
          font-size: 1.2rem;
          margin-top: 0.125rem;
        }
        
        .warning-text strong {
          display: block;
          margin-bottom: 0.25rem;
        }
        
        .validation-actions {
          text-align: center;
        }
        
        .validate-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        
        .validate-button:hover {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
        }
        
        .validate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .confirmation-panel {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }
        
        .confirmation-panel h4 {
          margin: 0 0 1rem 0;
          font-size: 1.3rem;
        }
        
        .confirmation-panel p {
          margin: 0 0 2rem 0;
          font-size: 1.1rem;
          opacity: 0.9;
        }
        
        .confirmation-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .confirm-button {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .confirm-button:hover:not(:disabled) {
          background: #c82333;
          transform: translateY(-1px);
        }
        
        .cancel-button {
          background: transparent;
          color: white;
          border: 2px solid white;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .cancel-button:hover:not(:disabled) {
          background: white;
          color: #667eea;
        }
        
        .button-icon {
          font-size: 1.1rem;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .confirm-button:disabled,
        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </>
  );
};