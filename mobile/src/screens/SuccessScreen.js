import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

export default function SuccessScreen({ route, navigation }) {
  const { emergencyType, emergencyId } = route.params || {};

  useEffect(() => {
    // Auto-navigate after 5 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleViewInstructions = () => {
    navigation.navigate('EmergencyDetails', { emergencyId });
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={64} color={colors.background.paper} />
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Les secours sont en route</Text>
        <Text style={styles.subtitle}>
          Une info conseils pour éviter tout autre risque
        </Text>

        {/* Instructions Button */}
        <TouchableOpacity 
          style={styles.instructionsButton}
          onPress={handleViewInstructions}
        >
          <Text style={styles.instructionsButtonText}>Lire les instructions</Text>
        </TouchableOpacity>

        {/* Home Button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={handleGoHome}
        >
          <Ionicons name="home" size={20} color={colors.primary.main} />
        </TouchableOpacity>

        {/* Auto-redirect message */}
        <Text style={styles.autoRedirectText}>
          Redirection automatique dans 5 secondes...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl * 2,
  },
  instructionsButton: {
    backgroundColor: colors.error.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  instructionsButtonText: {
    ...typography.button,
    color: colors.background.paper,
  },
  homeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: spacing.lg,
  },
  autoRedirectText: {
    ...typography.caption,
    color: colors.text.disabled,
    marginTop: spacing.xl,
  },
});
