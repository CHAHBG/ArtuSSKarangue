# 🚀 Guide de Déploiement sur Railway

Ce guide vous explique comment déployer votre backend sur Railway.app pour le rendre accessible partout.

## 📋 Prérequis

- ✅ Compte GitHub (pour connecter Railway)
- ✅ Backend fonctionnel avec Supabase
- ✅ Variables d'environnement préparées

---

## 🎯 Étape 1 : Créer un compte Railway

1. **Aller sur** : https://railway.app
2. **Cliquer sur** : "Start a New Project" ou "Login"
3. **Se connecter avec** : GitHub (recommandé)
4. **Autoriser Railway** à accéder à vos repos GitHub

---

## 📦 Étape 2 : Pousser le code sur GitHub

### Option A : Si vous avez déjà un repo GitHub

```powershell
# Dans le dossier backend
cd C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Configure backend for Railway deployment with Supabase"

# Push
git push origin main
```

### Option B : Si vous n'avez pas encore de repo GitHub

```powershell
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Backend with Supabase"

# Créer un repo sur GitHub (via le site)
# Puis connecter et push :
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

---

## 🚂 Étape 3 : Déployer sur Railway

### 3.1 Créer le projet

1. **Dans Railway Dashboard** → Cliquer sur **"New Project"**
2. **Choisir** : **"Deploy from GitHub repo"**
3. **Sélectionner** : Votre repo `ArtuSSKarangue`
4. **Railway va automatiquement** :
   - Détecter Node.js
   - Installer les dépendances
   - Configurer le build

### 3.2 Configurer les variables d'environnement

1. **Cliquer sur votre service** (le backend)
2. **Aller dans** : **Variables** (onglet en haut)
3. **Ajouter toutes ces variables** :

```env
# Base de données Supabase
DATABASE_URL=postgresql://postgres:Sensei00@db.xsnrzyzgphmjivdqpgst.supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://xsnrzyzgphmjivdqpgst.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzbnl6eXpncGhtaml2ZHFwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNTU5OTksImV4cCI6MjA0MzYzMTk5OX0.f-8b7bWnDHxGxSYV6YBqf8UrJQRCdMxQ4h1pSGGRjRc

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too-2024
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
NODE_ENV=production
PORT=5000

# Redis (désactivé pour l'instant)
REDIS_ENABLED=false

# CORS
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3.3 Variables importantes à personnaliser

⚠️ **IMPORTANT** : Changez ces valeurs pour la sécurité :

```env
# Générer des secrets forts
JWT_SECRET=VOTRE_SECRET_UNIQUE_ICI
JWT_REFRESH_SECRET=VOTRE_AUTRE_SECRET_UNIQUE_ICI
```

**Pour générer des secrets forts** :
```powershell
# Dans PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

---

## 🌐 Étape 4 : Obtenir l'URL de déploiement

1. **Aller dans** : **Settings** → **Domains**
2. **Railway génère automatiquement** une URL type :
   ```
   https://votre-app.up.railway.app
   ```
3. **Copier cette URL** (vous en aurez besoin pour l'app mobile)

---

## ✅ Étape 5 : Vérifier le déploiement

### 5.1 Vérifier les logs

1. **Aller dans** : **Deployments** (onglet)
2. **Cliquer sur** : Le dernier déploiement
3. **Vérifier** : Les logs montrent :
   ```
   ✅ Connected to Supabase PostgreSQL
   🚀 Server running on port 5000
   ```

### 5.2 Tester l'API

**Dans PowerShell** :
```powershell
# Remplacer par votre URL Railway
$railwayUrl = "https://votre-app.up.railway.app"

# Test health check
Invoke-RestMethod -Uri "$railwayUrl/health" -Method GET

# Test register
$testUser = @{
    nom = "Test"
    prenom = "Railway"
    telephone = "+221771234567"
    email = "test.railway@artu.sn"
    password = "Test123!"
    role = "citizen"
    username = "testrailway"
    full_name = "Test Railway"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$railwayUrl/api/v1/auth/register" -Method POST -ContentType "application/json" -Body $testUser
```

---

## 📱 Étape 6 : Mettre à jour l'app mobile

### 6.1 Modifier la configuration API

**Fichier** : `mobile/src/config/api.js`

```javascript
// AVANT (localhost)
const API_URL = 'http://192.168.1.9:5000/api/v1';

// APRÈS (Railway)
const API_URL = 'https://votre-app.up.railway.app/api/v1';
```

### 6.2 Rebuild l'application

```powershell
cd mobile

# Nettoyer
Remove-Item -Recurse -Force node_modules, android/build, android/app/build -ErrorAction SilentlyContinue

# Réinstaller
npm install

# Build Android
cd android
./gradlew clean
./gradlew assembleRelease

# L'APK sera dans : android/app/build/outputs/apk/release/
```

---

## 🎉 Étape 7 : Test final

1. **Installer l'APK** sur votre téléphone
2. **Désactiver le WiFi** (passer en 4G/5G)
3. **Tester** :
   - Création de compte ✅
   - Connexion ✅
   - Création d'urgence ✅

**L'app devrait fonctionner partout dans le monde !** 🌍

---

## 🔧 Dépannage

### Erreur : "Application failed to respond"

**Solution** : Vérifier que `PORT` n'est pas défini ou = `$PORT`
```env
# Dans Railway Variables, supprimer PORT ou mettre :
PORT=$PORT
```

### Erreur : "Database connection failed"

**Solution** : Vérifier `DATABASE_URL` dans Railway Variables
```powershell
# Tester la connexion depuis votre PC
psql "postgresql://postgres:Sensei00@db.xsnrzyzgphmjivdqpgst.supabase.co:5432/postgres"
```

### Erreur : "Cannot find module"

**Solution** : Vérifier `package.json` contient toutes les dépendances
```powershell
# Dans backend/
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Les logs ne s'affichent pas

**Solution** : Railway met ~1-2 minutes à démarrer
- Attendre que le statut passe à "Active"
- Rafraîchir les logs

---

## 💡 Conseils

### 1. Monitoring
- **Vérifier les logs** régulièrement dans Railway Dashboard
- **Surveiller l'utilisation** : Railway gratuit = 500h/mois

### 2. Sécurité
- ✅ Changer `JWT_SECRET` et `JWT_REFRESH_SECRET`
- ✅ Configurer `CORS_ORIGIN` avec l'URL de votre app
- ✅ Activer HTTPS uniquement (Railway le fait automatiquement)

### 3. Performance
- **Activer Redis** pour améliorer les performances
- **Utiliser PostgreSQL connection pooling** (déjà configuré)

### 4. Coûts
- **Gratuit** : 500h/mois (~20 jours)
- **Si vous dépassez** : $5/mois pour usage illimité
- **Surveiller** : Dashboard → Usage

---

## 📚 Ressources

- **Railway Docs** : https://docs.railway.app
- **Supabase Docs** : https://supabase.com/docs
- **Support** : https://discord.gg/railway

---

## ✅ Checklist finale

Avant de dire que c'est terminé, vérifiez :

- [ ] Code poussé sur GitHub
- [ ] Projet créé sur Railway
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi (logs OK)
- [ ] Test API depuis Postman/PowerShell OK
- [ ] App mobile mise à jour avec nouvelle URL
- [ ] App mobile rebuild
- [ ] Test sur téléphone en 4G/5G OK

**Bravo ! Votre app est maintenant accessible partout !** 🎉
