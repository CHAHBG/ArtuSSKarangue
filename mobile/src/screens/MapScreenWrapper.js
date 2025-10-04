import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

// Conditionally import MapScreen only on native platforms
let MapScreen;
if (Platform.OS !== 'web') {
  MapScreen = require('./MapScreen').default;
}

// Web fallback component
const WebMapFallback = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="map" size={80} color={colors.primary} />
        <Text style={styles.title}>Carte Interactive</Text>
        <Text style={styles.message}>
          La carte interactive nécessite l'application mobile.
        </Text>
        <Text style={styles.submessage}>
          Scannez le QR code avec Expo Go pour accéder à toutes les fonctionnalités natives.
        </Text>
      </View>
    </View>
  );
};

// Export the appropriate component based on platform
export default Platform.OS === 'web' ? WebMapFallback : MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 500,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  submessage: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
