# 🔧 Railway - Guide de Dépannage

## ❌ Erreur : "Railpack could not determine how to build the app"

### Problème
Railway ne trouve pas le `package.json` car il est dans `backend/` et non à la racine.

### ✅ Solution (DÉJÀ APPLIQUÉE)

Les fichiers suivants ont été créés à la racine :

1. **`package.json`** - Déclare le projet comme Node.js
2. **`railway.json`** - Configure le build vers `backend/`
3. **`nixpacks.toml`** - Indique à Nixpacks où trouver le code

### Vérification

```powershell
# Vérifier que les fichiers existent
ls railway.json, package.json, nixpacks.toml
```

Vous devriez voir :
```
railway.json
package.json
nixpacks.toml
```

---

## 🔄 Redéployer sur Railway

### Méthode 1 : Redéploiement automatique (Recommandé)

Railway détecte automatiquement le nouveau commit sur GitHub et redéploie.

**Attendez 2-3 minutes** et vérifiez les logs.

### Méthode 2 : Redéploiement manuel

1. **Railway Dashboard**
2. **Sélectionner votre service**
3. **Deployments** (onglet)
4. **⋮** (menu) → **Redeploy**

---

## 📋 Vérifier le déploiement

### 1. Vérifier les logs Railway

**Dashboard** → **Deployments** → Cliquer sur le dernier déploiement

Vous devriez voir :
```
✓ Installing dependencies
✓ Building application
✓ Starting server
✅ Connected to Supabase PostgreSQL
🚀 Server running on port 5000
```

### 2. Tester l'API

```powershell
# Remplacer par votre URL Railway
$url = "https://votre-app.up.railway.app"

# Test health
Invoke-RestMethod -Uri "$url/health"
```

Résultat attendu :
```json
{
  "status": "ok",
  "timestamp": "2025-10-04T15:30:00.000Z"
}
```

---

## 🐛 Autres erreurs communes

### Erreur : "Cannot find module"

**Cause** : Dépendances manquantes dans `package.json`

**Solution** :
```powershell
cd backend
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Erreur : "Port already in use"

**Cause** : Railway n'utilise pas `process.env.PORT`

**Solution** : Déjà corrigé dans `src/server.js` :
```javascript
const PORT = process.env.PORT || 5000;
```

### Erreur : "Database connection failed"

**Cause** : Variables d'environnement manquantes

**Solution** :
1. **Railway** → **Variables**
2. Vérifier que `DATABASE_URL` est présent
3. Tester la connexion :
```powershell
psql "postgresql://postgres:Sensei00@db.xsnrzyzgphmjivdqpgst.supabase.co:5432/postgres"
```

### Erreur : "Application failed to respond"

**Cause** : L'app ne démarre pas correctement

**Solution** :
1. Vérifier les logs Railway
2. Vérifier `railway.json` :
```json
{
  "deploy": {
    "startCommand": "cd backend && node src/server.js"
  }
}
```

### Erreur : "Build timeout"

**Cause** : Build trop long (>10 min)

**Solution** :
1. Simplifier `npm install` → `npm ci`
2. Utiliser `--production` si pas besoin de dev dependencies
3. Vérifier la taille de `node_modules`

---

## 📊 Structure du projet Railway

Railway détecte maintenant cette structure :

```
ArtuSSKarangue/           (racine - détectée par Railway)
├── package.json          ← Déclare Node.js
├── railway.json          ← Configure le build
├── nixpacks.toml         ← Configuration Nixpacks
├── backend/              ← Code du serveur
│   ├── package.json
│   └── src/
│       └── server.js
└── mobile/               ← Ignoré par Railway
```

---

## ✅ Checklist de déploiement

Avant de redéployer, vérifier :

- [x] `railway.json` à la racine
- [x] `package.json` à la racine
- [x] `nixpacks.toml` à la racine
- [x] Code poussé sur GitHub
- [ ] Variables configurées dans Railway
- [ ] Build réussi (logs Railway)
- [ ] API accessible (test health)

---

## 🆘 Support

Si le problème persiste :

1. **Vérifier les logs Railway** (Dashboard → Deployments → Logs)
2. **Tester localement** :
   ```powershell
   cd backend
   npm install
   node src/server.js
   ```
3. **Consulter la doc Railway** : https://docs.railway.app
4. **Discord Railway** : https://discord.gg/railway

---

## 🎯 Prochaines étapes

Une fois le build réussi :

1. **Copier l'URL Railway** (Settings → Domains)
2. **Tester l'API** avec `test-railway.ps1`
3. **Mettre à jour l'app mobile** avec la nouvelle URL
4. **Rebuild l'APK**

**Bon courage ! 🚀**
