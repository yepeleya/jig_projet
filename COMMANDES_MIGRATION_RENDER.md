# 🚀 Scripts de Migration Render - Commandes à Exécuter

## 1. Préparer le Backend pour PostgreSQL

```bash
# Naviguer vers le backend
cd c:\wamp64\www\jig_projet\jig2026\backend

# Sauvegarder l'ancien schema 
cp prisma\schema.prisma prisma\schema-mysql-backup.prisma

# Copier le nouveau schema PostgreSQL
cp prisma\schema-postgresql.prisma prisma\schema.prisma

# Vérifier que le changement est correct
echo "Vérifier que datasource db.provider = 'postgresql'"
```

## 2. Mettre à Jour package.json

Ajouter Prisma aux dépendances si pas déjà présent :

```json
{
  "dependencies": {
    "@prisma/client": "^6.18.0",
    "prisma": "^6.18.0"
  },
  "scripts": {
    "build": "npx prisma generate && npx prisma migrate deploy",
    "postinstall": "npx prisma generate"
  }
}
```

## 3. Tester en Local (Optionnel)

Si vous voulez tester localement avec PostgreSQL :

```bash
# Installer PostgreSQL localement ou utiliser Docker
docker run --name postgres-test -e POSTGRES_PASSWORD=test123 -p 5432:5432 -d postgres:15

# Mettre à jour .env avec PostgreSQL local
echo "DATABASE_URL=postgresql://postgres:test123@localhost:5432/jig2026_test" > .env

# Générer et appliquer les migrations
npx prisma migrate dev --name init
npx prisma generate

# Tester le serveur
npm run dev
```

## 4. Committer et Pousser

```bash
# Depuis la racine du projet
cd c:\wamp64\www\jig_projet

# Ajouter tous les changements
git add .

# Committer
git commit -m "Migration backend vers PostgreSQL pour Render"

# Pousser vers GitHub
git push origin main
```

## 5. Variables d'Environnement à Copier

**Pour votre base de données Render (à récupérer après création) :**
```
DATABASE_URL=postgresql://username:password@hostname:port/database_name
```

**Autres variables nécessaires :**
```
JWT_SECRET=votre_secret_jwt_super_securise_123456789_changez_moi
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://jig-projet-ea3m.vercel.app
DASHBOARD_URL=https://jig-projet-ea3m.vercel.app
JURY_URL=https://jig-projet-ea3m.vercel.app
```

## 6. Commandes de Vérification Post-Déploiement

```bash
# Tester l'API backend déployée
curl https://jig2026-backend.onrender.com/health
curl https://jig2026-backend.onrender.com/api/projets/public

# Vérifier les logs
# Aller sur Render Dashboard → Votre service → Logs
```

## 7. Variables à Ajouter dans Vercel

```bash
# Dans Vercel Dashboard → Settings → Environment Variables

NEXT_PUBLIC_API_URL=https://jig2026-backend.onrender.com/api
```

Puis redéployer le frontend :
```bash
# Méthode 1: Git push
git commit --allow-empty -m "Update API URL"
git push origin main

# Méthode 2: Via Vercel Dashboard
# Aller sur vercel.com → Votre projet → Deployments → Redeploy
```

## 🔍 Commandes de Debug

Si quelque chose ne fonctionne pas :

```bash
# Vérifier l'état de la base
npx prisma studio  # Ouvre l'interface graphique de la BD

# Voir le schema généré
npx prisma db push --preview-feature

# Reset complet de la base (ATTENTION: supprime les données!)
npx prisma migrate reset

# Logs détaillés
npm run dev  # Pour voir les erreurs en local
```

## ⭐ Ordre d'Exécution Recommandé

1. **Créer la base PostgreSQL sur Render** (fait ✅)
2. **Exécuter les commandes 1-4** ci-dessus  
3. **Créer le Web Service sur Render** avec votre repo GitHub
4. **Ajouter variables d'environnement** dans Render
5. **Attendre le déploiement** (5-10min)
6. **Mettre à jour Vercel** avec la nouvelle URL API
7. **Tester** toutes les fonctionnalités

🎯 **Résultat final :** Système 100% fonctionnel hébergé gratuitement sur Render + Vercel !