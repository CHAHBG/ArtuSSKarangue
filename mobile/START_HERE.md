# 🚀 Démarrage Rapide - Build de Développement Interne

**ARTU SI SEN KARANGUE** - Application d'urgence pour le Sénégal 🇸🇳

---

## ⚡ 3 Étapes pour Builder l'App

### 1️⃣ Configuration (Une seule fois)

```powershell
# Dans le dossier mobile/
cd mobile

# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Obtenir votre IP locale et configurer .env
.\get-ip.ps1
```

### 2️⃣ Vérifier que le Backend Tourne

```powershell
# Dans un autre terminal, dossier backend/
cd backend
node src/server.js

# Le serveur doit tourner sur http://localhost:5000
```

### 3️⃣ Lancer le Build

```powershell
# Option A: Avec le script automatisé (RECOMMANDÉ)
.\build.ps1

# Option B: Directement avec npm
npm run build:android

# Option C: Avec EAS directement
eas build --profile preview --platform android
```

---

## 📱 Résultat

Après 10-20 minutes, vous recevrez :
- ✅ Un lien de téléchargement pour l'APK
- ✅ Un QR code pour installation rapide
- ✅ L'APK prêt à être installé sur Android

---

## 🔧 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `.\get-ip.ps1` | Obtenir votre IP locale et configurer .env |
| `.\build.ps1` | Build automatisé avec vérifications |
| `npm run build:android` | Build Android APK (cloud) |
| `npm run build:android:local` | Build Android APK (local) |
| `npm run build:ios` | Build iOS (nécessite macOS) |
| `npm run build:production` | Build de production |
| `npm start` | Lancer Expo Go (test rapide) |

---

## 📖 Documentation Complète

- **`BUILD_QUICKSTART.md`** - Guide ultra-rapide
- **`BUILD_GUIDE.md`** - Documentation complète et détaillée
- **`README_BUILD.md`** - README spécifique au build
- **`eas.json`** - Configuration EAS

---

## 🆘 Problèmes Courants

### "eas: command not found"
```powershell
npm install -g eas-cli
```

### "Not logged in to Expo"
```powershell
eas login
```

### "Cannot connect to backend"
- Vérifiez que le backend tourne (port 5000)
- Vérifiez votre IP dans `.env`
- Lancez `.\get-ip.ps1` pour mettre à jour

### "Build failed"
```powershell
# Nettoyer et réinstaller
rm -rf node_modules
npm install
```

---

## 🎯 Test Rapide Sans Build

Si vous voulez juste tester rapidement :

```powershell
# 1. Installer Expo Go sur votre téléphone
# Android: https://play.google.com/store/apps/details?id=host.exp.exponent
# iOS: https://apps.apple.com/app/expo-go/id982107779

# 2. Lancer le serveur
npm start

# 3. Scanner le QR code avec Expo Go
```

⚠️ **Limitation** : Certaines fonctionnalités natives peuvent ne pas fonctionner

---

## ✅ Checklist

Avant de builder :
- [ ] Backend en cours d'exécution (port 5000)
- [ ] Fichier `.env` configuré avec votre IP
- [ ] EAS CLI installé et connecté
- [ ] Dépendances installées (`npm install`)
- [ ] Code testé sur Expo Go (optionnel)

---

## 📞 Support

Questions ? Consultez :
1. `BUILD_GUIDE.md` - Guide complet
2. [Expo Documentation](https://docs.expo.dev/build/introduction/)
3. [Expo Forums](https://forums.expo.dev)

---

## 🎉 C'est Parti !

```powershell
# Commande tout-en-un pour builder
.\build.ps1
```

**Votre app sera prête dans 10-20 minutes !** ⏱️

---

**Version** : 1.0.0  
**Date** : 4 octobre 2025  
**Auteur** : CHAHBG  
**Licence** : MIT
