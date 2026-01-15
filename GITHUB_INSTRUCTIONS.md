# 📋 Instructions pour GitHub

## 1. Créer le repository GitHub

1. Aller sur GitHub.com
2. Cliquer sur "New repository" 
3. Nom: `jig2026-platform` (ou nom de ton choix)
4. Description: `Plateforme complète JIG 2026 - Backend API, Dashboard Admin, Interface Utilisateur & Jury`
5. **Cocher "Public"** pour l'hébergement gratuit
6. **NE PAS** cocher "Initialize this repository with a README"
7. Cliquer "Create repository"

## 2. Connecter le project local

```bash
# Ajouter l'origin remote (remplacer par ton URL)
git remote add origin https://github.com/TON_USERNAME/jig2026-platform.git

# Pousser vers GitHub
git branch -M main
git push -u origin main
```

## 3. Commandes de push

```powershell
# Depuis le dossier c:\wamp64\www\jig_projet
cd c:\wamp64\www\jig_projet

# Ajouter l'origin (remplace par ton URL GitHub)
git remote add origin https://github.com/yepeleya/jig_projet.git

# Renommer la branche en main
git branch -M main

# Premier push
git push -u origin main
```

## 4. Vérifications avant hébergement

### ✅ Structure prête pour l'hébergement
- ✅ Pas de submodules Git problématiques
- ✅ .gitignore configuré correctement
- ✅ Base de données nettoyée (seul admin conservé)
- ✅ Variables d'environnement documentées
- ✅ Scripts de déploiement inclus

### ✅ Applications prêtes
- ✅ Backend API fonctionnel (port 5000)
- ✅ Dashboard Admin opérationnel (port 3001)
- ✅ Interface Utilisateur prête (port 3002) 
- ✅ Interface Jury configurée (port 3000)

### ✅ Base de données
- ✅ Schéma Prisma validé
- ✅ Migrations fonctionnelles
- ✅ Admin créé: admin@jig2026.com / admin123
- ✅ Données de test supprimées

## 5. Hébergement recommandé

### Backend (API)
- **Railway** (facile pour MySQL + Node.js)
- **Heroku** (avec ClearDB MySQL addon)
- **Vercel** (avec PlanetScale MySQL)

### Frontend (Next.js apps)
- **Vercel** (optimal pour Next.js)
- **Netlify** (bon support Next.js)
- **Github Pages** (après build statique)

### Base de données
- **PlanetScale** (MySQL serverless, gratuit)
- **Railway MySQL** (inclus avec hosting backend)
- **ClearDB** (addon Heroku)

## 6. Variables d'environnement pour production

```env
# Backend .env
DATABASE_URL="mysql://user:password@host:port/database"
JWT_SECRET="super_secure_jwt_secret_production_2026"
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://ton-domaine.vercel.app
DASHBOARD_URL=https://dashboard.ton-domaine.com
JURY_URL=https://jury.ton-domaine.com
```

## 7. Tests avant mise en ligne

1. ✅ Backend répond sur /health
2. ✅ Connexion admin fonctionne
3. ✅ Soumission de projet
4. ✅ Système de votes
5. ✅ Interface jury opérationnelle
6. ✅ Dashboard admin accessible

## 🎉 Prêt pour l'hébergement !

Le projet est maintenant prêt à être hébergé. Tous les problèmes de structure Git ont été résolus et la base de données est nettoyée avec seulement le compte admin conservé.