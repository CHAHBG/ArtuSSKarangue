# 🔍 GUIDE DEBUG CRASH APP

## 📱 COMMENT DIAGNOSTIQUER UN CRASH

### Méthode 1: Logs Android (ADB)

```bash
# 1. Connecter téléphone en USB (mode développeur activé)
# 2. Vérifier connexion
adb devices

# 3. Voir TOUS les logs
adb logcat

# 4. Filtrer logs React Native seulement
adb logcat | findstr "ReactNativeJS"

# 5. Filtrer logs d'erreur seulement
adb logcat *:E

# 6. Combiner les deux (React Native + Erreurs)
adb logcat | findstr /C:"ReactNativeJS" /C:"FATAL"
```

### Méthode 2: Expo Go (mode dev)

```bash
cd mobile
npx expo start

# Scanner QR code avec Expo Go
# Voir les logs en temps réel dans le terminal
```

### Méthode 3: Logcat depuis PowerShell

```powershell
# Installer ADB si pas fait
# https://developer.android.com/studio/releases/platform-tools

# Nettoyer les anciens logs
adb logcat -c

# Ouvrir l'app sur le téléphone

# Capturer logs crash
adb logcat -d > crash-logs.txt

# Chercher erreurs
Select-String -Path crash-logs.txt -Pattern "FATAL|Exception|Error"
```

## 🚨 TYPES DE CRASH COURANTS

### 1. Crash immédiat au lancement

**Symptômes:**
- App s'ouvre puis se ferme instantanément
- Écran blanc puis fermeture
- Pas d'ErrorBoundary affiché

**Causes possibles:**
```
❌ Import manquant (module non trouvé)
❌ Erreur de syntaxe JavaScript
❌ Variable undefined au top-level
❌ Dépendance native non configurée
```

**Logs à chercher:**
```
FATAL EXCEPTION: main
Unable to resolve module
ReferenceError: X is not defined
```

**Solution:**
1. Vérifier tous les imports dans `App.js`
2. Vérifier `index.js`
3. Vérifier `package.json` - toutes dépendances installées
4. Rebuild avec `eas build --clear-cache`

### 2. Crash après quelques secondes

**Symptômes:**
- App s'ouvre
- SplashScreen s'affiche
- Puis crash après 2-5 secondes

**Causes possibles:**
```
❌ Erreur réseau non gérée (API call failed)
❌ AuthContext crash (loadUser failed)
❌ Socket connection timeout
❌ AsyncStorage error
```

**Logs à chercher:**
```
Network request failed
TIMEOUT
Socket connection error
AsyncStorage: Error
```

**Solution:**
1. Ajouter try-catch partout dans AuthContext
2. Gérer erreurs réseau dans api.js
3. Socket init non-bloquante
4. ✅ **Déjà fixé dans v4.3**

### 3. Crash sur action spécifique

**Symptômes:**
- App fonctionne
- Crash quand on clique un bouton
- Ou quand on ouvre une page

**Causes possibles:**
```
❌ Screen navigation error (route pas trouvée)
❌ Props undefined passées à component
❌ API call failed sans gestion
❌ Permission refusée (camera, location)
```

**Logs à chercher:**
```
TypeError: Cannot read property 'X' of undefined
Navigation error
Permission denied
```

**Solution:**
1. Ajouter ErrorBoundary sur chaque screen
2. Vérifier props avec PropTypes
3. Gérer erreurs API dans try-catch
4. Demander permissions avant usage

## 📊 CHECKLIST DEBUG

### Avant de tester l'APK

- [ ] Backend Railway accessible
  ```bash
  curl https://artusskarangue-production.up.railway.app/health
  ```

- [ ] Routes API fonctionnent
  ```bash
  curl -X POST https://artusskarangue-production.up.railway.app/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"Test123!","full_name":"Test User","phone":"221771234567"}'
  ```

- [ ] Variables d'environnement correctes
  ```javascript
  // Dans api.js
  console.log('🌐 API URL:', API_URL);
  console.log('🔧 __DEV__:', __DEV__);
  ```

- [ ] Tous les packages installés
  ```bash
  cd mobile
  npm install
  ```

### Pendant le test de l'APK

1. **Préparer ADB**
   ```bash
   adb logcat -c  # Clear logs
   ```

