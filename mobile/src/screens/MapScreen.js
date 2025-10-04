import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../context/LocationContext';
import api from '../config/api';
import { colors, typography, spacing, borderRadius, shadows, getEmergencyColor, emergencyLabels } from '../theme';

// Conditional import for react-native-maps (not available on web)
let MapView, Marker, Circle, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Circle = Maps.Circle;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

export default function MapScreen({ route }) {
  const { location, getCurrentLocation } = useLocation();
  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    loadEmergencies();
    
    // Focus on specific emergency if passed
    if (route.params?.emergencyId) {
      // Find and focus emergency
    }
  }, [location]);

  const loadEmergencies = async () => {
    if (!location) {
      await getCurrentLocation();
      return;
    }

    try {
      const response = await api.get('/emergencies/nearby', {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 10000, // 10km for map view
        },
      });

      setEmergencies(response.data.data.emergencies);
    } catch (error) {
      console.error('Error loading emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  if (!location || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  // Web fallback - maps not available on web
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.webFallback}>
          <Ionicons name="map" size={80} color={colors.primary} />
          <Text style={styles.webFallbackTitle}>Carte interactive</Text>
          <Text style={styles.webFallbackText}>
            La carte interactive nécessite l'application mobile.
          </Text>
          <Text style={styles.webFallbackSubtext}>
            Scannez le QR code avec Expo Go pour accéder à toutes les fonctionnalités.
          </Text>
          <View style={styles.emergencyList}>
            <Text style={styles.emergencyListTitle}>Urgences à proximité :</Text>
            {emergencies.map((emergency) => (
              <View key={emergency.id} style={styles.emergencyItem}>
                <View style={[styles.emergencyDot, { backgroundColor: getEmergencyColor(emergency.type) }]} />
                <Text style={styles.emergencyItemText}>
                  {emergencyLabels[emergency.type]} - {emergency.description.substring(0, 50)}...
                </Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* User's radius circle */}
        <Circle
          center={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          radius={5000}
          fillColor="rgba(220, 38, 38, 0.1)"
          strokeColor={colors.primary}
          strokeWidth={2}
        />

        {/* Emergency markers */}
        {emergencies.map((emergency) => (
          <Marker
            key={emergency.id}
            coordinate={{
              latitude: emergency.location.coordinates[1],
              longitude: emergency.location.coordinates[0],
            }}
            onPress={() => setSelectedEmergency(emergency)}
          >
            <View style={[styles.marker, { backgroundColor: getEmergencyColor(emergency.type) }]}>
              <Ionicons name="alert" size={20} color={colors.text.inverse} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Center on user button */}
      <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
        <Ionicons name="locate" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* Emergency details card */}
      {selectedEmergency && (
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedEmergency(null)}
          >
            <Ionicons name="close" size={24} color={colors.text.secondary} />
          </TouchableOpacity>

          <View style={[styles.cardBadge, { backgroundColor: getEmergencyColor(selectedEmergency.type) }]}>
            <Text style={styles.cardBadgeText}>{emergencyLabels[selectedEmergency.type]}</Text>
          </View>

          <Text style={styles.cardDescription}>{selectedEmergency.description}</Text>

          <View style={styles.cardInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.infoText}>{Math.round(selectedEmergency.distance)}m de vous</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="arrow-up-circle-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.infoText}>{selectedEmergency.votes} votes</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    ...shadows.lg,
  },
  centerButton: {
    position: 'absolute',
    bottom: spacing.xxl + spacing.xl,
    right: spacing.lg,
    backgroundColor: colors.surface,
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  card: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.lg,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 1,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  cardBadgeText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  cardDescription: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  webFallbackTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  webFallbackText: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  webFallbackSubtext: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emergencyList: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  emergencyListTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emergencyDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  emergencyItemText: {
    ...typography.bodySmall,
    color: colors.text.primary,
    flex: 1,
  },
});
