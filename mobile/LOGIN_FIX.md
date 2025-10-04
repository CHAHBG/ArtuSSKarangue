# 🔧 Résolution : Erreur "Email or Password Incorrect"

## 🎯 Problème

Login échoue avec "Email or password incorrect" alors que les identifiants sont corrects.

---

## ✅ Solution Rapide

### Étape 1 : Vérifier que le Backend Tourne

```powershell
# Terminal dédié pour le backend
cd backend
node src/server.js
```

### Étape 2 : Créer un Utilisateur Test

**Utiliser l'écran Register de l'app :**
1. Ouvrir l'app sur votre téléphone
2. Aller sur "Register"
3. Remplir :
   - Nom : Test
   - Prénom : User
   - Téléphone : +221771234567
   - Email : test@test.com
   - Password : Test123!
4. Appuyer sur "S'inscrire"

**Ou via PowerShell :**
```powershell
$body = @{
    nom = "Test"
    prenom = "User"  
    telephone = "+221771234567"
    email = "test@test.com"
    password = "Test123!"
    role = "user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://192.168.1.9:5000/api/v1/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Étape 3 : Tester le Login

**Identifiants :**
- Email : `test@test.com`
- Password : `Test123!`

---

## 🔍 Vérifications

### 1. Backend Accessible ?

```powershell
curl http://192.168.1.9:5000/api/v1/auth/login -UseBasicParsing
```

### 2. IP Correcte ?

**Fichier `mobile/.env` :**
```env
API_URL=http://192.168.1.9:5000/api/v1
```

### 3. Même Réseau Wi-Fi ?

PC et téléphone doivent être sur le **même réseau**.

---

## 📋 Checklist

- [ ] Backend tourne (`node src/server.js`)
- [ ] Utilisateur créé via Register
- [ ] IP correcte dans `.env`
- [ ] Même réseau Wi-Fi
- [ ] Password correct : `Test123!`

---

## 🚀 Commandes Complètes

```powershell
# Terminal 1 : Backend
cd C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue\backend
node src/server.js

# Terminal 2 : Mobile
cd C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue\mobile
npm start

# Sur le téléphone :
# 1. Register → Créer compte test@test.com / Test123!
# 2. Login → Se connecter avec ces identifiants
```

---

**Avez-vous créé un utilisateur via l'écran Register de l'app ?** 📱
