# 🚀 Guide de Déploiement - ARTU SI SEN KARANGUE

Ce guide vous permet de déployer votre application pour qu'elle fonctionne **partout dans le monde**.

## 📋 Ce qui a été configuré

### ✅ Backend
- Configuration Supabase (PostgreSQL cloud)
- Scripts de test
- Configuration Railway
- Variables d'environnement

### ✅ Base de données
- Supabase PostgreSQL (gratuit)
- Schéma complet avec tables utilisateurs, urgences, etc.
- Connexion SSL sécurisée

## 🎯 Options de déploiement

Vous avez **2 options** :

### Option 1 : Développement local (actuel)
✅ **Avantages** : Rapide, pas de coûts
❌ **Inconvénient** : Fonctionne uniquement sur votre réseau WiFi

```
Mobile App (WiFi) → Backend (localhost:5000) → Supabase (cloud)
```

### Option 2 : Production cloud (recommandé)
✅ **Avantages** : Fonctionne partout (4G/5G/WiFi)
✅ **Gratuit** : Railway 500h/mois

```
Mobile App (partout) → Backend Railway (cloud) → Supabase (cloud)
```

## 🚀 Déployer sur Railway (Option 2)

### Étapes rapides

1. **Pousser sur GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Déployer sur Railway**
   - Aller sur https://railway.app
   - Login avec GitHub
   - New Project → Deploy from GitHub
   - Sélectionner votre repo

3. **Configurer les variables**
   - Copier les variables de `.env`
   - Les coller dans Railway Dashboard → Variables

4. **Tester l'API**
   ```powershell
   cd backend
   .\test-railway.ps1 -RailwayUrl "https://votre-app.up.railway.app"
   ```

5. **Mettre à jour l'app mobile**
   - Éditer `mobile/src/config/api.js`
   - Changer l'URL vers Railway
   - Rebuild l'app

### Documentation détaillée

- 📘 **Guide complet** : `backend/RAILWAY_DEPLOYMENT.md`
- ⚡ **Guide rapide** : `RAILWAY_QUICKSTART.md`
- 📝 **Checklist** : `DEPLOY_STEPS.md`

## 🧪 Scripts de test

### Test local (Supabase)
```powershell
cd backend
.\test-api-simple.ps1
```

### Test Railway (après déploiement)
```powershell
cd backend
.\test-railway.ps1 -RailwayUrl "https://votre-app.up.railway.app"
```

## 📱 Rebuild l'application mobile

Après avoir mis à jour l'URL de l'API :

```powershell
cd mobile
npm install
cd android
.\gradlew assembleRelease
```

APK généré : `mobile/android/app/build/outputs/apk/release/app-release.apk`

## 🔧 Configuration actuelle

### Backend
- ✅ Connecté à Supabase PostgreSQL
- ✅ JWT Authentication
- ✅ Socket.io pour temps réel
- ✅ Rate limiting
- ✅ Logs structurés

### Base de données (Supabase)
- ✅ Tables : utilisateurs, urgences, messages, etc.
- ✅ Authentification avec refresh tokens
- ✅ Audit logs
- ✅ 500 Mo gratuits

### Mobile
- ✅ React Native
- ✅ Expo
- ✅ Navigation
- ✅ Authentification
- ✅ Géolocalisation

## 🎉 Résultat final

Après le déploiement Railway, votre architecture sera :

```
┌─────────────────┐
│  Mobile App     │ ← Utilisateur (partout dans le monde 🌍)
│  (Android)      │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Railway        │ ← Backend API (cloud ☁️)
│  Node.js/Express│
└────────┬────────┘
         │ PostgreSQL
         ▼
┌─────────────────┐
│  Supabase       │ ← Database (cloud ☁️)
│  PostgreSQL     │
└─────────────────┘
```

## ✅ Tests réussis

- [x] Backend connecté à Supabase
- [x] Création d'utilisateur
- [x] Connexion avec JWT
- [x] Récupération de profil
- [x] API fonctionnelle

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifier les logs Railway** : Dashboard → Deployments → View Logs
2. **Tester l'API** : `.\test-railway.ps1`
3. **Vérifier Supabase** : Dashboard → Table Editor
4. **Documentation** : Consultez les guides dans le projet

## 📚 Fichiers importants

```
backend/
├── .env.railway          ← Template variables Railway
├── railway.json          ← Config Railway
├── test-api-simple.ps1   ← Test local
├── test-railway.ps1      ← Test Railway
└── RAILWAY_DEPLOYMENT.md ← Guide complet

mobile/
└── src/config/api.js     ← URL de l'API (à mettre à jour)

Documentation/
├── RAILWAY_QUICKSTART.md ← Guide rapide
└── DEPLOY_STEPS.md       ← Checklist déploiement
```

## 🎯 Prochaines étapes

1. [ ] Déployer sur Railway
2. [ ] Tester l'API en production
3. [ ] Mettre à jour l'app mobile
4. [ ] Rebuild l'APK
5. [ ] Tester en 4G/5G

**Bonne chance ! 🚀**
