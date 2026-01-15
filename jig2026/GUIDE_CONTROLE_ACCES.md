# 🎯 Système de Contrôle d'Accès Automatique - Guide d'Utilisation

Ce système gère automatiquement l'ouverture et la fermeture des pages selon les phases du concours JIG 2026.

## 📋 Fonctionnalités

### ⏰ Gestion Automatique des Phases

Le système définit automatiquement la phase actuelle du concours :

1. **Phase Soumission** : Les participants peuvent soumettre leurs projets
2. **Phase Vote** : Les soumissions sont fermées (7 jours avant la deadline), les votes sont ouverts
3. **Phase Résultats** : Les votes sont fermés, attente de validation admin
4. **Phase Terminée** : Le classement est public

### 🔐 Contrôle d'Accès Automatique

- **Page Soumission** : Accessible uniquement pendant la phase soumission
- **Page Vote** : Accessible uniquement pendant la phase vote
- **Page Classement** : Accessible uniquement après validation admin

## 🚀 Installation

### 1. Backend

Le système est déjà intégré au backend. Les services sont disponibles :

```javascript
// Services disponibles
import { AccessControlService } from './src/services/access-control.service.js';
import { ConfigurationService } from './src/services/configuration.service.js';
```

### 2. Frontend

Les composants sont prêts à utiliser :

```javascript
// Hooks et composants
import { useAccessControl } from '../hooks/useAccessControl';
import { AccessGuard, withAccessControl } from '../components/AccessGuard';
import { AdminValidationButton } from '../components/AdminValidationButton';
```

## 📖 Utilisation

### Méthode 1 : Composant AccessGuard

```jsx
import { AccessGuard } from '../components/AccessGuard';

function SubmissionPage() {
  return (
    <AccessGuard pageName="submission" showPhaseInfo={true}>
      <div>
        <h1>Contenu de la page soumission</h1>
        {/* Votre contenu ici */}
      </div>
    </AccessGuard>
  );
}
```

### Méthode 2 : HOC withAccessControl

```jsx
import { withAccessControl } from '../components/AccessGuard';

const SubmissionPageContent = () => (
  <div>
    <h1>Contenu de la page soumission</h1>
    {/* Votre contenu ici */}
  </div>
);

// Exporter la page protégée
export const SubmissionPage = withAccessControl(SubmissionPageContent, 'submission');
```

### Méthode 3 : Hook useAccessControl

```jsx
import { useAccessControl } from '../hooks/useAccessControl';

function CustomPage() {
  const { canAccess, isLoading, blockMessage } = useAccessControl('submission');
  
  if (isLoading) return <div>Chargement...</div>;
  
  if (!canAccess) {
    return (
      <div>
        <h2>{blockMessage?.title}</h2>
        <p>{blockMessage?.message}</p>
      </div>
    );
  }
  
  return <div>Contenu accessible</div>;
}
```

## 🛠️ Configuration

### Configuration des Dates dans la Base de Données

```sql
-- Date limite des votes (les soumissions ferment 7 jours avant)
INSERT INTO Configuration (cle, valeur, type) 
VALUES ('DATE_LIMITE_VOTES', '2026-03-15T23:59:59.000Z', 'date');

-- Visibilité du classement (contrôlée par l'admin)
INSERT INTO Configuration (cle, valeur, type) 
VALUES ('CLASSEMENT_PUBLIC_VISIBLE', 'false', 'boolean');
```

### Modification des Dates via l'API

```javascript
// Côté admin - modifier la date limite
await fetch('/api/admin/configuration', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cle: 'DATE_LIMITE_VOTES',
    valeur: '2026-03-15T23:59:59.000Z',
    type: 'date'
  })
});
```

## 👑 Administration

### Bouton de Validation du Classement

```jsx
import { AdminValidationButton } from '../components/AdminValidationButton';

function AdminPanel() {
  const handleSuccess = () => {
    alert('Classement publié avec succès !');
  };
  
  const handleError = (error) => {
    alert(`Erreur : ${error.message}`);
  };
  
  return (
    <AdminValidationButton
      onValidationSuccess={handleSuccess}
      onValidationError={handleError}
      buttonText="Publier le classement final"
    />
  );
}
```

