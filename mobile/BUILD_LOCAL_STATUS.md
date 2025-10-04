# 🚀 Build APK Local - Guide Rapide

## ✅ Ce qui a été fait

1. ✅ **Expo Prebuild** - Créé le dossier `android/` avec les fichiers natifs
2. ✅ **Gradle Build** - En cours de téléchargement et build de l'APK

---

## 📱 Build en cours...

```powershell
cd mobile\android
.\gradlew.bat assembleDebug
```

**Status :** Gradle télécharge les dépendances (première fois)
**Durée estimée :** 10-15 minutes

---

## 📍 Localisation de l'APK

Une fois le build terminé, l'APK sera ici :

```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

Pour l'ouvrir dans l'explorateur :

```powershell
cd mobile\android\app\build\outputs\apk\debug
explorer .
```

---

## 🔄 Builds Futurs (Plus Rapides)

Après ce premier build, les suivants seront beaucoup plus rapides (2-3 minutes) :

```powershell
# Build Debug
cd mobile\android
.\gradlew.bat assembleDebug

# Build Release (pour distribution)
.\gradlew.bat assembleRelease
```

---

## 📦 Types de Build

### Debug APK (Développement)
- **Fichier :** `app-debug.apk`
- **Taille :** ~50-80 MB
- **Usage :** Tests internes
- **Commande :** `.\gradlew.bat assembleDebug`

### Release APK (Production)
- **Fichier :** `app-release.apk`
- **Taille :** ~20-30 MB (optimisé)
- **Usage :** Distribution publique
- **Commande :** `.\gradlew.bat assembleRelease`
- **Note :** Nécessite signature avec keystore

---

## 📱 Installation sur Android

### Méthode 1 : USB (ADB)

```powershell
# Connecter téléphone en USB
# Activer "Débogage USB" sur le téléphone

cd mobile\android\app\build\outputs\apk\debug
adb install app-debug.apk
```

### Méthode 2 : Transfert Manuel

1. Copier `app-debug.apk` sur le téléphone
2. Ouvrir le fichier sur le téléphone
3. Activer "Sources inconnues" si demandé
4. Installer

---

## 🔧 Commandes Utiles

```powershell
# Nettoyer le build
cd mobile\android
.\gradlew.bat clean

# Build Debug
.\gradlew.bat assembleDebug

# Build Release
.\gradlew.bat assembleRelease

# Voir toutes les tâches disponibles
.\gradlew.bat tasks

# Build avec logs détaillés
.\gradlew.bat assembleDebug --info

# Build avec stacktrace en cas d'erreur
.\gradlew.bat assembleDebug --stacktrace
```

---

## 📊 Progression du Build

Le build se déroule en plusieurs étapes :

1. ✅ **Téléchargement Gradle** (8.14.3) - Terminé
2. 🔄 **Configuration du projet** - En cours
3. 🔄 **Compilation des dépendances**
4. 🔄 **Compilation du code**
5. 🔄 **Génération de l'APK**
6. ✅ **APK prêt !**

---

## 🎯 Après le Build

Une fois terminé, vous verrez :

```
BUILD SUCCESSFUL in Xm Ys
45 actionable tasks: 45 executed
```

L'APK sera dans :
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔄 Mettre à Jour l'App

Après avoir modifié le code :

```powershell
# Option 1 : Rebuild complet (sûr)
cd mobile\android
.\gradlew.bat clean assembleDebug

# Option 2 : Build incrémental (rapide)
.\gradlew.bat assembleDebug
```

---

## ⚠️ Dépannage

### Erreur : ANDROID_HOME not set

```powershell
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\USER\AppData\Local\Android\Sdk', 'User')
# Redémarrer PowerShell
```

### Erreur : Java not found

Android Studio inclut Java. Vérifiez :

```powershell
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Android\Android Studio\jbr', 'User')
```

### Build échoue

```powershell
# Nettoyer et rebuild
cd mobile\android
.\gradlew.bat clean
.\gradlew.bat --stop
.\gradlew.bat assembleDebug --stacktrace
```

### Gradle lent

```powershell
# Configurer Gradle pour utiliser plus de RAM
# Éditer : mobile\android\gradle.properties
# Ajouter :
org.gradle.jvmargs=-Xmx4096m
org.gradle.parallel=true
org.gradle.daemon=true
```

---

## 📚 Comparaison : Expo Go vs APK Local

| Aspect | Expo Go | APK Local |
|--------|---------|-----------|
| **Setup** | Instantané | 10-15 min (1ère fois) |
| **Hot Reload** | ✅ Oui | ❌ Non |
| **Fonctionnalités** | Limitées | ✅ Complètes |
| **Distribution** | ❌ Nécessite Expo Go | ✅ APK standalone |
| **Taille** | App Expo Go (~50MB) | ~50-80 MB |
| **Usage** | Développement | Tests + Production |

---

## 🎉 Résumé

**Build en cours :** 
```powershell
cd mobile\android
.\gradlew.bat assembleDebug
```

**APK sera disponible dans :**
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

**Installer :**
```powershell
adb install app-debug.apk
```

---

**Pour plus de détails, consultez `LOCAL_BUILD_GUIDE.md` 📖**
