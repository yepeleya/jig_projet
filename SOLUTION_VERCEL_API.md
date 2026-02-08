# 🎯 Solution Vercel API - Configuration

## ✅ Avantages de cette Solution
- **Gratuit** - Inclus dans votre plan Vercel
- **Même plateforme** - Frontend + API sur Vercel
- **Configuration simple** - Pas de deuxième hébergeur
- **Déploiement automatique** - Git push → déploiement

## 🚀 Étapes de Configuration

### 1. Copier le Schema Prisma
```bash
# Copier since le backend
cp jig2026/backend/prisma/schema.prisma jig2026/frontend/prisma/
```

### 2. Installer les Dépendances
```bash
cd jig2026/frontend
npm install @prisma/client bcryptjs jsonwebtoken multiparty
```

### 3. Générer Prisma Client
```bash
cd jig2026/frontend
npx prisma generate
```

### 4. Variables d'Environnement Vercel
Dans Vercel Dashboard → Settings → Environment Variables:
```
DATABASE_URL = postgresql://user:password@host:port/database
JWT_SECRET = votre_secret_jwt_super_secure_123
```

### 5. Modifier le Service API Frontend
Le frontend utilisera automatiquement les routes `/api/*` de Vercel au lieu du backend externe.

## 📝 Routes API Disponibles

✅ **Créées:**
- `GET /api/projets/public` - Liste des projets
- `POST /api/projets/soumettre` - Soumission projet  
- `POST /api/auth/login` - Connexion

🔄 **À Créer (si besoin):**
- `POST /api/auth/register` - Inscription
- `POST /api/votes` - Vote
- `GET /api/votes/*` - Données de vote

## 🎯 Avantages vs Backend Séparé

| Aspect | Backend Séparé | Vercel API |
|--------|---------------|------------|
| **Coût** | Payant après essai | Gratuit |
| **Maintenance** | 2 déploiements | 1 déploiement |
| **Configuration** | Complexe | Simple |
| **Performance** | Excellent | Très bon |
| **Évolutivité** | Très haute | Haute |

## 🚦 Démarrage Rapide

1. **Pusher les changements sur Git**
2. **Vercel déploiera automatiquement**
3. **Tester avec:** `https://votre-site.vercel.app/api/projets/public`

Voulez-vous continuer avec cette solution ou préférez-vous Render ?