# 🚨 Erreur : Chemin de fichier trop long (Windows)

## Problème

```
ninja: error: Stat(...): Filename longer than 260 characters
```

Windows a une limite de 260 caractères pour les chemins de fichiers. Votre projet est dans un chemin profond :
```
C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue\mobile\node_modules\...
```

---

## ✅ Solution 1 : Activer les Chemins Longs Windows (RECOMMANDÉ)

### Étape 1 : Activer via PowerShell (Admin)

```powershell
# Ouvrir PowerShell en tant qu'Administrateur
# Puis exécuter :
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

# Redémarrer l'ordinateur pour appliquer
```

### Étape 2 : Activer via Git (si Git installé)

```powershell
git config --system core.longpaths true
```

### Étape 3 : Rebuild

```powershell
cd C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue\mobile\android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

---

## ✅ Solution 2 : Déplacer le Projet (PLUS RAPIDE)

Déplacez le projet vers un chemin plus court :

```powershell
# Déplacer vers la racine C:
Move-Item "C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue" "C:\Artu"

# Puis rebuild
cd C:\Artu\mobile\android
.\gradlew.bat assembleDebug
```

**Nouveau chemin :** `C:\Artu\mobile\android\...` (beaucoup plus court !)

---

## ✅ Solution 3 : Subst Drive (Temporaire)

Créer un lecteur virtuel pointant vers votre projet :

```powershell
# Créer un lecteur X: pointant vers le projet
subst X: "C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue"

# Aller dans le nouveau lecteur
cd X:\mobile\android

# Build
.\gradlew.bat assembleDebug
```

**Avantage :** Le chemin devient `X:\mobile\android\...` au lieu de `C:\Users\USER\...`

---

## ✅ Solution 4 : Utiliser WSL2 (Ubuntu)

WSL2 n'a pas de limite de 260 caractères :

```powershell
# Installer WSL2 (si pas déjà fait)
wsl --install

# Redémarrer Windows

# Dans WSL2 (Ubuntu)
cd /mnt/c/Users/USER/Documents/Applications/ArtussKarangue/ArtuSSKarangue/mobile/android
./gradlew assembleDebug
```

---

## 📊 Comparaison des Solutions

| Solution | Temps | Permanent | Redémarrage | Difficulté |
|----------|-------|-----------|-------------|------------|
| **Chemins longs Windows** | 5 min | ✅ Oui | ✅ Oui | ⭐⭐ Moyen |
| **Déplacer projet** | 2 min | ✅ Oui | ❌ Non | ⭐ Facile |
| **Subst Drive** | 1 min | ❌ Non | ❌ Non | ⭐ Facile |
| **WSL2** | 15 min | ✅ Oui | ✅ Oui | ⭐⭐⭐ Difficile |

---

## 🎯 Recommandation

### Pour tester rapidement (maintenant) :
👉 **Solution 2 : Déplacer le projet**

```powershell
# Déplacer vers C:\Artu
Move-Item "C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue" "C:\Artu"

# Rebuild
cd C:\Artu\mobile\android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

### Pour long terme :
👉 **Solution 1 : Activer chemins longs** (puis déplacer le projet)

---

## 🔍 Vérifier si Chemins Longs Activés

```powershell
# PowerShell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled"

# Si retourne 1 : activé
# Si retourne 0 ou erreur : désactivé
```

---

## 📱 Alternative : Utiliser Expo Go (Pas d'APK)

Si vous voulez juste tester l'app sans créer d'APK :

```powershell
cd C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue\mobile
npm start

# Puis scanner le QR code avec Expo Go app
```

**Avantages :**
- Pas de build nécessaire
- Pas de problème de chemin
- Hot reload instantané

**Inconvénients :**
- Nécessite l'app Expo Go
- Pas d'APK standalone

---

## 🚀 Commandes Rapides

### Option 1 : Déplacer et Builder

```powershell
# Fermer VS Code et tous les terminaux du projet

# Déplacer le projet
Move-Item "C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue" "C:\Artu"

# Ouvrir VS Code dans le nouveau emplacement
cd C:\Artu
code .

# Rebuild
cd mobile\android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

### Option 2 : Subst et Builder

```powershell
# Créer lecteur virtuel
subst X: "C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue"

# Builder
cd X:\mobile\android
.\gradlew.bat clean
.\gradlew.bat assembleDebug

# Pour supprimer le lecteur après :
# subst X: /D
```

### Option 3 : Activer Chemins Longs

```powershell
# PowerShell en Admin
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

git config --system core.longpaths true

# Redémarrer Windows

# Après redémarrage :
cd C:\Users\USER\Documents\Applications\ArtussKarangue\ArtuSSKarangue\mobile\android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

---

## ❓ Quelle Solution Choisir ?

**Voulez-vous :**
- ✅ **Tester rapidement** → Déplacer vers `C:\Artu` (2 min)
- ✅ **Solution permanente** → Activer chemins longs + redémarrer (5 min)
- ✅ **Juste tester l'app** → Utiliser Expo Go avec `npm start` (instantané)

---

**Note :** Ce problème est spécifique à Windows. Sur macOS/Linux, les builds fonctionnent sans modification.
