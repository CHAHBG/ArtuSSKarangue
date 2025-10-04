# 📱 Guide de Build Interne - ARTU SI SEN KARANGUE

## 🎯 Options de Build de Développement

### Option 1 : Build EAS (Recommandé) ⭐

EAS (Expo Application Services) permet de créer des builds professionnels dans le cloud.

#### Prérequis
```powershell
# Installer EAS CLI globalement
npm install -g eas-cli

# Se connecter à votre compte Expo
eas login
```

#### Configuration du projet
```powershell
cd mobile

# Initialiser EAS dans le projet
eas build:configure
```

#### Créer un Build Android (APK de développement)
```powershell
# Build de développement (Preview)
eas build --profile preview --platform android

# Build de production
eas build --profile production --platform android
```

#### Créer un Build iOS (Simulateur)
```powershell
# Build pour simulateur iOS
eas build --profile preview --platform ios

# Build pour appareil physique (nécessite un compte Apple Developer)
eas build --profile production --platform ios
```

#### Télécharger et installer
Une fois le build terminé, EAS vous donnera un lien pour télécharger l'APK ou IPA.

**Android** : Transférez l'APK sur votre téléphone et installez-le
**iOS** : Utilisez TestFlight ou installez via Xcode

---

### Option 2 : Build Local avec EAS

Si vous préférez builder localement :

```powershell
# Build Android local
eas build --profile preview --platform android --local

# Build iOS local (uniquement sur macOS)
eas build --profile preview --platform ios --local
```

**Avantages** : Pas besoin de crédit EAS, build plus rapide
**Inconvénients** : Nécessite Docker (Android) ou macOS (iOS)

---

### Option 3 : APK de Développement avec Expo CLI

Pour un test rapide sans EAS :

```powershell
# Installer expo-dev-client
npm install expo-dev-client

# Créer un build de développement local
npx expo run:android

# Ou pour iOS (sur macOS uniquement)
npx expo run:ios
```

Cette méthode crée un APK/IPA avec le dev client Expo inclus.

---

### Option 4 : Expo Go (Test Rapide)

**Le plus simple pour tester rapidement** :

1. Installez Expo Go sur votre téléphone depuis le Play Store ou App Store
2. Lancez le serveur de développement :
```powershell
cd mobile
npm start
```
3. Scannez le QR code avec Expo Go

**Limitation** : Ne fonctionne pas avec les modules natifs custom (comme react-native-maps sur certaines versions)

---

## 🔧 Configuration pour Builds Internes

### Fichier `eas.json` (à créer dans le dossier mobile)

```json
{
  "cli": {
    "version": ">= 13.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Variables d'environnement

Créez un fichier `.env` dans le dossier mobile :

```env
# Backend API
API_URL=http://192.168.1.9:5000/api/v1
SOCKET_URL=http://192.168.1.9:5000

# Configuration
NODE_ENV=development
```

**⚠️ Important** : Remplacez `192.168.1.9` par l'adresse IP de votre ordinateur sur le réseau local.

---

## 📦 Commandes Rapides

### Build Android APK (Cloud)
```powershell
cd mobile
eas build -p android --profile preview
```

### Build Android APK (Local)
```powershell
cd mobile
eas build -p android --profile preview --local
```

### Build iOS (Cloud - nécessite compte Apple Developer)
```powershell
cd mobile
eas build -p ios --profile preview
```

### Test sur Expo Go
```powershell
cd mobile
npm start
# Scannez le QR code avec Expo Go
```

---

## 🚀 Distribution Interne

### Via QR Code (EAS)
Après un build EAS, vous obtenez :
- Un lien de téléchargement direct
- Un QR code pour installation rapide
- Tableau de bord pour gérer les builds

### Via TestFlight (iOS)
```powershell
# Après avoir créé un build iOS
eas submit -p ios --profile production
```

### Via Email/Drive (Android APK)
Téléchargez l'APK depuis EAS et partagez-le par :
- Email
- Google Drive
- Serveur web local

---

## 🔍 Vérification du Build

### Tester l'APK Android
```powershell
# Installer l'APK via ADB
adb install chemin/vers/votre-app.apk

# Vérifier les logs
adb logcat | findstr "ARTU"
```

### Tester sur iOS
```powershell
# Installer via Xcode
xcrun simctl install booted chemin/vers/votre-app.app

# Ou utiliser TestFlight pour un appareil physique
```

---

## 📊 Suivi des Builds

### EAS Dashboard
Visitez : https://expo.dev/accounts/[votre-username]/projects/artu-si-sen-karangue/builds

Vous y trouverez :
- Historique de tous les builds
- Statut de compilation
- Liens de téléchargement
- Logs de build

---

## ⚙️ Configuration Avancée

### Over-the-Air (OTA) Updates
Avec EAS Update, vous pouvez pousser des mises à jour JavaScript sans rebuild :

```powershell
# Installer EAS Update
npx expo install expo-updates

# Publier une mise à jour
eas update --branch preview --message "Fix bug urgence"
```

### Code Signing (Android)
```powershell
# Générer un keystore pour signing
keytool -genkey -v -keystore artu-release-key.keystore -alias artu-key -keyalg RSA -keysize 2048 -validity 10000

# Configurer dans eas.json
```

---

## 🐛 Dépannage

### Build échoue sur EAS
```powershell
# Vérifier les dépendances
npm install

# Nettoyer le cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### APK ne s'installe pas
- Activer "Sources inconnues" sur Android
- Vérifier que le package name est unique
- Désinstaller l'ancienne version

### Build trop gros
```powershell
# Analyser la taille du bundle
npx expo-updates assets:verify
```

---

## 📚 Ressources

- [Documentation EAS Build](https://docs.expo.dev/build/introduction/)
- [Distribution interne](https://docs.expo.dev/build/internal-distribution/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Expo Dev Client](https://docs.expo.dev/develop/development-builds/introduction/)

---

## 🎯 Workflow Recommandé

**Pour les tests quotidiens** :
```powershell
npm start
# Utilisez Expo Go pour tester rapidement
```

**Pour les tests avec stakeholders** :
```powershell
eas build --profile preview --platform android
# Partagez le lien de téléchargement EAS
```

**Pour la production** :
```powershell
eas build --profile production --platform all
eas submit --platform all
```

---

## ✅ Checklist Avant Build

- [ ] Backend en cours d'exécution (port 5000)
- [ ] Variables d'environnement configurées
- [ ] Version incrémentée dans app.json
- [ ] Icônes et splash screens à jour
- [ ] Permissions configurées (Location, Camera, etc.)
- [ ] Testé sur Expo Go
- [ ] Code committé sur Git
- [ ] Build profile sélectionné (development/preview/production)

---

**Créé le : 4 octobre 2025**
**Projet : ARTU SI SEN KARANGUE - Application d'urgence pour le Sénégal**
**Version : 1.0.0**
