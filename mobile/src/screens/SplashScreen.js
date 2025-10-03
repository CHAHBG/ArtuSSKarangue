import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animation séquence
    Animated.sequence([
      // Logo apparaît avec scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Texte glisse vers le haut
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Transition vers l'app après 2.5s
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Motif africain subtil en arrière-plan */}
      <View style={styles.pattern} />

      {/* Logo animé */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="call" size={64} color={colors.text.inverse} />
          <View style={styles.sosOverlay}>
            <Text style={styles.sosText}>SOS</Text>
          </View>
        </View>
      </Animated.View>

      {/* Texte animé */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>ARTU SI SEN KARANGUE</Text>
        <View style={styles.dividerLine} />
        <Text style={styles.subtitle}>Une alerte à temps,</Text>
        <Text style={styles.subtitle}>une vie sauvée</Text>
        <Text style={styles.wolof}>Ndimbalan daf ñëw</Text>
      </Animated.View>

      {/* Bande drapeau sénégalais */}
      <View style={styles.flagStripe}>
        <View style={[styles.flagColor, { backgroundColor: '#00853F' }]} />
        <View style={[styles.flagColor, { backgroundColor: '#FCD116' }]}>
          <Ionicons name="star" size={20} color="#00853F" />
        </View>
        <View style={[styles.flagColor, { backgroundColor: '#E31B23' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pattern: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.05,
    backgroundColor: colors.earth.medium,
  },
  logoContainer: {
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: colors.surface,
  },
  sosOverlay: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  sosText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: 'bold',
    fontSize: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  dividerLine: {
    width: 60,
    height: 3,
    backgroundColor: colors.secondary,
    marginVertical: spacing.md,
    borderRadius: 2,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs / 2,
  },
  wolof: {
    ...typography.bodySmall,
    color: colors.secondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  flagStripe: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 8,
    flexDirection: 'row',
  },
  flagColor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
