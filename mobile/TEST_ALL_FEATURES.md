# 🧪 TEST COMPLET - TOUTES LES FONCTIONNALITÉS

## ✅ ANIMATION SOS AJOUTÉE
Le bouton SOS pulse maintenant avec une animation douce et continue ! 💓

---

## 📋 CHECKLIST COMPLÈTE DES TESTS

### 1. ✅ AUTHENTIFICATION

#### Test Inscription
- [ ] Ouvrir l'app
- [ ] Écran d'inscription s'affiche
- [ ] Remplir: Nom, Email, Mot de passe
- [ ] Bouton "S'inscrire" fonctionne
- [ ] Toast de succès apparaît
- [ ] Redirection vers Home

#### Test Connexion
- [ ] Bouton "Déjà un compte ? Connexion"
- [ ] Écran de connexion s'affiche
- [ ] Remplir: Email, Mot de passe
- [ ] Bouton "Se connecter" fonctionne
- [ ] Token JWT sauvegardé (AsyncStorage)
- [ ] Redirection vers Home

**Commande backend pour vérifier:**
```powershell
# Vérifier que l'utilisateur existe
curl https://artusskarangue-production.up.railway.app/api/v1/auth/me `
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 🏠 HOME SCREEN

#### Éléments visibles
- [ ] Header avec "Dalal ak diam, [Nom]"
- [ ] Icône notification (🔔) en haut à droite
- [ ] **Bouton SOS rouge qui PULSE** 💓 (animation)
- [ ] Section "L'aide est à portée de clic !"
- [ ] Toggle "Se porter volontaire"
- [ ] Stats: "X Urgences actives" + "5km Rayon"
- [ ] Section "Urgences à proximité"
- [ ] Bouton "Voir tout" à droite du titre
- [ ] Liste des urgences (max 5)
- [ ] Bottom Navigation: Home, Karte, SOS, Jamonoy, Profil

#### Tests interactions
- [ ] Clic notification → `NotificationsScreen`
- [ ] **Clic bouton SOS (qui pulse)** → `ReportScreen` (mode SOS)
- [ ] Clic "Voir tout" → `ViewEmergenciesScreen`
- [ ] Clic sur une urgence → `EmergencyDetailsScreen`
- [ ] Pull-to-refresh fonctionne
- [ ] Bottom Tab "Karte" → `MapScreen`
- [ ] Bottom Tab "SOS" → `ReportScreen`
- [ ] Bottom Tab "Jamonoy" → `CommunityScreen`
- [ ] Bottom Tab "Profil" → `ProfileScreen`

**Test API:**
```javascript
// Doit charger depuis Railway
GET /api/v1/emergencies/nearby?latitude=14.6928&longitude=-17.4467&radius=5000
```

---

### 3. 🚨 REPORT SCREEN (SOS)

#### Mode normal (Bottom Tab SOS)
- [ ] Header "Teral karangue"
- [ ] Sélection type: Accident, Incendie, Médical, Inondation, Sécurité, Autre
- [ ] Chaque type a icône colorée
- [ ] Champ description (minimum 10 caractères)
- [ ] Bouton "Téléverser photo/vidéo"
- [ ] Bouton "Enregistrer vocal"
- [ ] Position GPS détectée automatiquement
- [ ] Bouton "Envoyer" en bas

#### Mode SOS (depuis Home)
- [ ] Header "Alerte SOS" en rouge
- [ ] Tous les champs identiques
- [ ] Flag `is_sos: true` envoyé à l'API

#### Tests interactions
- [ ] Cliquer type d'urgence → sélection active
- [ ] Écrire dans description → validation en temps réel
- [ ] Bouton photo → ouvre galerie/caméra
- [ ] Bouton vocal → enregistre audio
- [ ] **Bouton "Envoyer"** → API `POST /emergencies`
- [ ] Toast de succès
- [ ] Navigation vers `SuccessScreen`

**Test API:**
```javascript
POST /api/v1/emergencies
Body: {
  "emergency_type": "accident",
  "description": "Test depuis mobile",
  "location": {
    "type": "Point",
    "coordinates": [-17.4467, 14.6928]
  },
  "location_name": "Dakar",
  "is_sos": true
}
// Doit retourner 201 Created avec ID
```

