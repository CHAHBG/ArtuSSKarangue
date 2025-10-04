# CREATION TABLES SUPABASE - GUIDE FINAL

## Probleme Identifie

✅ Connexion Supabase : **FONCTIONNE !**
❌ Tables manquantes : **Backend cherche "users" mais table s'appelle "utilisateurs"**

## Solution

Le script `supabase-schema.sql` est maintenant COMPLET avec :
- Table `utilisateurs` (principale)
- Vue `users` (alias pour compatibilite backend)

---

## ETAPE 1 : Copier le Script SQL

**Ouvrir ce fichier :** `backend/supabase-schema.sql`

**Tout selectionner :** Ctrl+A
**Copier :** Ctrl+C

---

## ETAPE 2 : Executer dans Supabase

1. **Aller sur :** https://supabase.com/dashboard
2. **Projet :** xsnrzyzgphmjivdqpgst
3. **SQL Editor** (menu gauche)
4. **New query**
5. **Coller** le script (Ctrl+V)
6. **Run** (Ctrl+Enter)

**Attendez "Success"**

---

## ETAPE 3 : Verifier

**Table Editor** → Vous devez voir :
- ✅ utilisateurs
- ✅ emergencies
- ✅ messages
- ✅ notifications
- ✅ posts
- ✅ comments
- ✅ likes

---

## ETAPE 4 : Tester

**Terminal 1 :**
```powershell
cd backend
node src/server.js
```

**Attendez de voir :**
```
✅ Connected to Supabase PostgreSQL
🚀 Server running on port 5000
```

**Terminal 2 :**
```powershell
cd backend
.\test-supabase.ps1
```

**Resultat attendu :**
```
[OK] Backend en ligne
[OK] Utilisateur cree avec succes !
[OK] Connexion reussie !
[OK] Profil recupere !
TOUS LES TESTS REUSSIS !
```

---

## Verifier dans Supabase

**Table Editor** → Table `utilisateurs`
Vous devez voir : **test.supabase@artu.sn**

---

## Si Erreur Persiste

1. Verifier tables creees dans Supabase Dashboard
2. Relancer backend : `node src/server.js`
3. Voir les logs backend pour details erreur

---

**COPIEZ supabase-schema.sql DANS SUPABASE SQL EDITOR MAINTENANT !**
