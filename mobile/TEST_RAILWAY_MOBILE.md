# 🚀 GUIDE COMPLET - Tester l'App avec Railway

## 📱 Situation actuelle

✅ **Backend Railway** : https://artusskarangue-production.up.railway.app
✅ **Database Supabase** : PostgreSQL 17.6 connecté
✅ **API testée** : Register, Login, Profile fonctionnent
✅ **Mobile configuré** : `api.js` pointe vers Railway

---

## 🎯 Deux options pour tester

### Option 1 : Test rapide avec Expo Go (WiFi uniquement)

**Avantage** : Rapide, pas de build
**Inconvénient** : Ne teste pas 4G, seulement WiFi local

```powershell
# Si Expo tourne déjà, parfait !
# Sinon :
npx expo start

# Scanner le QR code avec Expo Go
# L'app va utiliser __DEV__ = true donc localhost
```

⚠️ **Cette option utilise l'URL locale** (`http://localhost:5000`), pas Railway !

---

### Option 2 : Build APK avec Railway (Recommandé) 🎯

**Avantage** : Test complet avec 4G + Railway
**Inconvénient** : Build prend 5-10 minutes

#### Étape 1 : Vérifier la configuration

```powershell
# Vérifier que api.js utilise Railway en production
Get-Content src\config\api.js | Select-String "railway"
```

Doit contenir :
```javascript
: 'https://artusskarangue-production.up.railway.app/api/v1';
```

#### Étape 2 : Builder l'APK

**Option A : Debug APK (rapide)** :
```powershell
.\build-railway-apk.ps1
# Choisir option 1 (Debug)
```

**Option B : Commande directe** :
```powershell
cd android
.\gradlew assembleDebug
```

APK sera dans : `android\app\build\outputs\apk\debug\app-debug.apk`

**Option C : Release APK (optimisé)** :
```powershell
cd android
.\gradlew assembleRelease
```

APK sera dans : `android\app\build\outputs\apk\release\app-release.apk`

#### Étape 3 : Installer sur téléphone

**Méthode 1 : USB** :
```powershell
# Connecter téléphone en USB
# Activer mode développeur + débogage USB
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

**Méthode 2 : Copie manuelle** :
1. Copier `app-debug.apk` sur téléphone (via Google Drive, Bluetooth, etc.)
2. Ouvrir l'APK sur le téléphone
3. Autoriser installation sources inconnues si demandé
4. Installer

#### Étape 4 : Tester avec 4G

1. **Désactiver WiFi** sur le téléphone
2. **Activer 4G/5G**
3. Ouvrir l'app
4. Créer un compte
5. Vérifier que ça fonctionne

Si tout marche → **L'app communique avec Railway partout dans le monde !** 🌍

---

## 🔍 Différence Dev vs Production

### Mode Development (`__DEV__ = true`)
- Expo Go
- URL : `http://localhost:5000/api/v1`
- Nécessite backend local lancé
- WiFi local uniquement

### Mode Production (`__DEV__ = false`)
- APK installé
- URL : `https://artusskarangue-production.up.railway.app/api/v1`
- Fonctionne avec Railway
- 4G/5G/WiFi partout

---

## 🐛 Dépannage

### Problème : "Network Error" dans l'app

**Cause** : L'app ne peut pas joindre Railway

**Vérifier** :
1. Téléphone en 4G (pas WiFi)
2. Railway fonctionne : `https://artusskarangue-production.up.railway.app/health`
3. `api.js` contient bien l'URL Railway

### Problème : Build Gradle échoue

**Solution** :
```powershell
cd android
.\gradlew clean
.\gradlew assembleDebug
```

### Problème : "App not installed"

**Cause** : Version déjà installée ou signature différente

**Solution** :
1. Désinstaller ancienne version
2. Réinstaller le nouvel APK

---

## ✅ Checklist finale

Avant de dire que tout fonctionne :

- [ ] Backend Railway accessible (test avec navigateur)
- [ ] `/health/db` retourne success
- [ ] `api.js` contient URL Railway pour production
- [ ] APK buildé (debug ou release)
- [ ] APK installé sur téléphone
- [ ] Test sur 4G (WiFi désactivé)
- [ ] Création compte réussie
- [ ] Login fonctionne
- [ ] Navigation app OK

---

## 📊 Résumé des commandes

```powershell
# 1. Lancer Expo Dev (WiFi local)
npx expo start

# 2. Build APK Debug (test 4G)
cd android
.\gradlew assembleDebug

# 3. Build APK Release (production)
cd android
.\gradlew assembleRelease

# 4. Installer via USB
adb install android\app\build\outputs\apk\debug\app-debug.apk

# 5. Tester API Railway depuis PC
Invoke-RestMethod -Uri "https://artusskarangue-production.up.railway.app/health/db"
```

---

## 🎯 Recommandation

**Pour tester rapidement Railway** :

1. ✅ **Build Debug APK** (5 min) :
   ```powershell
   cd android
   .\gradlew assembleDebug
   ```

2. ✅ **Copier APK** sur téléphone

3. ✅ **Installer et tester** avec 4G

C'est la façon la plus simple de vérifier que l'intégration Railway fonctionne ! 🚀

---

**Fichier créé** : `build-railway-apk.ps1` - Script interactif pour builder facilement
