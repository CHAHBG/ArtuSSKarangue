# 🏗️ Guide de Build Local (Sans EAS)

Ce guide vous explique comment créer un APK Android localement sur Windows, **sans utiliser EAS Build Cloud**.

---

## ⚠️ Important : Limitations des Builds Locaux

**EAS Build Local nécessite macOS ou Linux** - il ne fonctionne pas sur Windows.

Pour Windows, vous avez 3 options :

1. **Expo Go** (Recommandé pour développement) ✅ **Actuellement actif !**
2. **Build via Android Studio** (APK complet)
3. **Expo Export + Android Studio** (Hybride)

---

## 📱 Option 1 : Expo Go (Développement Rapide)

### ✅ Avantages
- Instantané (pas de build)
- Hot reload en direct
- Idéal pour le développement

### ❌ Limitations
- Nécessite l'app Expo Go
- Certaines fonctionnalités natives limitées

### 🚀 Utilisation (ACTUELLEMENT ACTIF)

Votre serveur Expo tourne déjà ! 

```powershell
# Si pas encore démarré :
cd mobile
npm start
```

**Sur votre téléphone Android :**
1. Installez **Expo Go** depuis le Play Store
2. Ouvrez Expo Go
3. Scannez le QR code affiché dans le terminal
4. L'app se lance automatiquement !

**URL actuelle :** `http://192.168.1.9:8081`

---

## 🔨 Option 2 : Build APK avec Android Studio

Cette méthode crée un vrai APK installable, mais nécessite Android Studio.

### Prérequis

1. **Android Studio** - https://developer.android.com/studio
2. **JDK 17** - Inclus avec Android Studio
3. **Android SDK** (API 34+)
4. **Variables d'environnement** :
   ```powershell
   # Ajouter au PATH système
   ANDROID_HOME=C:\Users\USER\AppData\Local\Android\Sdk
   JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
   ```

### Étape 1 : Convertir en projet React Native

```powershell
cd mobile

# Éjecter de Expo (crée les dossiers android/ et ios/)
npx expo prebuild
```

**⚠️ Attention :** Cette commande est irréversible ! Elle transforme votre projet Expo en React Native pur.

### Étape 2 : Configurer Android

```powershell
# Aller dans le dossier Android
cd android

# Nettoyer le projet
.\gradlew clean

# Vérifier la configuration
.\gradlew tasks
```

### Étape 3 : Créer l'APK Debug

```powershell
# Build APK Debug (non signé)
.\gradlew assembleDebug

# L'APK sera dans :
# android\app\build\outputs\apk\debug\app-debug.apk
```

### Étape 4 : Créer l'APK Release (Signé)

```powershell
# Générer une clé de signature
cd android\app
keytool -genkey -v -keystore release.keystore -alias artukarangue -keyalg RSA -keysize 2048 -validity 10000

# Build APK Release
cd ..\..
.\gradlew assembleRelease

# L'APK sera dans :
# android\app\build\outputs\apk\release\app-release.apk
```

---

## 🎯 Option 3 : Expo Export + Android Studio (Recommandé)

Cette méthode combine les avantages d'Expo et Android Studio.

### Étape 1 : Exporter le bundle Expo

```powershell
cd mobile

# Exporter pour Android
npx expo export --platform android --output-dir dist
```

### Étape 2 : Préparer le projet Android

```powershell
# Créer les fichiers natifs (une seule fois)
npx expo prebuild --platform android

# Aller dans le dossier Android
cd android
```

### Étape 3 : Build avec Gradle

```powershell
# APK Debug (rapide, pour tests)
.\gradlew assembleDebug

# APK Release (pour distribution)
.\gradlew assembleRelease
```

### Étape 4 : Localiser l'APK

```powershell
# Debug APK
cd app\build\outputs\apk\debug
explorer .

# Release APK  
cd app\build\outputs\apk\release
explorer .
```

---

## 🐳 Option 4 : Docker (Alternative pour Windows)

