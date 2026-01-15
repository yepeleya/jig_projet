# 📂 Page "Mes Projets" - Documentation

## 🎯 Vue d'ensemble

La page **"Mes Projets"** (`/mes-projets`) permet aux étudiants de gérer tous leurs projets soumis au concours JIG 2026.

---

## ✨ Fonctionnalités

### 1️⃣ **Tableau de bord des statistiques**
Affiche en temps réel :
- **Total** : Nombre total de projets
- **Validés** : Projets approuvés par l'admin
- **En attente** : Projets en cours de validation
- **Brouillons** : Projets non soumis

### 2️⃣ **Liste complète des projets**
Chaque projet affiche :
- ✅ Titre et description
- 🏷️ Catégorie
- 📅 Date de soumission
- ⭐ Note moyenne (si des votes existent)
- 🎨 Badge de statut coloré

### 3️⃣ **Badges de statut**
- 🟦 **Brouillon** : Projet non soumis (modifiable)
- 🟨 **En attente** : En cours de validation
- 🟩 **Validé** : Approuvé par l'admin
- 🟥 **Rejeté** : Refusé (peut être supprimé)
- 🔵 **Terminé** : Projet finalisé

### 4️⃣ **Actions disponibles**

#### Pour tous les projets :
- 👁️ **Voir** : Affiche le projet dans la page publique
- 📥 **Télécharger** : Télécharge le fichier du projet

#### Pour les brouillons :
- ✏️ **Modifier** : Édite le projet dans la page soumettre
- 🗑️ **Supprimer** : Supprime définitivement

#### Pour les projets rejetés :
- 🗑️ **Supprimer** : Permet de nettoyer les projets refusés

---

## 🔐 Sécurité et restrictions

### Accès
- ✅ **Réservé aux utilisateurs connectés**
- ✅ **Redirection automatique** vers login si non connecté
- ✅ **Seuls les étudiants** voient le lien dans le menu

### Visibilité
- Chaque étudiant ne voit **que ses propres projets**
- Les projets sont chargés via `getProjetsByUser(userId)`

### Actions limitées
- ❌ **Modification impossible** après validation
- ❌ **Suppression impossible** pour les projets validés
- ✅ **Suppression autorisée** pour brouillons et projets rejetés

---

## 🎨 Design et couleurs JIG

### Palette utilisée
```css
/* Couleur principale */
#9E1B32 - Rouge bordeaux JIG
#7A1529 - Rouge foncé
#5A0F1D - Rouge très foncé

/* États */
Vert : Validé, Téléchargement
Jaune : En attente
Rouge : Rejeté, Supprimer
Gris : Brouillon, Neutre
Bleu : Terminé
```

### UI/UX
- **Cards modernes** avec hover effects
- **Badges colorés** pour statuts
- **Icons intuitives** (react-icons/fi)
- **Layout responsive** (mobile-first)
- **Loading states** avec spinners
- **Empty states** encourageants

---

## 🔌 Intégration API

### Endpoints utilisés

#### 1. Charger les projets
```javascript
GET /api/projets/user/:userId
```
**Réponse** :
```json
{
  "data": [
    {
      "id": 1,
      "titre": "Mon projet",
      "description": "...",
      "categorie": "Design UX/UI",
      "statut": "VALIDE",
      "fichier": "projet_xyz.pdf",
      "moyenneVote": 4.5,
      "createdAt": "2026-01-15T..."
    }
  ]
}
```

#### 2. Supprimer un projet
```javascript
DELETE /api/projets/:id
```

#### 3. Télécharger un fichier
```javascript
GET /uploads/:fileName
```

---

## 📱 États de l'interface

### 1. **Loading**
```
┌─────────────────────┐
│   🔄 Chargement...  │
│  Spinner animé      │
└─────────────────────┘
```

### 2. **Erreur**
```
┌─────────────────────────────┐
│ ⚠️ Erreur                   │
│ Message d'erreur détaillé   │
│ [Bouton Réessayer]          │
└─────────────────────────────┘
```

### 3. **Aucun projet**
```
┌─────────────────────────────┐
│    📄 Aucun projet soumis   │
│                             │
│  [+ Soumettre mon premier]  │
│           projet            │
└─────────────────────────────┘
```

### 4. **Liste de projets**
```
┌─────────────────────────────┐
│ 📊 Statistiques (4 cards)   │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ Projet 1                │ │
│ │ 🏷️ Badge statut         │ │
│ │ [...] [Modifier] [🗑️]   │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Projet 2                │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 🧪 Tests à effectuer

### Après le redéploiement Vercel :

#### ✅ Scénario 1 : Accès non authentifié
1. Aller sur `/mes-projets` sans être connecté
2. **Attendu** : Redirection vers `/login?redirect=/mes-projets`

#### ✅ Scénario 2 : Aucun projet
1. Se connecter en tant qu'étudiant sans projet
2. **Attendu** : 
   - Message "Aucun projet soumis"
   - Bouton "Soumettre mon premier projet"

#### ✅ Scénario 3 : Affichage des projets
1. Se connecter en tant qu'étudiant avec projets
2. **Attendu** :
   - Stats correctes (total, validés, en attente, brouillons)
   - Liste de tous les projets
   - Badges de statut corrects

#### ✅ Scénario 4 : Actions
1. Tester "Voir" → Redirige vers page publique
2. Tester "Télécharger" → Ouvre le fichier
3. Tester "Modifier" (brouillon) → Ouvre formulaire pré-rempli
4. Tester "Supprimer" (brouillon) → Demande confirmation puis supprime

#### ✅ Scénario 5 : Restrictions
1. Projet validé → Pas de bouton modifier/supprimer
2. Projet en attente → Pas de bouton modifier
3. Projet rejeté → Bouton supprimer visible

---

## 🔧 Dépannage

### Problème : "Erreur lors du chargement"
**Cause** : API indisponible ou CORS
**Solution** : Vérifier Railway et variables d'env

### Problème : Projets vides
**Cause** : `userId` incorrect ou aucun projet en BDD
**Solution** : Vérifier console browser et logs backend

### Problème : Suppression échoue
**Cause** : Permissions backend ou projet non supprimable
**Solution** : Vérifier statut du projet (seuls BROUILLON et REJETE supprimables)

---

## 📝 Améliorations futures possibles

- [ ] Filtrer par statut (Tous / Validés / Brouillons...)
- [ ] Recherche par titre
- [ ] Tri (par date, par note, alphabétique)
- [ ] Édition inline du titre/description
- [ ] Pagination si > 20 projets
- [ ] Export PDF de la liste
- [ ] Graphiques des statistiques

---

## 🎓 Pour les développeurs

### Structure des fichiers
```
src/app/mes-projets/
└── page.jsx          # Page principale

src/components/
├── Header.jsx        # Contient le lien "Mes Projets"
└── Footer.jsx        # Footer réutilisé

src/services/
└── api.js            # getProjetsByUser(), deleteProjet()

src/store/
└── authStore.ts      # user, isAuthenticated
```

### Dépendances
```json
{
  "react-icons/fi": "Lucide icons",
  "next/navigation": "useRouter",
  "zustand": "authStore"
}
```

---

**Créé par** : Yéo Tenena  
**Date** : 15 janvier 2026  
**Version** : 1.0.0
