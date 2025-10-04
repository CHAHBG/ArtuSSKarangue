# 📱 Logs Development Build - Guide Complet

## 🎯 Votre App

**Package :** `com.artussenkarangue.emergency`
**Type :** Development Build (APK installé)

---

## 🚀 Commandes Rapides

### Lancer l'App

```powershell
adb shell am start -n com.artussenkarangue.emergency/.MainActivity
```

### Voir Tous les Logs

```powershell
adb logcat
```

### Voir Uniquement les Logs React Native

```powershell
adb logcat ReactNativeJS:V *:S
```

### Voir les Erreurs Uniquement

```powershell
adb logcat *:E
```

### Logs avec Filtres (Auth, API, Errors)

```powershell
adb logcat | Select-String "error|auth|API|login|axios" -CaseSensitive:$false
```

---

## 🔍 Logs en Temps Réel pour Votre App

### Option 1 : Logs Complets

```powershell
# Nettoyer les logs
adb logcat -c

# Lancer l'app
adb shell am start -n com.artussenkarangue.emergency/.MainActivity

# Voir les logs
adb logcat
```

### Option 2 : Logs Filtrés (RECOMMANDÉ)

```powershell
# Nettoyer
adb logcat -c

# Lancer
adb shell am start -n com.artussenkarangue.emergency/.MainActivity

# Logs filtrés
adb logcat | Select-String "ReactNativeJS|Error|artu|auth|API"
```

### Option 3 : Script Automatisé

```powershell
cd mobile
.\start-dev-with-logs.ps1
```

---

## 📊 Types de Logs

### Logs JavaScript (React Native)

```powershell
adb logcat ReactNativeJS:V *:S
```

**Exemple de sortie :**
```
ReactNativeJS: 'API Request: POST /api/v1/auth/login'
ReactNativeJS: 'Response:', {...}
ReactNativeJS: 'Login successful!'
```

### Logs Système (Android)

```powershell
adb logcat *:E
```

**Exemple de sortie :**
```
E/AndroidRuntime: FATAL EXCEPTION: main
```

### Logs Network (Axios/Fetch)

```powershell
adb logcat | Select-String "okhttp|axios|fetch"
```

---

## 🐛 Débugger un Problème de Login

### Étape 1 : Nettoyer et Lancer

```powershell
adb logcat -c
adb shell am start -n com.artussenkarangue.emergency/.MainActivity
```

### Étape 2 : Filtrer les Logs d'Auth

```powershell
adb logcat | Select-String "auth|login|API|axios|error" -CaseSensitive:$false
```

### Étape 3 : Reproduire le Problème

Sur le téléphone :
1. Aller sur l'écran Login
2. Entrer : cheikhabgn@gmail.com / Sensei00
3. Appuyer sur "Connexion"

### Étape 4 : Observer les Logs

Vous devriez voir :
```
ReactNativeJS: 'Attempting login...'
ReactNativeJS: 'API URL: http://localhost:5000/api/v1/auth/login'
ReactNativeJS: 'Request body:', {"email":"cheikhabgn@gmail.com","password":"***"}
ReactNativeJS: 'Response status: 200'
ReactNativeJS: 'Login successful!'
```

**Si erreur :**
```
ReactNativeJS: 'Error: Network request failed'
ReactNativeJS: 'Error: Email or password incorrect'
```

---

## 🔧 Commandes Utiles

### Redémarrer l'App

```powershell
# Forcer l'arrêt
adb shell am force-stop com.artussenkarangue.emergency

# Relancer
adb shell am start -n com.artussenkarangue.emergency/.MainActivity
```

### Vérifier l'App Installée

```powershell
adb shell pm list packages | Select-String "artus"
```

### Voir les Activités

```powershell
adb shell dumpsys package com.artussenkarangue.emergency | Select-String "Activity"
```

### Nettoyer le Cache

```powershell
adb shell pm clear com.artussenkarangue.emergency
```

---

## 📱 Logs Backend en Parallèle

**Terminal 1 : Backend Logs**
```powershell
cd backend
node src/server.js
```

**Terminal 2 : Mobile Logs**
```powershell
adb logcat | Select-String "ReactNativeJS|Error"
```

**Maintenant, testez le login et voyez les 2 côtés :**

