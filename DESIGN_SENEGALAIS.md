# 🇸🇳 Design Sénégalais - ARTU SI SEN KARANGUE

## 🎨 Identité Visuelle

### Palette de Couleurs Épurée
Notre design s'inspire du **drapeau sénégalais** et des **tons naturels africains** :

#### Couleurs Principales
- **🔴 Rouge Teranga** (#E31B23) - Hospitalité, urgence
- **🟢 Vert Sénégal** (#00853F) - Espoir, prospérité  
- **🟡 Jaune Sénégal** (#FCD116) - Richesse, générosité

#### Tons Terre Africains
- **Beige Sahel** (#F5E6D3) - Chaleur du sable
- **Sable Doré** (#D4A574) - Lumière du désert
- **Brun Baobab** (#8B4513) - Ancrage, tradition
- **Ébène** (#2C1810) - Profondeur, élégance

### ✨ Éléments Distinctifs

1. **Splash Screen Animé**
   - Logo circulaire avec icône téléphone + badge SOS
   - Animation fluide (fade + scale + slide)
   - Bande drapeau sénégalais en bas
   - Texte en wolof : "Ndimbalan daf ñëw"

2. **Écran d'Accueil (Home)**
   - Salutation en wolof : "Dalal ak diam" (Bienvenue)
   - **Grand bouton SOS circulaire** (140px) au centre
   - Effet ripple avec 2 cercles d'ondulation
   - Toggle "Se porter volontaire" avec design épuré
   - Badge notification avec compteur

3. **Navigation**
   - Labels en wolof :
     * Kër (Accueil)
     * Karte (Carte)
     * SOS (Signaler)
     * Jamonoy (Communauté)
     * Profil
   - Couleurs : Rouge actif, Gris inactif
   - Fond beige sahélien

4. **Authentification**
   - Connexion sociale (Google, Facebook, Instagram)
   - Design épuré avec cercles de couleur
   - Sous-titre en wolof
   - Boutons avec bordures fines

5. **Feed Communautaire**
   - Section "Jamonoy" (solidarité)
   - Cartes avec images, description, localisation
   - Bouton FAB vert pour créer un post
   - Design minimaliste et élégant

## 📱 Écrans Mis à Jour

### ✅ Implémentés
1. **SplashScreen** - Animation d'ouverture sénégalaise
2. **LoginScreen** - Connexion avec réseaux sociaux
3. **HomeScreen** - Grand bouton SOS circulaire
4. **CommunityScreen** - Feed d'entraide
5. **Theme** - Palette sénégalaise complète

### 🔄 Prochainement
6. **NotificationsScreen** - Liste des alertes
7. **SOSSettingsScreen** - Paramètres SOS avancés
8. **CreatePostScreen** - Créer un post communautaire
9. **EmergencyDetailScreen** - Voir détails + instructions

## 🌍 Messages en Wolof

### Vocabulaire de Base
- **Dalal ak diam** - Bienvenue
- **Artu si sen karangue** - L'aide est en route, urgence
- **Ndimbalan daf ñëw** - L'aide arrive
- **Karangue** - Urgence
- **Teral** - Signaler
- **Kër** - Accueil/Maison
- **Jamonoy** - Communauté/Solidarité
- **Wërsëg** - Aider/Volontaire
- **Jërëjëf** - Merci
- **Waaw** - Oui
- **Déedéet** - Non

### Types d'Urgence
- **Aksidaa** - Accident
- **Safara** - Incendie
- **Fàddal Wergu** - Urgence médicale
- **Ndox** - Inondation
- **Sékirite** - Sécurité
- **Yeneen** - Autre

## 🎯 Principes de Design

### Minimalisme Africain
- ✅ Couleurs limitées (3 principales + tons terre)
- ✅ Beaucoup d'espace blanc/beige
- ✅ Typographie claire et lisible
- ✅ Ombres subtiles
- ✅ Coins arrondis doux

### Authenticité Sénégalaise
- ✅ Vocabulaire wolof intégré naturellement
- ✅ Références au drapeau national
- ✅ Tons chauds et accueillants (teranga)
- ✅ Symbolisme local (baobab, sahel)

### Accessibilité
- ✅ Contraste suffisant pour lisibilité
- ✅ Tailles de boutons adaptées (48px minimum)
- ✅ Feedback visuel clair
- ✅ Messages bilingues (français/wolof)

## 🔧 Configuration Technique

### Fichiers Modifiés
1. `src/theme/index.js` - Nouvelle palette + messages wolof
2. `src/screens/LoginScreen.js` - Connexion sociale
3. `src/screens/HomeScreen.js` - Bouton SOS circulaire
4. `App.js` - Splash + navigation communauté

### Fichiers Créés
1. `src/screens/SplashScreen.js` - Écran d'ouverture animé
2. `src/screens/CommunityScreen.js` - Feed entraide

## 🚀 Prochaines Étapes

### Phase 2.5 : Finalisation Design
- [ ] NotificationsScreen avec style sénégalais
- [ ] SOSSettingsScreen (rayon, contact d'urgence)
- [ ] CreatePostScreen (photos, localisation)
- [ ] EmergencyDetailScreen (instructions sécurité)
- [ ] Audio/Voice recording dans signalements
- [ ] Onglets "Par Toi" vs "Par Les Autres"

### Phase 3 : Dashboard Admin
- Interface web avec même identité visuelle
- Gestion des urgences en temps réel
- Statistiques communautaires

## 📸 Captures d'Écran Attendues

### Splash
- Logo rouge circulaire avec téléphone
- Badge SOS vert
- Titre + sous-titres
- Bande drapeau (vert-jaune-rouge)

### Home
- Salutation wolof
- Grand cercle SOS rouge (3 niveaux)
- Toggle volontariat
- Stats et feed en dessous

### Communauté
- Cartes blanches sur fond beige
- Images de posts
- FAB vert pour créer

### Login
- Logo en haut
- Champs épurés
- 3 boutons sociaux ronds
- Texte wolof subtil

## 🎨 Guide de Style

### Espacement
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **xxl:** 48px

### Bordures
- **sm:** 4px
- **md:** 8px (défaut)
- **lg:** 12px
- **xl:** 16px
- **full:** 9999px (cercles)

### Ombres
- **sm:** Subtile (cartes)
- **md:** Moyenne (boutons)
- **lg:** Forte (bouton SOS)

## 💡 Philosophie

Notre design incarne la **Teranga sénégalaise** - l'hospitalité, la solidarité et la chaleur humaine. Chaque élément visuel rappelle que nous sommes une **communauté unie** face aux urgences.

Les couleurs épurées créent une expérience **calme et rassurante**, tout en gardant l'**urgence visuelle** nécessaire pour une application de ce type.

Le **wolof authentique** renforce l'ancrage local et rend l'app accessible à tous les Sénégalais, même ceux moins à l'aise avec le français.

---

**ARTU SI SEN KARANGUE** - Ndimbalan daf ñëw 🇸🇳
