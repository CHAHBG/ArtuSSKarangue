# 🌐 Migration Supabase - Démarrage Rapide

## 🎯 Objectif

Remplacer PostgreSQL local par **Supabase** (PostgreSQL cloud gratuit)

---

## 📋 Plan en 3 Étapes (5 minutes)

### 1️⃣ Créer les Tables (3 min)

**Ouvrir :** `backend/SUPABASE_QUICKSTART.md`

**Résumé :**
1. Aller sur https://supabase.com/dashboard
2. SQL Editor → New query
3. Copier-coller le script SQL
4. Run

✅ **Tables créées !**

---

### 2️⃣ Configurer le Backend (1 min)

```powershell
cd backend
.\setup-supabase.ps1
```

**Le script va vous demander votre mot de passe Supabase.**

📝 **Où trouver le mot de passe :**
- Supabase Dashboard → Settings → Database → Connection string
- Ou "Reset database password" si oublié

✅ **Backend configuré !**

---

### 3️⃣ Tester (1 min)

**Terminal 1 : Démarrer le backend**
```powershell
cd backend
node src/server.js
```

**Vous devriez voir :**
```
✅ Connected to Supabase PostgreSQL
```

**Terminal 2 : Tester l'API**
```powershell
cd backend
.\test-supabase.ps1
```

**Vous devriez voir :**
```
🎉 TOUS LES TESTS RÉUSSIS !
```

✅ **Migration réussie !**

---

## 📱 App Mobile

**Rien à changer !** L'app mobile continue de fonctionner normalement.

Le backend utilise maintenant Supabase au lieu de PostgreSQL local.

---

## 📚 Documentation

- **Guide rapide :** `backend/SUPABASE_QUICKSTART.md`
- **Guide complet :** `backend/SUPABASE_MIGRATION.md`
- **Plan d'action :** `backend/SUPABASE_ACTION_PLAN.md`

---

## 🚀 Prêt ?

**Commencez par :** `backend/SUPABASE_QUICKSTART.md`

---

## ✨ Avantages

- ✅ Gratuit (500 MB)
- ✅ Pas d'installation locale
- ✅ Dashboard web
- ✅ Accessible partout
- ✅ Backups automatiques
