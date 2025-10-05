# 🚨 FIX APP CRASH AU DÉMARRAGE

## ❌ PROBLÈME

L'application crash immédiatement à l'ouverture en production (APK).

## 🔍 DIAGNOSTIC

### Causes identifiées

1. **URL Backend invalide**
   - En production, l'app essaie de se connecter à Railway
   - Backend Railway répond **404** sur les routes API
   - L'app ne gère pas cette erreur et crash

2. **Timeout trop long**
   - Timeout de 10s bloque l'app trop longtemps
   - Si réseau lent, l'app freeze puis crash

3. **Socket initialization bloque**
   - Socket.io essaie de se connecter au démarrage
   - Si connexion échoue, peut bloquer le thread principal

4. **Pas de gestion d'erreur robuste**
   - AuthContext ne catch pas les erreurs réseau
   - Les erreurs remontent et crash l'app

## ✅ SOLUTIONS APPLIQUÉES

### 1. Gestion d'erreur dans AuthContext ✅

**Avant:**
```javascript
const loadUser = async () => {
  try {
    const [storedUser, token] = await AsyncStorage.multiGet(['user', 'accessToken']);
    if (storedUser[1] && token[1]) {
      setUser(JSON.parse(storedUser[1]));
      setIsAuthenticated(true);
      initializeSocket(token[1]); // ❌ Peut bloquer
    }
  } catch (error) {
    console.error('Error loading user:', error);
  } finally {
    setLoading(false);
  }
};
```

**Après:**
```javascript
const loadUser = async () => {
  try {
    console.log('📱 Loading user from storage...');
    const [storedUser, token] = await AsyncStorage.multiGet(['user', 'accessToken']);

    if (storedUser[1] && token[1]) {
      console.log('✅ User found in storage');
      setUser(JSON.parse(storedUser[1]));
      setIsAuthenticated(true);
      
      // Initialize socket but don't block if fails
      try {
        initializeSocket(token[1]);
      } catch (socketError) {
        console.warn('⚠️ Socket initialization failed (non-critical):', socketError.message);
      }
    } else {
      console.log('ℹ️ No stored user found');
    }
  } catch (error) {
    console.error('❌ Error loading user:', error);
    // Don't crash, just log and continue
  } finally {
    console.log('✅ Auth loading complete');
    setLoading(false);
  }
};
```

### 2. Timeout réduit + Validation status ✅

**Avant:**
```javascript
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Après:**
```javascript
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // ✅ Réduit à 5s pour fail fast
  headers: {
    'Content-Type': 'application/json',
  },
  // Don't throw on network errors, let interceptors handle
  validateStatus: function (status) {
    return status < 500; // Accept all status codes < 500
  },
});
```

### 3. Interceptor avec gestion réseau ✅

**Avant:**
```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // ...
  }
);
```

**Après:**
```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log network errors but don't crash
    if (error.code === 'ECONNABORTED') {
      console.warn('⚠️ Request timeout - API may be slow or unreachable');
    } else if (error.message === 'Network Error') {
      console.warn('⚠️ Network error - Check internet connection');
    }
    
    const originalRequest = error.config;
    // ...
  }
);
```

## 🔧 SOLUTIONS SUPPLÉMENTAIRES À APPLIQUER

### 1. Vérifier URL Railway ⚠️

Le backend répond **404** sur `/api/v1/...`. Vérifier:

```bash
# Route qui fonctionne
https://artusskarangue-production.up.railway.app/health

# Routes qui devraient fonctionner
https://artusskarangue-production.up.railway.app/api/v1/auth/register
https://artusskarangue-production.up.railway.app/api/v1/auth/login
```

**Action**: Tester les routes avec Postman ou curl

### 2. Ajouter fallback offline mode

Si pas de réseau au démarrage, l'app devrait quand même s'ouvrir:

```javascript
// Dans api.js
const isNetworkAvailable = async () => {
  try {
    const response = await fetch('https://artusskarangue-production.up.railway.app/health', {
      method: 'HEAD',
      timeout: 3000,
    });
    return response.ok;
  } catch {
    return false;
  }
};
```

### 3. Ajouter ErrorBoundary spécifique

```javascript
// Dans App.js - déjà présent mais peut être amélioré
class ErrorBoundary extends React.Component {
  // ... existing code ...
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops! Une erreur est survenue</Text>
          <Text style={styles.errorText}>{this.state.error?.message}</Text>
          <Text style={styles.errorHint}>Veuillez redémarrer l'application</Text>
          <TouchableOpacity onPress={() => this.setState({ hasError: false })}>
            <Text>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
```

## 📊 CHECKLIST DE TEST

### Tests à effectuer avant rebuild

- [ ] Vérifier backend Railway accessible
  ```bash
  curl https://artusskarangue-production.up.railway.app/health
  curl https://artusskarangue-production.up.railway.app/api/v1/auth/register -X POST
  ```

- [ ] Tester en mode développement
  ```bash
  npx expo start
  ```

- [ ] Tester les logs
  - ✅ "📱 Loading user from storage..."
  - ✅ "✅ Auth loading complete"
  - ⚠️ Warnings réseau mais pas de crash

- [ ] Tester sans internet
  - Désactiver WiFi et 4G
  - Ouvrir l'app
  - Devrait afficher écran de login (pas crash)

### Tests après rebuild

- [ ] Installer nouvel APK
- [ ] Ouvrir l'app (ne devrait pas crash)
- [ ] Vérifier logs avec `adb logcat`
- [ ] Tester login/register
- [ ] Tester avec/sans internet

## 🚀 REBUILD APK

Après avoir vérifié que le backend fonctionne:

```bash
cd mobile
eas build --platform android --profile preview --non-interactive
```

## 📝 NOTES

### Logs à surveiller

```javascript
// Si tout va bien
✅ axios loaded
✅ API instance created successfully
📱 Loading user from storage...
✅ Auth loading complete

// Si problèmes réseau (OK, l'app continue)
⚠️ Request timeout - API may be slow or unreachable
⚠️ Socket initialization failed (non-critical)

// Si vraie erreur (CRASH)
❌ CRITICAL: axios module is undefined
❌ Error loading user: [stack trace]
```

### Backend Railway - Routes à vérifier

```
GET  /health                        ✅ Fonctionne
GET  /health/db                     ✅ Fonctionne
GET  /api/v1                        ❓ À tester
POST /api/v1/auth/register          ❓ À tester
POST /api/v1/auth/login             ❓ À tester
GET  /api/v1/emergencies/nearby     ❓ À tester
```

## 🎯 PROCHAINE ÉTAPE

1. **Tester backend Railway** (maintenant)
2. **Rebuild APK** si backend OK
3. **Tester nouvel APK** sur téléphone
4. **Si crash persiste**, ajouter plus de logs et réanalyser

---

**Status**: ✅ Fixes appliqués dans le code
**Prochaine action**: Vérifier backend Railway puis rebuild
