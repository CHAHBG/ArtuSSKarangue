// Theme colors - Sénégal Identity
export const colors = {
  // Couleurs du drapeau sénégalais + Teranga
  primary: '#E31B23',      // Rouge Teranga - Hospitalité, urgence
  secondary: '#00853F',    // Vert Sénégal - Espoir, prospérité
  success: '#00853F',      // Vert Sénégal
  warning: '#FCD116',      // Jaune Sénégal - Richesse
  danger: '#E31B23',       // Rouge Teranga
  info: '#00853F',         // Vert info
  
  // Tons naturels africains
  background: '#F5E6D3',   // Beige Sahel - Chaleur du sable
  surface: '#FFFFFF',      // Blanc pur
  card: '#FFFFFF',
  
  // Tons terre
  earth: {
    light: '#F5E6D3',      // Beige sahélien
    medium: '#D4A574',     // Sable doré
    dark: '#8B4513',       // Brun baobab
  },
  
  text: {
    primary: '#2C1810',    // Brun foncé (ébène)
    secondary: '#6B5744',  // Brun moyen
    disabled: '#A89988',   // Beige grisé
    inverse: '#FFFFFF',    // Blanc
    accent: '#00853F',     // Vert pour accents
  },
  
  border: '#E8D4B8',       // Beige clair
  divider: '#E8D4B8',
  
  // Types d'urgence - couleurs contextuelles sénégalaises
  accident: '#FCD116',     // Jaune (attention route)
  fire: '#E31B23',         // Rouge (feu)
  medical: '#E31B23',      // Rouge (urgence médicale)
  flood: '#4A90E2',        // Bleu (eau)
  security: '#8B4513',     // Brun (sécurité)
  other: '#6B5744',        // Gris-brun
  
  // Couleurs teranga (hospitalité)
  teranga: {
    primary: '#E31B23',
    light: '#FFE5E7',
    dark: '#B71C1C',
  },
};

// Typography
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Emergency type colors
export const getEmergencyColor = (type) => {
  switch (type) {
    case 'accident':
      return colors.accident;
    case 'fire':
      return colors.fire;
    case 'medical':
      return colors.medical;
    case 'flood':
      return colors.flood;
    case 'security':
      return colors.security;
    default:
      return colors.other;
  }
};

// Emergency type labels (Wolof authentique)
export const emergencyLabels = {
  accident: 'Aksidaa',      // Accident en wolof
  fire: 'Safara',           // Incendie
  medical: 'Fàddal Wergu',  // Urgence médicale
  flood: 'Ndox',            // Inondation
  security: 'Sékirite',     // Sécurité
  other: 'Yeneen',          // Autre
};

// Messages wolof pour l'interface
export const wolofMessages = {
  welcome: 'Dalal ak diam',              // Bienvenue
  help: 'Artu si sen karangue',          // L'aide est en route
  emergency: 'Karangue',                 // Urgence
  report: 'Teral',                       // Signaler
  map: 'Karte',                          // Carte
  profile: 'Profil',                     // Profil
  home: 'Kër',                           // Accueil/Maison
  community: 'Jamonoy',                  // Communauté
  notifications: 'Begg-begg',            // Notifications
  settings: 'Parametar',                 // Paramètres
  logout: 'Génn',                        // Sortir/Déconnexion
  submit: 'Yónnee',                      // Envoyer/Soumettre
  cancel: 'Fey',                         // Annuler
  confirm: 'Def ni',                     // Confirmer
  yes: 'Waaw',                           // Oui
  no: 'Déedéet',                         // Non
  thanks: 'Jërëjëf',                     // Merci
  sorry: 'Baal ma',                      // Pardon
  helpArriving: 'Ndimbalan daf ñëw',    // L'aide arrive
  location: 'Bëj',                       // Lieu/Endroit
  description: 'Wax',                    // Description/Parler
  photo: 'Nataal',                       // Photo
  send: 'Yónnee',                        // Envoyer
  volunteer: 'Wërsëg',                   // Volontaire/Aider
};

// Export default pour compatibilité
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  getEmergencyColor,
  emergencyLabels,
  wolofMessages,
};
