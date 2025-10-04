# Guide : Utilisation des Scripts Supabase

## Scripts Disponibles

### 1. setup-supabase.ps1
Configure automatiquement la connexion Supabase.

**Utilisation :**
```powershell
cd backend
.\setup-supabase.ps1
```

---

### 2. test-supabase.ps1
Teste la connexion et l'API Supabase.

**Utilisation :**
```powershell
# Terminal 1 - Demarrer le backend
cd backend
node src/server.js

# Terminal 2 - Lancer les tests
cd backend
.\test-supabase.ps1
```

---

## Etapes Rapides

1. **Creer les tables** (voir SUPABASE_QUICKSTART.md)
2. **Configurer** : `.\setup-supabase.ps1`
3. **Tester** : Demarrer backend puis `.\test-supabase.ps1`

---

## Troubleshooting

**Backend non accessible ?**
```powershell
cd backend
node src/server.js
```

**Erreur mot de passe ?**
```powershell
.\setup-supabase.ps1
```

**Tables manquantes ?**
Voir SUPABASE_QUICKSTART.md pour creer les tables.
