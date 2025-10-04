# Guide de dépannage Railway - Erreur 500

## 🔍 Diagnostic

L'API retourne une erreur 500 sur `/api/v1/auth/register`.

### Vérifications à faire dans Railway Dashboard :

#### 1. Vérifier les logs

**Railway Dashboard** → **Votre service** → **Deployments** → Cliquer sur le dernier → **View Logs**

Cherchez des erreurs comme :
- `Error connecting to database`
- `JWT_SECRET is not defined`
- `Cannot find module`
- Erreurs PostgreSQL

#### 2. Vérifier que toutes les variables sont présentes

**Railway Dashboard** → **Variables**

Doit contenir :
- ✅ DATABASE_URL
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ JWT_SECRET
- ✅ JWT_EXPIRES_IN
- ✅ JWT_REFRESH_SECRET
- ✅ JWT_REFRESH_EXPIRES_IN
- ✅ NODE_ENV
- ✅ REDIS_ENABLED
- ✅ CORS_ORIGIN

#### 3. Tester la connexion Supabase

Depuis votre PC, vérifiez que Supabase est accessible :

```powershell
# Test de connexion PostgreSQL
$env:PGPASSWORD="Sensei00"
psql -h db.xsnrzyzgphmjivdqpgst.supabase.co -U postgres -d postgres -c "SELECT 1;"
```

#### 4. Vérifier les tables Supabase

**Supabase Dashboard** → **Table Editor**

Vérifiez que ces tables existent :
- ✅ utilisateurs
- ✅ refresh_tokens
- ✅ audit_logs

Et que la vue `users` existe.

---

## 🔧 Solutions possibles

### Solution 1 : Problème de connexion DB

Si les logs montrent une erreur de connexion à la base de données :

1. Vérifier que `DATABASE_URL` dans Railway est correct
2. Vérifier que Supabase est accessible depuis Railway
3. Vérifier que le mot de passe est correct

### Solution 2 : Variables manquantes

Si les logs montrent `undefined` pour JWT_SECRET ou autre :

1. Vérifier que toutes les variables sont dans Railway
2. Redémarrer le service : **Settings** → **Restart**

### Solution 3 : Tables manquantes

Si les logs montrent `relation "utilisateurs" does not exist` :

1. Aller sur Supabase Dashboard
2. SQL Editor
3. Exécuter le contenu de `backend/supabase-schema.sql`

### Solution 4 : Problème de CORS

Si l'erreur est liée à CORS :

1. Vérifier que `CORS_ORIGIN=*` dans Railway
2. Ou configurer avec l'URL de l'app mobile

---

## 🧪 Tests locaux

Pour tester localement avec les mêmes variables :

```powershell
cd backend

# Copier les variables Railway dans .env
# Puis :
node src/server.js

# Dans un autre terminal :
.\test-api-simple.ps1
```

---

## 📞 Support Railway

Si le problème persiste :

1. **Railway Logs** : Copiez les logs d'erreur
2. **Discord Railway** : https://discord.gg/railway
3. **Support** : help@railway.app

---

## ✅ Checklist de diagnostic

- [ ] Variables Railway configurées (10 variables)
- [ ] Logs Railway vérifiés
- [ ] Tables Supabase présentes
- [ ] Connexion Supabase fonctionnelle
- [ ] Service redémarré après ajout des variables
- [ ] Health check fonctionne (si oui, le serveur démarre)
- [ ] Test local réussi

---

**Une fois le problème identifié dans les logs, nous pourrons le corriger ! 🔧**
