# 🚀 Déploiement Railway - Guide Rapide

Votre backend est prêt à être déployé sur Railway !

## ⚡ Étapes Rapides

### 1. Créer un compte Railway
👉 https://railway.app → Login avec GitHub

### 2. Pousser sur GitHub (si pas déjà fait)
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 3. Déployer sur Railway
1. Railway Dashboard → **New Project**
2. **Deploy from GitHub repo**
3. Sélectionner votre repo `ArtuSSKarangue`

### 4. Configurer les variables d'environnement

Dans Railway → Variables, copier-coller :

```env
DATABASE_URL=postgresql://postgres:Sensei00@db.xsnrzyzgphmjivdqpgst.supabase.co:5432/postgres
SUPABASE_URL=https://xsnrzyzgphmjivdqpgst.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzbnp6eXpncGhtaml2ZHFwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNTU5OTksImV4cCI6MjA0MzYzMTk5OX0.f-8b7bWnDHxGxSYV6YBqf8UrJQRCdMxQ4h1pSGGRjRc
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too-2024
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
REDIS_ENABLED=false
CORS_ORIGIN=*
```

### 5. Obtenir votre URL

Railway génère automatiquement une URL :
```
https://votre-app.up.railway.app
```

### 6. Tester l'API

```powershell
cd backend
.\test-railway.ps1 -RailwayUrl "https://votre-app.up.railway.app"
```

### 7. Mettre à jour l'app mobile

**Fichier** : `mobile/src/config/api.js`
```javascript
const API_URL = 'https://votre-app.up.railway.app/api/v1';
```

### 8. Rebuild l'app

```powershell
cd mobile
npm install
cd android
./gradlew assembleRelease
```

## 📚 Documentation complète

Pour plus de détails : `backend/RAILWAY_DEPLOYMENT.md`

## ✅ Résultat

✨ **Votre app fonctionnera partout dans le monde !** 🌍

- Backend → Railway (cloud)
- Database → Supabase (cloud)
- Mobile → Accès partout en 4G/5G/WiFi
