import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Linking,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, getEmergencyColor, emergencyLabels } from '../theme';
import api from '../config/api';

const { width } = Dimensions.get('window');

export default function EmergencyDetailsScreen({ route, navigation }) {
  const { emergencyId } = route.params;
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmergencyDetails();
  }, [emergencyId]);

  const loadEmergencyDetails = async () => {
    try {
      const response = await api.get(`/emergencies/${emergencyId}`);
      setEmergency(response.data.data);
    } catch (error) {
      console.error('Error loading emergency:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails de l\'urgence');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = () => {
    if (!emergency?.location) return;
    
    const { latitude, longitude } = emergency.location;
    const url = Platform.OS === 'ios'
      ? `maps:0,0?q=${latitude},${longitude}`
      : `geo:0,0?q=${latitude},${longitude}`;
    
    Linking.openURL(url);
  };

  const callEmergency = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails de l'urgence</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </SafeAreaView>
    );
  }

  if (!emergency) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails de l'urgence</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error.main} />
          <Text style={styles.errorText}>Urgence introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const emergencyColor = getEmergencyColor(emergency.emergency_type);
  const emergencyLabel = emergencyLabels[emergency.emergency_type] || emergency.emergency_type;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route de l'accident</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Type Icon */}
        <View style={[styles.typeContainer, { backgroundColor: emergencyColor }]}>
          <View style={styles.typeIcon}>
            <Ionicons 
              name={emergency.emergency_type === 'accident' ? 'car-sport' : 
                    emergency.emergency_type === 'medical' ? 'medical' :
                    emergency.emergency_type === 'fire' ? 'flame' : 'alert-circle'} 
              size={32} 
              color={colors.background.paper} 
            />
          </View>
          <Text style={styles.typeLabel}>{emergencyLabel}</Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localité</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={20} color={colors.text.secondary} />
            <Text style={styles.locationText}>{emergency.location_name || 'Localisation GPS'}</Text>
            <TouchableOpacity onPress={openInMaps} style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Changer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{emergency.description}</Text>
        </View>

        {/* Images/Videos */}
        {emergency.media && emergency.media.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Images/Vidéos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
              {emergency.media.map((item, index) => (
                <Image key={index} source={{ uri: item.url }} style={styles.mediaImage} />
              ))}
            </ScrollView>
            {emergency.audio_url && (
              <View style={styles.audioContainer}>
                <Ionicons name="play-circle" size={24} color={colors.primary.main} />
                <Text style={styles.audioText}>Enregistrement vocal</Text>
              </View>
            )}
          </View>
        )}

        {/* Emergency Instructions */}
        <View style={styles.alertBox}>
          <View style={styles.alertHeader}>
            <Ionicons name="alert-circle" size={24} color={colors.error.main} />
            <Text style={styles.alertTitle}>Conseils qui peuvent vous êtres utiles</Text>
          </View>
          <Text style={styles.alertSubtitle}>Si vous voyez un accident</Text>
          <View style={styles.instructionsList}>
            <Text style={styles.instruction}>• Éviter : éviter de créer des passagers.</Text>
            <Text style={styles.instruction}>• Si quelqu'un est blessé, appelez immédiatement les secours.</Text>
            <Text style={styles.instruction}>• Si quelqu'un est un état grave, (dans la mesure du possible)</Text>
            <Text style={styles.instruction}>• Si le véhicule est encore en train de rouler, déplacez-le uniquement si vous avez l'aide nécessaire</Text>
            <Text style={styles.instruction}>• Sinon, allumez vos feux de détresse pour signaler le danger.</Text>
          </View>
        </View>

        {/* Instructions Button */}
        <TouchableOpacity style={styles.instructionsButton}>
          <Text style={styles.instructionsButtonText}>Lire les instructions</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.h3,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  content: {
    flex: 1,
  },
  typeContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
  },
  typeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeLabel: {
    ...typography.h2,
    color: colors.background.paper,
  },
  section: {
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...typography.body1,
    color: colors.text.primary,
    flex: 1,
    marginLeft: spacing.sm,
  },
  changeButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  changeButtonText: {
    ...typography.button,
    color: colors.error.main,
  },
  description: {
    ...typography.body1,
    color: colors.text.primary,
    lineHeight: 24,
  },
  mediaScroll: {
    marginTop: spacing.sm,
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
  },
  audioText: {
    ...typography.body2,
    color: colors.primary.main,
    marginLeft: spacing.sm,
  },
  alertBox: {
    backgroundColor: colors.background.paper,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error.main,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertTitle: {
    ...typography.subtitle1,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  alertSubtitle: {
    ...typography.subtitle2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  instructionsList: {
    marginTop: spacing.sm,
  },
  instruction: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  instructionsButton: {
    backgroundColor: colors.error.main,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    ...shadows.medium,
  },
  instructionsButtonText: {
    ...typography.button,
    color: colors.background.paper,
  },
});
