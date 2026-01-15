# 🧪 Test des nouvelles fonctionnalités - Système de Votes et Commentaires

## 📊 Routes disponibles

### **Votes** (`/api/votes`)
- `POST /api/votes` - Voter sur un projet
- `GET /api/votes/:projetId` - Voir les votes d'un projet  
- `GET /api/votes/scores/all` - Calculer les scores pondérés

### **Commentaires** (`/api/commentaires`)
- `POST /api/commentaires` - Ajouter un commentaire (jury)
- `GET /api/commentaires/:projetId` - Voir les commentaires d'un projet

### **Utilisateurs** (`/api/users`)
- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion

### **Projets** (`/api/projets`)
- `POST /api/projets/soumettre` - Soumettre un projet
- `GET /api/projets` - Liste des projets

## 🧪 Exemples de requêtes

### 1. Inscription d'un étudiant
```json
POST /api/users/register
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@etudiant.fr",
  "motDePasse": "password123",
  "role": "ETUDIANT"
}
```

### 2. Inscription d'un jury
```json
POST /api/users/register
{
  "nom": "Martin",
  "prenom": "Marie",
  "email": "marie.martin@jury.fr",
  "motDePasse": "jury123",
  "role": "JURY"
}
```

### 3. Soumettre un projet
```json
POST /api/projets/soumettre
Content-Type: multipart/form-data

titre: "Application Mobile Innovante"
description: "Une app révolutionnaire pour la gestion des tâches"
userId: 1
fichier: [UPLOAD FILE]
```

### 4. Vote d'un étudiant
```json
POST /api/votes
{
  "projetId": 1,
  "userId": 2,
  "valeur": 8.5,
  "typeVote": "ETUDIANT"
}
```

### 5. Vote d'un jury
```json
POST /api/votes
{
  "projetId": 1,
  "juryId": 1,
  "valeur": 9.2,
  "typeVote": "JURY"
}
```

### 6. Commentaire du jury
```json
POST /api/commentaires
{
  "contenu": "Excellent travail ! L'interface est intuitive et le code est bien structuré.",
  "projetId": 1,
  "juryId": 1
}
```

### 7. Voir les scores pondérés
```
GET /api/votes/scores/all
```

**Retourne :**
```json
[
  {
    "projetId": 1,
    "titre": "Application Mobile Innovante",
    "moyenneJury": 9.20,
    "moyenneEtudiant": 8.50,
    "scoreFinal": 8.99,
    "totalVotesJury": 1,
    "totalVotesEtudiants": 1
  }
]
```

## 🔥 Fonctionnalités avancées

### **Système de pondération automatique**
- **Votes jury : 70%** de la note finale
- **Votes étudiants : 30%** de la note finale
- **Calcul automatique** du classement
- **Prévention des votes multiples** par utilisateur/projet

### **Gestion des rôles**
- **ETUDIANT** : Peut voter sur les projets
- **JURY** : Peut voter ET commenter les projets  
- **ADMIN** : Accès complet (futur)

### **Sécurité**
- **JWT Authentication** pour toutes les routes protégées
- **Validation des rôles** avec middleware
- **Prévention des votes multiples**