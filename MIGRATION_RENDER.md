# 🚀 Migration Railway → Render

## Étapes de Déploiement

### 1. Créer un compte sur Render
- Aller sur https://render.com
- Se connecter avec GitHub

### 2. Créer une nouvelle Base de Données ✅ (En cours)
Vous êtes en train de configurer :
1. **Nom:** jig2026-database ✅
2. **Région:** Oregon (UE centrale) ✅
3. **Version:** PostgreSQL 18 ✅
4. **Plan:** Gratuit (256Mo RAM, 1Go stockage) ✅

**IMPORTANT:** Après avoir cliqué "Create Database", noter :
- **Internal Database URL** (pour Render services)
- **External Database URL** (pour connexions externes)
- **Nom de la base:** (généré automatiquement)
- **Utilisateur:** (généré automatiquement) 
- **Mot de passe:** (généré automatiquement)

### 3. Adapter le Schema Prisma pour PostgreSQL
Votre backend utilise MySQL mais Render utilise PostgreSQL. Il faut adapter :

1. **Modifier le schema.prisma dans le backend :**
```prisma
datasource db {
  provider = "postgresql"  // ← Changer de "mysql" vers "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Mettre à jour les types de données :**
```prisma
// Remplacer @db.Text par @db.Text dans tous les modèles
// PostgreSQL gère différemment les types
```

### 4. Déployer le Backend Web Service
1. Dashboard → "New Web Service"
2. Connecter le repository Git
3. Configurations:
   - **Nome:** jig2026-backend
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (0$/mois)

### 5. Configurer Git et Déployer le Backend

**Une fois votre base de données créée**, vous obtiendrez les informations de connexion. Utilisez-les ainsi :

1. **Connecter votre repository GitHub à Render :**
   - Dashboard Render → "New Web Service"  
   - Choisir "Build and deploy from a Git repository"
   - Connecter votre compte GitHub
   - Sélectionner le repository `jig_projet`

2. **Configurations du service :**
   - **Nome:** jig2026-backend
   - **Root Directory:** `jig2026/backend` (important!)
   - **Environment:** Node
   - **Node Version:** 18.x ou 20.x  
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 6. Variables d'Environnement Render
Une fois le service créé, aller dans Settings → Environment Variables et ajouter :

```
DATABASE_URL = postgresql://[user]:[password]@[host]:[port]/[database]
JWT_SECRET = votre_secret_jwt_super_securise_123456789
NODE_ENV = production
PORT = 10000
FRONTEND_URL = https://jig-projet-ea3m.vercel.app
```

**⚠️ IMPORTANT:** Remplacer `DATABASE_URL` par l'URL fournie par votre base PostgreSQL.

### 7. Préparer la Migration des Données

Avant de déployer, il faut prparer votre backend:

1. **Remplacer le schema Prisma actuel :**
```bash
# Dans jig2026/backend/
cp prisma/schema-postgresql.prisma prisma/schema.prisma
```

2. **Mettre à jour package.json pour inclure Prisma :**
```json
{
  "dependencies": {
    "@prisma/client": "^6.18.0",
    "prisma": "^6.18.0"
  },
  "scripts": {
    "postinstall": "npx prisma generate",
    "deploy": "npx prisma migrate deploy"
  }
}
```

3. **Committer les changements :**
```bash
git add .
git commit -m "Migration vers PostgreSQL pour Render"
git push origin main
```

### 8. Migration des Données Railway → Render

Si vous avez déjà des données importantes dans Railway MySQL :

1. **Exporter depuis Railway :**
   - Connecter à votre base MySQL Railway
   - Exporter en SQL : `mysqldump -h host -u user -p database > backup.sql`

2. **Convertir MySQL → PostgreSQL :**
   - Utiliser un outil comme `mysql2postgresql` ou convertir manuellement
   - Adapter les types de données et syntaxes

3. **Importer dans Render PostgreSQL :**
   - Connecter à votre nouvelle base Render  
   - Importer : `psql postgresql://... < converted_backup.sql`

**💡 Alternative:** Repartir à zéro avec la nouvelle base PostgreSQL (plus simple si peu de données).

### 9. Mettre à Jour le Frontend Vercel

Une fois votre backend Render déployé (vous obtiendrez une URL comme `https://jig2026-backend.onrender.com`) :

1. **Dans Vercel Dashboard :**
   - Aller à votre projet → Settings → Environment Variables
   - Ajouter/Modifier :
   ```
   NEXT_PUBLIC_API_URL = https://jig2026-backend.onrender.com/api
   ```

2. **Redéployer le frontend :**
   - Git push ou déclenchement manuel dans Vercel
   - Vérifier que la variable est prise en compte

### 10. Tests Finaux

Les URLs de test une fois déployé :

- **Frontend :** `https://jig-projet-ea3m.vercel.app/`
- **Backend Health :** `https://jig2026-backend.onrender.com/health`  
- **API Projets :** `https://jig2026-backend.onrender.com/api/projets/public`

**Vérifications :**
✅ Page de soumission fonctionne  
✅ Page de vote affiche les projets  
✅ Dashboard accessible avec données  
✅ Base de données synchronisée

## ⏱️ Temps de Déploiement Estimé
- **Création base :** 2-3 minutes
- **Déploiement backend :** 5-10 minutes (premier déploiement)
- **Configuration frontend :** 2 minutes
- **Total :** ~15 minutes

## 🆘 En Cas de Problème

### Erreur "Build Failed"
- Vérifier `Root Directory` = `jig2026/backend`
- Vérifier Node version 18.x ou 20.x
- Vérifier `package.json` contient toutes dépendances

### Erreur "Database Connection"  
- Vérifier DATABASE_URL exacte (copier depuis Render dashboard)
- Vérifier que Prisma generate s'exécute
- Regarder les logs : Render Dashboard → Logs

### API Non Fonctionnelle
- Vérifier CORS autorise votre domaine Vercel
- Tester directement : `https://backend-url/health`
- Vérifier variables d'environnement

## 💰 Coûts
- **Render PostgreSQL Free :** 0$/mois (256Mo RAM, 1Go stockage)
- **Render Web Service Free :** 0$/mois (750h/mois - ~31 jours)
- **Vercel Hobby :** 0$/mois
- **Total :** **0$/mois** 🎉

Le service Render se met en veille après 15min d'inactivité (mode gratuit), mais redémarre automatiquement à la première requête.

## 🎯 Avantages Render vs Railway
- ✅ 750h/mois gratuites (environ 31 jours)
- ✅ Base PostgreSQL incluse (1GB)
- ✅ SSL automatique
- ✅ Redémarrage automatique
- ✅ Logs en temps réel

## 🔧 Alternatives Si Render Pose Problème

### Option B: Vercel API (Plus simple)
Transformation du backend en API Vercel:
1. Créer dossier `api/` dans le Frontend
2. Convertir routes Express en fonctions Vercel

### Option C: Fly.io 
- 3 petites VMs gratuites
- Base PostgreSQL gratuite 3GB

Voulez-vous que je continue avec Render ou préférez-vous une autre solution ?