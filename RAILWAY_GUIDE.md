# 🚂 Guide Railway - Hébergement Backend JIG 2026

## ✅ Problème résolu !

J'ai configuré le projet pour Railway. Voici ce qui a été ajouté :

### 📦 Fichiers ajoutés/modifiés :
- ✅ `package.json` - Script `start` et `main` configurés
- ✅ `railway.toml` - Configuration Railway
- ✅ `Procfile` - Commande de démarrage alternative
- ✅ Dépendances backend ajoutées au package.json racine

## 🚀 Étapes pour héberger sur Railway :

### 1. Retourner sur Railway
1. Supprimer le déploiement précédent s'il existe
2. Reconnecter ton repository GitHub : `yepeleya/jig_projet`
3. Railway détectera maintenant la commande de démarrage

### 2. Variables d'environnement Railway
Ajouter ces variables dans Railway :
```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=ton_jwt_secret_ultra_securise_production
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://ton-frontend.vercel.app
DASHBOARD_URL=https://ton-dashboard.vercel.app
JURY_URL=https://ton-jury.vercel.app
```

### 3. Base de données MySQL
Railway peut fournir MySQL automatiquement :
1. Aller dans l'onglet "Data" sur Railway
2. Cliquer "Add MySQL"
3. Railway génère automatiquement DATABASE_URL
4. Utiliser cette URL dans les variables d'environnement

### 4. Déploiement automatique
Railway va :
1. ✅ Détecter Node.js
2. ✅ Exécuter `npm start`
3. ✅ Installer les dépendances dans `jig2026/backend/`
4. ✅ Générer le client Prisma
5. ✅ Démarrer le serveur

## 📋 Commande de démarrage configurée :
```bash
npm start
# Qui exécute : cd jig2026/backend && npm install && npx prisma generate && npm start
```

## 🔧 Si ça ne marche toujours pas :

### Option A : Déployer seulement le backend
1. Créer un nouveau repository : `jig2026-backend`
2. Copier seulement le contenu de `jig2026/backend/`
3. Déployer ce repository sur Railway

### Option B : Forcer le dossier de build
Dans Railway, configure la variable :
```env
RAILPACK_BUILD_COMMAND=cd jig2026/backend && npm install && npx prisma generate
RAILPACK_START_COMMAND=cd jig2026/backend && npm start
```

## ✅ Test après déploiement :
Une fois déployé, teste ton API :
- `https://ton-app.railway.app/health` - Devrait retourner le status
- `https://ton-app.railway.app/api/auth/login` - Test de connexion admin

## 🎯 Prochaines étapes :
1. ✅ Railway pour backend + MySQL
2. 🔜 Vercel pour Dashboard (port 3001)
3. 🔜 Vercel pour Frontend (port 3002)
4. 🔜 Vercel pour Jury (port 3000)

Essaie maintenant de redéployer sur Railway ! 🚂