# 🔧 Development Build sur Appareil Physique - Configuration

## 📱 Votre Situation

Vous avez installé un **Development Build APK** sur votre téléphone Android connecté via câble USB.

---

## ⚠️ Problème : "Email or Password Incorrect"

**Cause :** Le development build sur votre téléphone ne peut pas se connecter au backend car :
1. Le backend n'est pas démarré
2. L'IP configurée n'est pas accessible depuis le téléphone
3. Le téléphone et le PC ne sont pas sur le même réseau

---

## ✅ Solution Complète

### Étape 1 : Vérifier l'IP de Votre PC

```powershell
ipconfig | Select-String "IPv4"
```

**Notez l'IP :** Exemple : `192.168.1.9`

---

### Étape 2 : Vérifier la Configuration Mobile

**Fichier : `mobile/.env`**

```env
API_URL=http://192.168.1.9:5000/api/v1
SOCKET_URL=http://192.168.1.9:5000
```

**⚠️ IMPORTANT :** L'IP doit correspondre à celle de votre PC !

---

### Étape 3 : Démarrer le Backend

```powershell
cd backend
node src/server.js
```

**✅ Attendez de voir :**
```
✅ Redis connected
🚀 Server running on port 5000
📡 API: http://localhost:5000/api/v1
```

**⚠️ Laissez ce terminal ouvert !**

---

### Étape 4 : Test depuis le Téléphone

**Sur votre téléphone Android connecté via USB :**

1. Ouvrir le development build installé
2. Aller sur l'écran de Login
3. Entrer :
   - Email : **cheikhabgn@gmail.com**
   - Password : **Sensei00**
4. Appuyer sur "Connexion"

---

## 🔍 Vérifications Importantes

### 1. Backend Accessible depuis le Téléphone ?

**Via ADB :**
```powershell
adb shell curl http://192.168.1.9:5000/api/v1/health
```

**Devrait retourner :**
```json
{"status":"success","message":"API is running"}
```

### 2. Pare-feu Windows Autorise le Port 5000 ?

```powershell
# Ajouter règle pare-feu (Admin requis)
New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

### 3. Téléphone et PC sur le Même Réseau ?

**Si câble USB uniquement :** Utilisez ADB reverse

```powershell
adb reverse tcp:5000 tcp:5000
```

**Cela redirige `localhost:5000` du téléphone vers votre PC !**

---

## 🚀 Solution Rapide avec ADB Reverse

**Cette solution fonctionne MÊME si PC et téléphone sont sur des réseaux différents !**

### Étape 1 : ADB Reverse

```powershell
adb reverse tcp:5000 tcp:5000
```

### Étape 2 : Modifier l'API URL dans l'App

**Si vous avez rebuild l'app, modifiez `mobile/.env` :**

```env
# Utiliser localhost au lieu de l'IP
API_URL=http://localhost:5000/api/v1
SOCKET_URL=http://localhost:5000
```

**Puis rebuild :**
```powershell
cd mobile
npx expo prebuild --clean
cd android
.\gradlew.bat assembleDebug
```

### Étape 3 : Démarrer Backend

```powershell
cd backend
node src/server.js
```

### Étape 4 : Tester

Ouvrir l'app sur le téléphone et se connecter !

---

## 📱 Alternative : Configuration Dynamique dans l'App

**Si vous ne voulez pas rebuild,** vous pouvez configurer l'IP dans l'app.

Modifiez `mobile/src/config/api.js` pour permettre le changement d'IP :

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Permettre override de l'API URL
const getApiUrl = async () => {
  const customUrl = await AsyncStorage.getItem('custom_api_url');
  return customUrl || Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.9:5000/api/v1';
};

export default {
  API_URL: await getApiUrl(),
  // ...
};
```

---

## 🎯 Solution la Plus Simple (RECOMMANDÉE)

### 1. ADB Reverse (Redirection USB)

```powershell
# Une seule fois, dans un terminal
adb reverse tcp:5000 tcp:5000
```

### 2. Démarrer Backend

```powershell
# Terminal dédié
cd backend
node src/server.js
```

### 3. Ouvrir l'App

- L'app sur le téléphone
- Login avec : cheikhabgn@gmail.com / Sensei00
- ✅ Ça fonctionne !

---

## 🔧 Dépannage

### "Cannot connect to server"

```powershell
# 1. Vérifier backend
curl http://localhost:5000/api/v1/health

# 2. Vérifier ADB reverse
adb reverse --list

# 3. Refaire reverse
adb reverse --remove-all
adb reverse tcp:5000 tcp:5000

# 4. Redémarrer backend
cd backend
node src/server.js
```

### "Still not working"

**Rebuild l'app avec localhost :**

1. Modifier `mobile/.env` :
   ```env
   API_URL=http://localhost:5000/api/v1
   SOCKET_URL=http://localhost:5000
   ```

2. Copier l'APK déjà buildé :
   ```powershell
   # L'APK est dans :
   mobile\android\app\build\outputs\apk\debug\app-debug.apk
   
   # Installer via ADB
   adb install -r mobile\android\app\build\outputs\apk\debug\app-debug.apk
   ```

---

## 📋 Checklist Complète

- [ ] Backend démarré (`node src/server.js`)
- [ ] ADB reverse configuré (`adb reverse tcp:5000 tcp:5000`)
- [ ] Téléphone connecté en USB (`adb devices`)
- [ ] Development build installé sur le téléphone
- [ ] Se connecter : cheikhabgn@gmail.com / Sensei00

---

## 🎉 Résumé Ultra-Simple

```powershell
# Terminal 1 : Backend
cd backend
node src/server.js

# Terminal 2 : ADB Reverse
adb reverse tcp:5000 tcp:5000

# Sur le téléphone :
# Ouvrir l'app → Login → cheikhabgn@gmail.com / Sensei00
```

**C'est tout ! Le backend DOIT tourner et ADB reverse DOIT être configuré ! 🚀**

---

## 💡 Astuce Bonus

**Créer un script pour tout démarrer :**

```powershell
# start-dev.ps1
Write-Host "Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node src/server.js"

Start-Sleep -Seconds 3

Write-Host "Configuring ADB Reverse..." -ForegroundColor Yellow
adb reverse tcp:5000 tcp:5000

Write-Host "✅ All set! Open app on phone and login!" -ForegroundColor Green
```

**Utilisation :**
```powershell
.\start-dev.ps1
```