2. **Ouvrir l'app**
   - Installer APK
   - Ouvrir l'app

3. **Capturer logs immédiatement**
   ```bash
   adb logcat > app-logs.txt
   ```

4. **Analyser logs**
   ```bash
   # Dans un autre terminal
   type app-logs.txt | findstr /C:"FATAL" /C:"ReactNativeJS" /C:"Error"
   ```

### Après un crash

- [ ] Vérifier type de crash (immédiat / après X secondes / sur action)
- [ ] Capturer logs complets
- [ ] Identifier ligne exacte de l'erreur
- [ ] Vérifier stack trace
- [ ] Reproduire en mode dev (expo start)

## 🔧 OUTILS DE DEBUG

### React Native Debugger

```bash
# Installer
choco install react-native-debugger

# Utiliser
# 1. Ouvrir React Native Debugger
# 2. npx expo start
# 3. Shake device → Enable Remote Debugging
```

### Flipper

```bash
# Installer Flipper
# https://fbflipper.com/

# Voir logs, network, storage
# Crash reporter intégré
```

### Expo Dev Tools

```bash
cd mobile
npx expo start

# Ouvrir dans navigateur
# Voir logs, network, errors
```

## 📝 LOGS À ENVOYER EN CAS DE PROBLÈME

Si l'app crash et vous ne trouvez pas la cause, envoyer:

1. **Logs ADB complets**
   ```bash
   adb logcat -d > full-logs.txt
   ```

2. **Build logs EAS**
   ```
   https://expo.dev/accounts/cabgn/projects/artu-si-sen-karangue/builds/[BUILD_ID]
   ```

3. **Code de la section qui crash**
   - AuthContext.js
   - api.js
   - App.js

4. **Informations système**
   - Version Android
   - Modèle téléphone
   - Réseau (WiFi / 4G)

## 🎯 ERREURS CORRIGÉES (v4.3)

### ✅ AuthContext loadUser crash
```javascript
// AVANT (crash si erreur)
const loadUser = async () => {
  const [storedUser, token] = await AsyncStorage.multiGet(['user', 'accessToken']);
  if (storedUser[1] && token[1]) {
    setUser(JSON.parse(storedUser[1]));
    setIsAuthenticated(true);
    initializeSocket(token[1]); // ❌ Peut crash si socket fail
  }
};

// APRÈS (ne crash pas)
const loadUser = async () => {
  try {
    console.log('📱 Loading user...');
    const [storedUser, token] = await AsyncStorage.multiGet(['user', 'accessToken']);
    
    if (storedUser[1] && token[1]) {
      setUser(JSON.parse(storedUser[1]));
      setIsAuthenticated(true);
      
      // ✅ Socket non-bloquante
      try {
        initializeSocket(token[1]);
      } catch (socketError) {
        console.warn('⚠️ Socket failed (non-critical)');
      }
    }
  } catch (error) {
    console.error('❌ Load user error:', error);
    // ✅ Ne crash pas, continue
  } finally {
    setLoading(false); // ✅ Toujours exécuté
  }
};
```

### ✅ API timeout trop long
```javascript
// AVANT
timeout: 10000 // 10 secondes - trop long

// APRÈS
timeout: 5000 // 5 secondes - fail fast
```

### ✅ Erreurs réseau non gérées
```javascript
// AVANT
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ❌ Pas de gestion spécifique des erreurs réseau
    return Promise.reject(error);
  }
);

// APRÈS
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ✅ Log sans crash
    if (error.code === 'ECONNABORTED') {
      console.warn('⚠️ Request timeout');
    } else if (error.message === 'Network Error') {
      console.warn('⚠️ Network error');
    }
    
    return Promise.reject(error); // OK car géré upstream
  }
);
```

## 🚀 PROCHAINE ÉTAPE

1. **Attendre build v4.3**
2. **Télécharger nouvel APK**
3. **Installer sur téléphone**
4. **Préparer ADB** (`adb logcat -c`)
5. **Ouvrir app et capturer logs**
6. **Analyser résultats**

Si crash persiste:
- Envoyer logs complets
- Identifier ligne exacte
- Créer fix spécifique

---

**Version actuelle**: v4.3 (crash fixes appliqués)
**Status**: ⏳ En cours de build
**ETA**: ~5 minutes
