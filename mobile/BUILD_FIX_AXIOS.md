# 🔧 BUILD v3 - Fix "Cannot read property 'auth' of undefined"

## 🆕 Build ID : `5b2a0fc1-4d66-439d-8760-b138d00a619b`

**Date** : 4 octobre 2025 - 18:00
**Version** : v3 - Fix axios undefined

---

## 📲 TÉLÉCHARGER

```
https://expo.dev/accounts/cabgn/projects/artu-si-sen-karangue/builds/5b2a0fc1-4d66-439d-8760-b138d00a619b
```

---

## 🐛 Problème résolu

### Erreur précédente
```
Oops! Une erreur est survenue
Cannot read property 'auth' of undefined
Veuillez redémarrer l'application
```

### Cause identifiée
L'objet `api` (instance axios) était `undefined` quand l'app essayait de faire `api.post('/auth/register', ...)`.

**Raisons possibles** :
1. axios mal bundlé dans le build production
2. Import échoué silencieusement
3. Erreur dans la création de l'instance axios

---

## ✅ Correctifs appliqués

### 1. Validation axios au chargement

**Avant** :
```javascript
import axios from 'axios';
const api = axios.create({...});
```

**Après** :
```javascript
import axios from 'axios';

// Validation immédiate
if (!axios) {
  throw new Error('axios module failed to load');
}

if (typeof axios.create !== 'function') {
  throw new Error('axios module is invalid');
}

const api = axios.create({...});
```

### 2. Logs détaillés

L'app affichera maintenant dans les logs (accessible via `adb logcat`) :
```
✅ axios loaded, version: 1.12.2
✅ AsyncStorage loaded
🌐 API URL: https://artusskarangue-production.up.railway.app/api/v1
🔧 __DEV__: false
✅ API instance created successfully
✅ API.post is function
✅ AuthContext: api imported object
✅ AuthContext: api.post available function
```

Si une erreur survient, vous verrez :
```
❌ CRITICAL: axios module is undefined
```

### 3. Socket.io amélioré

- URL mise à jour : `https://artusskarangue-production.up.railway.app`
- Try-catch sur `initializeSocket()` pour éviter crash si socket échoue
- Logs détaillés pour diagnostic

### 4. AuthContext validation

Validation de l'import API avant toute utilisation :
```javascript
if (!api) {
  console.error('❌ CRITICAL: api is undefined in AuthContext');
  throw new Error('API module not loaded correctly');
}
```

---

## 📝 TEST DU NOUVEAU BUILD

### Étape 1 : Désinstaller l'ancienne version

**Sur votre téléphone** :
1. Paramètres → Applications
2. Rechercher "ARTU SI SEN KARANGUE"
3. Désinstaller

### Étape 2 : Installer le nouveau build

1. Ouvrir le lien ci-dessus sur votre téléphone
2. Télécharger l'APK
3. Installer (autoriser sources inconnues si demandé)

### Étape 3 : Tester l'ouverture

**Scénario A : App s'ouvre correctement** ✅
→ Parfait ! Passez à l'étape 4

**Scénario B : Message d'erreur différent** 📋
→ Notez le nouveau message et envoyez-le moi

**Scénario C : Même erreur "Cannot read property 'auth'"** ❌
→ Le problème est plus profond (peut-être expo-updates ou bundle)
→ Essayez le build development

### Étape 4 : Tester avec Railway (si app s'ouvre)

1. **Désactiver WiFi**, activer 4G
2. Créer un compte :
   - Nom, prénom
   - Email, téléphone
   - Mot de passe
   - Rôle (citizen/agent)
3. Vérifier que l'inscription réussit
4. Se connecter
5. Naviguer dans l'app

**Si tout fonctionne** → 🎉 Mission accomplie !

---

## 🔍 Logs pour diagnostic (si besoin)

Si l'app crash encore, vous pouvez récupérer les logs :

### Méthode 1 : USB Debugging

```powershell
# Sur PC (téléphone connecté en USB)
adb logcat | Select-String "expo|axios|CRITICAL"
```

### Méthode 2 : Expo Dev Tools

Utiliser le build **development** :
```
https://expo.dev/accounts/cabgn/projects/artu-si-sen-karangue/builds/02d5b2e1-fb25-479b-88e0-2b6a70cfc838
```

Ce build affiche tous les logs en temps réel.

---

## 📊 Historique des builds

| Build | Problème | Solution | Status |
|-------|----------|----------|--------|
| `1e40645e` | Crash silencieux | Ajout ErrorBoundary | ✅ Montre l'erreur |
| `ff4a7c7a` | "Cannot read property 'auth'" | Identifié : axios undefined | ❌ Même erreur |
| `5b2a0fc1` | axios undefined | Validation + logs + fixes | ⏳ À tester |

---

## 🎯 Si le problème persiste

### Option A : Tester avec Expo Go (dev mode)

Sur PC :
```powershell
cd mobile
npx expo start
```

Sur téléphone :
1. Installer "Expo Go" (Play Store)
2. Scanner le QR code

⚠️ **Note** : Expo Go utilise `localhost`, pas Railway. Pour tester Railway, il faut l'APK.

### Option B : Build avec expo-updates désactivé

Le warning mentionnait :
```
The build profile "preview" has specified the channel "preview", 
but the "expo-updates" package hasn't been installed.
```

Peut-être que c'est lié. On peut essayer un build sans channel.

### Option C : Build local (si chemin court)

Si vous déplacez le projet vers `C:\ArtuApp` :
```powershell
cd C:\ArtuApp\mobile\android
.\gradlew assembleDebug
```

---

## 💡 Théories sur le problème axios

### Théorie 1 : Metro bundler exclut axios
Peut-être que Metro ne bundle pas correctement axios en production.

**Test** : Vérifier dans les logs si on voit "✅ axios loaded".

### Théorie 2 : NODE_ENV=production casse quelque chose
Le warning dit "it will make npm install only production packages".

**Test** : Essayer un build avec `NODE_ENV=development` (mais alors __DEV__=true).

### Théorie 3 : Ordre d'import
Peut-être qu'un import circulaire cause `api` à être undefined.

**Fix appliqué** : Validation explicite dans chaque fichier qui importe api.

---

## 🚀 Prochaines étapes

**Si ce build fonctionne** :
1. ✅ App s'ouvre
2. ✅ Créer compte depuis l'app
3. ✅ Tester sur 4G (Railway)
4. ✅ Navigation app fonctionne
5. 🎉 **DÉPLOIEMENT COMPLET RÉUSSI !**

**Si ce build échoue encore** :
- On essaiera le build development (avec tous les outils de debug)
- Ou on passera en mode Expo Go pour dev local
- Ou on tentera un build avec `--no-bundler` pour forcer Metro à inclure tout

---

**Testez et dites-moi ce qui se passe !** 📱

**Lien de téléchargement** :
https://expo.dev/accounts/cabgn/projects/artu-si-sen-karangue/builds/5b2a0fc1-4d66-439d-8760-b138d00a619b