## 🔧 API Endpoints

### Vérifier le Statut Global

```
GET /api/access-control/status
```

Retourne :
```json
{
  "success": true,
  "data": {
    "phase": "submission",
    "canSubmit": true,
    "canVote": false,
    "canViewRanking": false,
    "canAdminValidateRanking": false,
    "dates": {
      "submissionDeadline": "2026-03-08T23:59:59.000Z",
      "voteDeadline": "2026-03-15T23:59:59.000Z",
      "now": "2025-11-03T13:10:28.367Z"
    },
    "isRankingPublic": false,
    "daysBeforeDeadline": 7,
    "phaseMessage": {
      "type": "info",
      "title": "Période de soumission active",
      "message": "Vous pouvez soumettre vos projets jusqu'au 8 mars 2026 (125 jours restants)."
    }
  }
}
```

### Vérifier l'Accès à une Page

```
GET /api/access-control/can-access/submission
GET /api/access-control/can-access/vote
GET /api/access-control/can-access/ranking
```

### Valider le Classement (Admin)

```
POST /api/access-control/validate-ranking
Authorization: Bearer <admin-token>
```

## 🎨 Personnalisation

### Messages Personnalisés

```jsx
<AccessGuard 
  pageName="submission"
  showPhaseInfo={true}
  fallback={<CustomBlockedMessage />}
  className="custom-guard-style"
>
  <YourContent />
</AccessGuard>
```

### Styles Personnalisés

Le système utilise `styled-jsx` pour les styles. Vous pouvez les personnaliser :

```jsx
<AccessGuard pageName="submission">
  <YourContent />
  <style jsx>{`
    .access-guard.blocked {
      background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    }
  `}</style>
</AccessGuard>
```

## 📱 Responsive

Tous les composants sont responsive et s'adaptent automatiquement aux écrans mobiles.

## 🔄 Cache et Performance

- **Cache automatique** : Les données sont mises en cache 30 secondes
- **Rafraîchissement automatique** : Toutes les 2 minutes
- **Rafraîchissement manuel** : Utilisez `refreshAccess(true)`

## 🐛 Gestion d'Erreurs

Le système est conçu pour être tolérant aux erreurs :
- En cas d'erreur réseau, l'accès est autorisé par défaut
- Messages d'erreur informatifs pour l'utilisateur
- Logs détaillés côté serveur

## 🧪 Tests et Débogage

### Tester les Phases

Modifiez la date limite dans la base de données pour tester les différentes phases :

```sql
-- Test phase vote (date limite dans 5 jours)
UPDATE Configuration 
SET valeur = DATE_ADD(NOW(), INTERVAL 5 DAY) 
WHERE cle = 'DATE_LIMITE_VOTES';

-- Test phase résultats (date limite dépassée)
UPDATE Configuration 
SET valeur = DATE_SUB(NOW(), INTERVAL 1 DAY) 
WHERE cle = 'DATE_LIMITE_VOTES';
```

### Mode Debug

```javascript
const { contestStatus, error } = useAccessControl();
console.log('Contest Status:', contestStatus);
console.log('Error:', error);
```

## 📋 Checklist d'Intégration

- [ ] Backend : Services AccessControl et Configuration installés
- [ ] Frontend : Hooks et composants importés
- [ ] Base de données : Configuration avec DATE_LIMITE_VOTES
- [ ] Pages : Protection ajoutée avec AccessGuard ou withAccessControl
- [ ] Admin : Bouton de validation intégré
- [ ] Tests : Différentes phases testées

## 🆘 Support

En cas de problème :

1. Vérifiez les logs du serveur
2. Testez les endpoints API manuellement
3. Vérifiez la configuration en base de données
4. Utilisez les outils de développement du navigateur pour les erreurs frontend

Le système est conçu pour être robuste et informatif en cas de problème.