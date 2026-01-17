# ✅ Checklist de test - JIG 2026 Frontend

## URL de test : https://jig-projet-ea3m.vercel.app

---

## 🎨 Test 1 : Page d'accueil

### URL : `/`

**À vérifier :**
- [ ] Les logos JIG s'affichent (blanc dans header, pas d'erreur 404)
- [ ] Section Hero avec dégradé rouge JIG
- [ ] Sections About, Programme, Galerie visibles
- [ ] Footer avec logos et informations
- [ ] Pas d'erreur dans la console (F12)

**Couleurs attendues :**
- Rouge bordeaux `#9E1B32`
- Dégradés rouges

---

## 📝 Test 2 : Inscription

### URL : `/register`

**À vérifier :**
1. Ouvrir la **Console** (F12)
2. Remplir le formulaire :
   - Nom : `Test`
   - Prénom : `Utilisateur`
   - Email : `test@example.com`
   - Mot de passe : `123456`
   - Confirmer mot de passe : `123456`
   - Rôle : `Utilisateur`
3. Cliquer sur **S'inscrire**

**Logs attendus dans la console :**
```
🔐 AuthService.register appelé avec: {...}
🌐 API Request: POST https://jig2026.up.railway.app/api/auth/register
⚠️ Pas de token trouvé pour la requête
📤 Envoi requête avec options: {...}
📥 Réponse reçue: 201 Created
✅ Inscription réussie !
```

**Résultat attendu :**
- [ ] Notification verte "Inscription réussie !"
- [ ] Redirection vers `/login` après 2 secondes
- [ ] **AUCUNE** erreur CORS dans la console

**En cas d'erreur :**
- Copier tous les logs de la console
- Noter le message d'erreur exact

---

## 🔐 Test 3 : Connexion

### URL : `/login`

**À vérifier :**
1. Se connecter avec le compte créé
2. Email : `test@example.com`
3. Mot de passe : `123456`

**Résultat attendu :**
- [ ] Connexion réussie
- [ ] Redirection vers page d'accueil
- [ ] Nom d'utilisateur affiché dans le header

---

## 📂 Test 4 : Page Mes Projets (Étudiants uniquement)

### URL : `/mes-projets`

**Conditions :**
- Être connecté en tant qu'**ETUDIANT**
- Si connecté en tant qu'utilisateur → le lien n'apparaît pas dans le menu

**À vérifier :**
1. Le lien "Mes Projets" est visible dans le menu
2. Cliquer sur "Mes Projets"
3. La page s'affiche avec :
   - [ ] 4 cartes de statistiques (Total, Validés, En attente, Brouillons)
   - [ ] Message "Aucun projet soumis" (si c'est le premier projet)
   - [ ] Bouton "Soumettre mon premier projet"
   - [ ] Design aux couleurs JIG

**Si vous avez des projets :**
- [ ] Liste des projets s'affiche
- [ ] Badges de statut corrects
- [ ] Boutons d'action visibles

---

## 🗳️ Test 5 : Page Voter

### URL : `/voter`

**À vérifier :**
1. La page se charge
2. **Console** (F12) : Chercher les logs
   ```
   🚀 === DEBUT CHARGEMENT PROJETS ===
   🌐 URL BASE API: https://jig2026.up.railway.app/api
   📦 RÉPONSE BRUTE: {...}
   ```

**Résultat attendu :**
- [ ] Liste des projets se charge
- [ ] Pas d'erreur "Le serveur est indisponible"
- [ ] Filtres et recherche fonctionnent

**En cas d'erreur :**
- Noter le message exact
- Copier les logs de la console

---

## ⚖️ Test 6 : Page Jury

### URL : `/jury`

**À vérifier :**
- [ ] Page placeholder s'affiche
- [ ] Design aux couleurs JIG
- [ ] Message informatif pour les jurys
- [ ] Boutons "Retour à l'accueil" et "Se connecter"

---

## 🖼️ Test 7 : Logos dans toutes les pages

**Vérifier sur TOUTES les pages :**
- [ ] Page d'accueil → Logo blanc dans header
- [ ] Page inscription → Logo blanc (côté gauche) + Logo rouge (formulaire)
- [ ] Page login → Logos visibles
- [ ] Footer → Logo blanc

**Console (F12) :**
- [ ] **AUCUNE** erreur type :
  ```
  GET http://localhost:5000/uploads/logo/... net::ERR_FAILED
  ```

**Si erreur logo :**
- Les logos doivent charger depuis `/logo/logo_blanc.png` et `/logo/logo_rouge.png`

---

## 📊 Résumé

### ✅ Tout fonctionne si :
1. Logos s'affichent partout
2. Inscription réussit (201 Created)
3. Connexion fonctionne
4. Page Mes Projets accessible (étudiants)
5. Page Voter charge les projets
6. Aucune erreur CORS

### ❌ Problèmes possibles :

#### Erreur CORS
```
Access to fetch at '...' has been blocked by CORS policy
```
**Solution :** Vérifier Railway CORS + variable FRONTEND_URL

#### Logos 404
```
GET /uploads/logo/... 404
```
**Solution :** Vérifier que Logo.jsx utilise `/logo/...`

#### API indisponible
```
Le serveur est indisponible
```
**Solution :** Vérifier `NEXT_PUBLIC_API_URL` sur Vercel

---

## 🆘 En cas de problème

**Informations à fournir :**
1. URL testée
2. Action effectuée
3. Message d'erreur exact
4. Capture d'écran de la console (F12)
5. Logs complets de la console

---

**Date** : 15 janvier 2026  
**Version** : 2.0.0  
**Commit** : c56717e
