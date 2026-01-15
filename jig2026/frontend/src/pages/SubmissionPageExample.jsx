import React from 'react';
import { AccessGuard, withAccessControl } from '../components/AccessGuard';

/**
 * Exemple d'une page de soumission protégée par le système de contrôle d'accès
 */
const SubmissionPageContent = () => {
  return (
    <div className="submission-page">
      <div className="page-header">
        <h1>📝 Soumission de Projet</h1>
        <p>Soumettez votre projet pour le concours JIG 2026</p>
      </div>

      <div className="submission-form">
        <div className="form-section">
          <h2>Informations du projet</h2>
          <div className="form-group">
            <label htmlFor="project-title">Titre du projet *</label>
            <input 
              type="text" 
              id="project-title" 
              placeholder="Entrez le titre de votre projet..."
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="project-description">Description *</label>
            <textarea 
              id="project-description"
              rows="5"
              placeholder="Décrivez votre projet en détail..."
              className="form-textarea"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="project-category">Catégorie *</label>
            <select id="project-category" className="form-select">
              <option value="">Sélectionnez une catégorie</option>
              <option value="web">Développement Web</option>
              <option value="mobile">Applications Mobile</option>
              <option value="ai">Intelligence Artificielle</option>
              <option value="game">Jeux Vidéo</option>
              <option value="iot">Internet des Objets</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>Équipe</h2>
          <div className="form-group">
            <label htmlFor="team-name">Nom de l&apos;équipe</label>
            <input 
              type="text" 
              id="team-name" 
              placeholder="Nom de votre équipe..."
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Membres de l&apos;équipe</label>
            <div className="team-members">
              <div className="member-input">
                <input 
                  type="text" 
                  placeholder="Nom du membre 1..."
                  className="form-input"
                />
                <input 
                  type="email" 
                  placeholder="Email du membre 1..."
                  className="form-input"
                />
              </div>
              <button className="add-member-btn">+ Ajouter un membre</button>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Fichiers du projet</h2>
          <div className="upload-area">
            <div className="upload-zone">
              <div className="upload-icon">📁</div>
              <p>Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</p>
              <p className="upload-hint">Formats acceptés: .zip, .rar, .tar.gz (max 50MB)</p>
              <input type="file" className="file-input" accept=".zip,.rar,.tar.gz" />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary">
            💾 Sauvegarder le brouillon
          </button>
          <button type="submit" className="btn-primary">
            🚀 Soumettre le projet
          </button>
        </div>
      </div>

      <style jsx>{`
        .submission-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border-radius: 12px;
        }
        
        .page-header h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2.5rem;
          font-weight: 700;
        }
        
        .page-header p {
          margin: 0;
          font-size: 1.2rem;
          opacity: 0.9;
        }
        
        .submission-form {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .form-section {
          padding: 2rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .form-section:last-child {
          border-bottom: none;
        }
        
        .form-section h2 {
          margin: 0 0 1.5rem 0;
          color: #2d3748;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }
        
        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }
        
        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .team-members {
          space-y: 1rem;
        }
        
        .member-input {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .add-member-btn {
          background: #f3f4f6;
          border: 2px dashed #d1d5db;
          color: #6b7280;
          padding: 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .add-member-btn:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
          color: #374151;
        }
        
        .upload-area {
          margin-top: 1rem;
        }
        
        .upload-zone {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 3rem 2rem;
          text-align: center;
          background: #f9fafb;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .upload-zone:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        
        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .upload-zone p {
          margin: 0.5rem 0;
          color: #374151;
        }
        
        .upload-hint {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        
        .form-actions {
          padding: 2rem;
          background: #f8fafc;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        
        .btn-secondary,
        .btn-primary {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background: #d1d5db;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        @media (max-width: 768px) {
          .submission-page {
            padding: 1rem;
          }
          
          .member-input {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .btn-secondary,
          .btn-primary {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

// Exporter la page protégée avec le HOC
export const SubmissionPage = withAccessControl(SubmissionPageContent, 'submission', {
  showPhaseInfo: true,
  className: 'submission-page-guard'
});

// Exporter aussi la version manuelle avec le composant AccessGuard
export const SubmissionPageWithGuard = () => (
  <AccessGuard pageName="submission" showPhaseInfo={true}>
    <SubmissionPageContent />
  </AccessGuard>
);

// Export par défaut requis par Next.js
export default SubmissionPage;