# 🚀 Guide d'Hébergement JIG 2026

## 📋 Pré-requis pour l'hébergement

### Base de données
- MySQL/MariaDB compatible
- Version recommandée: MySQL 8.0+ ou MariaDB 10.6+

### Variables d'environnement requises
Créez un fichier `.env` dans `jig2026/backend/` avec :

```env
# Base de données (OBLIGATOIRE)
DATABASE_URL="mysql://username:password@host:port/database_name"

# JWT Secret (OBLIGATOIRE - générez une clé sécurisée)
JWT_SECRET="votre_jwt_secret_ultra_securise_minimum_32_caracteres"

# Configuration serveur
PORT=3000
NODE_ENV=production

# URLs des applications (ajustez selon votre domaine)
FRONTEND_URL=https://votre-domaine.com
DASHBOARD_URL=https://admin.votre-domaine.com
JURY_URL=https://jury.votre-domaine.com

# Limite upload fichiers (optionnel)
UPLOAD_MAX_SIZE=10485760
```

## 🏗️ Structure pour l'hébergement

### Applications à déployer :

1. **Backend API** (`jig2026/backend/`)
   - Port: 3000 (ou variable PORT)
   - Base: Node.js + Express
   - Database: Prisma + MySQL

2. **Dashboard Admin** (`dashboard/`)
   - Port: 3001
   - Framework: Next.js
   - Build: `npm run build`

3. **Interface Utilisateur** (`jig2026/frontend/`)
   - Port: 3002  
   - Framework: Next.js
   - Build: `npm run build`

4. **Interface Jury** (`jig2026/jury/`)
   - Port: 3000 (Next.js)
   - Framework: Next.js
   - Build: `npm run build`

## 🔧 Configuration Prisma pour production

1. Installer les dépendances :
```bash
cd jig2026/backend
npm install
```

2. Générer le client Prisma :
```bash
npx prisma generate
```

3. Appliquer les migrations :
```bash
npx prisma migrate deploy
```

## 👤 Compte Administrateur par défaut

- **Email**: admin@jig2026.com
- **Mot de passe**: admin123
- **Rôle**: ADMIN

⚠️ **IMPORTANT**: Changez le mot de passe après le premier déploiement !

## 🌐 URLs de l'application

- **API Backend**: `http://localhost:3000` ou votre domaine
- **Dashboard Admin**: `http://localhost:3001` ou admin.votre-domaine.com
- **Interface Public**: `http://localhost:3002` ou www.votre-domaine.com  
- **Interface Jury**: `http://localhost:3000` ou jury.votre-domaine.com

## 📁 Fichiers à ignorer sur GitHub

Le `.gitignore` est configuré pour exclure :
- `node_modules/`
- `.env` (fichiers de configuration)
- Logs et fichiers temporaires
- Builds locaux

## 🔄 Processus de déploiement recommandé

1. **Cloner le repository**
2. **Configurer la base de données** 
3. **Créer le fichier .env**
4. **Installer les dépendances** dans chaque dossier
5. **Exécuter les migrations Prisma**
6. **Builder les applications Next.js**
7. **Démarrer les services**

## 🆘 Support

En cas de problème :
- Vérifiez les logs des applications
- Assurez-vous que la base de données est accessible
- Vérifiez que tous les ports sont disponibles
- Consultez la documentation Prisma pour les problèmes de DB