---

### 4. ✅ SUCCESS SCREEN

#### Éléments visibles
- [ ] Icône verte avec checkmark ✅
- [ ] Texte "Les secours sont en route"
- [ ] Sous-texte "Une info conseils..."
- [ ] Bouton "Lire les instructions"
- [ ] Bouton Home (icône maison)
- [ ] Texte "Redirection automatique dans 5 secondes..."

#### Tests interactions
- [ ] Bouton "Lire les instructions" → `EmergencyDetailsScreen`
- [ ] Bouton Home → retour `Home`
- [ ] Attendre 5 secondes → redirection auto vers `Home`

---

### 5. 📋 VIEW EMERGENCIES SCREEN

#### Éléments visibles
- [ ] Header "Urgence" avec flèche retour
- [ ] Deux onglets: "Signaler Par Toi" / "Signaler Par Les Autres"
- [ ] Liste des urgences avec:
  - Icône colorée selon type
  - Titre (type d'urgence)
  - Localisation
  - Description (2 lignes max)
- [ ] Bouton ❌ (supprimer) sur "Signaler Par Toi" uniquement
- [ ] État vide si aucune urgence
- [ ] Bottom Navigation

#### Tests interactions
- [ ] Clic onglet "Signaler Par Toi" → mes urgences
- [ ] Clic onglet "Signaler Par Les Autres" → urgences des autres
- [ ] Clic sur urgence → `EmergencyDetailsScreen`
- [ ] Clic ❌ (supprimer) → confirmation + suppression
- [ ] Pull-to-refresh fonctionne
- [ ] Bottom Tab "SOS" actif (rouge)

**Test API:**
```javascript
// Mes urgences
GET /api/v1/emergencies/my-emergencies
Headers: { Authorization: Bearer TOKEN }

// Urgences des autres
GET /api/v1/emergencies/nearby?latitude=14.6928&longitude=-17.4467&radius=50000
```

---

### 6. 📍 EMERGENCY DETAILS SCREEN

#### Éléments visibles
- [ ] Header "Route de l'accident" avec flèche retour
- [ ] Badge coloré avec type d'urgence
- [ ] Section "Localité" avec nom du lieu
- [ ] Bouton "Changer" pour ouvrir Maps
- [ ] Section "Description" avec texte complet
- [ ] Section "Images/Vidéos" (si disponible)
- [ ] Audio "Enregistrement vocal" (si disponible)
- [ ] Encadré rouge "Conseils qui peuvent vous êtres utiles"
- [ ] Liste des instructions de sécurité
- [ ] Bouton rouge "Lire les instructions" en bas

#### Tests interactions
- [ ] Bouton retour (←) → retour écran précédent
- [ ] Bouton "Changer" → ouvre Google Maps/Apple Maps avec coordonnées
- [ ] Cliquer image → zoom/fullscreen
- [ ] Cliquer audio → lecture audio
- [ ] Bouton "Lire les instructions" → scroll vers instructions ou modal
- [ ] Scroll fonctionne si contenu long

**Test API:**
```javascript
GET /api/v1/emergencies/:id
// Doit retourner tous les détails
```

---

### 7. 🗺️ MAP SCREEN

#### Si react-native-maps disponible
- [ ] Carte Google Maps s'affiche
- [ ] Position utilisateur (point bleu)
- [ ] Cercle de rayon 5km autour de l'utilisateur
- [ ] Markers colorés pour chaque urgence
- [ ] Clic marker → popup avec infos
- [ ] Clic popup → `EmergencyDetailsScreen`
- [ ] Bouton centrer sur utilisateur
- [ ] Zoom in/out fonctionne

#### Si react-native-maps NON disponible (fallback)
- [ ] Message "La bibliothèque de cartes n'est pas disponible"
- [ ] Liste des urgences à proximité
- [ ] Clic urgence → `EmergencyDetailsScreen`
- [ ] Message "X urgence(s) à proximité"

---

### 8. 👥 COMMUNITY SCREEN

#### Éléments visibles
- [ ] Header "Communauté"
- [ ] Bouton "+" en haut à droite (créer post)
- [ ] Liste des posts communautaires
- [ ] Chaque post: Avatar, nom, date, contenu, likes, commentaires
- [ ] Bottom Navigation

#### Tests interactions
- [ ] Clic "+" → `CreatePostScreen`
- [ ] Clic sur post → détails post
- [ ] Bouton like → +1 like
- [ ] Bouton commentaire → ouvre modal commentaires
- [ ] Pull-to-refresh fonctionne

---

### 9. ✍️ CREATE POST SCREEN

#### Éléments visibles
- [ ] Header "Créer un post communautaire"
- [ ] Zone "Téléverser photo/vidéo"
- [ ] Champ "Titre *"
- [ ] Exemple: "Repas gratuits disponibles..."
- [ ] Champ "Description *"
- [ ] Exemple: "Si vous ou quelqu'un..."
- [ ] Champ "Localisation (facultatif)"
- [ ] Bouton rouge "Poster"

#### Tests interactions
- [ ] Clic photo → ouvre galerie
- [ ] Remplir titre → validation
- [ ] Remplir description → validation
- [ ] Bouton "Poster" → API `POST /posts`
- [ ] Toast de succès
- [ ] Retour à `CommunityScreen`

---

### 10. 👤 PROFILE SCREEN

#### Éléments visibles
- [ ] Avatar utilisateur
- [ ] Nom complet
- [ ] Email
- [ ] Statistiques: Urgences signalées, Votes
- [ ] Bouton "Paramètres SOS" → `SOSSettingsScreen`
- [ ] Bouton "Déconnexion"
- [ ] Bottom Navigation

#### Tests interactions
- [ ] Clic "Paramètres SOS" → `SOSSettingsScreen`
- [ ] Clic "Déconnexion" → confirmation
- [ ] Confirmer → suppression token, retour `LoginScreen`

---

### 11. ⚙️ SOS SETTINGS SCREEN

#### Éléments visibles
- [ ] Header "Paramètre SOS"
- [ ] Slider "0 km ----●---- 100 km"
- [ ] Localisation: "Grande Yoff, Rue GY-137, Dakar"
- [ ] Bouton "Changer"
- [ ] Carte miniature avec marker
- [ ] Toggle "Envoyer sa localisation actuelle" (ON)
- [ ] Section "Sélectionner un contact"
- [ ] Contact: "Modou Ndiaye (Cousin)"
- [ ] Bouton "Change"
- [ ] Boutons: "Annuler" / "Enregistrer"

#### Tests interactions
- [ ] Slider rayon → change distance
- [ ] Bouton "Changer" localisation → ouvre sélecteur
- [ ] Toggle localisation → ON/OFF
- [ ] Bouton "Change" contact → ouvre contacts
- [ ] Bouton "Annuler" → retour sans sauvegarder
- [ ] Bouton "Enregistrer" → sauvegarde + toast

---

### 12. 🔔 NOTIFICATIONS SCREEN

#### Éléments visibles
- [ ] Header "Notifications"
- [ ] Liste des notifications
- [ ] Chaque notification: Icône, titre, message, date
- [ ] Badge "Nouveau" sur non lues
- [ ] Bottom Navigation

#### Tests interactions
- [ ] Clic notification → marque comme lue
- [ ] Clic notification urgence → `EmergencyDetailsScreen`
- [ ] Pull-to-refresh fonctionne
- [ ] Bouton "Marquer tout comme lu"

---

## 🌐 TESTS RÉSEAU

### Test avec WiFi
```bash
1. Connecter WiFi
2. Créer urgence → doit envoyer à Railway
3. Charger urgences → doit charger depuis Railway
4. Vérifier: pas d'erreur "Network Error"
```

### Test avec 4G/5G (IMPORTANT)
```bash
1. Désactiver WiFi
2. Activer données mobiles 4G/5G
3. Créer urgence → doit envoyer à Railway
4. Charger urgences → doit charger depuis Railway
5. Vérifier: app fonctionne partout dans le monde 🌍
```

### Test sans connexion (Offline)
```bash
1. Mode Avion activé
2. App doit afficher: "Pas de connexion Internet"
3. Données en cache doivent s'afficher
4. Désactiver Mode Avion → données se synchronisent
```

---

## 🐛 TESTS D'ERREURS

### Erreur serveur
```bash
# Tester avec backend éteint
1. Arrêter backend Railway (impossible, mais simuler)
2. App doit afficher: "Impossible de se connecter au serveur"
3. Bouton "Réessayer" doit apparaître
```

### Token expiré
```bash
1. Modifier token dans AsyncStorage (invalide)
2. Toute requête doit rediriger vers Login
3. Message: "Session expirée, reconnectez-vous"
```

### GPS désactivé
```bash
1. Désactiver localisation dans paramètres téléphone
2. App doit demander: "Activer la localisation"
3. Bouton "Activer" → ouvre paramètres système
```

---

## 📊 TABLEAU RÉCAPITULATIF

| Screen | Navigation fonctionne | API intégrée | Animations | État vide |
|--------|----------------------|--------------|------------|-----------|
| Login | ✅ | ✅ | - | - |
| Register | ✅ | ✅ | - | - |
| Home | ✅ | ✅ | ✅ (SOS pulse) | ✅ |
| Report | ✅ | ✅ | ✅ (recording) | - |
| Success | ✅ | - | ✅ (auto-redirect) | - |
| ViewEmergencies | ✅ | ✅ | - | ✅ |
| EmergencyDetails | ✅ | ✅ | - | ✅ |
| Map | ✅ | ✅ | - | ✅ (fallback) |
| Community | ✅ | ⚠️ (à tester) | - | ✅ |
| CreatePost | ✅ | ⚠️ (à tester) | - | - |
| Profile | ✅ | ✅ | - | - |
| SOSSettings | ✅ | ⚠️ (à tester) | - | - |
| Notifications | ✅ | ⚠️ (à tester) | - | ✅ |

**Légende:**
- ✅ = Fonctionnel et testé
- ⚠️ = À tester
- ❌ = Non fonctionnel / Bug
- `-` = Non applicable

---

## 🚀 COMMANDES DE TEST

### Démarrer l'app en mode dev
```powershell
cd mobile
npm start
```

### Voir les logs en temps réel
```powershell
# Dans un autre terminal
npx react-native log-android
# OU si USB connecté
adb logcat *:S ReactNative:V ReactNativeJS:V
```

### Tester API depuis PowerShell
```powershell
# Test register
$body = @{
    full_name = "Test User"
    email = "test@example.com"
    password = "password123"
    phone = "+221771234567"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://artusskarangue-production.up.railway.app/api/v1/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

---

## ✅ RÉSUMÉ DES AMÉLIORATIONS

### Nouvelles fonctionnalités
1. ✅ **Animation SOS pulsante** - Le bouton pulse en continu
2. ✅ **EmergencyDetailsScreen** - Détails complets d'urgence
3. ✅ **ViewEmergenciesScreen** - Liste mes urgences / autres
4. ✅ **SuccessScreen** - Confirmation après signalement
5. ✅ **Map fallback** - Liste si maps non disponible

### Corrections
1. ✅ Map ne crash plus (try-catch)
2. ✅ API intégrée pour créer urgence
3. ✅ Navigation complète entre toutes pages
4. ✅ Bouton "Voir tout" sur Home

### À tester
- [ ] Toutes les interactions (ce document)
- [ ] Test avec 4G (connexion mondiale)
- [ ] Test hors ligne (mode avion)
- [ ] Upload images/vidéos
- [ ] Enregistrement audio

---

## 🎯 CHECKLIST FINALE

Avant de déployer en production:
- [ ] Tous les tests ci-dessus passent
- [ ] **Animation SOS fonctionne** ✅
- [ ] Aucune erreur dans la console
- [ ] Performance OK (pas de lag)
- [ ] Test sur plusieurs téléphones
- [ ] Test avec connexion lente
- [ ] Test avec batterie faible
- [ ] Build APK teste final

---

Date: 4 janvier 2025
Version: Mobile v4.1 (avec animation SOS)
Status: ⏳ EN TEST
