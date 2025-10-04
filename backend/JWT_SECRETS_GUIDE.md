# 🔐 Secrets JWT - Guide Complet

## Qu'est-ce que JWT ?

**JWT (JSON Web Token)** est un standard pour sécuriser l'authentification dans votre application.

### Comment ça marche ?

```
1. Utilisateur se connecte → Email + Mot de passe
2. Backend vérifie → Credentials OK
3. Backend génère → JWT Token (signé avec JWT_SECRET)
4. Mobile reçoit → Token
5. Mobile envoie → Token dans chaque requête
6. Backend vérifie → Token valide ?
```

---

## 🔑 Les secrets JWT

### JWT_SECRET

**C'est quoi ?**  
La clé secrète utilisée pour **signer** et **vérifier** les tokens d'accès.

**Pourquoi important ?**  
- Si quelqu'un connaît ce secret, il peut créer des tokens valides
- Il peut se faire passer pour n'importe quel utilisateur
- **Doit rester ABSOLUMENT SECRET**

**Exemple d'utilisation :**
```javascript
// Création du token (backend)
const token = jwt.sign({ userId: 123 }, JWT_SECRET, { expiresIn: '1h' });

// Vérification du token (backend)
const decoded = jwt.verify(token, JWT_SECRET);
```

### JWT_REFRESH_SECRET

**C'est quoi ?**  
Une deuxième clé secrète pour les **refresh tokens** (tokens longue durée).

**Pourquoi deux secrets différents ?**  
- **Access Token** (JWT_SECRET) : Courte durée (1h), utilisé souvent
- **Refresh Token** (JWT_REFRESH_SECRET) : Longue durée (7j), utilisé rarement

Si le JWT_SECRET est compromis, vous pouvez le changer sans invalider tous les refresh tokens.

---

## ⏰ Durées de vie

### JWT_EXPIRES_IN=1h

**Access Token expire après 1 heure**

**Pourquoi court ?**
- Plus sécurisé (si volé, inutile après 1h)
- Réduit les dégâts en cas de fuite

**Cas d'usage :**
- Chaque requête API utilise l'access token
- Après 1h, le mobile doit utiliser le refresh token

### JWT_REFRESH_EXPIRES_IN=7d

**Refresh Token expire après 7 jours**

**Pourquoi plus long ?**
- Évite de demander le mot de passe trop souvent
- Utilisateur reste connecté pendant 7 jours

**Cas d'usage :**
- Quand l'access token expire (après 1h)
- Le mobile envoie le refresh token
- Backend génère un nouvel access token
- Utilisateur continue sans se reconnecter

---

## 🛠️ Générer des secrets forts

### Méthode 1 : PowerShell (Recommandé)

```powershell
# Exécuter le script
cd backend
.\generate-jwt-secrets.ps1
```

### Méthode 2 : Commande PowerShell unique

```powershell
# JWT_SECRET
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

# JWT_REFRESH_SECRET  
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

### Méthode 3 : En ligne (Node.js)

```javascript
// Dans Node.js
require('crypto').randomBytes(64).toString('hex')
```

### Méthode 4 : Site web

👉 https://generate-secret.vercel.app/64

---

## ⚠️ Règles de sécurité

### ✅ À FAIRE

- **Générer des secrets longs** (64+ caractères)
- **Utiliser des caractères aléatoires** (lettres + chiffres)
- **Changer les secrets par défaut** (JAMAIS utiliser ceux de la doc)
- **Secrets différents** pour JWT_SECRET et JWT_REFRESH_SECRET
- **Ne JAMAIS commiter** les secrets sur GitHub
- **Utiliser des variables d'environnement** (.env, Railway Variables)

### ❌ À NE PAS FAIRE

- ❌ Utiliser des mots simples (`password123`, `secret`)
- ❌ Réutiliser le même secret partout
- ❌ Commiter les secrets sur GitHub
- ❌ Partager les secrets par email/chat
- ❌ Hardcoder les secrets dans le code

---

## 📋 Configuration Railway

### Étape 1 : Générer les secrets

```powershell
cd backend
.\generate-jwt-secrets.ps1
```

### Étape 2 : Copier le résultat

Exemple :
```env
JWT_SECRET=JXUdhlHWoqTRbCF3ukDVeiIAyfYNS1LKajO2mn56s70v8trwpEMQz4GBPZgxc9
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=cBPkvG0wqbpsaxrD9h3YIRL54tUQOSNjgVF2TzC6Wo8uXAiHfE7ZneKlMdJm1y
JWT_REFRESH_EXPIRES_IN=7d
```

### Étape 3 : Ajouter dans Railway

1. **Railway Dashboard**
2. **Sélectionner votre service** (backend)
3. **Variables** (onglet)
4. **Coller les variables** une par une

---

## 🔄 Rotation des secrets

### Quand changer les secrets ?

- **Avant le déploiement production** (toujours)
- **Si suspicion de fuite** (immédiat)
- **Tous les 3-6 mois** (bonne pratique)
- **Après départ d'un développeur** qui avait accès

### Comment changer sans casser l'app ?

1. **Générer nouveaux secrets**
2. **Mettre à jour Railway Variables**
3. **Redéployer le backend**
4. **Les utilisateurs devront se reconnecter** (normal)

---

## 🧪 Test des secrets

### Vérifier que ça fonctionne

```powershell
# Tester le register/login après déploiement
cd backend
.\test-railway.ps1 -RailwayUrl "https://votre-app.up.railway.app"
```

Si le test réussit :
```
[OK] Connexion reussie
```

Les secrets JWT fonctionnent correctement ! ✅

---

## 🆘 Dépannage

### Erreur : "invalid token"

**Cause** : JWT_SECRET incorrect ou changé

**Solution** :
1. Vérifier Railway Variables → JWT_SECRET
2. Redéployer le backend
3. Utilisateurs doivent se reconnecter

### Erreur : "jwt expired"

**Cause** : Token expiré (normal après 1h)

**Solution** :
- Le mobile doit automatiquement utiliser le refresh token
- Vérifier le code de refresh dans l'app mobile

### Secrets exposés sur GitHub

**🚨 URGENT** :
1. **Changer immédiatement** tous les secrets
2. **Mettre à jour Railway** avec nouveaux secrets
3. **Ajouter .env dans .gitignore**
4. **Supprimer l'historique Git** (si nécessaire)

```powershell
# Vérifier que .env est ignoré
git check-ignore .env

# Devrait afficher : .env
```

---

## 📚 Ressources

- **JWT.io** : https://jwt.io (décodeur de tokens)
- **JWT Best Practices** : https://tools.ietf.org/html/rfc8725
- **OWASP JWT** : https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html

---

## ✅ Checklist sécurité JWT

Avant le déploiement :

- [ ] Secrets générés (64+ caractères aléatoires)
- [ ] JWT_SECRET ≠ JWT_REFRESH_SECRET
- [ ] Secrets ajoutés dans Railway Variables
- [ ] .env dans .gitignore
- [ ] Aucun secret dans le code
- [ ] Test d'authentification OK
- [ ] Durées configurées (1h / 7d)

**Votre authentification est maintenant sécurisée !** 🔐
