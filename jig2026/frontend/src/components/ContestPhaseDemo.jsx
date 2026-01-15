'use client'

import React, { useState } from 'react';
import { useAccessControl } from '../hooks/useAccessControl';
import { AccessGuard } from './AccessGuard';
import { AdminValidationButton } from './AdminValidationButton';

/**
 * Composant de démonstration du système de contrôle d'accès automatique
 */
export const ContestPhaseDemo = () => {
  const [selectedPage, setSelectedPage] = useState('submission');
  const [notification, setNotification] = useState(null);
  
  // Hook global pour le statut du concours
  const globalStatus = useAccessControl();

  /**
   * Simuler la validation du classement
   */
  const handleValidationSuccess = () => {
    setNotification({
      type: 'success',
      title: 'Classement publié !',
      message: `Le classement a été publié avec succès à ${new Date().toLocaleTimeString('fr-FR')}`
    });
    
    // Effacer la notification après 5 secondes
    setTimeout(() => setNotification(null), 5000);
  };

  const handleValidationError = (error) => {
    setNotification({
      type: 'error',
      title: 'Erreur de publication',
      message: error.message || 'Une erreur est survenue lors de la publication'
    });
    
    setTimeout(() => setNotification(null), 5000);
  };

  const pages = [
    { key: 'submission', label: 'Page Soumission', icon: '📝' },
    { key: 'vote', label: 'Page Vote', icon: '🗳️' },
    { key: 'ranking', label: 'Page Classement', icon: '🏆' }
  ];

  return (
    <div className="contest-phase-demo">
      <div className="demo-header">
        <h1>🎯 Système de Contrôle d&apos;Accès Automatique</h1>
        <p>Démonstration du système qui gère automatiquement l&apos;ouverture et la fermeture des pages selon les phases du concours JIG 2026.</p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
          </div>
          <button 
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="demo-layout">
        {/* Panneau de statut global */}
        <div className="status-panel">
          <h2>📊 Statut Global du Concours</h2>
          
          {globalStatus.isLoading ? (
            <div className="loading">Chargement du statut...</div>
          ) : globalStatus.error ? (
            <div className="error">Erreur: {globalStatus.error}</div>
          ) : (
            <div className="status-content">
              <div className="phase-info">
                <span className="phase-icon">
                  {globalStatus.utils.getPhaseIcon(globalStatus.phase)}
                </span>
                <div className="phase-text">
                  <h3>{globalStatus.utils.getPhaseName(globalStatus.phase)}</h3>
                  <p className="phase-description">
                    {globalStatus.phaseMessage?.message || 'Phase actuelle du concours'}
                  </p>
                </div>
              </div>

              <div className="permissions-grid">
                <div className={`permission ${globalStatus.permissions.canSubmit ? 'allowed' : 'blocked'}`}>
                  <span className="permission-icon">📝</span>
                  <span className="permission-label">Soumissions</span>
                  <span className="permission-status">
                    {globalStatus.permissions.canSubmit ? '✅ Ouvertes' : '❌ Fermées'}
                  </span>
                </div>
                
                <div className={`permission ${globalStatus.permissions.canVote ? 'allowed' : 'blocked'}`}>
                  <span className="permission-icon">🗳️</span>
                  <span className="permission-label">Votes</span>
                  <span className="permission-status">
                    {globalStatus.permissions.canVote ? '✅ Ouverts' : '❌ Fermés'}
                  </span>
                </div>
                
                <div className={`permission ${globalStatus.permissions.canViewRanking ? 'allowed' : 'blocked'}`}>
                  <span className="permission-icon">🏆</span>
                  <span className="permission-label">Classement</span>
                  <span className="permission-status">
                    {globalStatus.permissions.canViewRanking ? '✅ Public' : '❌ Privé'}
                  </span>
                </div>
              </div>

              {/* Dates importantes */}
              {globalStatus.contestStatus?.dates && (
                <div className="dates-info">
                  <h4>📅 Dates importantes</h4>
                  <div className="dates-grid">
                    {globalStatus.contestStatus.dates.submissionDeadline && (
                      <div className="date-item">
                        <span className="date-label">Fin des soumissions:</span>
                        <span className="date-value">
                          {globalStatus.utils.formatDate(globalStatus.contestStatus.dates.submissionDeadline)}
                        </span>
                      </div>
                    )}
                    {globalStatus.contestStatus.dates.voteDeadline && (
                      <div className="date-item">
                        <span className="date-label">Fin des votes:</span>
                        <span className="date-value">
                          {globalStatus.utils.formatDate(globalStatus.contestStatus.dates.voteDeadline)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="refresh-section">
            <button 
              className="refresh-button"
              onClick={() => globalStatus.refreshAccess(true)}
              disabled={globalStatus.isLoading}
            >
              🔄 Actualiser le statut
            </button>
          </div>
        </div>

        {/* Simulateur de pages */}
        <div className="page-simulator">
          <h2>🖥️ Simulateur de Pages</h2>
          
          <div className="page-selector">
            <p>Sélectionnez une page pour voir comment le contrôle d&apos;accès fonctionne :</p>
            <div className="page-buttons">
              {pages.map(page => (
                <button
                  key={page.key}
                  className={`page-button ${selectedPage === page.key ? 'active' : ''}`}
                  onClick={() => setSelectedPage(page.key)}
                >
                  <span className="page-icon">{page.icon}</span>
                  {page.label}
                </button>
              ))}
            </div>
          </div>

          <div className="page-content">
            <h3>Page simulée: {pages.find(p => p.key === selectedPage)?.label}</h3>
            
            <AccessGuard pageName={selectedPage} showPhaseInfo={true}>
              <div className="simulated-page">
                <h4>✅ Contenu de la page accessible</h4>
                <p>
                  Cette zone représente le contenu normal de la page{' '}
                  <strong>{pages.find(p => p.key === selectedPage)?.label}</strong>.
                </p>
                <p>
                  Le composant <code>AccessGuard</code> a vérifié automatiquement 
                  que cette page est accessible dans la phase actuelle du concours.
                </p>
                
                {selectedPage === 'submission' && (
                  <div className="page-specific-content">
                    <h5>Fonctionnalités de soumission :</h5>
                    <ul>
                      <li>Formulaire de soumission de projet</li>
                      <li>Upload de fichiers</li>
                      <li>Gestion des équipes</li>
                    </ul>
                  </div>
                )}
                
                {selectedPage === 'vote' && (
                  <div className="page-specific-content">
                    <h5>Fonctionnalités de vote :</h5>
                    <ul>
                      <li>Liste des projets à évaluer</li>
                      <li>Système de notation</li>
                      <li>Commentaires des jurés</li>
                    </ul>
                  </div>
                )}
                
                {selectedPage === 'ranking' && (
                  <div className="page-specific-content">
                    <h5>Fonctionnalités du classement :</h5>
                    <ul>
                      <li>Classement final des projets</li>
                      <li>Détails des scores</li>
                      <li>Certificats et récompenses</li>
                    </ul>
                  </div>
                )}
              </div>
            </AccessGuard>
          </div>
        </div>
      </div>

      {/* Section admin */}
      <div className="admin-section">
        <h2>👑 Section Administrateur</h2>
        <p>Cette section montre le bouton de validation du classement qui n&apos;apparaît que lorsque les votes sont terminés :</p>
        
        <AdminValidationButton
          onValidationSuccess={handleValidationSuccess}
          onValidationError={handleValidationError}
        />
        
        {!globalStatus.permissions.canAdminValidateRanking && (
          <div className="admin-info">
            <span className="info-icon">ℹ️</span>
            <p>
              Le bouton de validation n&apos;est pas visible car nous ne sommes pas 
              dans la phase appropriée. Il apparaîtra automatiquement quand les votes seront terminés.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .contest-phase-demo {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .demo-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
        }
        
        .demo-header h1 {
          margin: 0 0 1rem 0;
          font-size: 2.5rem;
          font-weight: 700;
        }
        
        .demo-header p {
          margin: 0;
          font-size: 1.2rem;
          opacity: 0.9;
          line-height: 1.6;
        }
        
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          min-width: 300px;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .notification.success {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }
        
        .notification.error {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-content h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }
        
        .notification-content p {
          margin: 0;
          font-size: 0.9rem;
        }
        
        .notification-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.7;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .notification-close:hover {
          opacity: 1;
        }
        
        .demo-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        @media (max-width: 768px) {
          .demo-layout {
            grid-template-columns: 1fr;
          }
        }
        
        .status-panel, .page-simulator {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }
        
        .status-panel h2, .page-simulator h2 {
          margin: 0 0 1.5rem 0;
          color: #2d3748;
          font-size: 1.5rem;
        }
        
        .loading, .error {
          padding: 1rem;
          border-radius: 6px;
          text-align: center;
        }
        
        .loading {
          background: #f7fafc;
          color: #4a5568;
        }
        
        .error {
          background: #fed7d7;
          color: #c53030;
        }
        
        .phase-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #3182ce;
        }
        
        .phase-icon {
          font-size: 2.5rem;
        }
        
        .phase-text h3 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
          font-size: 1.3rem;
        }
        
        .phase-description {
          margin: 0;
          color: #4a5568;
          font-size: 0.95rem;
        }
        
        .permissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .permission {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          transition: transform 0.2s ease;
        }
        
        .permission:hover {
          transform: translateY(-2px);
        }
        
        .permission.allowed {
          background: #f0fff4;
          border: 1px solid #9ae6b4;
        }
        
        .permission.blocked {
          background: #fffaf0;
          border: 1px solid #fbb6ce;
        }
        
        .permission-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .permission-label {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #2d3748;
        }
        
        .permission-status {
          font-size: 0.9rem;
          color: #4a5568;
        }
        
        .dates-info {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .dates-info h4 {
          margin: 0 0 1rem 0;
          color: #2d3748;
        }
        
        .dates-grid {
          display: grid;
          gap: 0.75rem;
        }
        
        .date-item {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 0.5rem;
          align-items: center;
        }
        
        .date-label {
          font-weight: 500;
          color: #4a5568;
        }
        
        .date-value {
          color: #2d3748;
          font-family: monospace;
          font-size: 0.9rem;
        }
        
        .refresh-section {
          margin-top: 2rem;
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .refresh-button {
          background: #3182ce;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        
        .refresh-button:hover:not(:disabled) {
          background: #2c5aa0;
        }
        
        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .page-selector {
          margin-bottom: 2rem;
        }
        
        .page-selector p {
          margin-bottom: 1rem;
          color: #4a5568;
        }
        
        .page-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .page-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        
        .page-button:hover {
          border-color: #3182ce;
          background: #f7fafc;
        }
        
        .page-button.active {
          border-color: #3182ce;
          background: #3182ce;
          color: white;
        }
        
        .page-icon {
          font-size: 1.2rem;
        }
        
        .page-content {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .page-content h3 {
          margin: 0;
          padding: 1rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          color: #2d3748;
        }
        
        .simulated-page {
          padding: 2rem;
          background: white;
        }
        
        .simulated-page h4 {
          color: #38a169;
          margin: 0 0 1rem 0;
        }
        
        .simulated-page p {
          margin-bottom: 1rem;
          line-height: 1.6;
          color: #4a5568;
        }
        
        .simulated-page code {
          background: #edf2f7;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9rem;
        }
        
        .page-specific-content {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 3px solid #3182ce;
        }
        
        .page-specific-content h5 {
          margin: 0 0 0.75rem 0;
          color: #2d3748;
        }
        
        .page-specific-content ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .page-specific-content li {
          margin-bottom: 0.25rem;
          color: #4a5568;
        }
        
        .admin-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }
        
        .admin-section h2 {
          margin: 0 0 1rem 0;
          color: #2d3748;
          font-size: 1.5rem;
        }
        
        .admin-section p {
          margin-bottom: 2rem;
          color: #4a5568;
          line-height: 1.6;
        }
        
        .admin-info {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: #f0fff4;
          border: 1px solid #9ae6b4;
          border-radius: 6px;
          margin-top: 2rem;
        }
        
        .info-icon {
          font-size: 1.2rem;
          margin-top: 0.125rem;
        }
        
        .admin-info p {
          margin: 0;
          color: #2f855a;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
};
