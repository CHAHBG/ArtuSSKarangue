# 🚀 DÉMARRAGE RAPIDE - ARTU SI SEN KARANGUE

## ✅ Identifiants de Test

**Utilisateur existant :**
- **Email :** cheikhabgn@gmail.com
- **Password :** Sensei00
- **Nom :** Khadim GNINGUE
- **Téléphone :** 778023851

---

## 🎯 Démarrage en 2 Étapes

### Étape 1 : Démarrer le Backend (OBLIGATOIRE)

**Double-cliquer sur :** `start-backend.bat`

**Ou via PowerShell :**
```powershell
cd backend
node src/server.js
```

**✅ Vous devriez voir :**
```
✅ Redis connected
🚀 Server running on port 5000
📡 API: http://localhost:5000/api/v1
```

**⚠️ IMPORTANT : Laissez ce terminal ouvert !**

---

### Étape 2 : Démarrer l'App Mobile

**Dans un NOUVEAU terminal, double-cliquer sur :** `start-mobile.bat`

**Ou via PowerShell :**
```powershell
cd mobile
npm start
```

---

### Étape 3 : Se Connecter

1. App s'ouvre sur le téléphone
2. Écran Login
3. Email : **cheikhabgn@gmail.com**
4. Password : **Sensei00**
5. Appuyer sur "Connexion"

**✅ Vous êtes connecté !**

---

## ⚠️ Si "Email or password incorrect"

**Cause : Backend pas démarré**

**Solution :**
```powershell
# Terminal 1
cd backend
node src/server.js

# Laisser tourner, puis dans Terminal 2 :
cd mobile
npm start
```

---

## 📋 Checklist

- [ ] Backend démarré (Terminal 1)
- [ ] Mobile démarré (Terminal 2)
- [ ] Même Wi-Fi (PC + téléphone)
- [ ] Login : cheikhabgn@gmail.com / Sensei00

---

**C'est tout ! Le backend DOIT tourner pour que le login fonctionne ! 🚀**
