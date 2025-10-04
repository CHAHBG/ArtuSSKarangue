# 📱 Instructions de Build - ARTU SI SEN KARANGUE

Application d'urgence mobile pour le Sénégal 🇸🇳

---

## 🚀 Démarrage Rapide

### Pour builder l'application mobile :

```powershell
# 1. Aller dans le dossier mobile
cd mobile

# 2. Consulter le guide de démarrage
# Ouvrir START_HERE.md pour les instructions complètes

# 3. Lancer le script automatisé
.\build.ps1
```

---

## 📚 Documentation Disponible

Tous les fichiers de documentation se trouvent dans le dossier `mobile/` :

### 🎯 Guides Principaux

1. **`mobile/START_HERE.md`** ⭐
   - Point d'entrée recommandé
   - Guide de démarrage en 3 étapes
   - Tous les scripts disponibles
   - Checklist rapide

2. **`mobile/BUILD_QUICKSTART.md`**
   - Quick start ultra-rapide
   - 3 options de build expliquées
   - Commandes essentielles
   - Problèmes courants et solutions

3. **`mobile/BUILD_GUIDE.md`**
   - Guide complet et détaillé
   - Toutes les options EAS
   - Configuration avancée
   - Dépannage exhaustif

4. **`mobile/README_BUILD.md`**
   - README spécifique au build
   - Types de build (dev, preview, prod)
   - Installation et distribution
   - Commandes utiles

### 🔧 Scripts Utilitaires

1. **`mobile/build.ps1`**
   - Script PowerShell automatisé
   - Vérifications pré-build
   - Gestion des erreurs
   - Interface utilisateur conviviale

2. **`mobile/get-ip.ps1`**
   - Détection automatique de l'IP locale
   - Configuration automatique du `.env`
   - Copie dans le presse-papier

### ⚙️ Fichiers de Configuration

1. **`mobile/eas.json`**
   - Configuration EAS Build
   - 3 profils : development, preview, production
   - Paramètres Android et iOS

2. **`mobile/.env.example`**
   - Template de configuration
   - Variables d'environnement
   - À copier en `.env`

---

## 🏃 Workflow Recommandé

### 1️⃣ Configuration Initiale (Une seule fois)

```powershell
cd mobile

# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Configurer l'IP et créer .env
.\get-ip.ps1

# Installer les dépendances
npm install
```

### 2️⃣ Test Rapide (Quotidien)

```powershell
# Démarrer le serveur backend
cd backend
node src/server.js

# Dans un autre terminal, lancer Expo
cd mobile
npm start

# Scanner le QR code avec Expo Go
```

### 3️⃣ Build pour Distribution (Hebdomadaire)

```powershell
cd mobile

# Build automatisé
.\build.ps1

# Ou directement
npm run build:android
```

### 4️⃣ Production (Release)

```powershell
cd mobile

# Incrémenter la version dans app.json
# Puis builder pour production
npm run build:production

# Soumettre aux stores
eas submit --platform android
eas submit --platform ios
```

---

## 📦 Types de Build

| Type | Commande | Usage | Durée |
|------|----------|-------|-------|
| **Expo Go** | `npm start` | Test rapide, hot reload | Instantané |
| **Preview (APK)** | `npm run build:android` | Distribution interne | 10-20 min |
| **Production** | `npm run build:production` | Release publique | 15-25 min |
| **Local** | `.\build.ps1 -Local` | Build hors ligne | 5-10 min |

---

## 🎯 Commandes Rapides

```powershell
# Obtenir l'IP et configurer .env
cd mobile
.\get-ip.ps1

# Build Android (le plus simple)
.\build.ps1

# Build avec options
.\build.ps1 -Profile production
.\build.ps1 -Platform ios
.\build.ps1 -Local

# Build via npm
npm run build:android
npm run build:ios
npm run build:production

# Test rapide
npm start
```

---

## 🔍 Structure du Projet

```
ArtuSSKarangue/
├── mobile/                    # Application mobile
│   ├── START_HERE.md         # 🎯 COMMENCER ICI
│   ├── BUILD_GUIDE.md        # Guide complet
│   ├── BUILD_QUICKSTART.md   # Quick start
│   ├── README_BUILD.md       # README build
│   ├── build.ps1             # Script automatisé
│   ├── get-ip.ps1            # Détection IP
│   ├── eas.json              # Config EAS
│   ├── .env.example          # Template env
│   ├── package.json          # Dépendances + scripts
│   └── src/                  # Code source
│
├── backend/                   # API Node.js
│   ├── src/                  # Code source
│   ├── .env                  # Config backend
│   └── server.js             # Point d'entrée
│
└── BUILD_INSTRUCTIONS.md     # Ce fichier
```

---

## ✅ Prérequis

### Logiciels Requis

- [x] **Node.js** (v18+) - https://nodejs.org/
- [x] **npm** ou **yarn**
- [x] **Git** - https://git-scm.com/
- [x] **Expo Go** (mobile) - Play Store ou App Store

### Comptes Requis

- [x] **Compte Expo** (gratuit) - https://expo.dev/signup
- [ ] **Compte Google Play Console** (optionnel, pour production)
- [ ] **Compte Apple Developer** (optionnel, pour iOS)

### Configuration Réseau

- [x] Backend tournant sur `http://localhost:5000`
- [x] IP locale configurée dans `mobile/.env`
- [x] Pare-feu autorisant les connexions locales

---

## 🆘 Support et Dépannage

### Problèmes Fréquents

1. **"eas: command not found"**
   ```powershell
   npm install -g eas-cli
   ```

2. **"Not logged in to Expo"**
   ```powershell
   eas login
   ```

3. **"Cannot connect to backend"**
   ```powershell
   # Vérifier que le backend tourne
   cd backend
   node src/server.js
   
   # Mettre à jour l'IP
   cd mobile
   .\get-ip.ps1
   ```

4. **"Build failed"**
   ```powershell
   cd mobile
   rm -rf node_modules
   npm install
   npm cache clean --force
   ```

### Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [Guide EAS Build](https://docs.expo.dev/build/introduction/)
- [Forums Expo](https://forums.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

---

## 📝 Notes Importantes

### Sécurité

- ⚠️ Ne JAMAIS commiter le fichier `.env`
- ⚠️ Ne JAMAIS partager vos keystores
- ⚠️ Gardez vos credentials privés

### Performance

- Les builds cloud (EAS) sont recommandés pour la qualité
- Les builds locaux sont plus rapides mais nécessitent Docker
- Expo Go est idéal pour le développement quotidien

### Production

- Incrémentez toujours la version dans `app.json`
- Testez sur plusieurs appareils avant release
- Vérifiez toutes les permissions
- Créez un changelog pour chaque version

---

## 🎉 Prochaines Étapes

Une fois le build terminé :

1. ✅ Téléchargez l'APK depuis le lien EAS
2. ✅ Installez sur votre téléphone Android
3. ✅ Testez toutes les fonctionnalités
4. ✅ Partagez avec votre équipe
5. ✅ Collectez les feedbacks
6. ✅ Itérez et améliorez

---

## 📞 Contact

**Projet** : ARTU SI SEN KARANGUE  
**Version** : 1.0.0  
**Date** : 4 octobre 2025  
**Repository** : https://github.com/CHAHBG/ArtuSSKarangue  
**Auteur** : CHAHBG

---

**Bonne chance avec votre build ! 🚀🇸🇳**
