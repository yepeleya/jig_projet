# JIG 2026 - Plateforme de Concours Innovation

## 📋 Description
Plateforme complète de gestion de concours d'innovation avec interface utilisateur, jury, et administration.

## 🏗️ Architecture
- **Backend**: API Express.js + Prisma + MySQL
- **Frontend**: Interface utilisateur Next.js
- **Dashboard**: Interface administration Next.js  
- **Jury**: Interface jury Next.js

## 🚀 Installation et Configuration

### 1. Prérequis
- Node.js 18+
- MySQL/MariaDB (WAMP)
- Git

### 2. Installation
```powershell
# Cloner le projet
git clone https://github.com/votre-username/jig_projet.git
cd jig_projet

# Installer les dépendances
.\install-dependencies.ps1
```

### 3. Configuration Base de Données
1. Créez une base de données MySQL `jig2026`
2. Copiez `.env.example` vers `.env` dans `jig2026/backend/`
3. Configurez DATABASE_URL dans le fichier .env :
```env
DATABASE_URL="mysql://username:password@localhost:3306/jig2026"
JWT_SECRET="votre_secret_jwt_très_long_et_sécurisé"
```

### 4. Initialisation de la base
```powershell
cd jig2026/backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Démarrage
```powershell
# Démarrage automatique de tous les services
.\start-jig2026.ps1
```

## 🌐 URLs d'accès

| Service | URL | Port | Description |
|---------|-----|------|-------------|
| Backend API | http://localhost:3000 | 3000 | API REST |
| Interface Utilisateur | http://localhost:3002 | 3002 | Soumission projets |
| Dashboard Admin | http://localhost:3001 | 3001 | Administration |
| Interface Jury | http://localhost:3000 (Next.js) | 3000 | Évaluation projets |

## 🧪 Test de l'Application

### 1. Test Soumission de Projet
1. Aller sur http://localhost:3002
2. Créer un compte utilisateur
3. Soumettre un projet
4. Vérifier dans le dashboard admin

### 2. Test Vote Utilisateur
1. Connecté en tant qu'utilisateur
2. Aller sur la page de vote
3. Noter des projets
4. Vérifier en base que les votes sont sauvegardés

### 3. Test Interface Jury
1. Aller sur l'interface jury
2. Se connecter avec un compte jury
3. Évaluer des projets
4. Laisser des commentaires

## 📁 Structure du Projet

```
jig_projet/
├── jig2026/
│   ├── backend/          # API Express.js
│   │   ├── src/
│   │   ├── prisma/
│   │   └── package.json
│   ├── frontend/         # Interface utilisateur Next.js
│   │   ├── src/
│   │   └── package.json
│   └── jury/             # Interface jury Next.js
│       ├── src/
│       └── package.json
├── dashboard/            # Dashboard admin Next.js
│   ├── src/
│   └── package.json
└── start-jig2026.ps1    # Script de démarrage
```

## 🔧 Commandes Utiles

### Backend
```powershell
cd jig2026/backend
npm run dev        # Démarrage développement
npm run seed       # Alimenter la base de test
npm run db:studio  # Interface Prisma Studio
```

### Frontend
```powershell
cd jig2026/frontend
npm run dev        # Démarrage développement
npm run build      # Build production
```

### Dashboard
```powershell
cd dashboard
npm run dev        # Démarrage développement
```

## 🐛 Dépannage

### Base de données
- Vérifier que MySQL/WAMP est démarré
- Vérifier la configuration `.env`
- Exécuter `npx prisma db push` si schema modifié

### Ports occupés
- Backend: 3000
- Dashboard: 3001  
- Frontend: 3002

### Logs
- Vérifier les logs dans les consoles PowerShell
- Vérifier les logs navigateur (F12)

## 📝 Fonctionnalités Testées

- ✅ Soumission de projets
- ✅ Authentification utilisateurs/jury/admin
- ✅ Vote utilisateurs
- ✅ Évaluation jury
- ✅ Dashboard administrateur
- ✅ Notifications temps réel
- ✅ Gestion fichiers/médias

## 🚀 Déploiement Production

### GitHub
```powershell
git add .
git commit -m "Configuration initiale JIG2026"
git push origin main
```

### Hébergement
- Backend: Vercel/Railway/Heroku
- Frontend: Vercel/Netlify
- Base de données: PlanetScale/Railway/Heroku

## 📧 Support
Pour toute question technique, consulter la documentation dans chaque sous-dossier.