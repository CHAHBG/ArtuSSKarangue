# Migration Supabase - Application Mobile

## ✅ Configuration Complète

L'application mobile utilise maintenant **Supabase directement** pour :
- ✅ Authentification (inscription, connexion, déconnexion)
- ✅ Base de données PostgreSQL cloud
- ✅ Temps réel avec Realtime
- ✅ Fonctionne partout (pas besoin de réseau local)

---

## 📱 Fonctionnalités Migrées

### 1. Authentification (AuthContext)
- **Inscription** : Supabase Auth + table `utilisateurs`
- **Connexion** : Supabase Auth avec session persistante
- **Déconnexion** : Gestion automatique de la session
- **Profil** : Récupération depuis la table `utilisateurs`
- **Mise à jour** : Profil et localisation

### 2. Base de Données
- **Tables** : `utilisateurs`, `emergencies`, `messages`, `notifications`, etc.
- **Connexion** : Directe à Supabase (https://xsnrzyzgphmjivdqpgst.supabase.co)
- **Sécurité** : Row Level Security (RLS) à configurer

### 3. Temps Réel
- **Realtime** : Supabase Realtime pour les urgences actives
- **WebSocket** : Automatique avec Supabase

---

## 🔧 Fichiers Modifiés

### Nouveaux Fichiers
1. **`mobile/src/config/supabase.js`**
   - Client Supabase configuré
   - Helpers pour auth et urgences
   - Temps réel activé

### Fichiers Mis à Jour
2. **`mobile/src/context/AuthContext.js`**
   - Utilise `supabaseAuth` au lieu de `api`
   - Session persistante avec AsyncStorage
   - Écoute des changements d'auth

### Fichiers Inchangés (peuvent rester)
- `mobile/src/config/api.js` (utilisé pour d'autres endpoints si besoin)
- `mobile/src/config/socket.js` (peut être utilisé avec le backend Node.js)

---

## 🚀 Comment Tester

### 1. Démarrer l'application
```bash
cd mobile
npm start
```

### 2. Scanner le QR Code avec Expo Go
- L'app se connecte directement à Supabase
- Pas besoin du backend Node.js
- Fonctionne avec WiFi, 4G, 5G, etc.

### 3. Tester les fonctionnalités
1. **Inscription** : Créer un nouveau compte
2. **Connexion** : Se connecter avec email/password
3. **Profil** : Voir les informations utilisateur
4. **Urgences** : Créer/voir les urgences (si implémenté)

---

## 🔐 Sécurité Row Level Security (RLS)

### Important : Configurer les RLS dans Supabase

Actuellement, **RLS est désactivé** pour le développement. Activez-le en production :

#### 1. Aller dans Supabase Dashboard
- Authentication → Policies

#### 2. Activer RLS sur les tables
```sql
-- Activer RLS sur utilisateurs
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- Policy : Utilisateurs peuvent lire leur propre profil
CREATE POLICY "Users can read own profile"
ON utilisateurs FOR SELECT
USING (auth.uid() = id);

-- Policy : Utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
ON utilisateurs FOR UPDATE
USING (auth.uid() = id);

-- Activer RLS sur emergencies
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

-- Policy : Tout le monde peut voir les urgences actives
CREATE POLICY "Everyone can read active emergencies"
ON emergencies FOR SELECT
USING (status = 'active');

-- Policy : Utilisateurs peuvent créer leurs propres urgences
CREATE POLICY "Users can create own emergencies"
ON emergencies FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy : Utilisateurs peuvent mettre à jour leurs propres urgences
CREATE POLICY "Users can update own emergencies"
ON emergencies FOR UPDATE
USING (auth.uid() = user_id);
```

---

## 📊 Avantages de Supabase

### ✅ Avantages
1. **Gratuit** : 500 Mo de stockage, 2 Go de bande passante
2. **Cloud** : Accessible partout sans VPN
3. **Temps réel** : WebSocket intégré
4. **Sécurité** : RLS pour protéger les données
5. **Backup** : Sauvegardes automatiques
6. **Scalabilité** : PostgreSQL optimisé

### 🔄 Comparaison Backend Local vs Supabase

| Feature | Backend Local | Supabase |
|---------|--------------|----------|
| Connexion | Même réseau WiFi | Partout (Internet) |
| Base de données | PostgreSQL local | PostgreSQL cloud |
| Temps réel | Socket.io manuel | Supabase Realtime |
| Déploiement | Railway/Render | Déjà en cloud |
| Coût | Gratuit (PC) | Gratuit (500 Mo) |
| Maintenance | Manuelle | Automatique |

---

## 🎯 Prochaines Étapes

### 1. Tester l'Application Mobile
```bash
cd mobile
npm start
```

### 2. Configurer les RLS (Production)
- Suivre les instructions de sécurité ci-dessus

### 3. Implémenter les Urgences
- Utiliser `supabaseEmergencies` dans `mobile/src/config/supabase.js`
- Créer/lire/mettre à jour les urgences

### 4. Activer le Temps Réel
```javascript
import { supabaseEmergencies } from './config/supabase';

// S'abonner aux changements d'urgences
const subscription = supabaseEmergencies.subscribeToChanges((payload) => {
  console.log('Changement:', payload);
  // Mettre à jour l'UI
});

// Se désabonner plus tard
subscription.unsubscribe();
```

---

## 🐛 Dépannage

### Erreur : "Invalid API key"
- Vérifier `SUPABASE_URL` et `SUPABASE_ANON_KEY` dans `mobile/src/config/supabase.js`

### Erreur : "Row level security policy violation"
- Désactiver temporairement RLS en développement
- Ou configurer les policies correctement

### Erreur : "Network request failed"
- Vérifier la connexion Internet
- Vérifier que Supabase est accessible

### Session non persistante
- Vérifier que `@react-native-async-storage/async-storage` est installé
- Vérifier la configuration du client Supabase

---

## 📝 Notes Importantes

1. **Backend Node.js** : N'est plus nécessaire pour l'authentification et la base de données
2. **Socket.io** : Peut être remplacé par Supabase Realtime
3. **API REST** : Supabase génère automatiquement les endpoints REST
4. **GraphQL** : Supabase supporte aussi PostgREST

---

## ✅ Checklist Finale

- [x] Installer `@supabase/supabase-js`
- [x] Créer `mobile/src/config/supabase.js`
- [x] Mettre à jour `AuthContext.js`
- [x] Tester inscription/connexion
- [ ] Configurer RLS en production
- [ ] Implémenter les urgences
- [ ] Activer le temps réel
- [ ] Tester sur device physique

---

**L'application mobile est maintenant connectée à Supabase et fonctionne partout ! 🚀**
