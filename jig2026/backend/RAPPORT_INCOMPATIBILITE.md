# 🚨 RAPPORT D'INCOMPATIBILITÉ FRONTEND/BACKEND JIG2026

## 📊 RÉSUMÉ EXÉCUTIF
- **Status**: 🔴 INCOMPATIBILITÉ CRITIQUE DÉTECTÉE
- **Impact**: Erreurs 400 sur authentification et soumission projets 
- **Cause principale**: Champs frontend inexistants dans le schema backend

---

## 1️⃣ CHAMPS BACKEND AUTORISÉS (Schema Prisma)

### 🧑‍💼 Modèle User
```prisma
- id: Int @id @default(autoincrement())
- nom: String
- prenom: String  
- email: String @unique
- motDePasse: String
- role: Role @default(ETUDIANT)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt
```

### 📋 Modèle Projet
```prisma
- id: Int @id @default(autoincrement())
- titre: String
- description: String
- categorie: String  
- fichier: String?
- image: String?
- statut: StatutProjet @default(EN_ATTENTE)
- userId: Int?
- moyenneVote: Float? @default(0)
- totalVotes: Int @default(0) 
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt
```

### 🎯 Enums Valides
```prisma
Role: ADMIN|ORGANISATEUR|JURY|EXPERT|ETUDIANT|ETUDIANT_LICENCE|ETUDIANT_MASTER|ETUDIANT_DOCTORAT|ELEVE_LYCEE|ELEVE_COLLEGE|PROFESSIONNEL|ENTREPRISE|STARTUP|FREELANCE|ENSEIGNANT|CHERCHEUR|VISITEUR

StatutProjet: EN_ATTENTE|EN_COURS|EVALUE|TERMINE|APPROUVE|REJETE|SUSPENDU

TypeVote: JURY_TECHNIQUE|JURY_CREATIVITE|JURY_INNOVATION|PUBLIC_GENERAL|ETUDIANT|PROFESSIONNEL|ENTREPRISE
```

---

## 2️⃣ VALIDATION BACKEND (Controllers)

### 🔐 auth.controller.js (Zod Schema)
**registerSchema accepte:**
- nom: string (min 2 chars)
- prenom: string (min 2 chars) 
- email: string (format email)
- password: string (min 6 chars)
- role: enum ['ADMIN', 'ETUDIANT', 'JURY'] (défaut: 'ETUDIANT')

**loginSchema accepte:**
- email: string (format email)
- password: string (min 1 char)

### 📋 projet.controller.js (Validation custom)
**validateProjectData exige:**
- titre: string (min 3 chars)
- description: string (min 10 chars)
- categorie: string (obligatoire)
- ❌ niveau: string (obligatoire) ← **PROBLÈME: champ inexistant en DB**

---

## 3️⃣ REQUÊTES FRONTEND ENVOYÉES

### 🔐 Authentification (lib/api.ts)
```typescript
// ❌ PROBLÈME: motDePasse vs password
register: {
  nom: string,
  prenom: string, 
  email: string,
  motDePasse: string,  // ← Backend attend "password"
  filiere?: string,    // ← Champ inexistant en DB
  role: 'ETUDIANT'
}
```

### 📋 Soumission Projet (soumettre/page.jsx)
```javascript
// FormData envoyé:
{
  titre: data.projectTitle,    ✓ OK
  description: data.description,  ✓ OK  
  categorie: data.category,    ✓ OK
  niveau: user?.niveau || 'Licence'  // ❌ PROBLÈME DOUBLE:
                                      // 1. Champ niveau inexistant en schema
                                      // 2. user.niveau inexistant
}
```

---

## 4️⃣ ERREURS BACKEND CONFIRMÉES

### ❌ Code backend utilisant des champs inexistants:
- **projet.controller.js**: Valide `niveau` mais champ absent de Prisma
- **notification.service.js**: Utilise `user.ecole` inexistant
- **Plusieurs services**: Utilisent `specialite` inexistant  
- **projet-suivi.service.js**: Select des champs inexistants

### ❌ Messages d'erreur attendus en production:
```
- "Null constraint violation on the fields: (`niveau`)"
- "invalid input value for enum Role: 'VISITEUR'"  
- "Unknown argument `ecole`. Available options are marked with ?" 
- "Unknown argument `specialite`. Available options are marked with ?"
```

---

## 5️⃣ CORRECTIONS REQUISES

### 🔧 Backend (PRIORITÉ 1)
1. **Supprimer validation `niveau`** de projet.controller.js 
2. **Nettoyer toutes références** aux champs: ecole, filiere, specialite, niveau
3. **Corriger enum Zod** pour supprimer VISITEUR des choix
4. **Mettre à jour les select Prisma** pour utiliser uniquement les champs existants

### 🔧 Frontend (PRIORITÉ 2) 
1. **Renommer `motDePasse` → `password`** dans lib/api.ts
2. **Supprimer champ `filiere`** de register
3. **Supprimer `niveau`** de soumission projet
4. **Nettoyer références** user.niveau, user.ecole, etc.

### 🔧 Middleware (PRIORITÉ 3)
1. **Ajouter logs détaillés** pour tracer toutes les requêtes Vercel→Render
2. **Configurer CORS** pour accepter toutes URLs Vercel

---

## 6️⃣ PLAN D'EXÉCUTION

### Phase 1: Nettoyage Backend (30 min)
- [ ] Supprimer validations champs inexistants
- [ ] Corriger services pour champs Prisma only
- [ ] Régénérer client Prisma
- [ ] Commit + Push → Render

### Phase 2: Correction Frontend (20 min)  
- [ ] Corriger lib/api.ts (motDePasse→password)
- [ ] Corriger soumettre/page.jsx (supprimer niveau)
- [ ] Nettoyer toutes références champs inexistants
- [ ] Commit + Push → Vercel

### Phase 3: Tests & Validation (10 min)
- [ ] Test login/register Vercel→Render
- [ ] Test soumission projet 
- [ ] Vérifier logs Render reçoit requêtes
- [ ] Confirmer codes 200/201 sur succès

**TEMPS TOTAL ESTIMÉ: 60 minutes**

---

## 7️⃣ LIENS UTILES
- **Backend Logs**: https://dashboard.render.com/web/srv-cr8h8lkqj1kc73af9t20/logs
- **Frontend Preview**: https://jig-projet-ea3m.vercel.app  
- **API Test**: `POST https://jig-projet-1.onrender.com/api/auth/login`

---

*Rapport généré le 9 février 2026 - Analyse complète de compatibilité*