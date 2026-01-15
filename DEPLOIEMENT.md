# 🚀 Guide de déploiement JIG 2026

## ✅ Corrections effectuées

### 1. Backend (Railway)
- ✅ CORS configuré pour Vercel
- ✅ Support wildcard `*.vercel.app`
- ✅ Logs détaillés ajoutés
- ✅ Routes sous `/api/*`

### 2. Frontend (Vercel)
- ✅ Auto-ajout `/api` à l'URL backend
- ✅ Logos corrigés (utilisation locale au lieu de localhost)
- ✅ Page Jury placeholder créée
- ✅ Gestion d'erreur améliorée
- ✅ Design avec couleurs JIG (#9E1B32)

### 3. Problèmes résolus
- ✅ CORS entre Vercel et Railway
- ✅ Erreur 404 logos
- ✅ Erreur 404 page jury
- ✅ Routes API correctes

---

## 📋 Variables d'environnement

### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://jig2026.up.railway.app/api
```

### Railway (Backend)
```env
FRONTEND_URL=https://jig-projet-fa2u.vercel.app
DATABASE_URL=<votre_url_mysql>
JWT_SECRET=<votre_secret>
PORT=8080
NODE_ENV=production
```

---

## 🎯 Prochaines étapes

### 1️⃣ Attendre le redéploiement Vercel
- ⏰ Dans ~22 heures (limite gratuite atteinte)
- Ou créer un nouveau projet Vercel

### 2️⃣ Déployer le Dashboard
Le dashboard permet aux admins de gérer les jurys.

**Structure actuelle:**
```
jig2026/
├── backend/      ✅ Déployé sur Railway
├── frontend/     ✅ Déployé sur Vercel
├── jury/         ⏳ À déployer
└── dashboard/    ⏳ À déployer
```

**Options de déploiement Dashboard:**

#### Option A: Vercel (Recommandé)
1. Créer un nouveau projet Vercel
2. Root Directory: `dashboard`
3. Variables d'env:
   ```
   NEXT_PUBLIC_API_URL=https://jig2026.up.railway.app/api
   ```

#### Option B: Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`

#### Option C: Railway
1. Créer nouveau service
2. Root directory: `dashboard`

---

## 📝 Checklist de vérification

### Avant le déploiement:
- [ ] Vérifier que Railway backend est actif
- [ ] Tester l'API: `https://jig2026.up.railway.app/health`
- [ ] Vérifier les variables d'env sur Railway

### Après le déploiement Frontend:
- [ ] Page d'accueil s'affiche avec couleurs JIG
- [ ] Logos JIG visibles (pas d'erreur console)
- [ ] Page /register fonctionne
- [ ] Page /login fonctionne
- [ ] Page /voter charge les projets
- [ ] Page /jury affiche le placeholder

### Après le déploiement Dashboard:
- [ ] Login admin fonctionne
- [ ] Création de comptes jury
- [ ] Gestion des projets
- [ ] Statistiques visibles

---

## 🆘 Résolution problèmes

### Erreur CORS
```
Access to fetch at '...' has been blocked by CORS policy
```
**Solution:** Vérifier que l'URL Vercel est dans Railway CORS

### Erreur "serveur indisponible"
```
Le serveur est indisponible
```
**Solution:** Vérifier l'URL API contient `/api`

### Images/Logos 404
```
GET http://localhost:5000/uploads/... net::ERR_FAILED
```
**Solution:** Utiliser chemins locaux `/logo/...`

---

## 📞 Contact
Pour toute question: Yéo Tenena