Si vous voulez vraiment utiliser EAS Build local, utilisez Docker Desktop.

### Prérequis
1. **Docker Desktop** - https://www.docker.com/products/docker-desktop/
2. **WSL2** activé sur Windows

### Configuration

```powershell
# Installer Docker Desktop avec WSL2
# Puis dans WSL2 (Ubuntu) :

cd /mnt/c/Users/USER/Documents/Applications/ArtussKarangue/ArtuSSKarangue/mobile

# Build local avec EAS
eas build --profile preview --platform android --local
```

---

## 📋 Comparaison des Options

| Méthode | Durée | Difficulté | APK ? | Hot Reload |
|---------|-------|------------|-------|------------|
| **Expo Go** | Instantané | ⭐ Facile | ❌ Non | ✅ Oui |
| **Android Studio** | 10-15 min | ⭐⭐⭐ Difficile | ✅ Oui | ❌ Non |
| **Expo Export** | 5-10 min | ⭐⭐ Moyen | ✅ Oui | ❌ Non |
| **Docker + EAS** | 15-20 min | ⭐⭐⭐ Difficile | ✅ Oui | ❌ Non |

---

## 🎯 Recommandation par Usage

### Pour le Développement Quotidien
👉 **Expo Go** (Option 1) - **ACTUELLEMENT ACTIF**
```powershell
npm start
# Scanner le QR code avec Expo Go
```

### Pour Tester sur Appareil Physique
👉 **Expo Export + Android Studio** (Option 3)
```powershell
npx expo prebuild --platform android
cd android
.\gradlew assembleDebug
```

### Pour Distribution Interne
👉 **Android Studio Release** (Option 2)
```powershell
cd android
.\gradlew assembleRelease
```

### Pour Production
👉 **EAS Build Cloud** (nécessite compte Expo)
```powershell
eas build --profile production --platform android
```

---

## 🔧 Dépannage

### Erreur : "ANDROID_HOME not set"

```powershell
# PowerShell (Admin)
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\USER\AppData\Local\Android\Sdk', 'User')
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Android\Android Studio\jbr', 'User')

# Redémarrer PowerShell
```

### Erreur : "Gradle build failed"

```powershell
cd android
.\gradlew clean
.\gradlew --stop
.\gradlew assembleDebug --stacktrace
```

### Erreur : "Could not find SDK"

```powershell
# Ouvrir Android Studio
# Tools > SDK Manager
# Installer : Android SDK 34, SDK Build-Tools, SDK Platform-Tools
```

### L'app crash au lancement

```powershell
# Vérifier les logs
adb logcat | Select-String "artu"

# Réinstaller les dépendances
rm -rf node_modules
npm install
npx expo prebuild --clean
```

---

## 📱 Installation de l'APK

### Sur téléphone Android

1. **Transférer l'APK**
   ```powershell
   # Via USB
   adb install app-debug.apk
   
   # Ou copier vers téléphone et installer manuellement
   ```

2. **Activer "Sources Inconnues"**
   - Paramètres > Sécurité > Sources Inconnues > Activer

3. **Installer l'APK**
   - Ouvrir le fichier APK
   - Appuyer sur "Installer"

---

## 🎉 Résumé

**Pour démarrer maintenant (Expo Go) :**
```powershell
cd mobile
npm start
# Scanner le QR code avec Expo Go app
```

**Pour créer un APK :**
```powershell
# Méthode simple
npx expo prebuild --platform android
cd android
.\gradlew assembleDebug
```

**L'APK sera ici :**
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📚 Resources

- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [Android Studio](https://developer.android.com/studio)
- [Gradle Build](https://docs.expo.dev/build-reference/android-builds/)
- [React Native Build](https://reactnative.dev/docs/signed-apk-android)

---

**Note :** Expo Go est actuellement actif sur `http://192.168.1.9:8081` 
Scannez le QR code dans votre terminal pour tester immédiatement ! 📱