**Backend Terminal :**
```
[info]: POST /api/v1/auth/login
[info]: User login attempt: cheikhabgn@gmail.com
[info]: Login successful
```

**Mobile Terminal :**
```
ReactNativeJS: 'Login request sent'
ReactNativeJS: 'Response received: 200'
ReactNativeJS: 'Token saved'
```

---

## 🎯 Scénario Complet

### Configuration Initiale

```powershell
# Terminal 1 : Backend
cd backend
node src/server.js

# Terminal 2 : ADB Reverse
adb reverse tcp:5000 tcp:5000

# Terminal 3 : Mobile Logs
cd mobile
adb logcat -c
adb shell am start -n com.artussenkarangue.emergency/.MainActivity
adb logcat | Select-String "ReactNativeJS|Error|auth"
```

### Test Login

1. Sur le téléphone : Entrer credentials
2. Observer Terminal 3 (mobile logs)
3. Observer Terminal 1 (backend logs)
4. Identifier le problème

---

## 🔍 Logs Spécifiques par Problème

### Problème : "Network request failed"

```powershell
# Voir les logs réseau
adb logcat | Select-String "okhttp|network|fetch"
```

**Vérifier :**
- Backend tourne ?
- ADB reverse configuré ?
- IP correcte ?

### Problème : "Email or password incorrect"

```powershell
# Voir les logs d'authentification
adb logcat | Select-String "auth|login|password"
```

**Vérifier :**
- Credentials corrects ?
- User existe dans DB ?
- Backend accessible ?

### Problème : App Crash

```powershell
# Voir les erreurs fatales
adb logcat *:E | Select-String "FATAL|Exception"
```

---

## 📋 Checklist Logs

Avant de débugger :

- [ ] Backend démarré (`node src/server.js`)
- [ ] ADB reverse configuré (`adb reverse tcp:5000 tcp:5000`)
- [ ] Logs nettoyés (`adb logcat -c`)
- [ ] App lancée (`adb shell am start -n com.artussenkarangue.emergency/.MainActivity`)
- [ ] Logs affichés (`adb logcat | Select-String "ReactNativeJS"`)

---

## 🎉 Script Tout-en-Un

**Fichier : `debug-login.ps1`**

```powershell
Write-Host "Starting debug session..." -ForegroundColor Cyan

# 1. Vérifier backend
Write-Host "[1/4] Checking backend..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:5000/api/v1/health" -UseBasicParsing -TimeoutSec 2 | Out-Null
    Write-Host "✓ Backend OK" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend not running!" -ForegroundColor Red
    exit 1
}

# 2. ADB reverse
Write-Host "[2/4] Configuring ADB..." -ForegroundColor Yellow
adb reverse tcp:5000 tcp:5000
Write-Host "✓ ADB reverse OK" -ForegroundColor Green

# 3. Clear logs
Write-Host "[3/4] Clearing logs..." -ForegroundColor Yellow
adb logcat -c
Write-Host "✓ Logs cleared" -ForegroundColor Green

# 4. Launch and monitor
Write-Host "[4/4] Launching app..." -ForegroundColor Yellow
adb shell am start -n com.artussenkarangue.emergency/.MainActivity
Start-Sleep -Seconds 2
Write-Host "✓ App launched" -ForegroundColor Green
Write-Host ""
Write-Host "=== LOGS (Ctrl+C to stop) ===" -ForegroundColor Cyan
Write-Host ""

# Monitor logs
adb logcat | Select-String "ReactNativeJS|Error|auth|API" -CaseSensitive:$false
```

**Utilisation :**
```powershell
cd mobile
.\debug-login.ps1
```

---

## 💡 Astuces

### Sauvegarder les Logs

```powershell
adb logcat > logs.txt
```

### Logs avec Timestamp

```powershell
adb logcat -v time
```

### Logs Colorés (via grep/awk)

```powershell
# Erreurs en rouge, info en vert
adb logcat | ForEach-Object {
    if ($_ -match "Error|ERROR") {
        Write-Host $_ -ForegroundColor Red
    } elseif ($_ -match "ReactNativeJS") {
        Write-Host $_ -ForegroundColor Cyan
    } else {
        Write-Host $_
    }
}
```

---

**Maintenant, essayez de vous connecter et partagez les logs si vous voyez une erreur !** 🔍
