# 🎯 ARTU SI SEN KARANGUE - Internal Development Build

## 📱 Build Rapide (Recommandé)

### Utiliser le Script PowerShell Automatisé

```powershell
# Build Android APK (Cloud)
.\build.ps1

# Build Android APK (Local)
.\build.ps1 -Local

# Build de production
.\build.ps1 -Profile production

# Build iOS
.\build.ps1 -Platform ios

# Avec toutes les options
.\build.ps1 -Profile preview -Platform android -Local
```

---

## 🚀 Build Étape par Étape

### 1. Installation d'EAS CLI (Une seule fois)

```powershell
# Installer EAS CLI globalement
npm install -g eas-cli

# Se connecter à votre compte Expo
eas login
```

### 2. Configurer le Projet (Une seule fois)

```powershell
cd mobile

# Configurer EAS
eas build:configure

# Créer le fichier .env
cp .env.example .env
```

### 3. Mettre à Jour l'Adresse IP

```powershell
# Obtenir votre adresse IP locale
ipconfig | Select-String "IPv4"
```

Modifiez `mobile/.env` :
```env
API_URL=http://VOTRE_IP:5000/api/v1
SOCKET_URL=http://VOTRE_IP:5000
```

### 4. Lancer le Build

```powershell
# Build Android (méthode la plus simple)
npm run build:android

# Ou directement avec EAS
eas build --profile preview --platform android
```

---

## 📦 Types de Build

### Preview (Développement Interne)
- Build APK Android
- Distributable en interne
- Idéal pour les tests

```powershell
npm run build:android
```

### Development (Dev Client)
- Inclut le dev client Expo
- Hot reload activé
- Pour le développement actif

```powershell
eas build --profile development --platform android
```

### Production
- Build optimisé
- App Bundle pour Play Store
- Code signing requis

```powershell
npm run build:production
```

---

## 🔧 Dépannage

### EAS non installé
```powershell
npm install -g eas-cli
```

### Pas connecté
```powershell
eas login
```

### Erreur de dépendances
```powershell
rm -rf node_modules package-lock.json
npm install
```

### Build échoue
```powershell
# Nettoyer le cache
npm cache clean --force
npm install

# Vérifier la configuration
eas build:configure
```

---

## 📊 Temps de Build

| Type | Durée | Taille |
|------|-------|--------|
| Cloud (EAS) | 10-20 min | ~60 MB |
| Local | 5-10 min | ~60 MB |
| Expo Go | Instantané | N/A |

---

## 📱 Installation du Build

### Android

1. **Via QR Code**
   - EAS génère un QR code
   - Scannez avec l'appareil photo
   - Installation automatique

2. **Via Téléchargement Direct**
   - Cliquez sur le lien EAS
   - Téléchargez l'APK
   - Installez manuellement

3. **Via ADB (Développeurs)**
   ```powershell
   adb install chemin/vers/app.apk
   ```

### iOS

1. **TestFlight** (Production)
   ```powershell
   eas submit -p ios
   ```

2. **Ad-hoc** (Développement)
   - Enregistrez l'UDID de l'appareil
   - Créez un profil de provisioning
   - Installez via Xcode ou Apple Configurator

---

## 🎯 Commandes Utiles

```powershell
# Liste des builds
eas build:list

# Voir les détails d'un build
eas build:view [BUILD_ID]

# Télécharger un build
eas build:download [BUILD_ID]

# Annuler un build
eas build:cancel

# Supprimer des builds
eas build:delete

# Voir les logs
eas build:log [BUILD_ID]

# Soumettre aux stores
eas submit --platform android
eas submit --platform ios
```

---

## 📝 Notes Importantes

### Avant Chaque Build
- ✅ Backend en cours d'exécution (port 5000)
- ✅ Adresse IP mise à jour dans `.env`
- ✅ Version incrémentée dans `app.json`
- ✅ Code testé sur Expo Go
- ✅ Derniers changements commités

### Pour la Production
- ✅ Créer un keystore Android
- ✅ Compte Apple Developer (iOS)
- ✅ Icônes et splash screens finalisés
- ✅ Privacy policies configurés
- ✅ Permissions validées

### Sécurité
- 🔐 Ne commitez JAMAIS les fichiers `.env`
- 🔐 Ne partagez JAMAIS vos keystores
- 🔐 Gardez vos credentials EAS privés

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- `BUILD_GUIDE.md` - Guide complet et détaillé
- `BUILD_QUICKSTART.md` - Quick start simplifié
- `eas.json` - Configuration EAS
- `.env.example` - Variables d'environnement

---

## 🆘 Support

En cas de problème :
1. Consultez les logs EAS
2. Vérifiez `BUILD_GUIDE.md` section Dépannage
3. Cherchez sur [Expo Forums](https://forums.expo.dev)
4. Consultez [Documentation EAS](https://docs.expo.dev/build/introduction/)

---

## ✅ Succès !

Une fois le build terminé, vous recevrez :
- 📧 Email de notification
- 🔗 Lien de téléchargement
- 📱 QR code pour installation rapide
- 📊 Dashboard avec tous les détails

**Félicitations ! Votre app ARTU SI SEN KARANGUE est prête à être testée ! 🇸🇳🎉**

---

**Version** : 1.0.0  
**Date** : 4 octobre 2025  
**Plateforme** : React Native + Expo  
**Backend** : Node.js + PostgreSQL + PostGIS
