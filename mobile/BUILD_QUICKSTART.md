# 🚀 Quick Start - Build Interne

## Option 1 : EAS Build (Cloud - Recommandé) ⭐

### Installation et Configuration (Une seule fois)
```powershell
# 1. Installer EAS CLI
npm install -g eas-cli

# 2. Se connecter
eas login

# 3. Configurer le projet
cd mobile
eas build:configure
```

### Créer un Build Android APK
```powershell
cd mobile
eas build --profile preview --platform android
```

**Résultat** : Vous obtiendrez un lien pour télécharger l'APK (5-15 minutes)

---

## Option 2 : Expo Go (Test Rapide - Limité)

### Installation
```powershell
# 1. Installer Expo Go sur votre téléphone
# Play Store : https://play.google.com/store/apps/details?id=host.exp.exponent
# App Store : https://apps.apple.com/app/expo-go/id982107779

# 2. Démarrer le serveur
cd mobile
npm start
```

### Utilisation
1. Scannez le QR code avec Expo Go
2. L'app se lance automatiquement
3. Hot reload : les modifications s'affichent instantanément

**⚠️ Limitation** : Certaines fonctionnalités natives (comme react-native-maps) peuvent ne pas fonctionner

---

## Option 3 : Build Local (Sans Cloud)

### Prérequis
- **Android** : Docker installé
- **iOS** : macOS avec Xcode

### Commandes
```powershell
# Android (APK local)
cd mobile
eas build --profile preview --platform android --local

# iOS (sur macOS uniquement)
eas build --profile preview --platform ios --local
```

---

## 📱 Installation sur Appareil

### Android
1. Téléchargez l'APK depuis le lien EAS
2. Transférez-le sur votre téléphone (USB, email, Drive)
3. Activez "Sources inconnues" dans les paramètres
4. Installez l'APK

### iOS
1. Utilisez TestFlight (production)
2. Ou installez via Xcode (développement)

---

## 🔍 Obtenir l'Adresse IP de votre PC

### Windows
```powershell
ipconfig | Select-String "IPv4"
```

### Mise à jour du fichier `.env`
```env
API_URL=http://VOTRE_IP_ICI:5000/api/v1
SOCKET_URL=http://VOTRE_IP_ICI:5000
```

Exemple :
```env
API_URL=http://192.168.1.9:5000/api/v1
SOCKET_URL=http://192.168.1.9:5000
```

---

## ✅ Checklist Rapide

Avant de builder, assurez-vous que :

- [ ] Le backend tourne sur http://localhost:5000
- [ ] Vous avez mis à jour l'IP dans `.env`
- [ ] Les dépendances sont installées (`npm install`)
- [ ] Le code est fonctionnel sur Expo Go

---

## 🆘 Problèmes Courants

### "eas: command not found"
```powershell
npm install -g eas-cli
```

### "Not logged in"
```powershell
eas login
```

### "Project not configured"
```powershell
cd mobile
eas build:configure
```

### "Build failed"
```powershell
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Temps de Build Estimés

- **EAS Cloud** : 10-20 minutes
- **Local** : 5-10 minutes
- **Expo Go** : Instantané (pas de build nécessaire)

---

## 🎯 Commande All-in-One

Pour un build Android APK rapide et simple :

```powershell
cd mobile && eas build --profile preview --platform android
```

C'est tout ! Le lien de téléchargement apparaîtra dans le terminal une fois terminé. 🎉
